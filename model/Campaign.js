const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://mehmetsan:"+process.env.mongoPassword+"@clustermehmet-aio9p.mongodb.net/Personality",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

const Schema = mongoose.Schema;
let CampaignSchema = new Schema({
  ownerId: String,
  problem: Object,
  category: String,
  questionIds: [String],
  answers: [String],
  result: String,
  feedbackGiven: {
        type: Boolean,
        default: false
  },
  feedback: Object
});

module.exports = mongoose.model(
  "Campaign",
  CampaignSchema,
  "Campaigns"
);
