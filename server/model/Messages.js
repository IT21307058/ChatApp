const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    consversationId: {
        type: String
    },
    senderId: {
        type: String
    },
    message: {
        type: String
    }
});

//Creating a model
const Messages = new mongoose.model('Message', messageSchema);

//In order to use this model in other files, we need to export it
module.exports = Messages;
