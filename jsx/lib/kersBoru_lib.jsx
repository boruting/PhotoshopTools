var Kinase = function() {
    return this;
}

kersBoru.listenerType = {};
/**
 * 导入连接对象
 * @param pat psd文件全路径 包括文件名和后缀
 */
kersBoru.listenerType.importLnkd = function(pat) {

    var idPlc = charIDToTypeID("Plc ");
    var desc634 = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    desc634.putPath(idnull, new File(pat)); //这里应该是路径加获取到到名字 

    var idLnkd = charIDToTypeID("Lnkd"); //定义为连接对象
    desc634.putBoolean(idLnkd, true);
    executeAction(idPlc, desc634, DialogModes.NO);

}