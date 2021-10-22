$.evalFile(File($.fileName).path + "/cleanMetadata_v2.jsx");
$.global.main = main;
var a = app.activeDocument;
//$.writeln("111111");
if(main() !== false){
    
    app.activeDocument.save();
    alert("PSD文件 原始数据 MXP 清理完成");
}




// try
// {
//     var main = new main();
   
// } catch (e)
// {
// }
 
//$.writeln(main);