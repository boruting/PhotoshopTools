
$.evalFile(File($.fileName).parent + "/lib/kersBoru_lib.jsx");
var file = File($.fileName);
var p = decodeURI(file.parent.parent);
$.evalFile(p + "/js/helper.js");

function checkLayers(layers, path, data) {
    for (var i = 1; i < layers.length; i++) {

        var layer = layers[i];

        var boundsInfo = kersBoru.layer.getLayerBounds(layer, "boundsNoEffects");
        var x = boundsInfo.center.x;
        var y = boundsInfo.center.y;
        var pos = "X:" + x + " " +"Y:"+ y;
        data.info.push([layer.name,pos]);
    }

}


/* original data */
//var data = [[1,2,3],[true, false, null, "sheetjs"],["foo","bar",new Date("2014-02-19T14:30Z"), "0.3"], ["baz", null, "qux"]]

function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();
    this.SheetNames = [];
    this.Sheets = {};
}
var doc;
try {
    doc = app.activeDocument;
    var docFile = new File(doc.fullName.path);
} catch (e) {
    doc = null;
    alert("没有打开psd文档 或 文档没有保存");
}
if (doc) {
    //会替换的文本
    var info = [["城池序号", "坐标信息"]];

    var data = { info: info };

    checkLayers(doc.layers, "", data);


    var wb = new Workbook();
    var sname, ws;
    //会替换的文本
    sname = "坐标";
    //ws = sheet_from_array_of_arrays(info);
    ws = kersBoru.excel.sheet_from_array_of_arrays(info);
    wb.SheetNames.push(sname);
    wb.Sheets[sname] = ws;


    var dat = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
    var psdName = doc.name.split(".");
    //var file=new File(doc.fullName.path + "/"+doc.name.replace(".psd",".xlsx"));
    var file = new File(doc.fullName.path + "/" + psdName[0] + "_坐标信息.xlsx");
    file.encoding = "BINARY";
    file.open("w");
    var flag = file.write(dat);
    file.close();
    if (flag) {
        alert("处理完成：" + decodeURI(file.fullName));
    } else {
        alert("失败了 T__T");
    }
}