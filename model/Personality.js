const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://mehmetsan:"+process.env.mongoPassword+"@clustermehmet-aio9p.mongodb.net/Personality",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

const Schema = mongoose.Schema;
let PersonalitySchema = new Schema({
  type: String,
  tends: [String],
  strengths: [String],
  weaknesses: [String],
  growths: [String],
  motivations: [String],
  Stresses: [String],
  positiveCareer: [String],
  negativeCareer: [String],
  jobs: [String],
  positiveFriendship: [String],
  negativeFriendship: [String],
  positiveRelationship: [String],
  negativeRelationship: [String],
  keywords: [String],
  type: String,
  name: String
});

module.exports = mongoose.model("Personality", PersonalitySchema);
