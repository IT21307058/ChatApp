const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fullName: { 
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'password is required'],
  },
  token: {
    type: String
  }
});

//Creating a model
const Users = new mongoose.model('User', UserSchema);

//In order to use this model in other files, we need to export it
module.exports = Users;
