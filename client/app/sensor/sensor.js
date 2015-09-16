'use strict';

angular.module('sparkFullStackApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/sensor', {
        templateUrl: 'app/sensor/sensor.html',
        controller: 'SensorCtrl'
      });
  });
