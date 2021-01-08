/**
 * @author kersBoru
 * @name Photoshop九宫格工具  
 * @description 真对psd文件的智能对象图层做九宫格处理 不影响圆角变形放大
 * @weixin JackdawTing
 * @date 2021-01-01 创建 
                    暂定放大区域是圆角+2像素(右上圆角宽度-2)
 * @date 2021-01-04 修正画板影响画布大小 创建选区的问题                     
 */
/*加载脚本库*/
$.evalFile(File($.fileName).parent + "/lib/Kinase_lib.jsx");
$.evalFile(File($.fileName).parent + "/lib/json2.jsx");
$.evalFile(File($.fileName).parent + "/lib/kersBoru_lib.jsx");

try {
    JSON
} catch (e) {
    $.writeln("1因为未载入 JSON 解析库，请载入 json2.jsx ");
}

var reviseSmartObject = {};
/*修正画板*/
var correctArtBoard = {};
/**
 * 通过变形修改图层尺寸
 * @param {*} newW 新增宽
 * @param {*} newH 新增高
 * @param {*} qcs 锚点坐标参数 左上:Qcs0 | 上中:Qcs4 |上右:Qcs1| 左中:Qcs7 | 中心:Qcsa |右中:Qcs5 | 左下:Qcs3 | 下中:Qcs6 |下右:Qcs2 
 */
var modifyLayerSize = function(newW, newH, qcs) { //缺少选区数据,Region

    //var boundsInfo = Kinase.layer.getLayerBounds(Kinase.REF_LayerID, layer.id); //获取图层边界信息




    var idTrnf = charIDToTypeID("Trnf");
    var desc = new ActionDescriptor();

    kersBoru.listenerType.modifyQcs(desc, qcs); //修改锚点

    var idWdth = charIDToTypeID("Wdth");
    var idPrc = charIDToTypeID("#Prc");
    desc.putUnitDouble(idWdth, idPrc, w);

    var idHght = charIDToTypeID("Hght");
    var idPrc = charIDToTypeID("#Prc");
    desc.putUnitDouble(idHght, idPrc, h);
    executeAction(idTrnf, desc, DialogModes.NO);

}
/**
 * 移动 智能对象 选区内容
 * @param x 向x方向移动 多少
 * @param y 向y方向移动 多少
 */
