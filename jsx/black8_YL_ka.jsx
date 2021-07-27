/**
 * @author kersBoru
 * @name 公司项目图标整合导出
 * @description 图标和一些角标品质框等拼合导出成一张图
 * @weixin JackdawTing
 * @date 2021-05-07 创建 
 * @date 2021-05-09 完善类型(右上角标)
 * @date 2021-05-13 修改品质BUG qua undefined
 */
/*引用库*/
$.evalFile(File($.fileName).parent + "/lib/kersBoru_lib.jsx");
//$.evalFile(File($.fileName).parent + "/lib/Kinase_lib.jsx");
//$.evalFile(File($.fileName).parent.parent + "/js/helper.js");
$.evalFile(File($.fileName).parent + "/lib/json2.jsx");

try {
    JSON
} catch (e) {
    $.writeln("1因为未载入 JSON 解析库，请载入 json2.jsx ");
}

var doc = app.activeDocument;
//var excelFile = new File("//版本公用计算机/美术资源共享文件夹1/天天幻灵美术/天天怼三国最终/T图标/图标拼合.xlsx");
//var excelFile = new File("E:/test/test.xlsx");

//var excelFile = new File("E:/test/武将.json");
var pat = "D:/Black8/bjj/svn/ui/upload/T图标/"; //后续需要改成配置的
var excelFile = new File(pat + "配置表/武将卡_灰.json"); //后续需要改成配置的
//var pat = "E:/test/T图标/";


//E:/test/T图标/武将/关羽.png

/**
 * 图标整合导出脚本
 */
var main = function() {
    if (excelFile.exists) {

        excelFile.open("r"); //打开JSON文件
        var content = excelFile.read(); //读取JSON内容
        //var lines = getExcelLines(excelFile);
        var lines = JSON.parse(content);

        if (lines) {
            var logArr = []; //未成功日志
            for (var i = 0; i < lines.length; i++) { //从第二行开始读
                var line = lines[i];

                var type = line.type; //道具类型
                var tag = line.tagL; //左上角标
                var tagR = line.tagR; //右上角标
                var lv = line.lv; //星级
                var img = line.img; //图标资源
                var qua = line.qua; //品质框
                var imgName = line.imgName; //图片名字
                var isExport = line.isExport; //是否需要导出
                var name = line.name; //武将名称
                var zhiye = line.zhiye//武将职业
                //quality(qua);
                var imgFullName = pat + img + ".png"
                var imgBoolean = new File(imgFullName);
                //decodeURI(a);
                if (isExport != 1) {
                    if (imgBoolean.exists) {

                        //$.writeln("111");
                        //smartObjectOptions().putPath(charIDToTypeID("null"), imgFullName);

                        //修改psd文件
                        modifyPSDcontent(tag, tagR, lv, imgFullName, qua, name,zhiye);
                        //保存图片
                        saveImg(pat, type, imgName);
                        $.writeln("保存: " + line.name);
                    } else {
                        logArr.push(line.name);
                    }
                }
            }

        }
        $.writeln("未成功数量:" + logArr.length + " 名字: " + logArr);
    }
}

/**
 * 修改psd文件
 * @param tag 左上角标
 * @param lv 星级
 * @param imgFullName 图标资源路径
 * @param qua 品质框
 *
 */
