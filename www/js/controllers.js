
var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
function randomString(length) {
    var result = "";
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}

angular.module("starter.controllers", ["cordovaHTTP"])

.controller("DialerCtrl", function($scope) {
	$scope.number = "";
	$scope.add = function(n){
		$scope.number += n;
	}
	$scope.makeCall = function(){
		$scope.number = "";
	};
	$scope.clear = function(){
		$scope.number = "";
	};
	$scope.removeLast = function(){
		$scope.number = $scope.number.substr(0, $scope.number.length - 1); 
	};
})
.controller("SettingsCtrl", function($scope, baseMmpUrl) {
	$scope.baseMmpUrl = baseMmpUrl;
	$scope.user = JSON.parse(localStorage.getItem("user"));
})
.controller("RegisterUserCtrl", function($scope, $state, $ionicBackdrop, baseMmpUrl, cordovaHTTP) {
	$scope.registerUser = function(userName){
	  var password = randomString(16);
	  $ionicBackdrop.retain();
	  cordovaHTTP.post(baseMmpUrl + "/users", {userName: userName, password: password}, {}).then(function(res){
	    var user = JSON.parse(res.data);
		user.password = password;
	    localStorage.setItem("user", JSON.stringify(user));
	    $ionicBackdrop.release();
		$state.go("tab.dialer");
	  }, function(res){
	  	$ionicBackdrop.release();
	  	alert(res.error || "Error");
	  });
	};
})
.filter("prettyNumber", function(){
	return function(v){
		if(!v){
			return "";
		}
		if(v.indexOf("*") >= 0 || v.indexOf("#") >= 0){
			return v;
		}
		if(v.length === 7){
			return v.substr(0, 3) + "-" + v.substr(3, 2) + "-" + v.substr(5, 2);
		}
		if(v.length === 10){
			return "(" + v.substr(0, 3) +")" + v.substr(3, 3) + "-" + v.substr(6, 2) + "-" + v.substr(8, 2);
		}
		return v;
	};
});
