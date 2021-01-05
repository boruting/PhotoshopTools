/*引用库*/
var file = File($.fileName);
var p = decodeURI(file.parent.parent);
$.evalFile(p + "/lib/Kinase_lib.jsx");
$.writeln("111");

/**
 * 拷贝图层
 * (非选区拷贝内容) 与原图层一样例如:智能对象图层 拷贝后依然是 智能对象图层
 */
var layerCopy = function() {
    var idcopy = charIDToTypeID("copy");
    executeAction(idcopy, undefined, DialogModes.NO);
}
/**
 * 获取需要选中的图层
 * 返回需要选中图层的ID数组
 */
var getLayer = function(layers, layerIDArra) {



    for (var i = 0; i < layers.length; i++) {

        var layer = layers[i];
        //$.writeln(layer.name);
        if (layer.layers) { //遍历图层子级

            getLayer(layer.layers, layerIDArra);
        }
        var layerN = layer.name.split(".");

        if (layerN[layerN.length - 1] == "png" || layerN[layerN.length - 1].substring(0, 3) == "jpg") { //如果图层名的后缀包含 png 或 jpg 字符

            layerIDArra[arrNum] = layer.id;
            arrNum += 1;
            //$.writeln(layerIDArra);
        }
    }
    $.writeln(layerIDArra);
    return layerIDArra;


}

/*选中图层*/
var selectLayer = function(layers) {
    var layerIDArra = []; //定义一个存放设计原psd 的选中图层id数组

    //layerIDArra = getLayer(layers, layerIDArra);
    Kinase.layer.selectMultLayers_byID(getLayer(layers, layerIDArra), true); //选中图层
    arrNum = 0; //图层ID数组索引需要
    $.writeln("选中图层函数结束");
}
/**
 * 新建文档
 */
var newDoc = function(doc) {

    docAssets = app.documents.add(doc.width, doc.height, doc.resolution, doc.name.split(".")[0] + "_切图.psd", NewDocumentMode.RGB, DocumentFill.TRANSPARENT);
    //
    var fileOut = new File(doc.path);
    $.writeln(decodeURI(fileOut));
    var psd = PhotoshopSaveOptions; //psd格式保存
    var asCopy = false; //用来指定以副本的方式保存。
    var extensionType = Extension.LOWERCASE; //后缀小写
    var folder_ = new Folder(fileOut);
    //folder_.create();
    if (!folder_.exists) {
        folder_.create();
    }
    docAssets.saveAs(fileOut, psd, asCopy, extensionType); //另存为一个文档
    docAssets.close(SaveOptions.SAVECHANGES);
    $.writeln("新建文档保存成功");
    //docAssets.close(SaveOptions.DONOTSAVECHANGES); //关闭原始文档(不保存)
}

/*重新命名图层*/
var layerRename = function(layers) {

    for (var i = 0; i < layers.length; i++) {

        var layer = layers[i];
        var layerN = layer.name.split("."); //后缀拆分
        if (layerN[layerN.length - 1] == "png" || layerN[layerN.length - 1].substring(0, 3) == "jpg") { //如果图层名的后缀包含 png 或 jpg 字符

            var layertyp = layer.name.split(":"); //冒号拆分

            if (layertyp[1]) {
                layer.name = layertyp[1];
            }


        }

    }

}
var main = function() {

    /**设计文档(psd)文档处理*==================*/
    var doc = app.activeDocument;
    arrNum = 0; //图层ID数组索引需要
    selectLayer(doc.layers); //选中图层
    layerCopy(); //拷贝图层

    /**切图文档处理*==================*/
    var fileAssets = new File(doc.path + "/" + doc.name.split(".")[0] + "_切图.psd"); //获取切图psd文件路径
    /*文档不存在*/
    if (!fileAssets.exists) { //如果文档不存在
        newDoc(doc); //新建文档 
    }
    /*文档已存在*/
    var docAssets = open(fileAssets); //1.打开文档
    app.activeDocument = docAssets; //2.激活切图文档
    if (docAssets.layers.length > 2) {
        selectLayer(docAssets.layers); //选中图层
        Kinase.layer.deleteLayer_ByActive(); //4.删除选中图层
    }
    docAssets.paste(); //5.粘贴图层
    layerRename(docAssets.layers);
    $.writeln("完成");
    alert("完成");

}
main();
var test = function() {

}
//test();