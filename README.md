#Ionic Digit Keyboard

![](http://icons.iconarchive.com/icons/yusuke-kamiyamane/fugue/16/information-button-icon.png) Try it now using [Ionic View](http://view.ionic.io/) with the following id: **462C870C**.

* [Info](#1---info)
* [Installation / loading](#2---installation--loading)
* [Usage](#3---usage)
	* [Adding the keyboard directive to your app](#31---adding-the-keyboard-directive-to-your-app)
	* [Settings](#32---settings)
	* [Last step to get a working keyboard](#33---last-step-to-get-a-working-keyboard)
	* [Show keyboard on demand](#34---show-keyboard-on-demand)
	* [Hide keyboard on demand](#35---hide-keyboard-on-demand)
	* [Show / hide animations](#36---show--hide-animations)
* [Left and right actions](#4---left-and-right-actions)
* [Resize content](#5---resize-content)
* [Customization](#6---customization)
	* [Keyboard theme](#61---keyboard-theme)
	* [Round buttons](#62---round-buttons)
	* [Keyboard width](#63---keyboard-width)
	* [Keyboard alignment](#64---keyboard-alignment)
	* [Actions buttons style](#65---actions-buttons-style)
	* [Display letters](#66---display-letters)
* [Advanced customization](#7---advanced-customization)
	
##1 - Info
Version: 1.0.0<br>
Author: Skol (Vincent Letellier)<br>
Email: skol.pro@gmail.com<br>
Donations: You're really welcome to donate, any amount at any time :-)

[![](https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=ADEZD3EL9DN5Q&lc=US&item_name=Ionic%20Digital%20Keyboard&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donate_LG%2egif%3aNonHosted)

##2 - Installation / loading
Add the *ion-digit-keyboard.min.js* to your project, insert it in your index.html, add it as dependency: 
```javascript
angular.module('app', ['ionic', 'ion-digit-keyboard'])
```

##3 - Usage
####3.1 - Adding the keyboard directive to your app
You can add the **ion-digit-keyboard** directive globaly, right before the body closure of your html:
```html
<!-- index.html -->
<body>
	...
	<ion-digit-keyboard settings="keyboardSettings"></ion-digit-keyboard>
</body>
```

Or in a specific view, be sure to put it outside of the view content:
```html
<!-- myView.html -->
<ion-view>
	<ion-header-bar></ion-header-bar>
	<ion-content></ion-content>
	<ion-digit-keyboard settings="keyboardSettings"></ion-digit-keyboard>
</ion-view>
```

####3.2 - Settings
As you probably noticed, you'll need to define a **settings** object in (one of) your controller(s):
```javascript
angular.module('app').controller('MyController', ['$scope', MyController]);

function MyController($scope) {	
	$scope.keyboardSettings = {
		// settings here
	}
}
```

####3.3 - Last step to get a working keyboard
Now you only need to define the **action** happening when a number key is pressed.
So let say you want to add the pressed numbers to an input element:
```html
<!-- myView.html -->
<ion-view ng-controller="MyController">
	<ion-content>
		<input type="text" ng-model="numbers">
	</ion-content>
	<ion-digit-keyboard settings="keyboardSettings"></ion-digit-keyboard>
</ion-view>
```
```javascript
// MyController.js
function MyController($scope) {
	$scope.numbers = '';
	$scope.keyboardSettings = {
		action: function(number) {
			$scope.numbers += number;
		}
	}
}
```
If you tried that, you probably noticed that if you click on the input, the native keyboard is showing up. One way to prevent that is to add the **readonly** property to the input, of course you'll have to adjust the input style using this method.

####3.4 - Show keyboard on demand
If you want to show the keyboard when you click on the input, simply use the **ngShow** or **ngHide** angular directive attributes (don't forget the **readonly** attribute in this case, or any other native keyboard workaround):
```html
<!-- myView.html -->
<ion-view ng-controller="MyController">
	<ion-content>
		<input type="text" ng-model="numbers" ng-click="showKeyboard($event)" readonly>
	</ion-content>
	<ion-digit-keyboard settings="keyboardSettings" ng-show="keyboardVisible"></ion-digit-keyboard>
</ion-view>
```
```javascript
// MyController.js
function MyController($scope) {
	$scope.numbers = '';
	$scope.keyboardVisible = false;
	$scope.keyboardSettings = {
		action: function(number) {
			$scope.numbers += number;
		}
	}
	$scope.showKeyboard = function($event) {
		keyboardVisible = true;
	}
}
```

####3.5 - Hide keyboard on demand
You won't be able to use angular **onBlur** directive to hide the keyboard, since tapping on the keyboard will trigger the blur event.
But you can for example add a **ngClick** directive to your content, and set `$scope.keyboardVisible` to false.

####3.6 - Show / hide animations
You can change the default *slide-up* animation to a *pop* animation (more animations may be implemented later):
```javascript
// MyController.js
function MyController($scope) {
	$scope.keyboardSettings = {
		animation: 'pop',
		// ...
	}
}
```

##4 - Left and right actions
You can add and customize bottom left and right actions. Here is an example with remove and submit buttons:
```javascript
// MyController.js
function MyController($scope) {
	// ...
	$scope.numbers = '';
	$scope.keyboardSettings = {
		action: function(number) {
			$scope.numbers += number;
		},
		leftButton: {
			html: '<i class="icon ion-backspace"></i>',
			action: function() {
				$scope.numbers = $scope.numbers.slice(0, -1);
			}
		},
		rightButton: {
			html: '<i class="icon ion-checkmark-circled"></i>',
			action: function() {
				// Submit stuff
			}
		}
	}
	// ...
}
```

##5 - Resize content
You can tell the directive to resize the main content of the view where the keyboard is showing up, **without** this property, the keyboard will be displayed over your view's content:
```html
<!-- myView.html -->
<ion-view ng-controller="MyController">
	<ion-content></ion-content>
	<ion-digit-keyboard settings="keyboardSettings"></ion-digit-keyboard>
</ion-view>
```
```javascript
// MyController.js
function MyController($scope) {
	$scope.keyboardSettings = {
		resizeContent: true
	}
}
```
By default, it will search for the **ion-content** element located inside the parent element. However you can specify another element to be resized:
```html
<!-- myView.html -->
<body>
	<ion-pane>
		<ion-header-bar></ion-header-bar>
		<ion-content></ion-content>
	</ion-pane>
	<ion-digit-keyboard settings="keyboardSettings"></ion-digit-keyboard>
</body>
```
```javascript
// MyController.js
function MyController($scope) {
	$scope.keyboardSettings = {
		resizeContent: {
			enable: true,
			element: 'ion-pane'
		}
	}
}
```

##6 - Customization
####6.1 - Keyboard theme
You can set one of the default ionic color scheme as a theme for the keyboard by adding the `theme` property in the keyboard settings (`light`, `stable`, `positive`, `calm`, `balanced`, `energized`, `assertive`, `royal`, `dark`).
There is two additional themes you can use: `opaque-black` and `opaque-white`, both are espacially usefull with `resizeContent` set to false since the keyboard will be displayed over your login panel background for-example.

####6.2 - Round buttons
To make buttons rounded, just set the `roundButtons` property to true inside the keyboard settings.

####6.3 - Keyboard width
You can change the `width` of the keyboard, using percentages or pixels. Default is "**100%**". Mostly usefull when using rounded buttons.

####6.4 - Keyboard alignment
You can also change the horizontal alignment of the keyboard using the `align` property. Default is "**center**".

####6.5 - Actions buttons style
You can add specific styles to the actions buttons by adding the `style` property to the action settings. Let say you want to have an iOS phone like button:
```javascript
// MyController.js
function MyController($scope) {
	$scope.keyboardSettings = {
		rightButton: {
			html: '<i class="icon ion-ios-telephone"></i>',
			action: function() {
				// Call action
			},
			style: {
				color: '#fff', // Text color
				bgColor: '#4cda64', // Background color
				activeBgColor: '#43bf58', // Baackground color when pressed
				borderColor: '#43bf58' // Only clearly visible on round buttons (until next plugin version)
			}
		}
	}
}
```

####6.6 - Display letters
Last but not least, you can display letters under numbers on the keyboard by setting the `showLetters` property to true.

##7 - Advanced customization
Coming soon...
