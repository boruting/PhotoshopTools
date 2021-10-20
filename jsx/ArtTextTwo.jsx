/**
 * @author boru
 * @name 多文本样式导出脚本
 * @description 两个文本图层类型 导出
 * @weixin JackdawTing
 * @date 2021-04-13 创建
 */
var file = File($.fileName);
var p = decodeURI(file.parent.parent);
$.writeln(p + "/js/helper.js");
$.evalFile(p + "/js/helper.js");


xlsxData();

function xlsxData() {
  var doc = app.activeDocument;
  var layers = doc.layers;

  // for (var lay = 0; lay < layers.length; lay++) { //遍历所有图层 全部图层都隐藏
  //   var layer_ = layers[lay];
  //   layer_.visible = false; //隐藏图层
  // }

  var docFile = doc.fullName; //当前文档的路径全名

  var filePaths = docFile.fullName.split("/");
  var fileName = filePaths[filePaths.length - 1];
  var fileNames = fileName.split(".");
  var pat = docFile.path + "/" + fileNames[0] + ".xlsx";
  //var pro = prompt("输入文件名", "页签1", "");
  //var pat = "D:/sg2/psd/文档/" + pat + ".xlsx ";
  if (pat.exists) {
    $.writeln("保存");
  }
  var excelFile = new File(pat); // 需要打开xlsx文档 
  var pngOutAssetsName = fileNames[0] + "-assets"; //需要保存图片的文件
  saveOption = new ExportOptionsSaveForWeb();
  saveOption.format = SaveDocumentType.PNG;
  saveOption.PNG8 = false;

  if (excelFile.exists) {
    var lines = getExcelLines(excelFile);
    if (lines) {
      var len = lines.length;
      var exp_num = 0;//导出计
      if (len > 0) {
        for (var i = 1; i < len; i++) { //从第二行开始读
          var line = lines[i];
          var tFileName = line[0]; //翻译的资源名次
          var text = translate || line[1]; //要输出的文本
          var translate = line[2]; //翻译的内容
          var ignore = line[3]; //检测第4列是否内用是否等于"不导出"
          var layerName = line[4]; //第5列 对应图层 

          if (ignore != 1) {

            if (text.indexOf("/" > 1)) {

              var txt = text.split("/");
              var txt_1 = txt[0];
              var txt_2 = txt[1];
              var txt_3 = txt[2];
              var txt_4 = txt[3];
            } else {
              $.writeln("err");
              return;
            }
            var num_ = 0;
            for (var j = 0; j < layers.length; j++) {
              var layer = layers[j];

              if (layer.layers) {
                // alert("替换文本用psd，不允许有子文件夹");
                continue;
              }
              //不做多层级遍历，也不判定文本名称
              if (layer.kind == "LayerKind.TEXT") {

                if (layer.name == "txt_1") {
                  textItem = layer.textItem;
                  if (txt_1) {
                    textItem.contents = txt_1.replace(/&#10;/g, "\n").replace(/&#13;/g, "\r").replace(/\r?\n/g, "\r");
                    num_ += 1;
                  }


                }
                if (layer.name == "txt_2") {
                  textItem = layer.textItem;
                  if (txt_2) {
                    textItem.contents = txt_2.replace(/&#10;/g, "\n").replace(/&#13;/g, "\r").replace(/\r?\n/g, "\r");
                    num_ += 1;
                  }
                }
                if (layer.name == "txt_3") {
                  textItem = layer.textItem;
                  if (txt_3) {
                    textItem.contents = txt_3.replace(/&#10;/g, "\n").replace(/&#13;/g, "\r").replace(/\r?\n/g, "\r");
                    num_ += 1;
                  }

                }
                if (layer.name == "txt_4") {
                  textItem = layer.textItem;
                  if (txt_4) {
                    textItem.contents = txt_4.replace(/&#10;/g, "\n").replace(/&#13;/g, "\r").replace(/\r?\n/g, "\r");
                    num_ += 1;
                  }

                }
                if (num_ >= 4) {
                  //num_ = 0;
                  break;
                }

              }
            }
            //======================================
            //$.writeln("保存");
            var parentPath = docFile.path + "/" + pngOutAssetsName;
            //$.writeln(parentPath);
            var folder = new Folder(parentPath);
            if (!folder.exists) {
              // alert("这里是folder.exists ");					
              folder.create(); //创建文件夹
            }
            var outfile = new File(parentPath + "/" + tFileName + ".png"); //保存图片到

            doc.exportDocument(outfile, ExportType.SAVEFORWEB, saveOption); //保存
            exp_num += 1;



          }
        }
      }
    }
    alert("成功 完成" + "\n导出 " + (exp_num) + "张 png图片");
  } else {
    alert("失败 对应xlsx文档错误\n请核对 xlsx文件名 是否 与 psd文件名 相同");
  }

}