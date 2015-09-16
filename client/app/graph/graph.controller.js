'use strict';

angular.module('sparkFullStackApp')
  .controller('GraphCtrl', ['$scope','$routeParams', 'Graph','SparkRequest','Svg',function ($scope,$routeParams,Graph,SparkRequest,Svg) {

    $scope.carteId = $routeParams.carteId;
    $scope.sensorId = $routeParams.sensorId;
    $scope.typeSensor = $routeParams.typeSensor;
    $scope.typeGraph = $routeParams.typeGraph;
    $scope.sensorData = [];
    $scope.dataRep = [];
    $scope.coordSvg =  [];

    $scope.xAxisTickFormatFunction = function() {
      return function(d) {
        //return d3.time.format('%x')(new Date(d));  //uncomment for date forma
        return d;
      }
    };

    var truncate = function(val,num) {
      var coeffMult = Math.pow(10,num);
      var tronc = Math.round( coeffMult * val);
      return tronc / coeffMult;
    };

    $scope.yAxisTickFormatFunction = function(){
      return function(d){
        return truncate(d,5);
      }
    };

    $scope.xAxisSvg = function() {
      return function(d) {
        return truncate(d.x,2);
      }
    };

    $scope.yAxisSvg = function(){
      return function(d){
        return truncate(d.y,2);
      };
    }


    var getDataSpark = function() {

      var start = new Date().getTime();
      var infodevice = $routeParams.carteId + '/' + $routeParams.sensorId;

      SparkRequest.infodevice(infodevice,function(data) {

        if ( $scope.typeGraph == "Graph" ) {
          Graph.drawData(data.result,$scope.sensorData[0]["values"],start);
        }
        else {
          $scope.coordSvg = [
            {
              "key":$scope.sensorId,
              "values":[]
            }
          ];
          var dataSvg = Svg.addAngle(data.result);
          Svg.drawSvg(dataSvg,$scope.coordSvg[0]["values"]);
        }
      });
    };

    $scope.readData = function() {
        $scope.sensorData = [
          {
            "key":$routeParams.sensorId,
            "values":[]
          }
        ];

      SparkRequest.getAll('token',function(tokens) {
        Graph.readData($routeParams,tokens[0].token,function() {
          getDataSpark()
        });
      });
    };

    $scope.scanData= function() {
      SparkRequest.sendData( $scope.carteId,"sparkCommand", "ok", function (data) {
         $scope.reponse = data;
      });

    }

    $scope.stopDraw = function() {

      Graph.stopData();
      $scope.dataRep = [];

      $scope.nbSchemas = Graph.drawSchemas($scope.sensorData[0]["values"],function(data) {
        $scope.dataRep.push(data);
      });
    };

    $scope.clearData = function() {
      $scope.sensorData = [];
      $scope.coordSvg = [];
      $scope.dataRep = [];
    };

  }]);
