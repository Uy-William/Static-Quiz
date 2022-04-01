const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  description: {
    type: String,
    required: true
  },
  answerid: [{
    type: Schema.Types.ObjectId,
    ref: 'Answers'
  }]
});

module.exports = mongoose.model('Questions', questionSchema);
