const mongoose = require ("mongoose");

const drcSchema = new mongoose.Schema({
  name: {
    type : String,
    required : true
  },
  fathername: {
    type : String,
    required : true
  },
  email: {
    type : String,
    required : true,
    unique : true
  },
  cnic: {
    type : Number,
    required : true
  },
  contactnumber: {
    type : Number,
    required : true
  },
  address: {
    type : String,
    required : true
  },
  password: {
    type : String,
    required : true
  },
  dname: {
    type : String,
    required : true
  },
  dfname: {
    type : String,
    required : true
  },
  dcontactnumber: {
    type : Number,
    required : true
  },
  daddress: {
    type : String,
    required : true
  },
  dtype: {
    type : String,
    required : true
  }


})
const Register = new mongoose.model ("Signup1",drcSchema);
module.exports = Register;