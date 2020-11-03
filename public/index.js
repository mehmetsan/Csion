$.get("https://csion.glitch.me/loginStatus", data => {
  console.log(data);
  if (data) {
    $(":input", "#loginForm")
      .not(":button, :submit, :reset, :hidden")
      .val("");
    $("#startPage").hide();
    $.get("https://csion.glitch.me/getTestStatus", resp => {
      if (resp) {
        $("#homePage").show();
      } else {
        $("#testPage").show();
      }
    });
  }
});

const delay = ms => new Promise(res => setTimeout(res, ms));
let signUpClicked = false;
$(".openLogin").click(() => {
  $(".entrance").hide();
  $("#signUpForm").hide();
  $(".circle").removeClass("open");

  if (window.innerWidth < window.innerHeight) {
    $("#logo").css("margin-bottom", "30%");
  } else {
    $("#logo").css("margin-top", "5% ");
  }
  var k = 1;
  for (let i = 1; i < 7; i++) {
    var element = "";
    sleep(200 * i).then(() => {
      element = "#circle" + k.toString();
      $(element).addClass("open");
      k++;
    });
  }
  sleep(1800).then(() => {
    $("#loginForm").show();
  });
});
$(".openSignUp").click(() => {
  $(".entrance").hide();
  $("#loginForm").hide();
  $(".circle").removeClass("open");
  if (window.innerWidth < window.innerHeight) {
    $("#logo").css("margin-bottom", "30%");
  } else {
    $("#logo").css("margin-top", "5% ");
  }

  var k = 1;
  for (let i = 1; i < 7; i++) {
    var element = "";
    sleep(200 * i).then(() => {
      element = "#circle" + k.toString();
      $(element).addClass("open");
      k++;
    });
  }
  sleep(1800).then(() => {
    $("#signUpForm").show();
  });
});
if (window.innerWidth < window.innerHeight) {
  //mobile
  $("#logo").css({ width: "50%", "margin-bottom": "45%", "margin-top": "30%" });
  $("button:hover, button:active").css({ position: "relative", top: "1px" });
  $("#circle1").css({ "margin-left": "20%", "margin-top": "70%" });
  $("#circle2").css({ "margin-left": "-15%", "margin-top": "73%" });
  $("#circle3").css({ "margin-left": "65%", "margin-top": "74%" });
  $("#circle4").css({ "margin-left": "25%", "margin-top": "115%" });
  $("#circle5").css({ "margin-left": "-15%", "margin-top": "115%" });
  $("#circle6").css({ "margin-left": "65%", "margin-top": "115%" });
  $("#loginForm").css({ "margin-left": "12%", "margin-top": "100%" });
  $("#signUpForm").css({ "margin-left": "12%", "margin-top": "82%" });
  $("#tc").css({ "margin":"0px !important", "padding":"0px" });
    $("#signUpButton").css({ "margin-bottom": "0px" });
    $("#suhr").css({ "margin-top": "0px" });
  $("#signUpForm input").css({ "margin-top": "0px", "margin-bottom": "0px" });

  $(".navbar a").css({
    "padding-top": "5%",
    "padding-bottom": "5%",
    "padding-left": "3%",
    "padding-right": "3%"
  });
} else {
  //desktop
  $("button:active").css({ position: "relative", top: "1px" });
  $("#signup:hover").css({
    "background-color": "#ffffff  !important",
    color: "#539093 !important"
  });
  $("#login:hover").css({ "background-color": "#64adb1 ", color: "#ffffff" });
  $("#startPage hr:not(#suhr)").css("margin-top", "10%");
  $("#circle1").css({ "margin-left": "52%", "margin-top": "17%" });
  $("#circle2").css({ "margin-left": "32%", "margin-top": "18%" });
  $("#circle3").css({ "margin-left": "42%", "margin-top": "16%" });
  $("#circle4").css({ "margin-left": "52%", "margin-top": "30%" });
  $("#circle5").css({ "margin-left": "32%", "margin-top": "30%" });
  $("#circle6").css({ "margin-left": "42%", "margin-top": "30%" });
  $("#loginForm").css({ "margin-left": "40%", "margin-top": "25%" });
  $("#signUpForm").css({ "margin-left": "40%", "margin-top": "23%" });
}
const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

