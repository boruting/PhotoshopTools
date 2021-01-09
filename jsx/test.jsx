/*引用库*/
$.evalFile(File($.fileName).parent + "/lib/kersBoru_lib.jsx");
$.evalFile(File($.fileName).parent + "/lib/Kinase_lib.jsx");

/*================================*/
$.writeln("111");

// var w = ((200 + 2) / 2) * 100; //((新的增加的宽度+现在选区宽度)/现在选区宽度)*100
// var h = ((200 + 2) / 2) * 100;
// var layer = app.activeDocument.activeLayer;
// var boundsInfo = kersBoru.layer.getLayerBounds (layer,"boundsNoEffects");//"bounds"、"boundsNoMask"

// var w = (200 / boundsInfo.w) * 100;//修改到需要的宽
// var h = (200 / boundsInfo.h) * 100;//修改到需要的高

// kersBoru.listenerType.modifyLayerSize(w, h, "Qcs7");
// var result_artBoard = Kinase.document.hasArtBoard(true, 3); //是否拥有画板 画板是个空的图层 图层边界信息等于画板的子级(所有图层合并) 需要一个和画板同大小的填充图层

// var artBoard_boundsInfo = Kinase.layer.getLayerBounds(Kinase.REF_LayerID, result_artBoard.aArtBoardId, "boundsNoEffects"); //画板的图层边界信息





//如果有多个画板 当前选中图层是在那个画板中
//activeDocument.activeLayer.parent //是否是

//var artBoard_boundsInfo = kersBoru.layer.getLayerBounds(activeDocument.layers["画板 3"], "boundsNoEffects");

var layers = activeDocument.layers;
// var aaaaa = activeDocument.activeLayer;
// if (activeDocument.activeLayer != undefined) {
//     $.writeln("1234567");

// }

var artBoard = getActiveLayerOutermost(activeDocument.activeLayer); //当前选中图层的最外层
var aaaa = isArtBoard(artBoard.id).artboardEnabled.value;
//var aaaa = Kinase.document.hasArtBoard(true, 3);
if (aaaa) {

    var artBoard_boundsInfo = kersBoru.layer.getLayerBounds(artBoard, "boundsNoEffects");
    //$.writeln(artBoard_boundsInfo.x);
    $.writeln("22222");
}
























// if (layers.length > 1) { //当前文档第一级图层数>1 
//     for (var i = 0; i < layers.length; i++) {
//         var layer = layers[i];
//         if (typename === "LayerSet") {

//             if (getArt(layer.id).artboardEnabled.value === true && layer.id === artBoard.id) {


//                 var artBoard_boundsInfo = kersBoru.layer.getLayerBounds(layer, "boundsNoEffects");

//             }

//         }

//     }


// }



// activeDocument.layers.length === 1 //现在是一个画板
// for (var i = 0; i < activeDocument.layers.length; i++) {



// }