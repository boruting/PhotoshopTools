/**
 * @author kersBoru
 * @name Photoshop通用库  
 * @description 将一些常用的函数放到这里
 * @weixin JackdawTing
 * @date 2021-01-08 modifySmartObject 函数添加了 宽高约束 (功能未开启)  
 * @date 2021-01-09 修改了获取边界信息的函数   getLayerBounds  直接读取.value    
 * @date 2021-05-07 添加替换链接对象 函数
 * @date 2021-05-08 添加 画布大小选区函数 和 分布对齐方式函数
 * @date 2021-05-11 添加 还原历史记录到打开时
 * @date 2021-10-20 添加 表格数据 函数
 *                  修改 getLayerBounds 添加了中心点(center)
 */
var kersBoru = function () {
    return this;
}

kersBoru.listenerType = {}; //监听脚本类型
kersBoru.layer = {}; //图层相关
kersBoru.doc = {};//psd文档相关
kersBoru.excel = {};//表格
/**
 * 
 * @param {*} type 保存的类型 如:png
 * @param {*} path 保存文件的位置
 * @param {*} imgName 保存文件的名字
 */
kersBoru.doc.saveDoc = function (type, path, imgName) {
    if (type === "png") {
        var saveOption = new ExportOptionsSaveForWeb();
        saveOption.format = SaveDocumentType.PNG;
        saveOption.PNG8 = false;
        var folder = new Folder(path);
        if (!folder.exists) {
            // alert("这里是folder.exists ");					//创建文件夹
            folder.create();
        }
        var outfile = new File(decodeURI(path + "/") + imgName + "." + type); //保存图片到

        app.activeDocument.exportDocument(outfile, ExportType.SAVEFORWEB, saveOption);

    }

}
/**
 * 旋转角度 变形工具 锚点坐标的
 * @param {*} x //坐标x
 * @param {*} y //坐标y
 * @param {*} angle //角度
 */
kersBoru.listenerType.rotationAngle = function (x, y, angle) {

    var idTrnf = charIDToTypeID("Trnf");//变形工具(transform)
    var desc = new ActionDescriptor();//动作描述符
    var descPstn = new ActionDescriptor();//位置动作描述符
    var idFTcs = charIDToTypeID("FTcs");
    var idQCSt = charIDToTypeID("QCSt");
    var idQcsi = charIDToTypeID("Qcsi");
    desc.putEnumerated(idFTcs, idQCSt, idQcsi);

    var idPstn = charIDToTypeID("Pstn");//位置(position)
    descPstn.putUnitDouble(charIDToTypeID("Hrzn"), charIDToTypeID("#Pxl"), x);//水平坐标
    descPstn.putUnitDouble(charIDToTypeID("Vrtc"), charIDToTypeID("#Pxl"), y);//垂直坐标
    var idPnt = charIDToTypeID("Pnt ");//锚点
    desc.putObject(idPstn, idPnt, descPstn);

    var idAngl = charIDToTypeID("Angl");
    var idAng = charIDToTypeID("#Ang");
    desc.putUnitDouble(idAngl, idAng, angle);

    executeAction(idTrnf, desc, DialogModes.NO);
}
/**
* 还原历史记录到打开时
*/
kersBoru.listenerType.returnRecords = function () {
    var idslct = charIDToTypeID("slct");
    var desc326 = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var ref97 = new ActionReference();
    var idSnpS = charIDToTypeID("SnpS");
    var docName = app.activeDocument.name;//获取当前文档名字
    ref97.putName(idSnpS, docName);
    desc326.putReference(idnull, ref97);
    executeAction(idslct, desc326, DialogModes.NO);
}
/**
 * 导入连接对象
 * @param pat psd文件全路径 包括文件名和后缀
 */