$("#signupbutton").click(() => {
  if ($("#tc").is(":checked")) {
    var message = {
      username: $("#signupUsername").val(),
      email: $("#signupEmail").val(),
      password: $("#signupPassword").val()
    };
    //server interaction
    $.post("https://csion.glitch.me/createNewUser", message, data => {
      if (data) {
        $(":input", "#signUpForm")
          .not(":button, :submit, :reset, :hidden")
          .val("");
        $("#signUpForm").empty();

        $("#signUpForm").append(
          `<pre id="verificationWarn">
          Verification mail has sent!

          Please check your e-mail.
          </pre>`
        );
        /*
      $(".entrance").show();
      $("#signUpForm").hide();
      $("#startPage").hide();
      $("#testPage").show();*/
      } else {
        /*$("#signupUsername").css({'border-color':'red'});
      $("#signupEmail").css({'border-color':'red'});
      $("#signupPassword").css({'border-color':'red'});*/
      }
    });
  }
});

$("#loginbutton").click(() => {
  var message = {
    username: $("#loginUsername").val(),
    password: $("#loginPassword").val()
  };
  //server interaction
  $.post("https://csion.glitch.me/auth", message, data => {
    if (data) {
      $.get("https://csion.glitch.me/getTestStatus", resp => {
        console.log(resp);
        $(":input", "#loginForm")
          .not(":button, :submit, :reset, :hidden")
          .val("");
        $("#startPage").hide();
        if (resp) {
          $("#homePage").show();
        } else {
          $("#testPage").show();
        }
      });
    } else {
      $("#loginUsername").css({ "border-color": "red" });
      $("#loginPassword").css({ "border-color": "red" });
    }
  });
});

$(".homeNavbar").click(() => {
  $("#profilePage").hide();
  $("#settingsPage").hide();
  $("#nlpPage").hide();
  $("#homePage").show();
});

$(".nlpNavbar").click(() => {
  $("#profilePage").hide();
  $("#settingsPage").hide();
  $("#homePage").hide();
  $("#nlpPage").show();
});

