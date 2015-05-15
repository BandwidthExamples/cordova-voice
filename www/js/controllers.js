
var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
function randomString(length) {
    var result = "";
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}
var incomingCallRing = new Audio("sound/ring.mp3");
incomingCallRing.loop = true;
function stopIncomingCallRing(){
	incomingCallRing.pause();
	incomingCallRing.currentTime = 0;
};

angular.module("starter.controllers", ["cordovaHTTP", "BWSip"])

.controller("MainCtrl", function($scope, $rootScope, $state, $window, $timeout, BWSip){
	$scope.user = JSON.parse(localStorage.getItem("user"));
	
	$window.addEventListener("bwsip.stateChanged", function(ev){
		$timeout(function(){
			$scope.state = ev.detail.state;
			console.log("State is " + $scope.state);
		});
	});
	$window.addEventListener("bwsip.callStateChanged", function(ev){
		$timeout(function(){
			if($rootScope.currentCall){
				$rootScope.currentCall.state = ev.detail.state;
				console.log("Call state is " + $rootScope.currentCall.state + "(" + ev.detail.stateCode + ")");
			}
			if(ev.detail.stateCode === 6) {//Disconnected
				$rootScope.currentCall = null;
				$state.go("tab.dialer");	
			}
		});
	});
	$window.addEventListener("bwsip.incomingCall", function(ev){
		$timeout(function(){
			var number = ev.detail.remoteUri.substr(7);
			var index = number.indexOf("@");
			if(index >= 0){
				number = number.substr(0, index);
			}
			$rootScope.currentCall = {call: ev.detail.call, number: number};
			incomingCallRing.play();
			$state.go("incoming-call");
		});
	});
	BWSip.connect({userName: $scope.user.endpoint.credentials.username, password: $scope.user.password, registrar: $scope.user.endpoint.credentials.realm})
	.then(function(){
		setInterval(function(){
			if(!$rootScope.currentCall){
				console.log("Updating registration");
				BWSip.updateRegistration().then(function(){}, function(err){
					console.log(err);
					alert(err.message);		
				});
			}
		},  60000);
	}, function(err){
		console.log(err);
		alert(err.message);
	});
})

.controller("DialerCtrl", function($scope, $rootScope, $state, BWSip) {
	$scope.number = "";
	$scope.add = function(n){
		$scope.number += n;
	}
	$scope.makeCall = function(){
		BWSip.makeCall("+1" + $scope.number + "@" + $scope.user.endpoint.credentials.realm).then(function(call){
			$rootScope.currentCall = {call: call, number: $scope.number};
			$scope.number = "";
			$state.go("call");
		}, function(err){
			console.log(err);
			alert(err.message);	
		});
	};
	$scope.clear = function(){
		$scope.number = "";
	};
	$scope.removeLast = function(){
		$scope.number = $scope.number.substr(0, $scope.number.length - 1); 
	};
	var phonepad = angular.element(document.getElementsByClassName("phonepad"));
	phonepad.css("margin-left", ((window.innerWidth - phonepad[0].offsetWidth)/2 - 4) + "px");
})
.controller("SettingsCtrl", function($scope, baseServerUrl) {
	$scope.baseServerUrl = baseServerUrl;
})
.controller("RegisterUserCtrl", function($scope, $state, $ionicBackdrop, baseServerUrl, cordovaHTTP, BWSip, $window, $timeout) {
	$scope.registerUser = function(userName){
	  var password = randomString(16);
	  $ionicBackdrop.retain();
	  cordovaHTTP.post(baseServerUrl + "/users", {userName: userName, password: password}, {}).then(function(res){
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
.controller("IncomingCallCtrl", function($scope, $rootScope, $state) {
	$scope.answer = function(){
		stopIncomingCallRing();
		$rootScope.currentCall.call.answerCall().then(function(){
			$state.go("call");
		}, function(err){
			console.log(err);
			alert(err.message);	
		});
	};
	$scope.hangup = function(){
		stopIncomingCallRing();
		$rootScope.currentCall.call.hangup().then(function(){
			$rootScope.currentCall = null;
			$state.go("tab.dialer");
		}, function(err){
			console.log(err);
			alert(err.message);	
		});
	};
})
.controller("CallCtrl", function($scope, $rootScope, $state) {
	$scope.hangup = function(){
		stopIncomingCallRing();
		$rootScope.currentCall.call.hangup().then(function(){
			$rootScope.currentCall = null;
			$state.go("tab.dialer");
		}, function(err){
			console.log(err);
			alert(err.message);	
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
