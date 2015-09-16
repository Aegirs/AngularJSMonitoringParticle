/**
 * Created by mazurkiewicz on 26/02/15.
 */

'use strict';

angular.module('sparkFullStackApp')
  .factory('SparkRequest', function ($q,$http,$base64,socket) {


    function dataConnection(infoConnection) {
      return  "grant_type="+ infoConnection.grant_type +
        "&username=" + infoConnection.username + "&password=" + infoConnection.password;
    }
    function idConnection(infoConnection) {
      return infoConnection.username + ":" + infoConnection.password;
    }

    function accessToken(infoConnection,callback) {
      $http({
        method: 'POST',
        url: "https://api.spark.io/oauth/token",
        headers: {'Content-Type': 'application/x-www-form-urlencoded','Authorization': 'Basic ' + $base64.encode('spark:spark')},
        data:  dataConnection(infoConnection)
      }).success(function(data){
        callback(data);
      }).error(function(err) {
        console.log(err);
      });
    };

    function listCardFunction() {

      deleteAll('core',function() {
        getAll('token',function(tokens) {
          $http.get('https://api.spark.io/v1/devices?access_token=' + tokens[0].token).success(function(cores) {

            angular.forEach(cores,function(core) {
              var coreJson = {"idCore": core.id,"name":core.name ,"connect":core.connected}
              postElt('core',coreJson);
            });

          }).error(function(err) {
            console.log(err);
          });
        })
      });
    };

    function createToken(token) {
      var expires_at = new Date() + new Date(token.expires_in);

      return {token:token.access_token,expires_at:expires_at.toString(),client:""}
    }

    function updateToken(tokens,infoConnection) {

      var ClientCli = false;
      deleteAll('token',function() {

        if ( tokens.length > 0 ) {

          var date = new Date();
          angular.forEach(tokens ,function(token){
            // trouver comment mettre un nom aux tokens et verifier qu'il exite un token pour token.client='Id Spark'
            //if ( token.client == 'cli' ) {

            ClientCli = true;
            var expires = new Date(token.expires_at);

            if ( expires - date < 0 ) {
              deleteToken(idConnection(infoConnection),token,function(data) {
                console.log("suppr: " + data);
              });
              accessToken(infoConnection,function(newToken) {
                postElt('token',createToken(newToken));
              });
            }
            else{
              postElt('token',token);
            }
            // }

          });
        }
        if ( !ClientCli ) {
          accessToken(infoConnection,function(newToken) {
            postElt('token',createToken(newToken));
          });
        }
      });
    }

    function connectionCloud(infoConnection,callback) {
      $http({
        method: 'GET',
        url: "https://api.spark.io/v1/access_tokens" ,
        headers: {'Authorization': 'Basic ' + $base64.encode(idConnection(infoConnection)) }
      }).success(function(tokens){
        updateToken(tokens,infoConnection);
        callback();
      }).error(function(err) {
        console.log(err);
      });
    }

    function infodevice(infoRead,callback) {

      getAll('token',function(tokens) {

        $http.get('https://api.spark.io/v1/devices/' + infoRead +'?access_token=' + tokens[0].token).success(function(data) {
          callback(data);
        }).error(function (err) {
          console.log(err);
        });
      })

    }

    function sendData(carte,functionName,args,callback) {
      getAll('token',function(tokens) {
        $http({
          method: 'POST',
          url: "https://api.spark.io/v1/devices/" + carte + "/" + functionName + '?access_token=' + tokens[0].token ,
          data: "&args=" + args,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function(data){
          callback(data);
        }).error(function(err) {
          console.log(err);
        });
      })
    }

    function deleteToken(idConnect,token,callback) {

      $http({
        method: 'DELETE',
        url: "https://api.spark.io/v1/access_tokens/" + token.token,
        headers: {'Authorization': 'Basic ' + $base64.encode(idConnect)}
      }).success(function (data) {
        console.log(token);
        deleteElt('token',token);
        callback(data);
      }).error(function (err) {
        console.log(err);
      });
    }

    function getAll(table,callback) {
      $http.get('/api/' + table).success(function(awesomeThings) {
        callback(awesomeThings);
        socket.syncUpdates(table, awesomeThings);
      }).error(function(err) {
        console.log(err);
      });
    }

    function postElt(table,elt) {
      $http.post('/api/' + table, elt).success(function(str) {
        console.log("Success post: " + str);
      }).error(function(err){
        console.log(err);
      });
    };

    function deleteElt(table,elt) {
      $http.delete('/api/' + table + '/' + elt._id).success(function() {
        console.log("Success delete: " + elt);
      }).error(function(err){
        console.log(err);
      });
    };

    function deleteAll(table,callback) {
      getAll(table,function(elts) {
        angular.forEach(elts ,function(elt) {
          deleteElt(table,elt);
        });
      });
      callback();
    }

        /* $scope.$on('$destroy', function () {
         socket.unsyncUpdates('token');
         });*/


        return {
          connectionCloud: function(infoConnection,callback) {
            return connectionCloud(infoConnection,callback);
          },
          accessToken: function(infoConnection,callback) {
            return accessToken(infoConnection,callback);
          },
          listCardFunction: function() {
            return listCardFunction();
          },
          deleteToken: function(idConnect,token,callback) {
            return deleteToken(idConnect,token,callback);
          },
          infodevice: function(infoRead,callback) {
            return infodevice(infoRead,callback);
          },
          sendData: function(carte,functionName,args,callback) {
            return sendData(carte,functionName,args,callback);
          },
          getAll: function(table,callback) {
            return getAll(table,callback);
          },
          postElt: function(table,elt) {
            return postElt(table,elt);
          },
          deleteElt: function(table,elt) {
            return deleteElt(table,elt);
          },
          deleteAll: function(table,callback) {
            return deleteAll(table,callback);
          }
        }


      });
