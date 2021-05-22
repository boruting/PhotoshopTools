
$.evalFile(File($.fileName).parent + "/lib/kersBoru_lib.jsx");

var doc = app.activeDocument;


var a = function () {

    var pat = "D:/sg2/psd/S神兵/星星/";//后续需要改成配置的
    var lines = [1, 2, 3, 4, 5, 6, 7];
    //var lines = [1];
    for (var i = 0; i < lines.length; i++) {
        var imgFullName = pat + lines[i] + ".psd";
        var type = "/卡/";
        var imgName = "small_17_" + lines[i];
        //var quaFullName = doc.path + "/" + qua + ".psd";
        var imgBoolean = new File(imgFullName);
        if (imgBoolean.exists) {
            var layer = getLayer_name("星级");
            activeDocument.activeLayer = layer;
            kersBoru.listenerType.placedLayerReplaceContents(imgFullName);
            saveImg(doc.path, type, imgName);
            $.writeln("保存: ");
        }
    }

}
a();
function getLayer_name(n) {
    var layers = app.activeDocument.layers;

    for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];
        if (layer.name == n) {
            return layer;
        }
    }
}

function saveImg(pat, type, imgName) {

    var saveOption = new ExportOptionsSaveForWeb();
    saveOption.format = SaveDocumentType.PNG;
    saveOption.PNG8 = false;
    var path = pat + type;
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