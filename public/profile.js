$(".item2").click(() => {
  $("#infoCard").hide();
  $("#nameInput").val($(".item1").text());
  $("#mailInput").val($(".item3").text());
  $("#unameInput").val($(".item5").text());
  $("#ageInput").val($(".item4").text());
  $("#editForm").css({ display: "inline-block" });
});

$("#editbutton").click(() => {

  const words = $("#nameInput").val().split(" ");
  //send user info to server, checks username if same username exists doesnot accept
  const message = {
    name: words[0],
    surname: words[1],
    mail: $("#mailInput").val(),
    username: $("#unameInput").val(),
    age: $("#ageInput").val()
  };
  $.post("https://csion.glitch.me/userInfoChange", message, data => {
    if (data) {
      $(".item1").text($("#nameInput").val());
      $(".item3").text($("#mailInput").val());
      $(".item5").text($("#unameInput").val());
      $(".item4").text($("#ageInput").val());
        if (window.innerWidth < window.innerHeight) {
  $(".settingsDiv").css({ width: "100%" });
  $(".profileCard").css({ width: "100%" });
  if($(".item3").text().length>20){
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
      $("#editForm").hide();
      $("#infoCard").css({ display: "inline-block" });
      $("#alert").remove();
    } else {
      $("#editbutton").after(
        `<p id='alert' style='color:Red'>This username already exists!</p>`
      );
    }
  });
});


