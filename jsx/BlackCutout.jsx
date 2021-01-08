// var idR = charIDToTypeID("Rd  ");
// var idG = charIDToTypeID("Grn ");
// var idB = charIDToTypeID("Bl  ");
/**
 * @author boru 
 * @name 去除黑色底脚本
 * @description 利用通道将黑底去除掉
 * @date 2019-09-13 初步制作完成 优化了从智能对象创建到 成品全自动
 */
var doc = app.activeDocument;


/**
 * 对通道做选区
 * @param {*} idRGB 根据 rgb 对相应通道做选区
 */
var tongDaoXuanQU = function (idRGB) {

    var desc = new ActionDescriptor();
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    var refRGB = new ActionReference();
    var idnull = charIDToTypeID("null");
    var idChnl = charIDToTypeID("Chnl");
    var idfsel = charIDToTypeID("fsel");
    var idT = charIDToTypeID("T   ");
    var idsetd = charIDToTypeID("setd");


    ref.putProperty(idChnl, idfsel);
    desc.putReference(idnull, ref);

    refRGB.putEnumerated(idChnl, idChnl, idRGB);
    desc.putReference(idT, refRGB);

    executeAction(idsetd, desc, DialogModes.NO);


}
var blueInfo = {
    color: "0000ff",
    name: "蓝色",
    //idRGB: "idB"
    idRGB: charIDToTypeID("Bl  ")
}
var redInfo = {
    color: "ff0000",
    name: "红色",
    //idRGB: "idB"
    idRGB: charIDToTypeID("Rd  ")
}
var greenInfo = {
    color: "00ff00",
    name: "绿色",
    //idRGB: "idB"
    idRGB: charIDToTypeID("Grn ")
}
function addLayer(colorInfo) {

    var doc = app.activeDocument;
    tongDaoXuanQU(colorInfo.idRGB);
    //修改前景色  
    foregroundColor.rgb.hexValue = colorInfo.color;//蓝色
    //新建图层  
    var layer = doc.artLayers.add();
    layer.name = colorInfo.name;
    //填充 前景色
    doc.selection.fill(app.foregroundColor);
    doc.selection.deselect();
    //图层混合模式做滤色模式
    if (layer.name != "蓝色") {
        layer.blendMode = BlendMode.SCREEN;
    }

    //隐藏图层
    layer.visible = false;

}
var editSmartObject = function () {
    //转换成智能对象
    var idnewPlacedLayer = stringIDToTypeID("newPlacedLayer");
    executeAction(idnewPlacedLayer, undefined, DialogModes.NO);
    //打开编辑智能对象
    executeAction(stringIDToTypeID("placedLayerEditContents"), undefined, DialogModes.NO);//编辑智能对象
    return true;

}
var getOriginalLayer = function () {
    var layers = app.activeDocument.layers;
    for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];
        if (layer.itemIndex === 1) {
            return layer;
            //layer.visible = false;
        }

    }
}
//editSmartObject();

try {
    var a = editSmartObject();

}
catch (e) {
    alert("请选中要去掉黑底的图层");
}
if (a === true) {

    addLayer(blueInfo);//新建一个 蓝色图层
    addLayer(greenInfo);//新建一个 绿色图层
    addLayer(redInfo);//新建一个 红色图层


    var layerBl = app.activeDocument.artLayers.getByName("蓝色");//获得蓝色图层
    var layerGrn = app.activeDocument.artLayers.getByName("绿色");//获得绿色图层
    var layerRd = app.activeDocument.artLayers.getByName("红色");//获得红色图层
    var layerOr = new getOriginalLayer();//获得原始图层
    layerBl.visible = true;//显示蓝色图层
    layerGrn.visible = true;//显示绿色图层
    layerRd.visible = true;//显示红色图层
    layerOr.visible = false;//隐藏原始图层

    app.activeDocument.close(SaveOptions.SAVECHANGES);//保存关闭当前文档
    //alert("完成");
} else {
    $.writeln("aaa");
    alert("出错了未能完成操作");
}