kersBoru.listenerType.importLnkd = function (pat) {

    var idPlc = charIDToTypeID("Plc ");
    var desc634 = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    desc634.putPath(idnull, new File(pat)); //这里应该是路径加获取到到名字 

    var idLnkd = charIDToTypeID("Lnkd"); //定义为连接对象
    desc634.putBoolean(idLnkd, true);
    executeAction(idPlc, desc634, DialogModes.NO);

}
/**
 * 替换连接对象
 * @param pat psd文件全路径 包括文件名和后缀
 */
kersBoru.listenerType.placedLayerReplaceContents = function (pat) {
    var idplacedLayerReplaceContents = stringIDToTypeID("placedLayerReplaceContents");
    var desc = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    desc.putPath(idnull, new File(pat));
    executeAction(idplacedLayerReplaceContents, desc, DialogModes.NO);
}
/**
 * 修改图层大小
 * @param w 新的宽
 * @param h 新的高
 * @param qcs 锚点坐标参数 左上:Qcs0 | 上中:Qcs4 |上右:Qcs1| 左中:Qcs7 | 中心:Qcsa |右中:Qcs5 | 左下:Qcs3 | 下中:Qcs6 |下右:Qcs2 
 */
kersBoru.listenerType.modifyLayerSize = function (w, h, qcs) {

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

    //var idLnkd = charIDToTypeID( "Lnkd" );//宽高约束
    //desc.putBoolean( idLnkd, true );

    executeAction(idTrnf, desc, DialogModes.NO);
}
/**
 * 移动智能对象     
 * 这个移动等同与键盘方向键 (智能对象图层的选区范围内图像是 鼠标无法单独移动的)
 * @param x 向x方向移动 多少
 * @param y 向y方向移动 多少
 */
kersBoru.listenerType.selectionMove = function (x, y) {
    var ref = new ActionReference();
    var desc = new ActionDescriptor();
    var desc_ = new ActionDescriptor();

    idcut = charIDToTypeID("cut ");
    var idnull = charIDToTypeID("null");
    ref.putProperty(charIDToTypeID("Chnl"), charIDToTypeID("fsel"));
    desc.putReference(idnull, ref);

    var idT = charIDToTypeID("T   ");
    var idOfst = charIDToTypeID("Ofst");
    desc_.putUnitDouble(charIDToTypeID("Hrzn"), charIDToTypeID("#Pxl"), x); //移动的到x坐标
    desc_.putUnitDouble(charIDToTypeID("Vrtc"), charIDToTypeID("#Pxl"), y); //移动的到y坐标
    desc.putObject(idT, idOfst, desc_);
    executeAction(idcut, desc, DialogModes.NO);

}
/**
 * 分布对齐方式
 * @param {*} adType 对齐方式 
 *                   [“AdLf”:左对齐],[“AdCH”:水平居中对齐],[“AdRg”:右对齐],[“AdTp”:顶对齐],[“AdBt”:底对齐]       
 */
kersBoru.listenerType.alignDistribute = function (adType) {
    var idAlgn = charIDToTypeID("Algn");
    var desc = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var ref = new ActionReference();
    var idLyr = charIDToTypeID("Lyr ");
    var idOrdn = charIDToTypeID("Ordn");
    var idTrgt = charIDToTypeID("Trgt");
    ref.putEnumerated(idLyr, idOrdn, idTrgt);
    desc.putReference(idnull, ref);
    var idUsng = charIDToTypeID("Usng");//使用(using)
    var idADSt = charIDToTypeID("ADSt");//对齐分布选择器(alignDistributeSelector)

    //[“AdCV”:ADSCentersV]会居中   [“AdHr”:ADSHorizontal] 会顶对齐    [“AdVr”:ADSVertical] 会顶对齐
    //[“AdLf”:ADSLefts]    左对齐
    //[“AdCH”:ADSCentersH]    水平居中对齐
    //[“AdRg”:ADSRights]  右对齐
    //[“AdTp”:ADSTops]    顶对齐
    //[“AdBt”:ADSBottoms]    底对齐
    //var idAdType= charIDToTypeID("AdCV");//对齐方式
    //var idAdSV = charIDToTypeID( "AdSV" );//垂直分布
    //var idAdSH = charIDToTypeID( "AdSH" );//水平分布

    desc.putEnumerated(idUsng, idADSt, charIDToTypeID(adType));
    //var idalignToCanvas = stringIDToTypeID("alignToCanvas");
    //desc.putBoolean( idalignToCanvas, true );
    executeAction(idAlgn, desc, DialogModes.NO);
}
/**
 * 创建画布选区
 * @param {*} type 选区 ["Al  ":创建] 还是 ["None":取消]
 */
