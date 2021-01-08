const mongoose =require('mongoose');
require('dotenv').config();

 
function connectDB(){
    mongoose.connect( process.env.MONGO_CONNECTION_URL, { useNewUrlParser: true,useUnifiedTopology: true });
    const connection =mongoose.connection;
    
    connection.once('open',()=>{
        console.log('mongodb connected.');
    }).catch((err)=>{
        console.log(err);
    });
}

module.exports =connectDB;