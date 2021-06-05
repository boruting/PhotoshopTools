/**
 * @author kersBoru
 * @name 美术字导出--同字双文本-4字
 * @description 将一些常用的函数放到这里
 * @weixin JackdawTing
 * @date 2021-06-05 创建  
 */
$.evalFile(File($.fileName).parent + "/lib/kersBoru_lib.jsx");
$.evalFile(File($.fileName).parent + "/lib/json2.jsx");


var savepng = kersBoru.doc.saveDoc;


//var la = doc.layers[0];

var main = function () {
    var doc = app.activeDocument;
    var savePath = app.activeDocument.path + "/assets-ArtText";//保存文件的位置
    var file_json = new File("E:/test/test.json");
    //var test = doc.activeLayer;//测试行
    if (file_json.exists) {

        file_json.open("r");//打开JSON文件
        var content = file_json.read();//读取文件内容
        var textLines = JSON.parse(content);//内容转换
        //var txts = [1];
        var len = textLines.length;
        for (var i = 0; i < len; i++) {
            var txt = textLines[i].text;//文字内容
            //var txtLen = textLines[i].text.length;
            hideAllLayer();//隐藏所有图层
            txts(doc.layers, txt);

            doc.mergeVisibleLayers();//合拼显示的图层
            kersBoru.listenerType.canvasConstituency("Al  ");//创建选区
            kersBoru.listenerType.alignDistribute("AdCV");//垂直居中对齐
            doc.artLayers.getByName("bg").visible = true;//显示背景图层
            var imgName = textLines[i].imgName;//保存图片的名字
            savepng("png", savePath, imgName);//保存
            kersBoru.listenerType.returnRecords();//还原历史记录
            $.writeln("导出: "+txt);
        }
        $.writeln("完成");
    }



}
/**
 * 修改文本内容
 * @param {*} layerSet 图层组
 * @param {*} txt 文字内容的单字
 */
function setLayerConten(layerSet, txt) {

    if (layerSet.layers.length >= 2) {
        //var txt_ = txt[0];
        //var lay = layer.layers;
        var txt_0 = layerSet.layers[0].textItem;
        var txt_1 = layerSet.layers[1].textItem;
        txt_0.contents = txt
        txt_1.contents = txt;

    }
}
/**
 * 文字内容拆分成单字
 * @param {*} layers 图层组的子级文本层数组
 * @param {*} txt 
 */
function txts(layers, txt) {

    for (var i = 0; i < txt.length; i++) {
        var layerName = i + 1;
        var layerSet = lookupLayerSet(layers, layerName);
        if (layerSet.layers) {
            setLayerConten(layerSet, txt[i]);
        }


    }
}
/**
 * 查找对应图组
 * @param {*} layers 
 * @param {*} layerName 
 * @returns 
 */
function lookupLayerSet(layers, layerName) {

    var len = layers.length;

    for (var i = 0; i < len; i++) {
        var layer = layers[i];

        if (layer.name == layerName && layer.typename == "LayerSet") {
            layer.visible = true;
            return layer;
        }
        if (layer.name == layerName && layer.typename == "LayerSet") {
            layer.visible = true;
            return layer;

        }
        if (layer.name == layerName && layer.typename == "LayerSet") {
            layer.visible = true;
            return layer;

        }
        if (layer.name == layerName && layer.typename == "LayerSet") {
            layer.visible = true;
            return layer;

        }

    }
}
/**
 * 隐藏所有图层
 */
function hideAllLayer() {
    var layers = app.activeDocument.layers;
    for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];
        layer.visible = false;
    }
}
//kersBoru.doc.saveDoc("png", savePath, imgName);
main();
