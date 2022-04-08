const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Schema design for the QuestionTable on mongoDB
const questionSchema = new Schema({
  description: {
    type: String,
    required: true,
  },
  answerid: [
    {
      type: Schema.Types.ObjectId,
      // ref means the reference of other table on the database
      // it makes a connection/relation to the other table
      ref: "Answers",
    },
  ],
});

module.exports = mongoose.model("Questions", questionSchema);
