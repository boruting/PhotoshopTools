/**
 * @author boru
 * @name 清理psd文档原始数据-V2.0
 * @description 减小psd文件  由于原始数据和智能对象的关系导致psd文件过大
 * @weixin JackdawTing
 * @date 2021-10-22  创建时间
 *
 */

$.evalFile(File($.fileName).parent.parent + "/lib/kersBoru_lib.jsx");

/**
 * 清理数据
 */
var cleanMetadata = function () {

    if (ExternalObject.AdobeXMPScript == undefined) ExternalObject.AdobeXMPScript = new ExternalObject("lib:AdobeXMPScript");

    var xmp = new XMPMeta(activeDocument.xmpMetadata.rawData);

    // Begone foul Document Ancestors!

    xmp.deleteProperty(XMPConst.NS_PHOTOSHOP, "DocumentAncestors");

    app.activeDocument.xmpMetadata.rawData = xmp.serialize();
    $.writeln("清理");

}
/**
 * 编辑智能对象
 */
var smartObjectEdit = function (smartArr) {

    // executeAction(stringIDToTypeID("placedLayerEditContents"), undefined, DialogModes.NO);//编辑智能对象
    // getSmartObjectLayers(app.activeDocument.layers);

    try {
        executeAction(stringIDToTypeID("placedLayerEditContents"), undefined, DialogModes.NO);//编辑智能对象
        if (smartArr.length > 0) {

            for (var i = 0; i < smartArr.length; i++) {

                if (app.activeDocument.name == smartArr[i]) {

                    app.activeDocument.close(SaveOptions.SAVECHANGES);
                    return;

                }
            }
        }
        smartArr.push(app.activeDocument.name);
        getSmartObjectLayers(app.activeDocument.layers, smartArr);
        cleanMetadata();
        activeDocument.close(SaveOptions.SAVECHANGES);

        $.writeln(smartArr);

    } catch (e) {
        $.writeln("丢失链接的链接对象"); 6
        return;
    }

}
var main = function () {
    
    cleanMetadata();
    var doc = app.activeDocument;
    var layers = doc.layers;
    var smartArr = []; //重复智能对象
    getSmartObjectLayers(layers, smartArr);


}
/**
 * 主函数
 * @param {*} layers 
 */
var getSmartObjectLayers = function (layers, smartArr) {
    
    for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];
        if (layer.typename == "LayerSet" && layer.layers.length > 0) { //判断 是否是 画板或图层组 如果是就向下遍历

            getSmartObjectLayers(layer.layers, smartArr);

        }
        if (layer.kind == "LayerKind.SMARTOBJECT") {//是否 智能对象

            // var layInfo = new kersBoru.layer.layerAttribute(layer); 
            // activeDocument.activeLayer = layer;
            // layer.visible = layInfo.visible;
            //kersBoru.listenerType.selectLayer(layer);

            kersBoru.layer.selectLayer(layer);//

            var options = kersBoru.listenerType.smartObjectOptions();

            try { //判断是否为链接对象
                var smartPath = options.getPath(stringIDToTypeID("link")); //获取链接路径(getPath)

            } catch (e) {
                var smartPath = null;
            }
            if (smartPath == null) {//不是链接对象进入

                var smartName = options.getString(stringIDToTypeID("fileReference"));
                var suf = suffix(smartName);

                if (suf == true) {

                    if (layer.allLocked === true) {//如果锁定  

                        layer.allLocked = false;//解锁
                        $.writeln("选中图层名: " + activeDocument.activeLayer.name + "  当前循环中图层名: " + layer.name);
                        if (activeDocument.activeLayer.id === layer.id) {
                            smartObjectEdit(smartArr);//编辑智能对象
                        }
                        layer.allLocked = true;//解锁
                    } else {
                        $.writeln("选中图层名: " + activeDocument.activeLayer.name + "  当前循环中图层名: " + layer.name);
                        if (activeDocument.activeLayer.id === layer.id) {
                            smartObjectEdit(smartArr);//编辑智能对象
                        }
                    }



                    //cleanMetadata();
                    //activeDocument.close(SaveOptions.SAVECHANGES);

                }


            }

        } else {
            //忽略


        }

    }
    $.writeln("00");
}

