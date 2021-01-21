/**
 * @author kersBoru
 * @name PStoExml PhotoshopToExml 
 * @description psd文件导出Exml文件
 * @weixin JackdawTing
 * @date 2020-12-17 创建
 * @date 2020-12-18 调整 
                    九宫图 暂时为天加九宫属性需要在 Egret 手动开启
                    程序字体 暂时未添加 仿粗 和 仿斜
 * @date 2021-01-04 切图方式>>>  将当前psd文档中的需要切图的文件全部复制到一个新的psd文档中文档名字 为 当前文档名字加"-切图"    skin-Frame1-切图               
 */
/*加载其他脚本*/
// var file = File($.fileName);
// var p = decodeURI(file.parent);
// //$.evalFile(p + "/lib/Bounds.jsx");
// //$.evalFile(p + "/lib/getSelectedLayerItemIndex.jsx");
$.evalFile(File($.fileName).parent.parent + "/lib/Kinase_lib.jsx");


//

/*测试===================*/

/**
 * psd文件导出成exml文件
 * 
 */
var PSDtoEUI = function() {
    var doc = app.activeDocument; //当前激活文档

    /*EUI*/
    var PSDname = decodeURI(app.activeDocument.name);
    PSDname = PSDname.substring(0, PSDname.indexOf(".")); //psd文件名去掉后缀
    var dir = doc.path + "/exml/" + PSDname + "/"; //文件路径
    new Folder(dir).create(); //创建文件夹

    var EUI_w = 720; //EUI--Skin 宽 
    var EUI_h = 1280; //EUI--Skin 高

    //exml数据↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓/
    var exml = "<?xml version='1.0' encoding='utf-8'?>\n"; //EUI_头
    exml += '<e:Skin  width=\"' + EUI_w + '\" height=\"' + EUI_h + '\" xmlns:e=\"http://ns.egret.com/eui\" xmlns:w=\"http://ns.egret.com/wing\">';

    var layers = doc.layers;
    var selectedLayersID = Kinase.layer.getTargetLayersID(); //获取当前psd文档的选中图层 ID

    for (var i = 0; i < selectedLayersID.length; i++) { //遍历选中的图层

        var layerID = selectedLayersID[i];
        var exml_ = "";
        exml += getLayerInfoToExml(layers, layerID, exml_); //根据图层id获取图层信息

        //$.writeln(exml);
    }
    exml += "\n</e:Skin>"

    $.writeln(exml);
    //exml数据↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑/

    /*创建exml文件*/
    var file = new File(dir + PSDname + ".exml");
    file.remove();
    file.open("a");
    file.lineFeed = "\n";
    file.encoding = "utf-8";
    file.write(exml);
    file.close();
    alert("生成结束\n EXML路径: " + dir);
}

/**
 * 获取图层信息 返回一个exml信息
 *@param id 选中图层的ID
 *@param exml 单条的Exml信息() 
 *@param layers 图层组
 */
