/**
 * @author kersBoru
 * @name 公司项目图标整合导出
 * @description 图标和一些角标品质框等拼合导出成一张图
 * @weixin JackdawTing
 * @date 2021-05-07 创建 
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

var excelFile = new File("E:/test/图标拼合.json");

var pat = "E:/test/T图标/";

//E:/test/T图标/武将/关羽.png

/**
 * 图标整合导出脚本
 */
var main = function () {
    if (excelFile.exists) {

        excelFile.open("r");//打开JSON文件
        var content = excelFile.read();//读取JSON内容
        //var lines = getExcelLines(excelFile);
        var lines = JSON.parse(content);

        if (lines) {

            for (var i = 1; i < lines.length; i++) { //从第二行开始读
                var line = lines[i];

                var type = line.type;//道具类型
                var tag = line.tag;//左上角标
                var lv = line.lv;//星级
                var img = line.img;//图标资源
                var qua = line.qua;//品质框
                var imgName = line.imgName;//图片名字
                var quality = function (qua) {//修改品质名
                    switch (qua) {
                        case "绿": //替换 图标资源

                            return qua = 1 + qua;
                        case "蓝": //替换 图标资源

                            return qua = 2 + qua;
                        case "紫": //替换 图标资源

                            return qua = 3 + qua;
                        case "橙": //替换 图标资源

                            return qua = 4 + qua;
                        case "红": //替换 图标资源

                            return qua = 5 + qua;
                        case "金": //替换 图标资源

                            return qua = 6 + qua;
                        case "白": //替换 图标资源

                            return qua = 7 + qua;
                    }
                }
                //quality(qua);
                var imgFullName = pat + type + "/" + img + ".png"
                var imgBoolean = new File(imgFullName);
                //decodeURI(a);
                if (imgBoolean.exists) {

                    $.writeln("111");
                    //smartObjectOptions().putPath(charIDToTypeID("null"), imgFullName);

                    //修改psd文件
                    modifyPSDcontent(tag, lv, imgFullName, quality(qua));
                    //保存图片
                    saveImg(pat, type, imgName);
                    $.writeln("啊啊啊啊啊啊");
                }

            }
        }
    }
}
/**
 * 修改psd文件
 * @param tag 左上角标
 * @param lv 星级
 * @param imgFullName 图标资源路径
 * @param qua 品质框
 */
function modifyPSDcontent(tag, lv, imgFullName, qua) {

    //修改链接图层的地址
    //1.替换 图标资源 if(如果没找到对应资源直接条到下一个循环 continue )
    //2.替换 星级 if(lv !=0){执行替换}

    var layers = doc.layers;
    var pat = "//版本公用计算机/美术资源共享文件夹1/天天幻灵美术/天天怼三国最终/lib/原始文件/";

    var tagFullName = pat + "阵营/小_" + tag + ".psd";
    var lvFullName = pat + "星星/" + lv + ".psd";
    var quaFullName = pat + "道具品质底/" + qua + ".psd";

    for (var i = 0; i < layers.length; i++) {//遍历图层

        var layer = layers[i];
        
        switch (layer.name) {//根据类型修改

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
            case "星级": //替换 星级

                if (lv != 0) {
                    layer.visible = true;
                    activeDocument.activeLayer = layer;
                    kersBoru.listenerType.placedLayerReplaceContents(lvFullName);
                } else {
                    layer.visible = false;
                }


                break;
            case "品质": //替换 品质框

                activeDocument.activeLayer = layer;
                kersBoru.listenerType.placedLayerReplaceContents(quaFullName);
                break;

        }
        //activeDocument.activeLayer = layer;


    }

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
    var path = pat + "重命名/" + type;
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

main();