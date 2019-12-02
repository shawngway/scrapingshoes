
$.getJSON("/articles", function(data) {

  for (var i = 0; i < data.length; i++) {
    $("#articles").append("<h2 class='tire-title' data-id='" + data[i]._id + "'>" + data[i].title + "</h2>" + "<p class='price'>" + '$' + data[i].price + "</ p>");
  }
});

$(document).on("click", ".scrapeKey", function() {
  $.ajax({
    method: "GET",
    url: "/scrape"
  })
  .then(console.log("scrape complete"))
  alert("Your tires have been added")
});

$(document).on("click", ".homeKey", function() {
  location.reload();
});




$(document).on("click", "h2", function() {
  $("#notes").empty();
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })

    .then(function(data) {
      console.log(data);
      $("#notes").append("<h2>" + data.title + "</h2>");
      $("#notes").append("<input id='titleinput' name='title' >");
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      if (data.note) {
        $("#titleinput").val(data.note.title);
        $("#bodyinput").val(data.note.body);
      }
    });
});

$(document).on("click", "#savenote", function() {
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  })
    .then(function(data) {
      console.log(data);
      $("#notes").empty();
    });

  $("#titleinput").val("");
  $("#bodyinput").val("");
});
