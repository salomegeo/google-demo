var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var self = require("sdk/self");

var CREDENTIALS = "";

var button = buttons.ActionButton({
    id: "google-demo",
      label: "Google demo",
      icon: {
        "16": "./icon-16.png",
        "32": "./icon-32.png",
        "64": "./icon-64.png"
      },
      onClick: handleClick
});

function handleClick(state) {
  tabs.open({
    url: self.data.url("../lib/tab.html"),
    onLoad: function onLoad(tab) {
      worker = tab.attach({
        contentScriptFile : [
          self.data.url("../lib/display.js")]
      });
      if (CREDENTIALS == "") {
        worker.port.emit("setUp");
        worker.port.on("logIn", function(){
          googleAuth(worker);
        });
      } else {
        worker.port.emit("display", CREDENTIALS);
      }
    }
  });
}

function googleAuth(main_worker) {
    tabs.open({
      url: "https://accounts.google.com/o/oauth2/auth?" +
           "scope=https://www.googleapis.com/auth/plus.login" +
           //"scope=email%20https://www.googleapis.com/auth/googletalk" +
           "&redirect_uri=urn:ietf:wg:oauth:2.0:oob" +
           "&response_type=code" +
           "&client_id=222861774905-u4e5lp293k0hm2cbmr9iil4jk3os7i3b.apps.googleusercontent.com",
      isPrivate: true,

      onLoad: function onLoad(tab) {
        worker = tab.attach({
          contentScriptFile : [
            self.data.url("../lib/login.js")]
        });

        var title = tab.title;
        if (title.startsWith("Success")) {
          var code = title.match(/code=([^&]+)/)[1];
          worker.port.emit("getToken", code);;
        }
        worker.port.on("receiveCredentials", function(credentials) {
          tab.close();
          CREDENTIALS = credentials;
          main_worker.port.emit("display", CREDENTIALS);
        });
      }
   })
}