$(".settingsNavbar").click(() => {
  //get notification preference
  $.get("https://csion.glitch.me/getNotifPref", data => {
    if (data !== $("#switchNotif").is(":checked")) {
      if ($("#switchNotif").is(":checked"))
        $("#switchNotif").prop("checked", false);
      else $("#switchNotif").prop("checked", true);
    }
  });
  $("#profilePage").hide();
  $("#homePage").hide();
  $("#settingsPage").show();
  $("#nlpPage").hide();
});
let flag = false;
$(".profileNavbar").click(() => {
  if (!flag) {
    flag = true;
  } else {
    $("#personalityExp").remove();
    $("#previousAnss").remove();
  }
  //incoming data should be in the type of the message above
  $.get("https://csion.glitch.me/getUserInfo", data => {
    //user info
    $(".item1").text(data.user.name + " " + data.user.surname);
    $(".item3").text(data.user.email);
    $(".item5").text(data.user.username);
    $(".item4").text(data.user.age);
if (window.innerWidth < window.innerHeight) {
  $(".settingsDiv").css({ width: "100%" });
  $(".profileCard").css({ width: "100%" });
  if($(".item3").text().length>24){
    $(".item3").css({ 'font-size': "12px" });
  } else{
    $(".item3").css({ 'font-size': "16px" });
  }
    $(".item1").css({ 'font-size': "16px" });
    $(".item5").css({ 'font-size': "16px" });
  $(".navbar a").css({ "padding-top": "5%", "padding-bottom": "5%" });
} else {
  if($(".item3").text().length>24){
    $(".item3").css({ 'font-size': "16px" });
  }else {
        $(".item3").css({ 'font-size': "20px" });
  }
}
    //user personality
    $("#personalityCard").append(`<div id = "personalityExp"></div>`);
    $("#personalityExp").append(
      `<b>You are ` + data.personality.name + `</b><br>`
    );
    $("#personalityExp").append(
      `<a id="showDets" class="dButton">>> Show Details</a>`
    );
    $("#personalityExp").append(
      `<a id="hideDets" class="dButton">>> Hide Details</a>`
    );

    $("#personalityExp").append(`<div id = "personalityDets"></div>`);
    $("#personalityDets").append(`<br><b>You are tend to:</b>`);
    data.personality.tends.forEach(function(element, index) {
      $("#personalityDets").append(`<p>` + element + ` </p>`);
    });
    $("#personalityDets").append(`<br><b>Your strengths:</b>`);
    data.personality.strengths.forEach(function(element, index) {
      $("#personalityDets").append(`<p>` + element + ` </p>`);
    });
    $("#personalityDetspersonalityDets").append(`<br><b>Your weaknesses:</b>`);
    data.personality.weaknesses.forEach(function(element, index) {
      $("#personalityDets").append(`<p>` + element + ` </p>`);
    });
    $("#personalityDets").append(
      `<br><b>The things that can grow your personality:</b>`
    );
    data.personality.growths.forEach(function(element, index) {
      $("#personalityDets").append(`<p>` + element + ` </p>`);
    });
    $("#personalityDets").append(`<br><b>The things that motivate you:</b>`);
    data.personality.motivations.forEach(function(element, index) {
      $("#personalityDets").append(`<p>` + element + ` </p>`);
    });
    $("#personalityDets").append(`<br><b>The things that stress you out:</b>`);
    data.personality.Stresses.forEach(function(element, index) {
      $("#personalityDets").append(`<p>` + element + ` </p>`);
    });
    $("#personalityDets").append(
      `<br><b>The jobs that would go well with your personality:</b>`
    );
    data.personality.jobs.forEach(function(element, index) {
      $("#personalityDets").append(`<p>` + element + ` </p>`);
    });
    $("#personalityDets").append(
      `<br><b>The attributes that has positive effect on your career:</b>`
    );
    data.personality.positiveCareer.forEach(function(element, index) {
      $("#personalityDets").append(`<p>` + element + ` </p>`);
    });
    $("#personalityDets").append(
      `<br><b>The attributes that has negative effect on your career:</b>`
    );
    data.personality.negativeCareer.forEach(function(element, index) {
      $("#personalityDets").append(`<p>` + element + ` </p>`);
    });
    $("#personalityDets").append(
      `<br><b>The attributes that has positive effect on your relationships:</b>`
    );
    data.personality.positiveRelationship.forEach(function(element, index) {
      $("#personalityDets").append(`<p>` + element + ` </p>`);
    });
    $("#personalityDets").append(
      `<br><b>The attributes that has negative effect on your relationships:</b>`
    );
    data.personality.negativeRelationship.forEach(function(element, index) {
      $("#personalityDets").append(`<p>` + element + ` </p>`);
    });
    $("#personalityDets").append(
      `<br><b>The attributes that has positive effect on your friendships:</b>`
    );
    data.personality.positiveFriendship.forEach(function(element, index) {
      $("#personalityDets").append(`<p>` + element + ` </p>`);
    });
    $("#personalityDets").append(
      `<br><b>The attributes that has negative effect on your friendships:</b>`
    );
    data.personality.negativeFriendship.forEach(function(element, index) {
      $("#personalityDets").append(`<p>` + element + ` </p>`);
    });
    //previous decisions asked
    let pquestions = [];
    data.decisions.forEach(function(element, index) {
      console.log(element);
      if (!pquestions.includes(element.problem.problem)) {
        pquestions.push(element.problem.problem);
        $("#previousAnswers").append('<div id="previousAnss"></div>');
        $("#previousAnss").append(
          `<hr>
            <div class="decision" id="decision` +
            index +
            `">
                <p id="problem` +
            index +
            `">` +
            element.problem.problem +
            `</p>
                <b>Our Advice: </b><p id="advice` +
            index +
            `"></p>`
        );
        if (element.result >= 75) {
          $("#advice" + index).text(
            ` In light of the data we gathered, we believe that you should definitely go for it.`
          );
        } else if (element.result >= 50) {
          $("#advice" + index).text(
            ` In light of the data we gathered, we believe that it is in your best interest to perform this action.`
          );
        } else if (element.result >= 25) {
          $("#advice" + index).text(
            ` In light of the data we gathered, we believe that you should consider not performing this action.`
          );
        } else {
          $("#advice" + index).text(
            ` In light of the data we gathered, we believe that it would be bad for you to perform this action.`
          );
        }
        $("#previousAnss").append(
          `
                <button class="feedback" id="` +
            index +
            `">Give Feedback</button>
                <div class="feedbackForm" id= "q` +
            index +
            `feedback">
                    <h6>Give Feedback</h6>
                    <p>Did you follow our decision?</p>
                    <input type="radio" id="followed` +
            index +
            `" name="follow` +
            index +
            `" value="true">
                    <label for="followed` +
            index +
            `">Yes</label>
                    <input type="radio" id="not` +
            index +
            `" name="follow` +
            index +
            `" value="false">
                    <label for="not` +
            index +
            `">No</label>
                    <p>Are you happy and satisfied with the decision you've made?</p>
                    <input type="radio" id="satisfied` +
            index +
            `" name="satisfy` +
            index +
            `" value="true">
                    <label for="satisfied` +
            index +
            `">Yes</label>
                    <input type="radio" id="notsat" name="satisfy` +
            index +
            `" value="false">
                    <label for="notsat` +
            index +
            `">No</label>
                    <p>Any further detail you want to share with us?</p>
                    <textarea class="detail" id="detail` +
            index +
            `" placeholder="Please type here..."></textarea>
                    <br>
                    <button class= "feedbackSubmit" id="feedbackSubmit` +
            index +
            `">Submit</button>
                </div>
            </div>
            `
        );
        if (element.feedbackGiven) {
          $("#" + index).remove();
          $("#q" + index + "feedback").remove();
        }
      }
      $("body").on("click", "#" + index, function() {
        const id = index;
        $("#" + id).remove();
        $("#q" + id + "feedback").show();
        $("body").on("click", "#feedbackSubmit" + id, function() {
          const feedbackToSend = {
            campaignID: element._id,
            feedback: {
              isFollowed: $("input[name='follow" + id + "']:checked").val(),
              isSatisfied: $("input[name='satisfy" + id + "']:checked").val(),
              detail: $("#detail" + id).val()
            }
          };
          $("#q" + id + "feedback").remove();
          console.log(feedbackToSend);
          $.post(
            "https://csion.glitch.me/giveFeedback",
            feedbackToSend,
            data => {
              if (data) {
                $("#q" + id + "feedback").remove();
              } else {
                //TODO Alert user
              }
            }
          );
        });
      });
    });
  });
  $("#settingsPage").hide();
  $("#homePage").hide();
  $("#nlpPage").hide();
 
  
  $("#profilePage").show();
});

