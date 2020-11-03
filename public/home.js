if (window.innerWidth < window.innerHeight) {
  $(".categoryButton").css({ width: "70%" });
  $(".subcategoryButton").css({ width: "70%" });
  $(".problemButton").css({ width: "90% !important" });
  $("#back1").css({ width: "30%" });
}
var chosenCategory = "";
let categorysub="";
$("#career").click(() => {
  $("#categories").hide();
  $("#careerSub").show();
  $("#back1").show();
  chosenCategory = "Career";
  categorysub = "careerSub";
});

$("#relation").click(() => {
  $("#categories").hide();
  $("#relationshipSub").show();
  $("#back1").show();
  chosenCategory = "Relationship";
    categorysub = "relationshipSub";

});

$("#education").click(() => {
  $("#categories").hide();
  $("#educationSub").show();
  $("#back1").show();
  chosenCategory = "Education";
      categorysub = "educationSub";

});

$("#back1").click(() => {
  $("#back1").hide();
  $(".subCategories").hide();
  $("#categories").show();
  chosenCategory = "";
});

let problems;
$(".subcategoryButton").click(function() {
  $("#back1").hide();
  $(".subCategories").hide();
  let subid= this.id;
  let message = { category: chosenCategory, subcategory: this.id };
  console.log(message);
  $.post("https://csion.glitch.me/getProblems", message, data => {
    $("#problems").append(`<div id='removeProblems'></div>`);
    $("#removeProblems").append(
      `<h2 style="font-family: 'Roboto'; color:white">` +
        message.category +
        `</h2><h4 style="font-family: 'Montserrat'; color:white">` +
        message.subcategory +
        `</h4>`
    );

    problems = data;
    data.forEach(element => {
      let problemButton = jQuery(
        `<button ontouchstart="" class="problemButton">` +
          element.problem +
          `</button> <br>`
      );
      
      problemButton.click(function() {
        var chosenProblemIndex;
        let problem = $(this).text();
        problems.forEach((element, index) => {
          if (element.problem == $(this).text()) {
            chosenProblemIndex = index;
          }
        });
        $("#problems").hide();
        $("#categoryHeader").hide();
        $("#questionHeader").show();
        $.post(
          "https://csion.glitch.me/getQuestions",
          problems[chosenProblemIndex],
          data => {
            //data should be array of strings: questions
            console.log(data);
            $("#questions").append(`<div id='removeQuestions'></div>`);
            data.questions.forEach(function(element, index) {
              $("#removeQuestions").append(
                `<div class= "question">
            <p>` +
                  element[0].question +
                  `</p>
            <input class="qInput" type="radio" id="positive` +
                  index +
                  `" name="` +
                  index +
                  `" value="1">
            <label for="positive` +
                  index +
                  `">Yes</label>
            <input class="qInput" type="radio" id="negative` +
                  index +
                  `" name="` +
                  index +
                  `" value="-1" >
            <label for="negative` +
                  index +
                  `">No</label>
        </div><br> `
              );
            });
            $("#removeQuestions").append(
              `<label style="font-family: 'Montserrat'; color:white">Please use the scale below to tell us how much do you want to perform this action.</label><br><br>`
            );
            if (window.innerWidth < window.innerHeight) {
              $(
                `<input type="range" min="-10" max="10" value="0" class="slider" id="myRange">`
              )
                .css({ width: "70%" })
                .appendTo("#removeQuestions");
            } else {
              $(
                `<input type="range" min="-10" max="10" value="0" class="slider" id="myRange">`
              )
                .css({ width: "25%" })
                .appendTo("#removeQuestions");
            }
            let submitButton = jQuery(
              `<br><input class="qInput" type="submit" value="Submit" id = "submitQuestions"><br>`
            );

            $("#questions").show();

            submitButton.click(function(e) {
              e.preventDefault();
              //we should keep array of yes/no answers
              var answers = [];
              data.questions.forEach(function(element, index) {
                answers.push($("input[name=" + index + "]:checked").val());
              });
              answers.push($("#myRange").val());
              answers.push(data.campaignId);
              let message = { answers: answers };
              //post answers to backend and get decision, show decision to user
              $.post("https://csion.glitch.me/getDecision", message, rsp => {
                console.log("Successful!");
                $("#questions").hide();
                $("#questionHeader").hide();
                $("#decision").show();
                $("#decision").append(`<div id='removeDecision'></div>`);
                $("#removeDecision").append(
                  `<div class= "decisiondiv"><b>Your Problem:</b><p>  ` +
                    problem +
                    `</p></div><br><br><div class= "decisiondiv" id ="dqs"></div>`
                );
                $("#dqs").append("<b>Your Answers:</b>");
                data.questions.forEach(function(element, index) {
                  $("#dqs").append(
                    `<p id="qford` + index + `"">` + element[0].question + ` : `
                  );
                  if (answers[index] == 1)
                    $("#qford" + index).append(`Yes</p>`);
                  else $("#qford" + index).append(`No</p>`);
                });
                $("#removeDecision").append(
                  `<br><br><div class= "decisiondiv"><b>Your Personality Type:</b><p>  ` +
                    rsp.type +
                    `</p></div><br><br>`
                );
                $("#removeDecision").append(
                  `<div class= "decisiondiv"><b>Supportive Personality Attributes: </b><p id='keywords'>`
                );
                $("#keywords").append(rsp.encourageKeywords[0]);
                rsp.encourageKeywords.forEach(function(element, index) {
                  if (index !== 0) $("#keywords").append(` - ` + element);
                });
                $("#removeDecision").append(
                  `</p></div><br><div class= "decisiondiv"><b>Discouraging Personality Attributes: </b><p id='keywords2'>`
                );
                $("#keywords2").append(rsp.discourageKeywords[0]);
                rsp.discourageKeywords.forEach(function(element, index) {
                  if (index !== 0) $("#keywords2").append(` - ` + element);
                });
                if (rsp.ratio >= 75) {
                  $("#removeDecision").append(
                    ` </p></div><br><div class= "decisiondiv"><b>Our Advice:</b><p> In light of the data we gathered, we believe that you should definitely go for it.</p></div><br> `
                  );
                } else if (rsp.ratio >= 50) {
                  $("#removeDecision").append(
                    ` </p></div><br><div class= "decisiondiv"><b>Our Advice:</b><p>  In light of the data we gathered, we believe that it is in your best interest to perform this action.</p></div><br> `
                  );
                } else if (rsp.ratio >= 25) {
                  $("#removeDecision").append(
                    ` </p></div><br><div class= "decisiondiv"><b>Our Advice:</b><p>  In light of the data we gathered, we believe that it is in your best interest not to perform this action.</p></div><br> `
                  );
                } else {
                  $("#removeDecision").append(
                    ` </p></div><br><div class= "decisiondiv"><b>Our Advice:</b><p> In light of the data we gathered, we believe that it would be bad for you to perform this action.</p></div><br> `
                  );
                }
                $("#removeDecision").append(
                  `<br><button ontouchstart="" class="backButton" id="back2"><i class="fas fa-arrow-left"></i> Back </button>`
                );
                $("#back2").show();
                $("body").on("click", "#back2", function() {
                  $("#removeProblems").remove();
                  $("#removeQuestions").remove();
                  $("#removeDecision").remove();
                  $("#decision").hide();
                  $("#categories").show();
                  $("#categoryHeader").show();
                });
              });
            });
            $("#removeQuestions").append(submitButton);
          }
        );
      });
      $("#removeProblems").append(problemButton);
      
    });
    $("#removeProblems").append(
        `<button ontouchstart="" class="backButton" id="back4"><i class="fas fa-arrow-left"></i> Back </button>`
      );
      $("#back4").show();
      $("body").on("click", "#back4", function() {
        $("#removeProblems").remove();
        $("#"+categorysub).show();
        $("#back1").show();

      });
  });
  $("#problems").show();
});
