const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const userSchema = mongoose.Schema({
  name: String,
  username: {
    type: String,
    required: true,
    minlength: 3,
    unique: true,
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ],
  passwordHash: String
})

userSchema.set('toJSON',{
  transform: (document,returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User',userSchema)