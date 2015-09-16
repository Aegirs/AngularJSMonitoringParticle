'use strict';

angular.module('sparkFullStackApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/graph/:carteId/:sensorId/:typeSensor/:typeGraph', {
        templateUrl: 'app/graph/graph.html',
        controller: 'GraphCtrl'
      });

  });
