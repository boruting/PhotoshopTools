var kersBoru = function() {
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
/**
 * 导入连接对象
 * @param w 新的宽
 * @param h 新的高
 * @param qcs 锚点坐标参数 左上:Qcs0 | 上中:Qcs4 |上右:Qcs1| 左中:Qcs7 | 中心:Qcsa |右中:Qcs5 | 左下:Qcs3 | 下中:Qcs6 |下右:Qcs2 
 */
kersBoru.listenerType.modifySmartObject = function(w, h, qcs) {

    var idTrnf = charIDToTypeID("Trnf");
    var desc = new ActionDescriptor();

    if (qcs != undefined) { //是否需要修改锚点

        //===============锚点=====================
        //| 左上:Qcs0 | 上中:Qcs4 |上右:Qcs1 |
        //| 左中:Qcs7 | 中心:Qcsa |右中:Qcs5 |    
        //| 左下:Qcs3 | 下中:Qcs6 |下右:Qcs2 |
        //========================================
        var idFTcs = charIDToTypeID("FTcs");
        var idQCSt = charIDToTypeID("QCSt");
        var idQcs = charIDToTypeID(qcs);
        desc.putEnumerated(idFTcs, idQCSt, idQcs);

    }

    /*修改宽*/
    var idWdth = charIDToTypeID("Wdth");
    var idPrc = charIDToTypeID("#Prc");
    desc.putUnitDouble(idWdth, idPrc, w); //w 新的宽
    /*修改高*/
    var idHght = charIDToTypeID("Hght");
    var idPrc = charIDToTypeID("#Prc");
    desc.putUnitDouble(idHght, idPrc, h); //h 新的高
    executeAction(idTrnf, desc, DialogModes.NO);
}
/**
 * 
 * @param {*} layer 暂时是当前图层
 * @param {*} getType 获取边类型，默认为："boundsNoEffects"，还可以是："bounds"、"boundsNoMask"
 */
kersBoru.layer.getLayerBounds = function(layer,getType) {
    var boundsInfo = {
        x: null,
        y: null,
        w: null,
        h: null,
        right: null,
        bottom: null
    }  
    var classStr = _value(getType, "boundsNoEffects");//"bounds"、"boundsNoEffects"
    var bounds = layer[classStr];

    var reg = /[0-9]*/;
    boundsInfo.x = reg.exec(bounds[0]);
    boundsInfo.y = reg.exec(bounds[1]);
    boundsInfo.right = reg.exec(bounds[2]);
    boundsInfo.bottom = reg.exec(bounds[3]);
    boundsInfo.w = boundsInfo.right - boundsInfo.x;
    boundsInfo.h = boundsInfo.bottom - boundsInfo.y;

    return boundsInfo;

}
var _value = function(value, defaultValue) {
        if (value != undefined) {
            return value;
        } else {
            if (defaultValue != undefined) {
                return defaultValue;
            } else {
                return null;
            }
        }
    }