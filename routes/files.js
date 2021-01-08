const router = require('express').Router();
const path= require('path');
const File = require('./../models/file');
const { v4:uuid4 }  =require('uuid');//padna hai
require('dotenv').config();

const multer= require('multer');

// Baisc configuration for multer

let storage = multer.diskStorage({
    destination: (req, file, cb)=> {
        cb(null, 'uploads/'); //doubt
     },
    filename: (req, file, cb)=> {
        const uniqueName = `${Date.now()}-${Math.round(Math.random()*1E9)}${path.extname(file.originalname)}`;
        cb(null,uniqueName);
    }
});

let upload = multer({
     storage: storage ,
     limit: {fileSize:1000000*100}
    }).single('myFile');



router.post('/', (req,res)=>{
//    if(!req.file){
//       return res.json({ error:'all fielsd are required'}); 
//    }
   upload(req,res, async(err)=>{

        if(!req.file){
            return res.json({ error:'all fielsd are required'}); 
        }

       if(err){
          return res.status(500).send(err); //doubt
         //return res.status(500).send({error: err.message});
       }
       
       const file = new File({
        fileName: req.file.filename,
        uuid: uuid4(),
        size: req.file.size,
        path: req.file.path
       });

       const response= await file.save();
       console.log('sneha');
       return res.json({file:`${process.env.APP_BASE_URL}/files/${response.uuid}`});

   });
});



router.post('/send', async(req,res)=>{
    const { uuid, emailTo, emailFrom, expiresIn } = req.body;
    if(!uuid || !emailTo || !emailFrom) {
        return res.status(422).send({ error: 'All fields are required except expiry.'});
    }// for validation error status 422

    const file =await File.findOne({uuid:uuid});
    if(file.sender){
        return res.status(422).send({ error: 'Email already sent once.'});
    }
    file.sender =emailFrom;
    file.receiver =emailTo;

    const response = await file.save();

    //send mail
    const sendMail =require('./../services/emailService');

    sendMail({
        from:emailFrom,
        to:emailTo,
        subject:'inshare file sharing',
        text:`${emailFrom}shared file with you`,
        html:require('../services/emailTemplate')({
            emailFrom, 
            downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}` ,
            size: parseInt(file.size/1000) + ' KB',
            expires: '24 hours'
        }) 
    });

    return res.send({success:true});
});


module.exports = router;