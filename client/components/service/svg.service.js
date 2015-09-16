/**
 * Created by mazurkiewicz on 07/03/15.
 */

// problem max = 0 ou -1 aucune detection faite aux alentours
'use strict';

angular.module('sparkFullStackApp')
  .factory('Svg', function ($q,$interval) {

    function convertionPolaire_XY(infoPolaire) {
      var angle =  infoPolaire[0];

      var x = infoPolaire[1]*Math.cos(Math.PI*angle/180);
      var y = infoPolaire[1]*Math.sin(Math.PI*angle/180);
      return {"x":x,"y":y,"size":infoPolaire[2]}
    }

    function convertCoord(datas) {
      var res = [];

      angular.forEach(datas,function(elt) {
        var data = convertionPolaire_XY(elt);
        res.push(data);
      });

      return {"datas":res}
    }

    function addAngle(datasCapteur) {
      var res = [];
      var datas = [];

      if ( (typeof datasCapteur) == "string") {
        datas = datasCapteur.split(",");
      }
      else {
        datas = datasCapteur;
      }

      var N = datas.length -1;
      console.log(N);

      for(var k = 0 ; k < N ;k++) {
        var data = parseFloat(datas[k]);

        if ( data > -1 ) {

          var angle = 6*(k%31);
          if ( k < 31 ) {
            res.push([angle,data,1.5]);
          }
          else {
            res.push([(180 - angle),data,1.0])
          }
        }
      }

      return res;
    }

    function updateData(datas,drawData) {
      angular.forEach(datas,function(elt) {
        drawData.push({"x":elt["x"],"y":elt["y"],"size":elt["size"]});
      });
    }

    function drawSvg(datas,drawData) {
      var coordsXY = convertCoord(datas);
      updateData(coordsXY["datas"],drawData);
    }


    return {
      convertionPolaire_XY: function(infoPolaire,numCoord) {
        return convertionPolaire_XY(infoPolaire,numCoord);
      },
      addAngle: function(datasCapteur) {
        return addAngle(datasCapteur);
      },
      drawSvg: function(datas,drawData) {
        return drawSvg(datas,drawData);
      }
    }
  });

