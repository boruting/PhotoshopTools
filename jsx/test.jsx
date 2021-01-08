/*引用库*/
$.evalFile(File($.fileName).parent + "/lib/kersBoru_lib.jsx");
/*================================*/
$.writeln("111");

// var w = ((200 + 2) / 2) * 100; //((新的增加的宽度+现在选区宽度)/现在选区宽度)*100
// var h = ((200 + 2) / 2) * 100;
var layer = app.activeDocument.activeLayer;
var boundsInfo = kersBoru.layer.getLayerBounds (layer,"boundsNoMask");//"bounds"、"boundsNoMask"
var w = (200 / boundsInfo.w) * 100;
var h = (200 / boundsInfo.h) * 100;

kersBoru.listenerType.modifySmartObject(w, h, "Qcs7");