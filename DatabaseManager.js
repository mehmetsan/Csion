const async = require("async");
const Campaign = require("./model/Campaign");
const EducationQuestion = require("./model/EducationQuestion");
const EducationProblem = require("./model/EducationProblem");
const RelationshipQuestion = require("./model/RelationshipQuestion");
const RelationshipProblem = require("./model/RelationshipProblem");
const CareerQuestion = require("./model/CareerQuestion");
const CareerProblem = require("./model/CareerProblem");
const Personality = require("./model/Personality");
const User = require("./model/User");

//addUser("selim", "özcan","selo","selo123","selo@selo.com","23");
function addUser(username, password, email, name = "", surname = "", age = "") {
  let newUser = new User({
    name:      name,
    surname:   surname,
    username:  username,
    password:  password,
    email:     email,
    age:       age
  });

  
  
  newUser.save((err, user) => {
    if (err) {
      return undefined;
    }
  });
  return newUser;
}

/*
let account = {_id : "5ec2d1e2df3026273a8d3016"};
let results = ["1","1","-1","1","1", "1","10"];*/
//calculateOutput(account,results,"5ec6d996a2573d5c7c50f35a")
function calculateOutput(accountId, results) {
  /*
  acount id 
  campaignId ye göre campaign bulduk
  answers ı setledik
  bu answer ı sırasıyla questionların scorelarıyla çarptık
  overall score u aldık 
  results'ın son elemnaı desire level 
  [1,1,1-1,1,1,10] 
  */
  let campaignId = results[results.length-1];
  let personalityType;
  let personalityKeywords = [];
  let problemPosKeywords = [];
  let problemNegKeywords = [];
  let encourageKeywords = [];
  let discourageKeywords = [];
  let matchedPosKeywords = 0;
  let matchedNegKeywords = 0;
  
  return new Promise((resolve, reject) => {
    
    getUserWithId(accountId)
    .then(user => {
      personalityType = user[0].personalityType;
      return getPersonalityType(personalityType);
    })
    .then(personality => {

      personalityKeywords = personality[0].keywords;
      return getCampaign(campaignId);
    })
    .then(campaign => {
      let tempProblem = campaign[0].problem;

      problemPosKeywords = tempProblem.encourage;
      problemNegKeywords = tempProblem.discourage; 
      return updateCampaign(campaignId, results)
    })
    .then(campaign => {
      //GET QUESTION
      return sendQuestions(campaign.problem);
    })
    .then(questions => {
      let answersScore = 0;
      let expectedScore = 0;
      
      for(let i = 0 ; i < questions.length; i++) {
        answersScore = answersScore + parseInt(questions[i][0].score) * parseInt(results[i]);
        expectedScore = expectedScore + parseInt(questions[i][0].score);
      }
      answersScore = answersScore + parseInt(results[results.length - 2]);
      expectedScore = expectedScore + parseInt(results[results.length - 2]);
      var answersRatio = (answersScore / expectedScore ) * 50;
      

      for(let i = 0 ; i < personalityKeywords.length; i++) {
        for(let j = 0 ; j< problemPosKeywords.length; j++) {
          if(personalityKeywords[i] == problemPosKeywords[j]) {
            if(!encourageKeywords.includes(personalityKeywords[i])){
                matchedPosKeywords = matchedPosKeywords +1;
                encourageKeywords.push(personalityKeywords[i]);
            }
          }
        }

        for(let j = 0 ; j< problemNegKeywords.length; j++) {
          if(personalityKeywords[i] == problemNegKeywords[j]) {
            if(!discourageKeywords.includes(personalityKeywords[i])){
                matchedNegKeywords = matchedNegKeywords +1;
                discourageKeywords.push(personalityKeywords[i]);
            }
          }
        }      
      }   
      var keywordRatio = (5*(matchedPosKeywords - matchedNegKeywords)/personalityKeywords.length)*50;
      console.log("ANSWERS' RATIO >>>> " + answersRatio);
      console.log("KEYWORDS' RATIO >>>> " + keywordRatio);
      let overallScore = keywordRatio + answersRatio;
      if(overallScore < 0) {
        overallScore = 0;
      } else if (overallScore > 100) {
        overallScore = 100;
      }
      console.log("OVERALL SCORE >>>> " + overallScore);
      return updateCampaignOutput(campaignId, overallScore)
      .then(() => {
        let result = {encourageKeywords : encourageKeywords, discourageKeywords : discourageKeywords, ratio : overallScore, type : personalityType};
        console.log("RESULT >>> " + result);
        return resolve(result);
      })
    })
  })
  
}

