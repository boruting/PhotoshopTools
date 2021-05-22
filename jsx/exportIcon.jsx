/**
 * 导出图片
 */
var exportIcon = function (layer) {

    saveOption = new ExportOptionsSaveForWeb();
    saveOption.format = SaveDocumentType.PNG;
    saveOption.PNG8 = false;

    var docFile = doc.fullName;
    var filePaths = docFile.fullName.split("/");
    var fileName = filePaths[filePaths.length - 1];
    var fileNames = fileName.split(".");
    //var size = fileNames[0].split("-")[1];

    //$.writeln(size); //打印

    var pngOutAssetsName = fileNames[0] + "-assets/"; //需要保存图片的文件
    var parentPath = docFile.path + "/" + pngOutAssetsName;
    var folder = new Folder(parentPath);
    if (!folder.exists) {
        // alert("这里是folder.exists ");					
        folder.create(); //创建文件夹
    }

    //var imgName = layer.name + "-" + size + ".png"; //图片名字
    var imgName = layer.name + ".png"; //图片名字

    var outfile = new File(parentPath + "/" + imgName); //保存图片到
    doc.exportDocument(outfile, ExportType.SAVEFORWEB, saveOption);

}
/**
 * 隐藏图层
 */
var LayerVisibleFalse = function (layers) {
    for (var i = 0, len = layers.length; i < len; i++) {
        var layer = layers[i];
        if (layer.name != "不隐藏") {
            layer.visible = false;
        }
        // if (layer.layers) { //遍历图层组
        //     LayerVisibleFalse(layer.layers);
        // }


    }
}

//main
var doc = app.activeDocument;
var layers = doc.layers;
LayerVisibleFalse(layers);
//$.writeln("size");

for (var i = 0, len = layers.length; i < len; i++) {
    var layer = layers[i];
    if (layer.name != "不隐藏") {

        layer.visible = true;
        exportIcon(layer);
        layer.visible = false;
        //$.writeln("啊");
    }

}
alert("完成");
//===========


// /**
//  * 创建新的文档
//  */
// function newDOC(size) {
//     //定义一个变量[Width]，表示新文档的宽度。
//     var width = size;

//     //定义一个变量[height]，表示新文档的高度。
//     var height = size;

//     //定义一个变量[resolution]，表示新文档的分辨率。
//     var resolution = 72;

//     //定义一个变量[docName]，表示新文档的名称。
//     var docName = "New Document";

//     //定义一个变量[mode]，表示新文档的颜色模式。
//     var mode = NewDocumentMode.RGB;

//     //定义一个变量[initialFill]，表示新文档的默认背景填充颜色。
//     var initialFill = DocumentFill.TRANSPARENT;

//     //定义一个变量[pixelAspectRatio]，用来设置新文档的像素比率。
//     var pixelAspectRatio = 1;

//     //使用[Documents.add]命令创建一个新文档，将设置好的参数放在[add]方法里面。
//     app.documents.add(width, height, resolution, docName, mode, initialFill, pixelAspectRatio);
//     activeDocument.close(SaveOptions.SAVECHANGES);
// }