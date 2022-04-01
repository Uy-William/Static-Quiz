const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const answerSchema = new Schema({
    option: {
        type: String,
        required: true
    },
    isCorrect: {
        type: Boolean,
        required: true
    },
    questionid: {
        type: Schema.Types.ObjectId,
        ref: 'Questions'
    }
});

module.exports = mongoose.model('Answer', answerSchema);