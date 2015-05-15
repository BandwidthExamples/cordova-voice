//Change this item to valid voice server web app url (without last slash)
var baseServerUrl = "http://localhost";

document.addEventListener("deviceready", function(){
  // Ionic Starter App

  angular.module("starter", ["ionic", "starter.controllers"])

  .run(function($ionicPlatform, $state) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleLightContent();
      }
    });
  })

  .config(function($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state"s controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
      .state("tab", {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html",
      controller: "MainCtrl"
    })

    // Each tab has its own nav history stack:

    .state("tab.dialer", {
      url: "/dialer",
      views: {
        "tab-dialer": {
          templateUrl: "templates/tab-dialer.html",
          controller: "DialerCtrl"
        }
      }
    })
    .state("tab.settings", {
      url: "/settings",
      views: {
        "tab-settings": {
          templateUrl: "templates/tab-settings.html",
          controller: "SettingsCtrl"
        }
      }
    })
    
    .state("register-user", {
      url: "/register-user",
      templateUrl: "templates/register-user.html",
      controller: "RegisterUserCtrl"
    })

    .state("call", {
      url: "/call",
      templateUrl: "templates/call.html",
      controller: "CallCtrl"
    })

    .state("incoming-call", {
      url: "/incoming-call",
      templateUrl: "templates/incoming-call.html",
      controller: "IncomingCallCtrl"
    });

    // if none of the above states are matched, use this as the fallback
    //$urlRouterProvider.otherwise("/tab/dialer");
    
    $urlRouterProvider.when("", function ($state) {
      if (!localStorage.getItem("user")) {
        $state.go("register-user");
      }
      else{
        $state.go("tab.dialer");
      }
    });

  })
  .value("baseServerUrl", baseServerUrl);
  angular.bootstrap(document, ["starter"]);
}, false);

