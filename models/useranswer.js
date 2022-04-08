const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Schema design for the UserAnswerTable on mongoDB
const userAnswerSchema = new Schema({
  userid: {
    // ref means the reference of other table on the database
    // it makes a connection/relation to the other table
    type: Schema.Types.ObjectId,
    ref: "Users",
  },
  earningpoints: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("userAnswerTable", userAnswerSchema);
