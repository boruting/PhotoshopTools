
$.evalFile(File($.fileName).path + "/cleanMetadata_v2.jsx");
$.global.main = main;
try {
    var a = app.activeDocument;
    if (main() !== false) {

        app.activeDocument.save();
        alert("PSD文件 原始数据 MXP 清理完成");
    }
} catch (e) {

    alert("当前没有激活的文档");

}

//$.writeln("111111");





// try
// {
//     var main = new main();

// } catch (e)
// {
// }

//$.writeln(main);