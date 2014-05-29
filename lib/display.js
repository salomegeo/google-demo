/**
 * @fileoverview Description of this file.
 */

self.port.on("setUp", function() {
  document.getElementById("login").onclick = function() {
    self.port.emit("logIn");
  }
});

var CREDENTIALS;
self.port.on("display", function(credentials){
  document.getElementById("login").style.visibility = 'hidden';
  CREDENTIALS = JSON.parse(credentials);
  displayFriends();
})

function displayFriends() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET",
           "https://www.googleapis.com/plus/v1/people/me/people/visible", false);
  xhr.setRequestHeader("Authorization",
      CREDENTIALS.token_type + " " + CREDENTIALS.access_token);
  xhr.onload = function() {
    var response = JSON.parse(xhr.response);
    var results  = document.getElementById("results");
    for (var i = 0; i < response.totalItems; i++) {
      var friend = document.createElement("P");
      friend.innerHTML = response.items[i].displayName;
      results.appendChild(friend);
    }
  }
  xhr.send()
}