kersBoru.listenerType.canvasConstituency = function (type) {

    var idsetd = charIDToTypeID("setd");
    var desc = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var ref = new ActionReference();
    var idChnl = charIDToTypeID("Chnl");
    var idfsel = charIDToTypeID("fsel");
    ref.putProperty(idChnl, idfsel);
    desc.putReference(idnull, ref);
    var idT = charIDToTypeID("T   ");
    var idOrdn = charIDToTypeID("Ordn");
    //var idAl = charIDToTypeID("Al  ");
    desc.putEnumerated(idT, idOrdn, charIDToTypeID(type));
    executeAction(idsetd, desc, DialogModes.NO);
}
/**
 * 
 * @param {*} layer 暂时是当前图层
 * @param {*} getType 获取边类型，默认为："boundsNoEffects"，还可以是："bounds"、"boundsNoMask"
 */
kersBoru.layer.getLayerBounds = function (layer, getType) {
    var boundsInfo = {
        x: null,
        y: null,
        w: null,
        h: null,
        right: null,
        bottom: null,
        center: {
            x: null,
            y: null
        }
    }
    var classStr = _value(getType, "boundsNoEffects"); //"bounds"、"boundsNoEffects"
    var bounds = layer[classStr];

    //var reg = /[0-9]*/;
    boundsInfo.x = bounds[0].value;//reg.exec(DOmBounds[0])[0]
    boundsInfo.y = bounds[1].value;
    boundsInfo.right = bounds[2].value;
    boundsInfo.bottom = bounds[3].value;
    boundsInfo.w = boundsInfo.right - boundsInfo.x;
    boundsInfo.h = boundsInfo.bottom - boundsInfo.y;

    boundsInfo.center.x = boundsInfo.x + (boundsInfo.w / 2);
    boundsInfo.center.y = boundsInfo.y + (boundsInfo.h / 2);
    
    return boundsInfo;

}
var _value = function (value, defaultValue) {
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
//===========================================
/**
 * 判断是否是画板
 * @param {*} id 图层id
 */
var isArtBoard = function (id) {
    var ob = {};
    var ref = new ActionReference();
    ref.putProperty(charIDToTypeID("Prpr"), stringIDToTypeID("artboardEnabled"));
    //targetReference(ref, target, "layer"); //"contentLayer"
    var typeID = stringIDToTypeID("layer");
    ref.putIdentifier(typeID, id);
    var layerDesc = executeActionGet(ref);
    //Kinase.layer.get_XXX_Objcet(targetReference, target, "artboardEnabled", "Lyr ");

    var key = layerDesc.getKey(0);
    var obType = layerDesc.getType(key);
    var obValue = null;
    obValue = layerDesc.getBoolean(key);
    //var name = typeIDToStringID(key);
    ob[typeIDToStringID(key)] = {
        value: obValue,
        type: obType.toString()
    };
    return ob;
    $.writeln(ob.artboardEnabled.value);
}


/**
 * 表格--表格数据
 * @param {*} data 
 * @param {*} opts 
 * @returns 
 */
kersBoru.excel.sheet_from_array_of_arrays = function (data, opts) {
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
function datenum(v, date1904) {
    if (date1904) v += 1462;
    var epoch = Date.parse(v);
    return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}