function modifyPSDcontent(tag, tagR, lv, imgFullName, qua, name,zhiye) {

    //修改链接图层的地址
    //1.替换 图标资源 if(如果没找到对应资源直接条到下一个循环 continue )
    //2.替换 星级 if(lv !=0){执行替换}

    var layers = doc.layers;
    //var pat = "//版本公用计算机/美术资源共享文件夹1/天天幻灵美术/天天怼三国最终/lib/原始文件/"; //后续需要改成配置的
    var pat = "//版本公用计算机/美术资源共享文件夹1/天天幻灵美术/百将诀/lib/原始文件/"; //后续需要改成配置的
    var tagFullName = pat + "阵营/" + tag + ".psd";
    
    var tagR_FullName = pat + "图标相关/" + tagR + ".psd";
    var lvFullName = pat + "星星/卡牌类型/" + lv + ".psd";//卡片类型
    var quaFullName = pat + "道具品质/" + qua + ".psd";
    var zhiyeIcon = pat + "阵营/" + zhiye + ".psd";//职业


    for (var i = 0; i < layers.length; i++) { //遍历图层

        var layer = layers[i];
        // if(layer.name=="图标资源"||layer.name=="左上角标"||layer.name=="右上角标"||layer.name=="星级"||layer.name=="品质"){

        // }else{
        //     alert("检查图层名");
        // }

        switch (layer.name) { //根据类型修改

            case "图标资源": //替换 图标资源
                activeDocument.activeLayer = layer;
                kersBoru.listenerType.placedLayerReplaceContents(imgFullName);
                break;
            case "左上角标": //替换 左上角标

                if (tag != "无") {
                    layer.visible = true;
                    activeDocument.activeLayer = layer;
                    kersBoru.listenerType.placedLayerReplaceContents(tagFullName);
                } else {
                    layer.visible = false;
                }

                break;
            case "右上角标": //替换 左上角标

                if (tagR != "无") {
                    layer.visible = true;
                    activeDocument.activeLayer = layer;
                    kersBoru.listenerType.placedLayerReplaceContents(tagR_FullName);
                } else {
                    layer.visible = false;
                }

                break;
            case "星级": //替换 星级

                if (lv != 0) {
                    layer.visible = true;
                    activeDocument.activeLayer = layer;
                    kersBoru.listenerType.placedLayerReplaceContents(lvFullName);

                    //对齐需要 选区 做 对齐参考
                    //kersBoru.listenerType.canvasConstituency("Al  ");//创建选区 
                    //kersBoru.listenerType.alignDistribute("AdCH");//居中对齐
                    //kersBoru.listenerType.canvasConstituency("None");//取消选区

                } else {
                    layer.visible = false;
                }


                break;
            case "品质": //替换 品质框
                if (qua != "无") {
                    layer.visible = true;
                    activeDocument.activeLayer = layer;
                    kersBoru.listenerType.placedLayerReplaceContents(quaFullName);
                    break;
                } else {
                    layer.visible = false;
                }
            case "职名":
                if (layer.layers) {

                    var txt = layer.layers.getByName("txt");
                    var icon = layer.layers.getByName("职业");
                    var item = txt.textItem;
                    item.contents = name;
                    item.color.rgb["hexValue"] = qualityColor(qua);
                    activeDocument.activeLayer = icon;
                    kersBoru.listenerType.placedLayerReplaceContents(zhiyeIcon);
                    activeDocument.activeLayer = layer;
                    kersBoru.listenerType.canvasConstituency("Al  ");
                    kersBoru.listenerType.alignDistribute("AdCH");
                    kersBoru.listenerType.canvasConstituency("None");
                    //$.writeln("未成功数量:");


                }
                
            default:
                {}


        }
        //activeDocument.activeLayer = layer;


    }

}

function qualityColor(qua) {

    switch (qua) {
        case "英灵卡品质_绿":
            return "96e68c";
        case "英灵卡品质_蓝":
            return "008ee0";
        case "英灵卡品质_紫":
            return "da00d8";
        case "英灵卡品质_橙":
            return "ff7700";
        case "英灵卡品质_红":
            return "ea0101";
        case "英灵卡品质_白":
            return "efe3ff";
        default:
            {
                return "000000";
            }
    }
    // if (qua == "英灵卡品质_绿") {
    //     return
    // }
    // if (qua == "英灵卡品质_蓝") {
    //     return "008ee0";
    // }


}
/**
 * 保存图片
 * @param {*} pat 链接对象的路径 目录
 * @param {*} type 图标类型
 * @param {*} imgName 图片名称
 */
function saveImg(pat, type, imgName) {

    var saveOption = new ExportOptionsSaveForWeb();
    saveOption.format = SaveDocumentType.PNG;
    saveOption.PNG8 = false;
    var path = pat + "正式名称1/" + type;
    var folder = new Folder(path);
    if (!folder.exists) {
        // alert("这里是folder.exists ");					//创建文件夹
        folder.create();
    }
    var outfile = new File(decodeURI(path + "/") + imgName + ".png"); //保存图片到
    //alert("这里是outfile   "+outfile);
    doc.exportDocument(outfile, ExportType.SAVEFORWEB, saveOption);
    //alert("这里是000000000000000   "); 
}
function test(){

}
main();