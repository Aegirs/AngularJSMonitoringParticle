/**
 * Created by mazurkiewicz on 27/02/15.
 */

'use strict';

angular.module('sparkFullStackApp')
  .controller('MenuCtrl', function ($scope, $location) {
    $scope.menu = [
      {'title': 'Dashboard', 'link': '/'},
      {'title': 'Sensors', 'link': '/sensor'}
    ];

    $scope.isCollapsed = true;

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
