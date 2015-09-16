'use strict';

angular.module('sparkFullStackApp')
  .controller('NavbarCtrl', function ($scope, $location) {
    $scope.menu = [
      {'title': 'Dashboard', 'link': '/'},
      {'title': 'Sensors', 'link': '/sensor'},
      {'title': 'Settings', 'link': '/token'},
      {'title': 'Help', 'link': '/'}
    ];

    $scope.isCollapsed = true;

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
