#Ionic Digit Keyboard
Version: 1.0.0<br>
Author: Skol (Vincent Letellier)<br>
Email: skol.pro@gmail.com<br>
*Tutorial made using __iPhone 5__ as screen size reference.*
	
##Tutorial 1
Read the `readme.md` for the the installation and basics knowledges.

Let say you made a simple login screen like that and you want to add the Ionic Digit Keyboard plugin to it.

![Tutorial 1 screen A](https://github.com/skol-pro/ion-digit-keyboard/blob/master/tutorials/resources/tutorial_1_A.png?raw=true)

```html
<body ng-controller="MainController">
	<ion-pane id="login-panel">
		<ion-content>
			<p id="login-header">Welcome<span>Lorem ipsum dolor sit amet, recusandae sequi velit, aut fuga iste ea architecto, unde culpa.</span></p>
			<input type="text" ng-model="email" placeholder="Email address">
			<input type="password" ng-model="password" placeholder="Password" readonly>
			<p id="help">Password | Register</p>
		</ion-content>
	</ion-pane>
</body>
```
Simply add the directive in the `ion-pane` after `ion-content` if you want to use the keyboard only on this screen, or in `body` after `ion-pane` to use it globally.
Do not forget to add the `settings` attribute.
```html
<ion-digit-keyboard settings="keyboardSettings"></ion-digit-keyboard>
```
Let's add rounded buttons, display letters, a white opaque theme, a not full-width keyboard and the default action function:
```javascript
// MainController.js
angular.module('starter').controller('MainController', ['$scope', MainController]);

function MainController($scope) {
	$scope.email = '';
	$scope.password = '';
	
	$scope.keyboardSettings = {
		showLetters: true,
		roundButtons: true,
		width: '75%',
		theme: 'opaque-white',
		
		action: function(number) {
			$scope.password += number;
		}
	}
}
```
![Tutorial 1 screen B](https://github.com/skol-pro/ion-digit-keyboard/blob/master/tutorials/resources/tutorial_1_B.png?raw=true)

Nice ! Now, we'll need a submit button, and why not a remove button ?
```javascript
// MainController.js
function MainController($scope) {
	$scope.email = '';
	$scope.password = '';
	
	$scope.keyboardSettings = {
		showLetters: true,
		roundButtons: true,
		width: '75%',
		theme: 'opaque-white',
		
		action: function(number) {
			$scope.password += number;
		},
		
		leftButton: {
			html: '<i class="icon ion-backspace"></i>',
			action: function() {
				$scope.password = $scope.password.slice(0, -1);
			}
		},
		
		rightButton: {
			html: '<i class="icon ion-checkmark-round"></i>',
			action: function() {
				// Submit stuff
			}
		}
	}
}
```
Let's cutomize the submit button a bit:

```javascript
// MainController.js
function MainController($scope) {
	$scope.email = '';
	$scope.password = '';
	
	$scope.keyboardSettings = {
		//...
		rightButton: {
			html: '<i class="icon ion-checkmark-round"></i>',
			action: function() {
				// Submit stuff
			},
			style: {
				color: '#4E3A39',
				bgColor: '#fff',
				activeBgColor: 'rgba(255, 255, 255, 0.75)',
				borderColor: '#fff'
			}
		}
	}
}
```
Great, pretty good looking ! Final touch, we could make the keyboard a bit higher on the screen, by adding a bottom-margin to the keyboard for-example.

![Tutorial 1 screen C](https://github.com/skol-pro/ion-digit-keyboard/blob/master/tutorials/resources/tutorial_1_C.png?raw=true)

Currently, tapping the email input will show up the default keyboard over the digit keyboard, so let's hide the digit keyboard when the email input is focussed, and show it back when it's blured.
```html
<input type="text" ng-model="email" placeholder="Email address" ng-focus="hideKeyboard()" ng-blur="showKeyboard()">
```
```html
<ion-digit-keyboard settings="keyboardSettings" ng-show="keyboardVisible" style="margin-bottom: 15px;"></ion-digit-keyboard>
```
```javascript
// MainController.js
function MainController($scope) {
	$scope.email = '';
	$scope.password = '';
	
	$scope.keyboardVisible = true;
	
	$scope.keyboardSettings = {
		//...
	}
	
	$scope.showKeyboard = function() {
		$scope.keyboardVisible = true;
	}
	
	$scope.hideKeyboard = function() {
		$scope.keyboardVisible = false;
	}
}
```

Just for fun, let's play with some of the properties. Turn `showLetters` and `roundButtons` to false, set the `width` property to "**90%**" and finally add/replace the `style` property of both action buttons by the following one:
```javascript
style: {
	color: '#fff',
	bgColor: 'rgba(255, 255, 255, 0)',
	activeBgColor: 'rgba(255, 255, 255, 0.15)',
	borderColor: 'transparent'
}
```
Not very beautiful of course, it's just for demonstration purposes.

![Tutorial 1 screen D](https://github.com/skol-pro/ion-digit-keyboard/blob/master/tutorials/resources/tutorial_1_D.png?raw=true)

To conclude with this tutorial, let's imagine we want the login form to remains compact and to be centered on higher screens like tablets.
To achieve that, simple wrap `ion-content` in a new **div** and add some media queries style rules:
```html
<ion-pane id="login-panel">
	<div id="login-inner">
		<ion-content>
			<p id="login-header">Welcome<span>Lorem ipsum dolor sit amet, recusandae sequi velit, aut fuga iste ea architecto, unde culpa.</span></p>
			<input type="text" ng-model="email" placeholder="Email address" ng-focus="hideKeyboard()" ng-blur="showKeyboard()">
			<input type="password" ng-model="password" placeholder="Password" readonly>
			<p id="help">Password | Register</p>
		</ion-content>		
		<ion-digit-keyboard settings="keyboardSettings" ng-show="keyboardVisible" style="margin-bottom: 15px;"></ion-digit-keyboard>
	</div>
</ion-pane>
```
```html
<style>
	@media screen and (min-width: 310px) and (min-height: 510px) {
		#login-inner {
			position: relative;
			width: 310px;
			height: 510px;
			margin: 0 auto;
			top: 50%;
			margin-top: -270px; /* height/2 */
			overflow: hidden;
		}
	}
</style>
```
Of course feel free to add some size conditions code so that the digit keyboard is not hidding when the email input is focuessed on tablets.
![Tutorial 1 screen E](https://github.com/skol-pro/ion-digit-keyboard/blob/master/tutorials/resources/tutorial_1_E.png?raw=true)
Set back some of the previous keyboard settings and adjust style:
```html
<style>
	@media screen and (min-width: 310px) and (min-height: 540px) {
		#login-inner {
			position: relative;
			width: 310px;
			height: 540px;
			margin: 0 auto;
			top: 50%;
			margin-top: -270px; /* height/2 */
			overflow: hidden;
		}
	}
</style>
```
![Tutorial 1 screen F](https://github.com/skol-pro/ion-digit-keyboard/blob/master/tutorials/resources/tutorial_1_F.png?raw=true)

Hope you enjoyed !