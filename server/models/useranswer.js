const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userAnswerSchema = new Schema({
    userid: {
        // type: String,
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    earningpoints: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('userAnswerTable', userAnswerSchema);