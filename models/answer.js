const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema design for the AnswerTable on mongoDB
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
        // ref means the reference of other table on the database
        // it makes a connection/relation to the other table
        ref: 'Questions'
    }
});

module.exports = mongoose.model('Answer', answerSchema);