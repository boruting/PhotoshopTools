/**
* 自动生成切图用pdf的Excel
* 自动根据当前激活的pdf名字，在同文件夹生成同名xlsx文件，格式如下：
* 位置    原始内容    字体  字号      替换内容    替换字体  替换字号
* @author 3tion
* 2015-11-24
* 
* 2015-12-01 新增对特殊文本（需要翻译，但是无法直接替换的文本）的方案支持
*            目前的方案，如果是有特殊的需要翻译的文本，psd中的图层，ui会做成智能对象，而将图层名称命名为  txt_no_开头，文本内容会放在  txt_no_ 和.png中间
*            例如： 通关奖励    图层会弄成命名为   txt_no_通关奖励.png
**/
var file = File($.fileName);
var p = decodeURI(file.parent.parent.parent);
//$.writeln(p.parent + "/js/helper.js");
$.evalFile(p + "/js/helper.js");
//#include "helper.js"

function datenum(v, date1904) {
    if(date1904) v+=1462;
    var epoch = Date.parse(v);
    return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}
 
function sheet_from_array_of_arrays(data, opts) {
    var ws = {};
    var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
    for(var R = 0; R != data.length; ++R) {
        for(var C = 0; C != data[R].length; ++C) {
            if(range.s.r > R) range.s.r = R;
            if(range.s.c > C) range.s.c = C;
            if(range.e.r < R) range.e.r = R;
            if(range.e.c < C) range.e.c = C;
            var cell = {v: data[R][C] };
            if(cell.v == null) continue;
            var cell_ref = XLSX.utils.encode_cell({c:C,r:R});
			
            if(typeof cell.v === 'number') cell.t = 'n';
            else if(typeof cell.v === 'boolean') cell.t = 'b';
            else if(cell.v instanceof Date) {
                cell.t = 'n'; cell.z = XLSX.SSF._table[14];
                cell.v = datenum(cell.v);
            }
            else cell.t = 's';
			
            ws[cell_ref] = cell;
        }
    }
    if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
    return ws;
}
 
/* original data */
//var data = [[1,2,3],[true, false, null, "sheetjs"],["foo","bar",new Date("2014-02-19T14:30Z"), "0.3"], ["baz", null, "qux"]]
 
function Workbook() {
    if(!(this instanceof Workbook)) return new Workbook();
    this.SheetNames = [];
    this.Sheets = {};
}



function checkLayers(layers,path,data){
    for(var i=0,len=layers.length;i < len;i++){
        var layer = layers[i];       
        var layerName = layer.name;
        var p = layerName;
        if(path)
        {
            p=path + "/" + p;
        }
        if(layer.layers){
            checkLayers(layer.layers,p,data);
        }
        else{
            if(layerName.substring(0,7)=="txt_no_"){//特殊图层，放入Sheet2的
                var content=layerName.replace("txt_no_","").replace(".png","");
                data.info2.push([p,content])
            }else if(layer.kind=="LayerKind.TEXT" && layerName.substring(0,4)=="txt_"){
                var textItem = layer.textItem;
                textItem.size.convert("px");
                data.info.push([p,textItem.contents,textItem.font,textItem.size.value]);
            }
        }
    }
}



var doc;
try{
    doc=app.activeDocument
}catch(e){
    doc=null;
}
if(doc){
    //会替换的文本
    var info=[["位置","原始内容","字体","字号","替换内容","替换字体","替换字号"]];
    //特殊文本
    var info2=[["位置","原始内容","字体","字号","替换内容","替换字体","替换字号"]];

    var data={info:info,info2:info2};

    checkLayers(doc.layers,"",data);


    var wb = new Workbook();
    var sname,ws;
    //会替换的文本
    sname="替换文本";
    ws = sheet_from_array_of_arrays(info);
    wb.SheetNames.push(sname);
    wb.Sheets[sname] = ws;

    //特殊文本
    sname="特殊文本";
    ws = sheet_from_array_of_arrays(info2);
    wb.SheetNames.push(sname);
    wb.Sheets[sname] = ws;


    var dat = XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'binary'});
    var file=new File(doc.fullName.path + "/"+doc.name.replace(".psd",".xlsx"));
    file.encoding = "BINARY";
    file.open("w");
    var flag=file.write(dat);
    file.close();
    if(flag){
        alert("处理完成："+ decodeURI(file.fullName));
    }else{
        alert("失败了 T__T");
    }
}