var getLayerInfoToExml = function(layers, id, exml) {

    for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];

        if (layer.layers) { //遍历图层组的子级
            exml = getLayerInfoToExml(layer.layers, id, exml);

        }
        //$.writeln(exml);
        if (layer.id == id) { //判断当前图层是否是选中图层

            $.writeln("图层名字: " + layer.name + " 图层ID:" + layer.id);

            var boundsInfo = Kinase.layer.getLayerBounds(Kinase.REF_LayerID, layer.id); //获取图层边界信息
            var x = boundsInfo.x; //获取当前图层的坐标x
            var y = boundsInfo.y; //获取当前图层的坐标y
            var w = boundsInfo.w; //获取当前图层的宽
            var h = boundsInfo.h; //获取当前图层的高
            var layerName = layer.name; //获取当前图层的名字
            var type = layerName.split("@"); //获取当前图层的EUI类型
            var splitLayerName = type[1].split("."); //拆分图层名

            var getimgName = function(splitLayerName) {
                if (splitLayerName[splitLayerName.length - 1] == "png" || splitLayerName[splitLayerName.length - 1].substring(0, 3) == "jpg") {

                    var imgName = splitLayerName[0];
                    return imgName;
                    $.writeln("图层名:");
                } else {

                    var imgName = type[1];
                    return imgName;
                }
            }

            switch (type[0]) {

                case "G9P": //九宫类型png格式
                    var imgName = getimgName(splitLayerName);
                    var imgType = "_png";
                    emxl = '\n	<e:Image source=\"' + imgName + imgType + '\" x=\"' + x + '\" y=\"' + y + '"\ width=\"' + w + '\" height=\"' + h + '\"/>';
                    return emxl;
                case "G9J": //九宫类型jpg格式
                    var imgName = getimgName(splitLayerName);
                    var imgType = "_jpg";
                    emxl = '\n	<e:Image source=\"' + imgName + imgType + '\" x=\"' + x + '\" y=\"' + y + '"\ width=\"' + w + '\" height=\"' + h + '\"/>';
                    return emxl;
                case "FxJ": //半图 翻转两张拼接 jpg格式  scaleX="-1" x="360" anchorOffsetX="360"
                    var imgName = getimgName(splitLayerName);
                    var imgType = "_jpg";
                    exml = '\n    <e:Group x=\"' + x + '\" y=\"' + y + '\">';
                    exml += '\n    <e:Image source=\"' + imgName + imgType + '\" x=\"' + 0 + '\" y=\"' + 0 + '\"/>';
                    exml += '\n    <e:Image source=\"' + imgName + imgType + '\" x=\"' + w + '\" y=\"' + 0 + '\" scaleX=\"-1' + '\" anchorOffsetX=\"' + w + '\"/>';
                    exml += '\n    </e:Group>';
                    $.writeln(exml);
                    return;
                case "FxP": //半图 翻转两张拼接 png格式
                    var imgName = getimgName(splitLayerName);
                    var imgType = "_png";
                    exml = '\n    <e:Group x=\"' + x + '\" y=\"' + y + '\">';
                    exml += '\n    <e:Image source=\"' + imgName + imgType + '\" x=\"' + 0 + '\" y=\"' + 0 + '\"/>';
                    exml += '\n    <e:Image source=\"' + imgName + imgType + '\" x=\"' + w + '\" y=\"' + 0 + '\" scaleX=\"-1' + '\" anchorOffsetX=\"' + w + '\"/>';
                    exml += '\n    </e:Group>';
                    $.writeln(exml);
                    return exml;
                case "ImgP": //普通图片 png格式
                    var imgName = getimgName(splitLayerName);
                    var imgType = "_png";
                    return exml = '\n    <e:Image source=\"' + imgName + imgType + '\" x=\"' + x + '\" y=\"' + y + '\"/>';
                    // return;
                case "ImgJ": //普通图片 jpg格式
                    var imgName = getimgName(splitLayerName);
                    var imgType = "_jpg";
                    return exml = '\n    <e:Image source=\"' + imgName + imgType + '\" x=\"' + x + '\" y=\"' + y + '\"/>';
                    return;
                case "TxtA": //美术字 png格式

                    return;
                case "Skin": //皮肤类型 EUI

                    return;
                case undefined: //程序字 EUI
                    if (layer.kind == LayerKind.TEXT) {
                        var textItem = layer.textItem; //获取当前文本图层信息
                        var labelColor = "0x" + textItem.color.rgb["hexValue"]; //获取当前文本颜色(有多颜色最前的颜色)
                        var labelSize = textItem.size.value; //获取当前文本字体大小
                        var labelBold = Kinase.layer.getLayerTextInfo(Kinase.REF_LayerID, id).bold //仿粗体
                        var labelJustification = Kinase.layer.getLayerTextInfo(Kinase.REF_LayerID, id).justification; //段落对齐方式
                        exml = '\n    <e:Label text="前往充值" textColor=\"' + labelColor + '\" size=\"' + labelSize + '\" x=\"' + x + '\" y=\"' + y + '\"' + ' textAlign=\"' + labelJustification + '"/>';
                        return exml;
                    } else {
                        $.writeln("出错!!! 图层名:" + layer.name);
                        return;
                    }




            }

        }

    }
    return exml;
}


/*  运行  */

PSDtoEUI();



/**
 * 获取 exml 
 * @param imgName 图层名字
 * @param x 坐标x
 * @param y 坐标y
 * @param w 图层宽
 * @param h 图层高
 * @param skinName 图层全名(layer.names)
 * @param format 图片后缀(png,jpg)
 * @param labelColor 文字颜色
 * @param labelSize 字号
 * @param labelJustification 段落样式 (左对齐,居中)
 */
function getExml(imgName, x, y, w, h, skinName, format, labelColor, labelSize, labelJustification) {

    //皮肤(按钮)
    this.typeSkinBtn = '\n    <e:Button label=\"前往充值\"' + ' skinName=\"' + skinName + '\" x=\"' + x + '\" y=\"' + y + '\"/>';
    //图片(不改变尺寸)[jpg,png
    this.typeImg1 = '\n    <e:Image source=\"' + imgName[0] + '_' + format + '\" x=\"' + x + '\" y=\"' + y + '\"/>';
    //图片(九宫/需放大)[jpg,png]
    this.typeImg2 = '\n	<e:Image source=\"' + imgName[0] + '_' + format + '\" x=\"' + x + '\" y=\"' + y + '"\ width=\"' + w + '\" height=\"' + h + '\"/>';
    //文本(程序字)
    this.typeText = '\n    <e:Label text="前往充值" textColor=\"' + labelColor + '\" size=\"' + labelSize + '\" x=\"' + x + '\" y=\"' + y + '\"' + ' textAlign=\"' + labelJustification + '"/>';
    //文本(美术字)  
    this.typeTextA = '\n    <e:Image source=\"' + imgName[0] + '_' + format + '\" x=\"' + x + '\" y=\"' + y + '\"/>';

}