function createCampaign(accountId, problem, category, questionIds, answers, result) {
  let newCampaign = new Campaign({
    ownerId:     accountId,
    problem:     problem,
    category:     category,
    questionIds: questionIds,
    answers:     answers,
    result:      result
  });

  newCampaign.save((err, campaign) => {
    if (err) {
      throw err;
    }
  });

  return newCampaign;
}

function createCampaignAndSendQuestions(accountId, problem) {
  let questionIds = problem.personalQuestions;
 // let problemTitle = problem.problem;
  let cat = problem.category;
  let newCampaign = createCampaign(accountId, problem, cat, questionIds);

  return new Promise((resolve, reject) => {
    sendQuestions(problem)
      .then(questions => {
      let campaignId = newCampaign._id;
      //CAMPAIGN ID YI FRONTEND E ATMA
      let questionsAndCampaignId = {questions, campaignId};
      resolve(questionsAndCampaignId);    
    });
  });
} 

function deleteAccount(userId) {
  
  return new Promise( (resolve, reject) => {
    User.findOneAndDelete({ _id: userId }, (err, user) => {
      if (err) {
        throw err;
      }
      resolve(user);
    }) 
  })
}

function getCampaign(campaignId) {
  return new Promise( (resolve, reject) => {
    Campaign.find({ _id: campaignId }, (err, campaign) => {
      if (err) {
        throw err;
      }

      resolve(campaign);
    }) 
  })
}

function getCampaignsWithOwnerId(ownerId) {
  return new Promise( (resolve, reject) => {
    Campaign.find({ ownerId: ownerId }, (err, campaigns) => {
      if (err) {
        throw err;
      }

      resolve(campaigns);
    }) 
  })
}

//getPersonalityType('Di');
function getPersonalityType(type) {
  return new Promise((resolve, reject) => {
    Personality.find({ type: type }, (err, personality) => {
    if (err) throw err;
    resolve(personality)
    });
  })
  
}

//getProblems( "Relationship", "Romantic");
function getProblems(cat, sub) {

  return new Promise((resolve, reject) => {
    if (cat == "Relationship") {
      RelationshipProblem.find({ subcategory: sub }, (err, relProblem) => {
        if (err) {
          throw err;
        }
        resolve(relProblem);
      });
    } else if (cat == "Education") {
      EducationProblem.find({ subcategory: sub }, (err, eduProblem) => {
        if (err) {
          throw err;
        }
        resolve(eduProblem);
      });
    }  else if(cat == "Career"){
      CareerProblem.find({ subcategory: sub }, (err, carProblem) => {
        if (err) {
          throw err;
          console.log("subcategory not found");
        }
        resolve(carProblem);
      });   
    }else {
      console.log("Error Problem");
    }
  });
}

function getQuestion(cat, no) {
  return new Promise((resolve, reject) => {
    if (cat == "Relationship") {
      RelationshipQuestion.find({ questionId: no }, (err, relQuestion) => {
        if (err) {
          throw err;
        }
        resolve(relQuestion);
      });
    } else if (cat == "Education") {
      EducationQuestion.find({ questionId: no }, (err, eduQuestion) => {
        if (err) {
          throw err;
        }
        resolve(eduQuestion);
      });
    } else if(cat == "Career"){
      CareerQuestion.find({ questionId: no }, (err, carQuestion) => {
        if (err) {
          throw err;
        }
        resolve(carQuestion);
      });   
    }  else {
      console.log("Error Question");
    }
  });
}

//getUser("selo","selo123");
function getUser(username, password) {
  return new Promise((resolve, reject) => {
    User.find({ username: username, password: password }, (err, user) => {
      if (err) {
        throw err;
      }
      resolve(user);
    });
  });
}

function getUserInfo(accountId) {
  let myUser ;
  let myCampaigns;
  return new Promise((resolve, reject) => {
    getUserWithId(accountId)
    .then(user => {
      myUser = user[0];
      return getCampaignsWithOwnerId(accountId)
    })
    .then(campaigns => {
      myCampaigns = campaigns;
      return getPersonalityType(myUser.personalityType)
    })
    .then( personality => {
      let result = {user: myUser, personality: personality[0], decisions: myCampaigns}
      return resolve(result);
    })
  })
  
}