/**
 * 通过文件后缀 返回 false 或 true
 * @param {*} smartName 
 * @returns  
 */
function suffix(smartName) {
    var suf = smartName.split(".").slice(-1).toString();
    switch (suf) {

        case "psb":
            return true;
        case "psd":
            return true;
        case "ai":
            return false;
        case "jpg":
            return false;
        case "png":
            return false;
        case "gif":
            return false;
        case "jpeg":
            return false;
        case "PSB":
            return true;
        case "PSD":
            return true;
        case "AI":
            return false;
        case "JPG":
            return false;
        case "PNG":
            return false;
        case "GIF":
            return false;
        case "JPEG":
            return false;
        default:

            return true;

    }


}
/**
 * 记录图层信息
 * @param {*} layer 
 */
function layerInfo(layer) {
    this.visible = layer.visible;
    this.allLocked = layer.allLocked;
    this.positionLocked = layer.positionLocked;
}

/**
 * JPEG 处理
 *  @param {*} document 文档
 */
var jpegSave = function (document) {
    var saveIn = document.path; //当前激活文档路径
    var extensionType = Extension.LOWERCASE; //后缀小写
    var asCopy = false; //是否已副本的方式
    var jpegOptions = new JPEGSaveOptions(); //embedColorProfile,formatOptions,matte,quality,scans,typename
    jpegOptions.quality = 12; //图片品质 0-12 
    jpegOptions.embedColorProfile = true; //false 嵌入颜色配置文件
    jpegOptions.matte = MatteType.NONE; //BACKGROUND,BLACK,FOREGROUND,NETSCAPE,NONE,SEMIGRAY,WHITE
    jpegOptions.formatOptions = FormatOptions.STANDARDBASELINE; //基线（”标准”）

    //document.saveAs(saveIn, jpegOptions, asCopy, extensionType);//保存当经激活文档
    document.close(document.saveAs(saveIn, jpegOptions, asCopy, extensionType)); //保存关闭当前文档

}
/**
 * PSD  处理
 * @param {*} document 
 */
var psdSave = function (document) {
    var sddd = decodeURI(document.path).substring(2, decodeURI(document.path).length); //
    $.writeln(sddd);
    //var fileOut = new File("E:/000" + sddd + "/");

    var fileOut = new File(document.path + "/" + document.name);
    $.writeln(decodeURI(fileOut));
    var psd = PhotoshopSaveOptions; //psd格式保存
    var asCopy = false; //用来指定以副本的方式保存。
    var extensionType = Extension.LOWERCASE; //后缀小写
    var folder_ = new Folder(fileOut);
    //folder_.create();
    if (!folder_.exists) {
        folder_.create();
    }
    document.saveAs(fileOut, psd, asCopy, extensionType); //另存为一个文档
    $.writeln("文件保存到:  " + decodeURI(fileOut));
    document.close(SaveOptions.DONOTSAVECHANGES); //关闭原始文档(不保存)
}
/**
 * 保存并且关闭文档 
 * 
 * @param {*} document 文档  这里应该是当前激活文档 app.activeDocument
 */
var saveClose = function (document) {
    if (document.name.substr(-4) == ".jpg" || document.name.substr(-5) == ".JPEG") { //jpg 智能对象 保存会有弹窗            条件位置保存当前文档前
        $.writeln("======保存jpeg类型文件=====");
        jpegSave(document); //jpg 格式保存关闭
        return;
    }
    if (document.name.substr(-4) == ".psd") {
        $.writeln("======保存PSD类型文件=====");
        psdSave(document);
        return;
    } else {
        $.writeln("======保存其它类型文件=====");
        document.close(SaveOptions.SAVECHANGES); //保存关闭当前文档
    }
}
//main();