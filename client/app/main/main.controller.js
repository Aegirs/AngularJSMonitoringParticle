'use strict';

angular.module('sparkFullStackApp')
  .controller('MainCtrl', ['$scope','$rootScope','socket','$http', 'SparkRequest',function ($scope,$rootScope,socket,$http,SparkRequest) {

    $scope.infoConnect = {};

    $scope.connection = {grant_type:'password',username: '', password: ''};
    $rootScope.connection =  $scope.connection;

    $scope.connect = function() {
      SparkRequest.connectionCloud($scope.connection,function() {
        SparkRequest.listCardFunction();
      });
    }

    $scope.deleteAll = function() {
      SparkRequest.deleteAll('core',function() {

      });
      SparkRequest.deleteAll('token',function() {

      });
    }

    SparkRequest.getAll('core',function(cores) {
      $rootScope.listCarte = cores;
    })
  }]);
