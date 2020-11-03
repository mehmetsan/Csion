$("#nlpSubmit").click(() => {
  let description = { description: $("#problemDescription").val() };
  $("#nlpSubmit").hide();
  $("#problemDescription").hide();
  $('#qform').hide();

  $(".he").text("Processing....");
  $.post("https://csion.glitch.me/nlp", description, data => {
    $("#nlpSubmit").show();
    $("#problemDescription").show();
    
    if (data.charAt(0) !== "{") {
      $('#qform').show();
      $(".he").text(data);
    } else {
      $('#problemDescription').val('');
      data = JSON.parse(data.slice(0, -1).replace(/'/g, '"'));
      $("#nlpResult").append(`<div id="nlpRemove"></div>`);
      let resultField = $("#nlpRemove");
      $("#nlpQPage").hide();
      resultField.append(
        `<br><br><div class= "decisiondiv"><b>Your Personality Type:</b><p>  ` +
          data.type +
          `</p></div><br><br>`
      );
      resultField.append(
        `<div class= "decisiondiv"><b>Supportive Personality Attributes: </b><p id='keywords3'>`
      );
      $("#keywords3").append(data.encourageKeywords[0]);
      data.encourageKeywords.forEach(function(element, index) {
        if (index !== 0) $("#keywords3").append(` - ` + element);
      });
      resultField.append(
        `</p></div><br><div class= "decisiondiv"><b>Discouraging Personality Attributes: </b><p id='keywords4'>`
      );
      $("#keywords4").append(data.discourageKeywords[0]);
      data.discourageKeywords.forEach(function(element, index) {
        if (index !== 0) $("#keywords4").append(` - ` + element);
      });
      if (data.ratio >= 75) {
        resultField.append(
          ` </p></div><br><div class= "decisiondiv"><b>Our Advice:</b><p> In light of the data we gathered, we believe that you should definitely go for it.</p></div><br> `
        );
      } else if (data.ratio >= 50) {
        resultField.append(
          ` </p></div><br><div class= "decisiondiv"><b>Our Advice:</b><p>  In light of the data we gathered, we believe that you should try performing this action.</p></div><br> `
        );
      } else if (data.ratio >= 25) {
        resultField.append(
          ` </p></div><br><div class= "decisiondiv"><b>Our Advice:</b><p>  In light of the data we gathered, we believe that you should consider not to perform this action.</p></div><br> `
        );
      } else {
        resultField.append(
          ` </p></div><br><div class= "decisiondiv"><b>Our Advice:</b><p> In light of the data we gathered, we believe that it would be bad for you to perform this action.</p></div><br> `
        );
      }
      resultField.append(
        `<br><button ontouchstart="" class="backButton" id="back3"><i class="fas fa-arrow-left"></i> Back </button>`
      );
      $(".he").text("Here is your result!");
      $('#back3').show();
    }
  });
});

$("body").on("click", "#back3", function() {
    $("#nlpRemove").remove();
    $("#nlpQPage").show();
    $('#qform').show();
    $(".he").text("Please describe your situation...");

});
