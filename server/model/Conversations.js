const mongoose = require('mongoose');

const consversationSchema = new mongoose.Schema({
  members: { 
    type: Array,
    required: true,
  }
});

//Creating a model
const Consversation = new mongoose.model('Consversation', consversationSchema);

//In order to use this model in other files, we need to export it
module.exports = Consversation;