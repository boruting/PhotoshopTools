var file = File($.fileName);
var p =decodeURI(file.parent.parent);
$.evalFile( p+ "/js/helper.js");
function datenum(v, date1904) {
    if (date1904) v += 1462;
    var epoch = Date.parse(v);
    return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}

function sheet_from_array_of_arrays(data, opts) {
    var ws = {};
    var range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 } };
    for (var R = 0; R != data.length; ++R) {
        for (var C = 0; C != data[R].length; ++C) {
            if (range.s.r > R) range.s.r = R;
            if (range.s.c > C) range.s.c = C;
            if (range.e.r < R) range.e.r = R;
            if (range.e.c < C) range.e.c = C;
            var cell = { v: data[R][C] };
            if (cell.v == null) continue;
            var cell_ref = XLSX.utils.encode_cell({ c: C, r: R });

            if (typeof cell.v === 'number') cell.t = 'n';
            else if (typeof cell.v === 'boolean') cell.t = 'b';
            else if (cell.v instanceof Date) {
                cell.t = 'n'; cell.z = XLSX.SSF._table[14];
                cell.v = datenum(cell.v);
            }
            else cell.t = 's';

            ws[cell_ref] = cell;
        }
    }
    if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
    return ws;
}

/* original data */
//var data = [[1,2,3],[true, false, null, "sheetjs"],["foo","bar",new Date("2014-02-19T14:30Z"), "0.3"], ["baz", null, "qux"]]

function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();
    this.SheetNames = [];
    this.Sheets = {};
}



function checkLayers(layers, path, data) {
    for (var i = 0, len = layers.length; i < len; i++) {
        var layer = layers[i];
        var layerName = layer.name;
        var p = layerName;

        if (path) {
            p = path + "/" + p;
        }
        if (layer.layers) {
            checkLayers(layer.layers, p, data);
        }
        else {
            if (layer.kind == "LayerKind.TEXT") {
                if (layer.name.substr(0, 8) == "txtInfo_") {
                    var textItem = layer.textItem;
                    textItem.size.convert("px");
                    var R = Math.round(textItem.color.rgb["red"]);
                    var G = Math.round(textItem.color.rgb["green"]);
                    var B = Math.round(textItem.color.rgb["blue"]);
                    var RGB = "RGB( " + R + "," + G + "," + B + ")";
                    data.info.push([textItem.contents, textItem.font, textItem.size.value, textItem.color.rgb["hexValue"], RGB]);
                }
            }
        }
    }
}



var doc;
try {
    doc = app.activeDocument
} catch (e) {
    doc = null;
}
if (doc) {
    //会替换的文本
    var info = [["文字类型", "字体", "字号", "颜色hex", "颜色RGB"]];

    var data = { info: info };

    checkLayers(doc.layers, "", data);


    var wb = new Workbook();
    var sname, ws;
    //会替换的文本
    sname = "字体颜色表";
    ws = sheet_from_array_of_arrays(info);
    wb.SheetNames.push(sname);
    wb.Sheets[sname] = ws;


    var dat = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
    var psdName = doc.name.split(".");
    //var file=new File(doc.fullName.path + "/"+doc.name.replace(".psd",".xlsx"));
    var file = new File(doc.fullName.path + "/" + psdName[0] + "_文字信息.xlsx");
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