var selectionMove = function(x, y) {
    var ref = new ActionReference();
    var desc = new ActionDescriptor();
    var desc_ = new ActionDescriptor();

    idcut = charIDToTypeID("cut ");
    var idnull = charIDToTypeID("null");
    ref.putProperty(charIDToTypeID("Chnl"), charIDToTypeID("fsel"));
    desc.putReference(idnull, ref);

    var idT = charIDToTypeID("T   ");
    var idOfst = charIDToTypeID("Ofst");
    desc_.putUnitDouble(charIDToTypeID("Hrzn"), charIDToTypeID("#Pxl"), x); //移动的到x坐标
    desc_.putUnitDouble(charIDToTypeID("Vrtc"), charIDToTypeID("#Pxl"), y); //移动的到y坐标
    desc.putObject(idT, idOfst, desc_);
    executeAction(idcut, desc, DialogModes.NO);

}
var main = function() {
    var pro = prompt("圆角图形不拉伸情况下放大智能对象", '{"w":100,"h":100}', "修改智能对象大小"); //输入一个新的 尺寸 (200,200)
    if (pro == null) {
        alert("已取消本次操作");
        return;
    }
    pro = JSON.parse(pro); //转换成对象
    var doc = app.activeDocument;
    var layer = doc.activeLayer;


    if (layer.kind == "LayerKind.SMARTOBJECT") { //判断是否 是智能对象
        var g9 = getSmartObject();

        var result_artBoard = Kinase.document.hasArtBoard(true, 3); //是否拥有画板
        correctArtBoard.boundsInfo = Kinase.layer.getLayerBounds(Kinase.REF_LayerID, result_artBoard.aArtBoardId); //画板的图层边界信息

        reviseSmartObject.reviseWidth = function() { //修改宽度函数


            if (result_artBoard.hasArtBoard) {

                reviseSmartObject.reviseWidth.boundsInfo = Kinase.layer.getLayerBounds(Kinase.REF_LayerID, layer.id); //获取选中图层边界信息            

                reviseSmartObject.reviseWidth.boundsInfo.right = reviseSmartObject.reviseWidth.boundsInfo.right + Math.abs(correctArtBoard.boundsInfo.x); //修正右边界
                reviseSmartObject.reviseWidth.boundsInfo.bottom = reviseSmartObject.reviseWidth.boundsInfo.bottom + Math.abs(correctArtBoard.boundsInfo.y); //修正底边界
                reviseSmartObject.reviseWidth.boundsInfo.x = reviseSmartObject.reviseWidth.boundsInfo.x + Math.abs(correctArtBoard.boundsInfo.x); //修正边界x坐标
                reviseSmartObject.reviseWidth.boundsInfo.y = reviseSmartObject.reviseWidth.boundsInfo.y + Math.abs(correctArtBoard.boundsInfo.y); //修正边界y坐标
            } else {
                reviseSmartObject.reviseWidth.boundsInfo = Kinase.layer.getLayerBounds(Kinase.REF_LayerID, layer.id); //获取图层边界信息
            }
            createRegion(getRegionData("移动x", reviseSmartObject.reviseWidth.boundsInfo, g9));
            var x = pro.w - reviseSmartObject.reviseWidth.boundsInfo.w;
            var y = 0;
            selectionMove(x, y);

            createRegion(getRegionData("加宽", reviseSmartObject.reviseWidth.boundsInfo, g9)); //创建选区
            //移动
            selectionMove(1, 0);
            selectionMove(-1, 0);
            //修改大小
            var w = ((newW + 2) / 2) * 100; //((新的增加的宽度+现在选区宽度)/现在选区宽度)*100
            var h = ((newH + 2) / 2) * 100;
            kersBoru.listenerType.modifySmartObject(w, h, "Qcs7"); //Qcs7 锚点是左中 查看锚点 字符串>>> modifyLayerSize函数中
            

        }
        reviseSmartObject.reviseHeight = function() { //修改高度函数

            if (result_artBoard.hasArtBoard) {

                reviseSmartObject.reviseHeight.boundsInfo = Kinase.layer.getLayerBounds(Kinase.REF_LayerID, layer.id); //获取图层边界信息           

                reviseSmartObject.reviseHeight.boundsInfo.right = reviseSmartObject.reviseHeight.boundsInfo.right + Math.abs(correctArtBoard.boundsInfo.x); //修正右边界
                reviseSmartObject.reviseHeight.boundsInfo.bottom = reviseSmartObject.reviseHeight.boundsInfo.bottom + Math.abs(correctArtBoard.boundsInfo.y); //修正底边界
                reviseSmartObject.reviseHeight.boundsInfo.x = reviseSmartObject.reviseHeight.boundsInfo.x + Math.abs(correctArtBoard.boundsInfo.x); //修正边界x坐标
                reviseSmartObject.reviseHeight.boundsInfo.y = reviseSmartObject.reviseHeight.boundsInfo.y + Math.abs(correctArtBoard.boundsInfo.y); //修正边界y坐标
            } else {
                reviseSmartObject.reviseHeight.boundsInfo = Kinase.layer.getLayerBounds(Kinase.REF_LayerID, layer.id); //获取图层边界信息
            }


            createRegion(getRegionData("移动y", reviseSmartObject.reviseHeight.boundsInfo, g9));
            var x = 0;
            var y = pro.h - reviseSmartObject.reviseHeight.boundsInfo.h;
            selectionMove(x, y);

            createRegion(getRegionData("加高", reviseSmartObject.reviseHeight.boundsInfo, g9)); //创建选区
            //移动
            selectionMove(0, 1);
            selectionMove(0, -1);
            modifyLayerSize(x, y, "Qcs4"); //Qcs4 锚点是上中 查看锚点 字符串>>> modifyLayerSize函数中
        }
        if (pro.w > 0 && pro.h == 0) { //只修改宽

            reviseSmartObject.reviseWidth();

        } else if (pro.h > 0 && pro.w == 0) { //修改高度
            reviseSmartObject.reviseHeight();
        } else if (pro.h > 0 && pro.w > 0) { //线修改高度在修改宽度x

            reviseSmartObject.reviseWidth();
            $.writeln("修改宽度后");

            reviseSmartObject.reviseHeight();
            $.writeln("修改高度后");


        } else {
            return alert("失败");
        }
        //selectionMove(x, y);

    } else {
        return alert("选中的图层 不是智能对象");
    }

    /*选区数据 */
    //var type = "加宽";

    //var regionData= getRegionData(type,boundsInfo,g9);//通过类型获取数据



}

