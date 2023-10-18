const mongoose = require('mongoose')

const schema = new mongoose.Schema({

    name:String,
    email:String,
    mobileno:String,
    file:String
})


module.exports = new mongoose.model('cruddatas',schema) 



