'use strict';

angular.module('sparkFullStackApp')
  .controller('TokenCtrl', ['$scope','$rootScope','SparkRequest',function ($scope,$rootScope,SparkRequest) {


    SparkRequest.getAll('token',function(tokens) {
      $scope.arrayToken = {tokens: tokens,check: {}};
    });

    $scope.clearToken = function(index) {
      var idConnect =  $rootScope.connection.username + ":" + $rootScope.connection.password;
      SparkRequest.deleteToken(idConnect,$scope.arrayToken.tokens[index], function(data) {

        $scope.arrayToken.check[index.toString()] = false;

        if($scope.arrayToken.tokens.length < 2 ) {
          $scope.arrayToken.tokens = [];
          $scope.arrayToken.check = {};
        }
        else {
          $scope.arrayToken.tokens.splice(index,1);
        }
        SparkRequest.getAll('token',function(datas) {
          $scope.tmp=datas;
        })

      });
    };

    $scope.clearAllToken = function() {
      for(var i in $scope.arrayToken.tokens)
      {
        $scope.clearToken(i);
      }
    };

    $scope.clearSelectedToken = function() {
      angular.forEach( $scope.arrayToken.check, function(key,value) {
        var index = parseInt(value);
        if ( key ) {
          $scope.clearToken(index);
        }
      });
      $scope.arrayToken.check = {};
    };

  }]);
