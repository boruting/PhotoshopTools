/**
 * @author kersBoru
 * @name Photoshop九宫格工具  
 * @description 真对psd文件的智能对象图层做九宫格处理 不影响圆角变形放大
 * @weixin JackdawTing
 * @date 2021-01-01 创建 
                    暂定放大区域是圆角+2像素(右上圆角宽度-2)
 * @date 2021-01-04 修正画板影响画布大小 创建选区的问题 
 * @date 2021-01-08 调整调用函数的位置(改变大小函数放入kersBoru_lib) 
                    调整了创建选区的函数(regionData 放到函数内了) 获取选区数据函数改成 通过类型创建选区  
 * @date 2021-01-08 调整函数结构
                    画板修正函数取消  之前用的是Kinase_lib里的getLayerBounds 会对有画板的文件bounds 修改 (多画板会有问题)
                    现在直接掉用未修正带有画板的文档 创建选区无问题
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
var getBoundsInfo = function(layer) {



    //var result_artBoard = Kinase.document.hasArtBoard(true, 4); //是否拥有画板 画板是个空的图层 图层边界信息等于画板的子级(所有图层合并) 需要一个和画板同大小的填充图层
    //var boundsInfo = Kinase.layer.getLayerBounds(Kinase.REF_LayerID, layer.id);
    //correctArtBoard.boundsInfo = kersBoru.layer.getLayerBounds(doc.layers[0], "boundsNoEffects");

    /*if (result_artBoard.hasArtBoard=="22222") { //如果存在画板 坐标需要修正
        var artBoard = getActiveLayerOutermost(activeDocument.activeLayer); //当前选中图层的最外层
        // if (a) {//如果文档有多个画板
        //     var artBoard_boundsInfo = kersBoru.layer.getLayerBounds(artBoard, "boundsNoEffects"); //画板的图层边界信息 
        // }
        //var artBoard_boundsInfo = kersBoru.layer.getLayerBounds(artBoard, "bounds"); //获取选中图层边界信息  
        var artBoard_boundsInfo = Kinase.layer.getLayerBounds(Kinase.REF_LayerID, artBoard.id, "boundsNoEffects"); //画板的图层边界信息 

        var boundsInfo = Kinase.layer.getLayerBounds(Kinase.REF_LayerID, layer.id); //获取选中图层边界信息 这个更全面       
        //var boundsInfo = kersBoru.layer.getLayerBounds(layer, "bounds"); //获取选中图层边界信息  

        boundsInfo.right = boundsInfo.right + Math.abs(artBoard_boundsInfo.x); //修正右边界
        boundsInfo.bottom = boundsInfo.bottom + Math.abs(artBoard_boundsInfo.y); //修正底边界
        boundsInfo.x = boundsInfo.x + Math.abs(artBoard_boundsInfo.x); //修正边界x坐标
        boundsInfo.y = boundsInfo.y + Math.abs(artBoard_boundsInfo.y); //修正边界y坐标a
    } else {
        //var boundsInfo = Kinase.layer.getLayerBounds(Kinase.REF_LayerID, result_artBoard.aArtBoardId); //获取图层边界信息
        //var boundsInfo = kersBoru.layer.getLayerBounds(layer, "bounds");
        //var boundsInfo = Kinase.layer.getLayerBounds(Kinase.REF_LayerID, layer.id,"boundsNoEffects");
    }*/
    return boundsInfo;
}

