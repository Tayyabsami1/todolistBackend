const express=require('express');
const app=express();
const cors=require("cors");
const authRoutes = require('./routes/authRoutes')
const {Connect_to_Mongo_DB}=require('./connect');
const cookieParser = require('cookie-parser')
const {requireAuth} = require('./middleware/authMiddleware')
require('dotenv').config();

//DB connection
//Usman's Code 
// const Atlas=process.env.DB
// Connect_to_Mongo_DB(Atlas);

//Local Database Connection Code
//Connecting to Database
const connectionString = 'mongodb://localhost:27017/';
const databaseName = 'To_Do_List';
const url = connectionString + databaseName;
Connect_to_Mongo_DB(url);


//Router Connections

app.use(express.json());
app.use(cors());
app.use(authRoutes);
app.use(cookieParser())



app.get("/", requireAuth ,(req,res)=>{
    res.json("To Do list running at localhost:3000");
})

//Listening to APP through PORT 3000.
app.listen(process.env.PORT || 3000,()=>{
console.log("Server Started at local host");
});