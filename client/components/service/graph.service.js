/**
 * Created by mazurkiewicz on 26/02/15.
 */


'use strict';

angular.module('sparkFullStackApp')
  .factory('Graph', function ($q,$interval) {

    function reasearchEnd(tableData,indexCurrent,i) {
      var indexStart = [];
      var indexEnd = [];
      var n = tableData.length;
      var start = indexCurrent - 1;

      for(var m = i; m < n;m++) {
        if ( ( indexCurrent < n ) && ( tableData[m][1] == tableData[indexCurrent][1] ) ) {
          indexCurrent += 1;
        }
        else {
          indexStart.push(i-1);
          indexStart.push(start);

          indexEnd.push(m-1);
          indexEnd.push(indexCurrent-1);

          break;
        }
      }
      return {"start":indexStart,"end": indexEnd};
    };

    function researchSchemas(datas) {

      var indexCurrent = [];

      var n = datas.length;
      var i = 0;
      var schemas ={"start":[],"end":[]}

      while ( i < n ) {

        if ( indexCurrent.length > 0 ) {
          // boucle parcourant tout l'ensemble des elements egaux à datas[i][1]
          var max = 0;
          for(var k in indexCurrent) {

            // pas de reparcourir si l'indice de fin max inclut est superieur à l'indice start
            if ( ( (indexCurrent[k] - 1) < max) || (max == 0) ) {

              // recherche de la fin de l'interval
              var result = reasearchEnd(datas,indexCurrent[k],i);

              // test max indice
              if ( result.end[0] > max ) {
                max = result.end[0];
              }

              // test de la taille de l'interval
              if ( (result.end[0] - result.start[0] ) > 20 ) {
                schemas["start"].push(result.start);
                schemas["end"].push(result.end);
              }

            }
            else {
              break;
            }

          }

          i = max;
          indexCurrent = [];
        }
        else {
          for(var j = i+1;j < n;j++) {
            if ( datas[i][1] == datas[j][1] ) {
              indexCurrent.push(j+1);
            }
          }
        }
        i++;
      }
      return schemas;
    };

    function drawSchemas(datas,callback) {
      var allRepeat = researchSchemas(datas);
      for(var i = 0 ; i < allRepeat["start"].length;i++) {

        var tmp = {"key":  "Sequence" + i , "values":[]}
        for(var j = allRepeat["start"][i][0]; j < allRepeat["end"][i][0]; j++) {
          tmp.values.push(datas[j]);
        }
        callback(tmp);

        tmp = {"key":  "Repetition" + i , "values":[]}
        for(var j = allRepeat["start"][i][1]; j < allRepeat["end"][i][1]; j++) {
          tmp.values.push(datas[j]);
        }
        callback(tmp);
      }
      return allRepeat["start"].length;
    }

    var eventSource = null;
    var lastPublished = null;
    var boucle = undefined;
    var incr = 0;

    // coeff test à supprimer à l'avenir
    var sizeAverageData = 0;

    var end = false;
    var totalT2 = 0;
    var cpt = 0;
    var totalT = 0;

    function readData(params,accestoken,callback) {
      console.log(params.typeSensor);
      incr = 0;

      if ( params.typeSensor != "string" ) {

        // Don't start a new fight if we are already fighting
        boucle = $interval(function() {
          callback();
        }, 500);

      }
      else {
        eventSource = new EventSource("https://api.spark.io/v1/devices/" + params.carteId + "/events/?access_token=" + accestoken);

        eventSource.addEventListener('open', function (e) {
          console.log("Opened! : ", e);
        }, false);

        eventSource.addEventListener('error', function (e) {
          console.log("Errored!");
        }, false);

        eventSource.addEventListener('allData', function (e) {
          var data = JSON.parse(e.data);
          if (lastPublished == null) {
            lastPublished = new Date(data.published_at);
          }
          else {
            var published = new Date(data.published_at);
            console.log("Time published : " + (published - lastPublished));
            lastPublished = published;
          }
          callback();
        }, false);
      }
    }

    function stopData() {
      if (angular.isDefined(boucle)) {
        $interval.cancel(boucle);
        boucle = undefined;
      }
      else if ( eventSource != null ) {
        eventSource.close();
        lastPublished = null;
      }

      end = true;
      console.log('Request took : ' + totalT/cpt + '\nWith : '+ cpt);
      console.log('Calcul took : ' + totalT2/cpt + '\nWith : '+ cpt);
      console.log('Size table took : ' + sizeAverageData/cpt + '\nWith : '+ cpt);
    }

    function readStringData(data,dataDraw) {
      var arr = data.split(",");
      sizeAverageData += arr.length;

      for(var i=0;i<arr.length -1 ;i++) {
        dataDraw.push([incr, parseInt(arr[i])]);
        incr += 1;
      }
    };

    function saveData(data,dataDraw) {
      console.log(incr);

      if ( data != null ) {
        dataDraw.push([ incr , data]);
      }
      incr += 200;
    }

    function drawData(data,dataDraw,start) {
      var endTime  = new Date().getTime();
      cpt += 1;
      totalT += endTime - start;

      if ( ( typeof data ) == "string" ) {
        readStringData(data,dataDraw);
      }
      else {
        saveData(data,dataDraw);
      }
      var end2  = new Date().getTime();
      totalT2 += end2 - endTime;

      console.log("Time request: " , (endTime - start));
    }

    function extractDataY(elt) {
      var data = -1;
      if ( elt.length > 1 ) {
        data = elt[1];
      }
      else {
        data = elt;
      }

      return data;
    }


    return {
      drawSchemas: function(datas,callback) {
        return drawSchemas(datas,callback);
      },
      readData: function(carte,accestoken,callback) {
        return readData(carte,accestoken,callback);
      },
      stopData: function() {
        return stopData();
      },
      drawData: function(data,dataDraw,start) {
        return drawData(data,dataDraw,start);
      },
      convertionPolaire_XY: function(infoPolaire,numCoord) {
        return convertionPolaire_XY(infoPolaire,numCoord);
      },
      drawSvg: function(datas,seuilX,seuilY) {
        return drawSvg(datas,seuilX,seuilY);
      },
      axis: function(tailleElt,tailleFenete,caract) {
        return axis(tailleElt,tailleFenete,caract);
      }
    }

  });

