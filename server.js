const express = require('express');
const connectDB =require('./config/db');

const app=express();
const path= require('path');
const PORT =process.env.PORT||3000;
connectDB();

app.set('views',path.join(__dirname,'/views'));
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(express.json());

app.use('/api/files',require('./routes/files'));
app.use('/files',require('./routes/show'));
app.use('/files/download',require('./routes/download'));

app.listen(PORT,()=>{
    console.log(`server started on port ${PORT}`);
})