main();

/*测试函数*/
var test = function() {
    var doc = app.activeDocument;
    var lay = doc.activeLayer;
    // var boundsInfo = Kinase.layer.getLayerBounds(Kinase.REF_LayerID, layer.id); //获取图层边界信息
    // if (layer.kind == "LayerKind.SMARTOBJECT") { //判断是否 是智能对象
    //     var g9 = getSmartObject();
    // }
    boundsInfo = Kinase.layer.getLayerBounds(Kinase.REF_LayerID, lay.id);
    for (var i = 0; i < layers.length; i++) {

        var layer = layers[i];
        var isArtboard = Kinase.layer.getLayerEditInfo(Kinase.REF_LayerID, layer.id).isArtboard;

        if (isArtboard === true) {
            correctArtBoard.boundsInfo = Kinase.layer.getLayerBounds(Kinase.REF_LayerID, layer.id);

            var x = correctArtBoard.boundsInfo.x;
        }

        return boundsInfo;
    }
}

//test();

function getRegionData(type, boundsInfo, g9) {

    switch (type) {
        case "移动x":
            var L = boundsInfo.x + g9[2];
            var T = boundsInfo.y;
            var R = boundsInfo.right;
            var B = boundsInfo.bottom;
            var regionData = [
                [L, T],
                [R, T],
                [R, B],
                [L, B]
            ];
            return regionData;
        case "移动y":
            var L = boundsInfo.x;
            var T = boundsInfo.y + g9[3];
            var R = boundsInfo.right;
            var B = boundsInfo.bottom;
            var regionData = [
                [L, T],
                [R, T],
                [R, B],
                [L, B]
            ];
            return regionData;
        case "加宽":
            var L = boundsInfo.x + g9[2] - 2; //暂定2个px宽
            var T = boundsInfo.y;
            var R = boundsInfo.x + g9[2];
            var B = boundsInfo.bottom;
            var regionData = [
                [L, T],
                [R, T],
                [R, B],
                [L, B]
            ];
            return regionData;
        case "加高":
            var L = boundsInfo.x;
            var T = boundsInfo.y + g9[3] - 2;
            var R = boundsInfo.right; //
            var B = boundsInfo.y + g9[3];
            var regionData = [
                [L, T],
                [R, T],
                [R, B],
                [L, B]
            ];
            return regionData;
    }
}
/*获取智能对象内图层信息*/
function getSmartObject() { //var  getSmartObject = function

    executeAction(stringIDToTypeID("placedLayerEditContents"), undefined, DialogModes.NO); //打开智能对象
    var layers = app.activeDocument.layers;

    for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];
        //暂时不需要遍历子级
        // if (layer.typename == "LayerSet" && layer.layers.length > 0) {
        //     layerSetFor(layer.layers);
        // }
        //var oldEditInfo = Kinase.layer.getLayerEditInfo(Kinase.REF_LayerID, layer.id);
        var layerName = layer.name;
        var g9Data = layerName.split(":");

        if (g9Data[0] == "G9Data") {
            var g9 = JSON.parse(g9Data[1]);
            //return g9[0];
            app.activeDocument.close(SaveOptions.DONOTSAVECHANGES); //关闭原始文档(不保存)
            return g9;
        }

    }

}
/*获取选区信息*/
function createRegion(regionData) {


    var type = SelectionType.REPLACE;
    var feather = 0; //构建选区时的羽化值
    var antiAlias = true; //构建选区时是否抗锯齿

    app.activeDocument.selection.select(regionData, type, feather, antiAlias);

}