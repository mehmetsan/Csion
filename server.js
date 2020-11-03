// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const session = require("express-session");
const app = express();
const databaseManager = require("./DatabaseManager.js");
const { exec } = require("child_process");
const bcrypt = require("bcrypt");
const mailer = require("./mailer.js");

app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 6000000,
      secure: false
    }
  })
);

app.use((req, res, next) => {
  if (!req.session.userid) {
    req.session.userid = "";
  }
  next();
});

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/createNewUser", function(req, res) {
  //Create user in database with following credentials
  bcrypt.hash(req.body.password, 10, function(err, hash) {
    // Store hash in database
    let newUser = databaseManager.addUser(
      req.body.username,
      hash,
      req.body.email
    );
    if (newUser != undefined) {
      mailer.sendVerification(req.body.email, newUser._id);
      res.send(true);
    } else {
      res.send(false);
    }
  });
});

app.post("/auth", (req, res) => {
  databaseManager.getUserWithUsername(req.body.username).then(user => {
    if (user.length != 0 && user[0].authorised) {
      bcrypt.compare(req.body.password, user[0].password, function(
        err,
        response
      ) {
        if (response) {
          req.session.regenerate(function() {
            // Store the user's primary key
            // in the session store to be retrieved,
            // or in this case the entire user object
            req.session.userid = user[0]._id;
            res.send(true);
          });
        } else {
          res.send(false);
        }
      });
    } else {
      res.send(false);
    }
  });
});

app.get("/loginStatus", (req, res) => {
  if (req.session.userid != "") {
    res.send(true);
  } else {
    res.send(false);
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy(function() {
    res.send(true);
  });
});

app.post("/getCampaigns", function(req, res) {
  if (req.session.userid != "") {
    let accountId = req.session.userid;
    databaseManager.sendCampaigns(accountId).then(campaigns => {
      res.json(campaigns);
    });
  }
});

app.post("/getProblems", function(req, res) {
  if (req.session.userid != "") {
    let category = req.body.category;
    let subCategory = req.body.subcategory;
    databaseManager.sendProblems(category, subCategory).then(problems => {
      res.json(problems);
    });
  }
});

app.post("/getQuestions", function(req, res) {
  if (req.session.userid != "") {
    let problem = req.body;
    let accountId = req.session.userid;
    databaseManager
      .createCampaignAndSendQuestions(accountId, problem)
      .then(questionsAndCampaignId => {
        res.json(questionsAndCampaignId);
      });
  }
});

app.post("/setPersonality", function(req, res) {
  if (req.session.userid != "") {
    let type = req.body.type;
    let accountId = req.session.userid;
    databaseManager.setPersonalityType(accountId, type);
    res.send(true);
  }
});

app.get("/getTestStatus", (req, res) => {
  if (req.session.userid != "") {
    let accountId = req.session.userid;
    databaseManager.getUserWithId(accountId).then(user => {
      if (user[0].personalityType) res.send(true);
      else res.send(false);
    });
  }
});

app.post("/getDecision", (req, res) => {
  if (req.session.userid != "") {
    let accountId = req.session.userid;
    let results = req.body.answers;

    databaseManager.calculateOutput(accountId, results).then(output => {
      res.json(output);
    });
  }
});

app.post("/nlp", (req, res) => {
  if (req.session.userid != "") {
    exec(
      'python3 NLP.py "' +
        req.body.description +
        '" "' +
        req.session.userid +
        '"',
      (err, stdout, stderr) => {
        if (err) {
          //some err occurred
          console.error(err);
        } else {
          res.json(stdout);
        }
      }
    );
  }
});

app.post("/userInfoChange", function(req, res) {
  if (req.session.userid != "") {
    let name = req.body.name;
    let surname = req.body.surname;
    let mail = req.body.mail;
    let username = req.body.username;
    let age = req.body.age;
    let accountId = req.session.userid;

    databaseManager
      .updateUser(accountId, name, surname, mail, username, age)
      .then(user => {
        res.json(user);
      });
  }
});

app.get("/getUserInfo", function(req, res) {
  if (req.session.userid != "") {
    let accountId = req.session.userid;

    databaseManager.getUserInfo(accountId).then(result => {
      res.json(result);
    });
  }
});

app.post("/changePass", function(req, res) {
  if (req.session.userid != "") {
    let accountId = req.session.userid;

    let oldPassword = req.body.oldPass;
    let newPassword = req.body.newPass;
    databaseManager.getUserWithId(accountId).then(user => {
      if (user.length != 0) {
        bcrypt.compare(oldPassword, user[0].password, function(err, response) {
          if (response) {
            bcrypt.hash(newPassword, 10, function(err, hash) {
              databaseManager.updatePassword(accountId, hash).then(user => {
                res.json(user);
              });
            });
          } else {
            res.send(false);
          }
        });
      } else {
        res.send(false);
      }
    });
  }
});

app.post("/deleteAccount", function(req, res) {
  if (req.session.userid != "") {
    let accountId = req.session.userid;
    let password = req.body.password;
    databaseManager.getUserWithId(accountId).then(user => {
      if (user.length != 0) {
        bcrypt.compare(password, user[0].password, function(err, response) {
          if (response) {
            databaseManager.deleteAccount(accountId).then(user => {
              req.session.destroy(function() {
                res.send(true);
              });
            });
          } else {
            res.send(false);
          }
        });
      }
    });
  }
});

app.get("/emailVerification", function(req, res) {
  databaseManager.getUserWithId(req.query.userid).then(user => {
    if (user.length != 0) {
      databaseManager.updateAuthorise(user[0]._id);
    }
  });
  res.redirect("/");
});

app.post("/giveFeedback", (req, res) => {
  if (req.session.userid != "") {
    databaseManager.updateCampaignFeedback(req.body.campaignID, req.body.feedback);
  }
  res.send(true);
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
