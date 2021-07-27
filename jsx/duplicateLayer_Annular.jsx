$.evalFile(File($.fileName).parent + "/lib/kersBoru_lib.jsx");


var m = function () {
    var num = 12;//数量
    var angle = 30; //角度
    var alpha = 100;//透明度
    for (var i = 0; i < num-1; i++) {

        var layer = app.activeDocument.activeLayer;
        layer.duplicate();
        layer.fillOpacity = nn;
        alpha -= 9;
        kersBoru.listenerType.rotationAngle(124, 124, angle);//旋转角度
    }
}
m();



/** 动作描述 全套动作
var idTrnf = charIDToTypeID("Trnf");
var desc2644 = new ActionDescriptor();
var idnull = charIDToTypeID("null");
var ref472 = new ActionReference();
var idLyr = charIDToTypeID("Lyr ");
var idOrdn = charIDToTypeID("Ordn");
var idTrgt = charIDToTypeID("Trgt");
ref472.putEnumerated(idLyr, idOrdn, idTrgt);
desc2644.putReference(idnull, ref472);
var idFTcs = charIDToTypeID("FTcs");
var idQCSt = charIDToTypeID("QCSt");
var idQcsi = charIDToTypeID("Qcsi");
desc2644.putEnumerated(idFTcs, idQCSt, idQcsi);
var idPstn = charIDToTypeID("Pstn");
var desc2645 = new ActionDescriptor();
var idHrzn = charIDToTypeID("Hrzn");
var idPxl = charIDToTypeID("#Pxl");
desc2645.putUnitDouble(idHrzn, idPxl, 250.000000);
var idVrtc = charIDToTypeID("Vrtc");
var idPxl = charIDToTypeID("#Pxl");
desc2645.putUnitDouble(idVrtc, idPxl, 618.000000);
var idPnt = charIDToTypeID("Pnt ");
desc2644.putObject(idPstn, idPnt, desc2645);
var idOfst = charIDToTypeID("Ofst");
var desc2646 = new ActionDescriptor();
var idHrzn = charIDToTypeID("Hrzn");
var idPxl = charIDToTypeID("#Pxl");
desc2646.putUnitDouble(idHrzn, idPxl, -0.000000);
var idVrtc = charIDToTypeID("Vrtc");
var idPxl = charIDToTypeID("#Pxl");
desc2646.putUnitDouble(idVrtc, idPxl, 0.000000);
var idOfst = charIDToTypeID("Ofst");
desc2644.putObject(idOfst, idOfst, desc2646);
var idAngl = charIDToTypeID("Angl");
var idAng = charIDToTypeID("#Ang");
desc2644.putUnitDouble(idAngl, idAng, 20.000000);
var idLnkd = charIDToTypeID("Lnkd");
desc2644.putBoolean(idLnkd, true);
var idIntr = charIDToTypeID("Intr");
var idIntp = charIDToTypeID("Intp");
var idBcbc = charIDToTypeID("Bcbc");
desc2644.putEnumerated(idIntr, idIntp, idBcbc);
executeAction(idTrnf, desc2644, DialogModes.NO);
 */