var main = function() {
    var pro = prompt("圆角图形不拉伸情况下放大智能对象", '{"w":200,"h":200}', "修改智能对象大小"); //输入一个新的 尺寸 (200,200)
    if (pro == null) {
        alert("已取消本次操作");
        return;
    }
    pro = JSON.parse(pro); //转换成对象
    var doc = app.activeDocument;
    var layer = doc.activeLayer;


    if (layer.kind == "LayerKind.SMARTOBJECT") { //判断是否 是智能对象
        var g9 = getSmartObject();




        /**
         * 修改智能对象选区内图像尺寸
         */
        var modifySmartObject_RegionSize = function(x, y, qcs) {

            //移动 智能对象需要位移一次才会将变形工具范围 从整个图层范围 变成 当前选区内的图层范围
            kersBoru.listenerType.selectionMove(1, 0);
            kersBoru.listenerType.selectionMove(-1, 0); //还原坐标位置
            //修改大小
            var w = ((x + 2) / 2) * 100; //((新的增加的宽度+现在选区宽度)/现在选区宽度)*100
            var h = ((y + 2) / 2) * 100;
            kersBoru.listenerType.modifyLayerSize(w, h, qcs); //查看锚点 字符串>>> modifyLayerSize函数中
        }

        var reviseWidth = function() { //修改宽度函数

            //var boundsInfo = getBoundsInfo(layer);
            var boundsInfo = kersBoru.layer.getLayerBounds(layer, "boundsNoEffects");
            getTypeCreateRegion("移动x", boundsInfo, g9); //创建选区
            var x = pro.w - boundsInfo.w;
            var y = 0;
            kersBoru.listenerType.selectionMove(x, y); //移动选区内的图像

            getTypeCreateRegion("加宽", boundsInfo, g9); //创建选区

            modifySmartObject_RegionSize(x, y, "Qcs7"); //修改尺寸 Qcs7 锚点是左中 
        }
        var reviseHeight = function() { //修改高度函数

            //var boundsInfo = getBoundsInfo(layer);
            var boundsInfo = kersBoru.layer.getLayerBounds(layer, "boundsNoEffects");
            getTypeCreateRegion("移动y", boundsInfo, g9);

            var x = 0;
            var y = pro.h - boundsInfo.h;
            kersBoru.listenerType.selectionMove(x, y);

            getTypeCreateRegion("加高", boundsInfo, g9); //创建选区

            modifySmartObject_RegionSize(x, y, "Qcs4"); //修改尺寸 Qcs4 锚点是上中
        }

        if (pro.w > 0 && pro.h == 0) { //只修改宽

            reviseWidth();

        } else if (pro.h > 0 && pro.w == 0) { //修改高度
            reviseHeight();
        } else if (pro.h > 0 && pro.w > 0) { //先修改高度 在修改宽度x

            reviseWidth();
            $.writeln("修改宽度后");

            reviseHeight();
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

function getTypeCreateRegion(type, boundsInfo, g9) {

    switch (type) {
        case "移动x":
            var L = boundsInfo.x + g9[2];
            var T = boundsInfo.y;
            var R = boundsInfo.right;
            var B = boundsInfo.bottom;
            createRegion(L, T, R, B);
            return;
        case "移动y":
            var L = boundsInfo.x;
            var T = boundsInfo.y + g9[3];
            var R = boundsInfo.right;
            var B = boundsInfo.bottom;
            createRegion(L, T, R, B);
            return;
        case "加宽":
            var L = boundsInfo.x + g9[2] - 2; //暂定2个px宽
            var T = boundsInfo.y;
            var R = boundsInfo.x + g9[2];
            var B = boundsInfo.bottom;
            createRegion(L, T, R, B);
            return;
        case "加高":
            var L = boundsInfo.x;
            var T = boundsInfo.y + g9[3] - 2;
            var R = boundsInfo.right; //
            var B = boundsInfo.y + g9[3];
            createRegion(L, T, R, B);
            return;
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
function createRegion(L, T, R, B) {


    var type = SelectionType.REPLACE;
    var feather = 0; //构建选区时的羽化值
    var antiAlias = true; //构建选区时是否抗锯齿
    var regionData = [
        [L, T],
        [R, T],
        [R, B],
        [L, B]
    ];

    app.activeDocument.selection.select(regionData, type, feather, antiAlias);
    //return regionData;
}
/**
 * 获取当前选中图层嵌套的最外层
 */
function getActiveLayerOutermost(layer) {
    if (layer.parent.typename === "Document") {
        return layer;
    } else {
        var a = layer;
        var b;
        while (a.parent.typename != "Document") {
            b = a.parent;
            a = b;
            //$.writeln(b);
        }
        return b;
    }

}