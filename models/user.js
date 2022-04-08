const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema design for the UserTable on mongoDB
const userSchema = new Schema({
  email: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('User', userSchema);
