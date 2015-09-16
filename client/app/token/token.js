'use strict';

angular.module('sparkFullStackApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/token', {
        templateUrl: 'app/token/token.html',
        controller: 'TokenCtrl'
      });
  });
