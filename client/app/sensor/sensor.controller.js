'use strict';

angular.module('sparkFullStackApp')
  .controller('SensorCtrl',  ['$scope','$rootScope', '$location', 'SparkRequest','fileUpload',function ($scope,$rootScope,$location,SparkRequest,fileUpload) {

    $rootScope.listCarte = [];
    $scope.id = 0;

    $scope.go = function (path,id) {
      $location.path(path + id);
    };

    $scope.choiceDraw = ["Graph","Map"];
    $scope.typeDraw = [];

    $scope.refreshCore = function(id) {
      $scope.id = id;
      $scope.carteId = $rootScope.listCarte[id].name;

      SparkRequest.infodevice($scope.carteId,function(data) {
        var varName = data.variables["name"];
        var information = data.variables["information"];

        $rootScope.listDataCarte = data;

        if ( angular.isDefined(varName)) {

          delete $rootScope.listDataCarte.variables["name"];
          var infodevice = $scope.carteId + '/name';

          SparkRequest.infodevice(infodevice,function(info) {
            $scope.nameProg = info.result;
          })
        }

        if ( angular.isDefined(information)) {

          delete $rootScope.listDataCarte.variables["information"];
          /*var infodevice = $scope.carteId + '/name';

          SparkRequest.infodevice(infodevice,function(info) {
            $scope.nameProg = info.result;
          })*/
          $scope.informationSpark = information;
        }


        $scope.typeDraw = [];

        angular.forEach($rootScope.listDataCarte.variables,function(key,type) {
          $scope.typeDraw.push("Graph");
        })

      })
    }

    $scope.updateTypeDraw= function(indexVariable,choice) {
      console.log(indexVariable);
      $scope.typeDraw[indexVariable] = choice;
    }

    SparkRequest.getAll('core',function(cores) {
      console.log(cores);
      $rootScope.listCarte = cores;
      $scope.refreshCore(0);
    })

    $scope.reponse = null;
    $scope.args = [];

    $scope.useFunction = function(funcName,index) {
      SparkRequest.sendData( $scope.carteId,funcName, $scope.args[index], function (data) {
        console.log(data);
        $scope.reponse = data;
      });
    }

    $scope.isConnect = function() {
      if ( angular.isDefined($rootScope.listDataCarte) ) {
        if ( $rootScope.listDataCarte.connected ) {
          return "btn btn-success dropdown-toggle"
        }
      }
      else {
        return "btn btn-danger dropdown-toggle"
      }
    }

    $scope.flash = function() {
      var file = $scope.myFile;

      console.log('file is ' + JSON.stringify(file));
      var uploadUrl = "/fileUpload";
      fileUpload.uploadFileToUrl(file, uploadUrl);
    }

    //test key press
    document.addEventListener('keypress', logeventinfo, false);

    function logeventinfo (ev) {
      console.log(ev);
    }

}]).directive('fileModel', ['$parse', function ($parse) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var model = $parse(attrs.fileModel);
        var modelSetter = model.assign;

        element.bind('change', function(){
          scope.$apply(function(){
            modelSetter(scope, element[0].files[0]);
          });
        });
      }
    };
  }]).service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(file, uploadUrl){
      var fd = new FormData();
      fd.append('file', file);
      $http.post(uploadUrl, fd, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
      })
        .success(function(){
        })
        .error(function(){
        });
    }
  }]);
