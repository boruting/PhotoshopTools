window.onload=function(){
    var css = new CSInterface();
    var csInterface = new CSInterface();
    var str = csInterface.getSystemPath(SystemPath.EXTENSION);
    

    $("#psdG9").click(function () {//智能对象九宫
            
        css.evalScript('$.evalFile("' + str + "/jsx/psdG9.jsx" + '")');
    });
    $("#CornerEditor").click(function () {//矢量角修改
            
        css.evalScript('$.evalFile("' + str + "/jsx/Corner Editor.jsx" + '")');
    });
    $("#PsdToEUI").click(function () {//Psd导出EUI
            
        css.evalScript('$.evalFile("' + str + "/jsx/PsdToEUI/PsdToEUI.jsx" + '")');
    });
    $("#PsdToAssets").click(function () {//Psd切图脚本
            
        css.evalScript('$.evalFile("' + str + "/jsx/PsdToEUI/PsdToAssets.jsx" + '")');
    });
    $("#cleanMetadata_one").click(function () {//清理原始数据-单
            
        css.evalScript('$.evalFile("' + str + "/jsx/cleanMetaData/main_one.jsx" + '")');
    });
    $("#cleanMetadata_N").click(function () {//清理原始数据-N
            
        css.evalScript('$.evalFile("' + str + "/jsx/cleanMetaData/batchPSDmetaData.jsx" + '")');
    });
    $("#test").click(function () {//测试
            
        css.evalScript('$.evalFile("' + str + "/jsx/test.jsx" + '")');
    });
    $("#BlackCutout").click(function () {//抠图黑色底
            
        css.evalScript('$.evalFile("' + str + "/jsx/BlackCutout.jsx" + '")');
    });
    $("#fileImportLnkd").click(function () {//创建链接对象
            
        css.evalScript('$.evalFile("' + str + "/jsx/fileImportLnkd.jsx" + '")');
    });
    $("#fontInfoExportExcel").click(function () {//文本层信息>>Excel
            
        css.evalScript('$.evalFile("' + str + "/jsx/fontInfoExportExcel.jsx" + '")');
    });
    

}
