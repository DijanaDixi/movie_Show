"use strict";
// dom
var $template = $("#template").html();
var $template2 = $("#template2").html();
var $movie = $("#movie");


// ajax
window.onload = function () {
  $.ajax({
    url: "https://api.tvmaze.com/show",
    method: "get",
    dataType: "json",
  }).done(function (res) {
    console.log(res);
    display(res);
  });
};

// display all movies(template)
function display(response) {
  var text = "";
  response.forEach(function (e) {
    text = $template
      .replace("{{image}}", e.image.medium)
      .replace(/{{movie}}/g, e.name)
      .replace("{{id}}", e.id);
    $movie.append(text);
  });
}

//ajax get value from search input and create dropdown
$(".form-control").keyup(function () {
  var inputValue = $(".form-control").val();
  $.get({
    url: "https://api.tvmaze.com/search/shows?q=" + inputValue,
  }).done(function (res) {
    var $ulSearch = $(".search-dropdown");
    $ulSearch.html("");
    res.forEach(function (el) {
      var liSearch = document.createElement("li");
      var aSearch = document.createElement("a");
      aSearch.innerHTML += el.show.name;
      aSearch.setAttribute("data-collection",el.show.id)
      aSearch.setAttribute("href","#")
      liSearch.append(aSearch)
      $ulSearch.append(liSearch).css("display","block");
      displaySearchShow(res);
     
    });
  });
});

// display movies from search
function displaySearchShow(res) {
  $movie.html("");
  var text = "";
  res.forEach(function (e) {
    text = $template
      .replace("{{image}}", e.show.image.medium)
      .replace("{{movie}}", e.show.name)
      .replace("{{id}}", e.show.id);
    $movie.append(text);
  });
}

// display movie from search to another page
$(document).on("click", ".search-dropdown a", function (event) {
  console.log(event);
  const id= $(this).attr("data-collection");
  movieSelected(id)
  getMovie()
})


// local storage set item
function movieSelected(id) {
  localStorage.setItem("movieId", id);
  window.location = "movie.html";
  return false;
}

// local storage get item
function getMovie() {
  let movieId = localStorage.getItem("movieId");
  console.log(movieId);
  $.get({
    url: `https://api.tvmaze.com/shows/${movieId}?embed[]=cast&embed[]=seasons`,
  }).done(function (e) {
    displayCastAndSeasons(e);
    var text = "";
    text = $template2
      .replace("{{image}}", e.image.medium)
      .replace(/{{movie}}/g, e.name)
      .replace("{{about}}", e.summary);
    $("#movieDetails").prepend(text);
  });
}

// display seasons and cast(dom)-movie details
function displayCastAndSeasons(el) {
  // console.log(el);
  var cast = document.createElement("ul");
  var season = document.createElement("ul");
  var list = document.getElementById("list");
  var listSeason = document.getElementById("list-season");
  var naslov = document.createElement("h2");

  el._embedded.cast.forEach((c) => {
    cast.innerHTML += (`<li>${c.person.name}</li> `)
  });
  el._embedded.seasons.forEach((s) => {
    season.innerHTML += "<li>" + s.premiereDate + " - " + s.endDate + "</li>";
    naslov.innerHTML = `Seasons (${el._embedded.seasons.length})`;
  });
  listSeason.appendChild(naslov);
  listSeason.appendChild(season);
  list.appendChild(cast);
}


// back-to-top//hide back-to-top before scroll
$(document).ready(function () {
  $(window).scroll(function () {
    if ($(this).scrollTop() > 200) {
      $("#back-to-top").fadeIn(500);
    } else {
      $("#back-to-top").fadeOut(300);
    }
  });
  $("#back-to-top").click(function (event) {
    event.preventDefault();

    $("html, body").animate({ scrollTop: 0 }, 300);
  });
});
