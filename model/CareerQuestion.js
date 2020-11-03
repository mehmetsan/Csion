const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://mehmetsan:"+process.env.mongoPassword+"@clustermehmet-aio9p.mongodb.net/Personality",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

const Schema = mongoose.Schema;
let CareerQuestionSchema = new Schema({
  question: String,
  score: String,
  questionId: String
});

module.exports = mongoose.model(
  "CareerQuestion",
  CareerQuestionSchema,
  "CareerQuestions"
);
