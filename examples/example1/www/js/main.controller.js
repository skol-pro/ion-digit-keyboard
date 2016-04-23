angular.module('starter').controller('MainController', ['$scope', MainController]);

function MainController($scope) {
	$scope.password = '';
	$scope.canErase = false;
	$scope.pinDotVisible = {};
	$scope.success = null;

	$scope.keyboardSettings = {
		showLetters: true,
		theme: 'dark',
		
		action: function(number) {
			if ($scope.password.length < 4) {
				$scope.password += number;
				$scope.pinDotVisible[$scope.password.length] = true;
				$scope.canErase = true;
				$scope.success = null;
			}
		},
		
		// Clear
		leftButton: {
			html: '<i class="icon ion-close-circled"></i>',
			action: function() {
				$scope.password = '';
				$scope.pinDotVisible = {};
				$scope.canErase = false;
				$scope.success = null;
			},
			style: {
				color: '#fff',
				bgColor: 'transparent',
				activeBgColor: 'rgba(0, 0, 0, 0.50)',
				borderColor: 'transparent'
			}
		},
		
		// Submit login
		rightButton: {
			html: '<i class="icon ion-log-in"></i>',
			action: function() {
				if ($scope.password == '1234') {
					$scope.success = true;
				} else {					
					$scope.success = false;
					$scope.password = '';
					$scope.canErase = false;
					$scope.pinDotVisible = {};
				}
			},
			style: {
				color: '#fff',
				bgColor: 'transparent',
				activeBgColor: 'rgba(0, 0, 0, 0.50)',
				borderColor: 'transparent'
			}
		}
	}
	
	$scope.doErase = function() {
		$scope.pinDotVisible[$scope.password.length] = false;
		$scope.password = $scope.password.slice(0, -1);
		if ($scope.password.length == 0) $scope.canErase = false;
	}
	
	/*$scope.toggleKeyboard = function() {
		$scope.hideKeyboard = !$scope.hideKeyboard;
	}*/
	
	$scope.showKeyboard = function() {
		$scope.keyboardVisible = true;
	}
	
	$scope.hideKeyboard = function() {
		$scope.keyboardVisible = false;
	}
	
	/*$scope.hideKeyboard = function($event) {
		if (typeof $event.target.attributes.type == 'undefined' || $event.target.attributes.type.value != 'password') {
			$scope.keyboardVisible = false;
		}
	}*/
}