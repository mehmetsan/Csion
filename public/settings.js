if (window.innerWidth < window.innerHeight) {
  $(".settingsDiv").css({ width: "100%" });
  $(".navbar a").css({ "padding-top": "5%", "padding-bottom": "5%" });

}

$("#aboutUs").click(() => {
  $(".settingComp").hide();
  $("#about").css("display", "inline-block");
});

$("#terms").click(() => {
  $(".settingComp").hide();
  $("#termsCons").css("display", "inline-block");
});

$("#backTerms").click(() => {
  $(".settingComp").show();
  $("#termsCons").css("display", "none");
});

$("#backAbout").click(() => {
  $(".settingComp").show();
  $("#about").css("display", "none");
});

$("#switchNotif").change(() => {
  const msg = { pref: $("#switchNotif").is("checked") };

  //send new preference to server
  $.get("https://csion.glitch.me/notificationPref" + msg, data => {
    console.log("Success");
  });
});

$("#suspend").submit(() => {
  const message = { password: $("#suspend :input").get(0).value };
  //send suspend request to server with password to be checked
  $.post("https://csion.glitch.me/deleteAccount", message, data => {
    if (data) {
      console.log("Success");
      window.location = "https://csion.glitch.me/index.html";
    } else {
      $("#susSub").after(`<p style='color:red;'>Wrong Password!</p>`);
    }
  });
  $(":input", "#suspend")
    .not(":button, :submit, :reset, :hidden")
    .val("");
  return false;
});

$("#changePassword").submit(() => {
  //send suspend request to server with password to be checked
  var message = {
    oldPass: $("#changePassword :input").get(0).value,
    newPass: $("#changePassword :input").get(1).value
  };
  $.post("https://csion.glitch.me/changePass", message, data => {
    if (data) {
      $("#pasSub").after(
        `<p style='color:antiquewhite;'>Password Changed!</p>`
      );
    } else {
      $("#pasSub").after(`<p style='color:red;'>Wrong Old Password!</p>`);
    }
  });
  $(":input", "#changePassword")
    .not(":button, :submit, :reset, :hidden")
    .val("");
  return false;
});
