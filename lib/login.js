/**
 * @fileoverview Description of this file.
 */


var CLIENT_ID =
  "222861774905-u4e5lp293k0hm2cbmr9iil4jk3os7i3b.apps.googleusercontent.com";
var CLIENT_SECRET = "SB-6TREbiMAM9b8Mnwhizo1p";

var REDIRECT_URI = "urn:ietf:wg:oauth:2.0:oob";

self.port.on("getToken", function(authorization_code) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "https://accounts.google.com/o/oauth2/token", false);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  var params = "code=" + authorization_code +
               "&client_id=" + CLIENT_ID +
               "&client_secret=" + CLIENT_SECRET +
               "&redirect_uri=" + REDIRECT_URI +
               "&grant_type=authorization_code";
  xhr.onload = function() {
    self.port.emit("receiveCredentials", xhr.response);
  }
  xhr.send(params);
});
