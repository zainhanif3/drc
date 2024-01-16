const mongoose = require (mongoose)
mongoose.coonect("mogodb://localhost:27017/drc")
.then(()=>{
    console.log("mongo connected");
})
.catch(()=>{
    console.log("failed to connect");
})

const loginschema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    }
})
const collection = new mongoose= new mongoose.model("collection1",loginschema)
module.exports=collection