function getUserWithId(userId) {
  return new Promise((resolve, reject) => {
    User.find({ _id: userId }, (err, user) => {
      if (err) {
        throw err;
      }
      resolve(user);
    });
  });
}

function getUserWithUsername(username) {
  return new Promise((resolve, reject) => {
    User.find({ username: username }, (err, user) => {
      if (err) {
        throw err;
      }
      resolve(user);
    });
  });
}

function sendCampaigns(accountId){
  return new Promise( (resolve, reject) => {
    Campaign.find({ ownerId: accountId }, (err, userCampaigns) => {
      if (err) {
        throw err;
      }
      resolve(userCampaigns);
    }) 
  })
}

//sendProblems("Relationship", "Romantic");
function sendProblems(cat, sub) {
  return new Promise((resolve, reject) => {
    getProblems(cat, sub)
      .then(problems => {
       resolve(problems);
    });
  });
}

//sendProblems("Career", "change");
function sendQuestions(problem) {
  let questionIds = problem.personalQuestions;
  let cat = problem.category;
  return new Promise((resolve, reject) => {
    const jobs = questionIds.map(questionId => {
      return function(callback) {
        getQuestion(cat, questionId)
          .then(question => {
          callback(null, question);
        });
      };
    });

    async.series(jobs, function(err, questions) {
      if (err) {
        return reject(err);
      } else {
        return resolve(questions);
      }
    });
  });
}

/*
let user = {};
user._id = "5ec1ab7e0018c41acc9e4023";
setPersonalityType(user, "Di")*/
function setPersonalityType(userId, type) {
  User.findOneAndUpdate({ _id: userId }, { personalityType: type }, function(
    err,
    type
  ) {
    if (err) throw err;
    console.log(type);
  });
}

function updateCampaign(campaignId, results) {
  return new Promise( (resolve, reject) => {
    Campaign.findOneAndUpdate({ _id: campaignId }, {answers: results}, (err, campaign) => {
      if (err) {
        throw err;
      }

      resolve(campaign);
    }) 
  })
}
function updateCampaignFeedback(campaignId, feedback) {
  return new Promise( (resolve, reject) => {
    Campaign.findOneAndUpdate({ _id: campaignId }, {feedback: feedback, feedbackGiven: true}, (err, campaign) => {
      if (err) {
        throw err;
      }

      resolve(campaign);
    }) 
  })
}

function updateCampaignOutput(campaignId, ratio) {
  return new Promise( (resolve, reject) => {
    Campaign.findOneAndUpdate({ _id: campaignId }, {result: ratio}, (err, campaign) => {
      if (err) {
        throw err;
      }

      resolve(campaign);
    }) 
  })
}

function updateUser(userId, newName, newSurname, newMail, newUserName, newAge) {
  return new Promise( (resolve, reject) => {
    console.log("NAME->>", newName, "SURNAME -->", newSurname);
    User.findOneAndUpdate({ _id: userId }, {name: newName, surname: newSurname, username: newUserName, email: newMail, age: newAge},(err, user) => {
      if (err) {
        throw err;
      }

      resolve(user);
    }) 
  })
}

function updateAuthorise(userId) {
  return new Promise( (resolve, reject) => {
    User.findOneAndUpdate({ _id: userId }, {authorised: true},(err, user) => {
      if (err) {
        throw err;
      }
      resolve(user);
    }) 
  })
}

function updatePassword(userId, newPass) {
  
  return new Promise( (resolve, reject) => {
    User.findOneAndUpdate({ _id: userId }, {password: newPass},(err, user) => {
      if (err) {
        throw err;
      }
      resolve(user);
    }) 
  })
}






exports.createCampaignAndSendQuestions = createCampaignAndSendQuestions;
exports.sendProblems = sendProblems;
exports.addUser = addUser;
exports.getUser = getUser;
exports.getUserInfo = getUserInfo;
exports.setPersonalityType = setPersonalityType;
exports.sendCampaigns = sendCampaigns;
exports.calculateOutput = calculateOutput;
exports.updateAuthorise = updateAuthorise;
exports.updateUser = updateUser;
exports.updatePassword = updatePassword;
exports.getUserWithId = getUserWithId;
exports.getUserWithUsername = getUserWithUsername;
exports.deleteAccount = deleteAccount;
exports.updateCampaignFeedback = updateCampaignFeedback;