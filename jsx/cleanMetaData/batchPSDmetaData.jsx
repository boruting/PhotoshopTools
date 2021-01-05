/**
 * 批量处理psd原始数据
 * 
 * 可以对指定文件夹下的所有psd文件进行清理 包含子文件夹内的psd文件
 * 
 * @author boru   微信:JackdawTing
 * 
 * @date 2019-08-29  v0.1
 */
$.evalFile(File($.fileName).path + "/cleanMetadata.jsx");
$.global.saveClose = saveClose;
$.global.cleanMetadataMain = main;


var pro = function() {
    var folderPath = prompt("输入地址", "", "批处理地址");
    if (folderPath) {
        $.writeln(folderPath);
        getPsdFileName(folderPath.replace(/\\/g, '/'));
        alert("PSD文件 原始数据 MXP 清理完成");

    } else {

        return alert("没有文件地址, 本次操作结束");
    }


}


//var folderPath = "D:/test";
var getPsdFileName = function(folderPath) {

    var folderPath = Folder(folderPath); //文件夹
    var folderList = folderPath.getFiles(); //获取文件列表


    for (f in folderList) { //遍历每个文件或文件夹

        var file = folderList[f]; //当前文件或文件夹
        var fileBoolean = file instanceof File; //返回是文件夹 还是文件 (文件返回true 文件夹返回false)

        $.writeln(file.name + "  " + fileBoolean); //打印到控制台

        if (fileBoolean) { //判断是否是文件

            if (file.name.substr(-4) === ".psd") { //判断是否是psd文件

                $.writeln(decodeURI(file)); //打印到控制台

                open(file); //打开psd 文件
                var logPath = File($.fileName).parent.parent;
                log=new File(logPath.parent+ "/log.log");
                log.open("w", "TEXT", "????");//设置文件的操作模式为写入模式。
                log.writeln(file);
                //执行清理psd原始数据的脚本
                cleanMetadataMain();
                saveClose(app.activeDocument); //保存关闭当前psd


            } else {
                $.writeln("不是psd文件"); //打印到控制台
            }

        } else { //是文件夹 访问子级
            getPsdFileName(file); //递归 
        }


    }
}
pro();