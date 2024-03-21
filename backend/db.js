const mongoose = require('mongoose');

// const mongoURI = "mongodb+srv://Faizan_Khan:faizankhan@cluster0.iuzfm80.mongodb.net/?retryWrites=true&w=majority"
const mongoURI = "mongodb+srv://Faizan_Khan:faizankhan@cluster0.iuzfm80.mongodb.net/"


mongoose.set('strictQuery', true)

const connectToMongo = ()=>{
    mongoose.connect(mongoURI, ()=>{
        console.log("Connected to Mongo Successfully");
    })
}

module.exports = connectToMongo;