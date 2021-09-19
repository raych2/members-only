const mongoose = require('mongoose')

const Schema = mongoose.Schema

const UserSchema = new Schema({
  firstName: { type: String, required: true, maxLength: 100 },
  lastName: { type: String, required: true, maxLength: 100 },
  username: { type: String, required: true, maxLength: 50 },
  password: { type: String, required: true, maxLength: 50 },
  passwordConfirmation: { type: String, required: true, maxLength: 50 },
  membershipStatus: { type: String, maxLength: 20 },
  admin: { type: Boolean },
})

UserSchema.virtual('fullName').get(function () {
  return this.firstName + ' ' + this.lastName
})

module.exports = mongoose.model('User', UserSchema)