$("body").on("click", "#cont", function() {
  $("#testPage").hide();
  $("#homePage").show();
});
$("body").on("click", "#showDets", function() {
  $("#personalityDets").show();
  $("#showDets").hide();
  $("#hideDets").show();
});
$("body").on("click", "#hideDets", function() {
  $("#personalityDets").hide();
  $("#showDets").show();
  $("#hideDets").hide();
});
$("#logout").click(() => {
  //server interaction to end session
  $.get("https://csion.glitch.me/logout", data => {
    //if success go to entrance page
    if (data) {
      $("#settingsPage").hide();
      $("#homePage").hide();
      $("#profilePage").hide();
      $("#settingsPage").hide();
      $("#testPage").hide();
      $("#nlpPage").hide();
      $("#startPage").show();
    }
  });
});

$("#showTerms").click(() => {
  $("#startPage").hide();
  $("#termsCons").css({ display: "inline-block" });
  $("#settingsPage").show();
  $(".settingComp").hide();
  $(".navbar").hide();
  $("#backTerms").hide();
  $("#backSign").show();
});

$("#backSign").click(() => {
  $("#startPage").show();
  $("#termsCons").hide();
  $("#settingsPage").hide();
  $(".settingComp").show();
  $(".navbar").show();
  $("#backTerms").show();
  $("#backSign").hide();
});
