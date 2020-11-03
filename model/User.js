const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://mehmetsan:"+process.env.mongoPassword+"@clustermehmet-aio9p.mongodb.net/Personality",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

const Schema = mongoose.Schema;
let UserSchema = new Schema({
  name: String,
  surname: String,
  username:  {type : String , unique : true},
  password: {type: String, required: true},
  email: {type : String , unique : true},
  age: String,
  personalityType: String,
  authorised: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("User", UserSchema);
