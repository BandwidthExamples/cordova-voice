#cordova-voice

Cordova demo of voice app

## Requirements

* Android and/or IOS developer kits
* [Node.js](https://nodejs.org/) 0.10+
* Voice server app (you can use any of them: [ruby-voice-reference-app](https://github.com/BandwidthExamples/ruby-voice-reference-app), [node-voice-reference-app](https://github.com/BandwidthExamples/node-voice-reference-app), [csharp-voice-reference-app](https://github.com/BandwidthExamples/csharp-voice-reference-app))


## Install

Install `ionic` and `cordova`.

```
	npm install -g ionic cordova # may be sudo will be required
```

Clone this project

```
	git clone https://github.com/BandwidthExamples/cordova-voice
```
Go to project directory and install dependencies by

```
	ionic state restore
```

Open file `www/js/app.js` and change first line

```js
	var baseServerUrl = "url-to-your-voice-server"; //without last slash
```

Build and run this app

```
	# ios app on emulator
	ionic emulate ios
	
	# android app on emulator
	ionic emulate android
	
	# ios app on real ios device
	ionic run ios
	
	# android app on real android device
	ionic run android

```

You can use XCode and Android Studio to run this app.

Open `platforms/ios/cordova-voice.xcodeproj` in XCode to run and debug this app from Xcode.

Open directory `platform/android/` in Android Studio as new project (import from Gradle) to run and debug this app from Android Studio.