/*重新写格子类型exml*/
/* 
格式采用前最区分





*/

var getLayerInfoToExml1 = function(layers, id, exml) {

    for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];

        if (layer.layers) { //遍历图层组的子级
            exml = getLayerInfoToExml(layer.layers, id, exml);

        }
        //$.writeln(exml);
        if (layer.id == id) { //判断当前图层是否是选中图层

            $.writeln("图层名字: " + layer.name + " 图层ID:" + layer.id);

            var boundsInfo = Kinase.layer.getLayerBounds(Kinase.REF_LayerID, layer.id); //获取图层边界信息
            var x = boundsInfo.x; //获取当前图层的坐标x
            var y = boundsInfo.y; //获取当前图层的坐标y
            var w = boundsInfo.w; //获取当前图层的宽
            var h = boundsInfo.h; //获取当前图层的高
            var layerName = layer.name; //获取当前图层的名字
            var imgType = layerName.split("."); //拆分图层名 (切图的类型)
            var type = layerName.split(":"); //获取当前图层的EUI类型
            // var type = layerName.substring(0, 5); //获取当前图层的EUI类型

            //var exml_ = new getExml(imgType, x, y, w, h, layerName, format, labelColor, labelSize, labelJustification); //typeSkinBtn typeImg1 typeImg2 typeText typeTextA
            //$.writeln(exml.typeSkinBtn);

            if (type[0] == "skin") { //皮肤类型(按钮)

                exml = '\n    <e:Button label=\"前往充值\"' + ' skinName=\"skin_' + type[type.length - 1] + '\" x=\"' + x + '\" y=\"' + y + '\"/>';
                return exml;

            }
            if (type[0] == "Fx") {

                exml = '\n    <e:Image source=\"' + type[type.length - 1] + '_png' + '\" x=\"' + x + '\" y=\"' + y + '\"/>';

            }
            if (layer.kind == LayerKind.TEXT) { //判断是否是文本图层

                var textItem = layer.textItem; //获取当前文本图层信息
                var labelColor = "0x" + textItem.color.rgb["hexValue"]; //获取当前文本颜色(有多颜色最前的颜色)
                var labelSize = textItem.size.value; //获取当前文本字体大小
                var labelBold = Kinase.layer.getLayerTextInfo(Kinase.REF_LayerID, id).bold //仿粗体
                var labelJustification = Kinase.layer.getLayerTextInfo(Kinase.REF_LayerID, id).justification; //段落对齐方式

                if (imgType.length > 1) { //2.文本(美术字)

                    if (imgType[imgType.length - 1] == "png") {
                        exml = '\n    <e:Image source=\"' + imgType[0] + '_png' + '\" x=\"' + x + '\" y=\"' + y + '\"/>';
                        return exml;
                    }

                } else { //文本(程序字)
                    exml = '\n    <e:Label text="前往充值" textColor=\"' + labelColor + '\" size=\"' + labelSize + '\" x=\"' + x + '\" y=\"' + y + '\"' + ' textAlign=\"' + labelJustification + '"/>';
                    return exml;
                }

            }
            if (type[0] == "G9") { //图片(九宫/需放大)[jpg,png] 需要图层宽高
                if (type[type.length - 1] == "png") { //png

                    exml = '\n	<e:Image source=\"' + type[1] + '_png' + '\" x=\"' + x + '\" y=\"' + y + '"\ width=\"' + w + '\" height=\"' + h + '\"/>';
                    return exml;
                } else { //jpg

                    exml = '\n	<e:Image source=\"' + type[1] + '_jpg' + '\" x=\"' + x + '\" y=\"' + y + '"\ width=\"' + w + '\" height=\"' + h + '\"/>';
                    return exml;
                }
            }
            if (imgType.length > 1) { //图片(不改变尺寸)[jpg,png] 

                if (imgType[imgType.length - 1] == "png") { //png类型

                    exml = '\n    <e:Image source=\"' + imgType[0] + '_png' + '\" x=\"' + x + '\" y=\"' + y + '\"/>';
                    return exml;
                } else { //jpg类型

                    exml = '\n    <e:Image source=\"' + imgType[0] + '_jpg' + '\" x=\"' + x + '\" y=\"' + y + '\"/>';
                    return exml;

                }

            }


        }

    }
    return exml;
}