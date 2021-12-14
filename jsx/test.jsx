//app.displayDialogs = DialogModes.NO;
//$.evalFile(File($.fileName).parent + "/lib/kersBoru_lib.jsx");
// var mainScriptPath = Folder($.fileName).parent;
// //$.evalFile(new File(mainScriptPath + '/ad-to-uxp.jsx'));
// $.evalFile(File($.fileName).parent + "/ad-to-uxp.jsx");
// // var ref = new ActionReference();
// // ref.putProperty(charIDToTypeID('Prpr'), charIDToTypeID("Nm  "));
// // ref.putIndex(charIDToTypeID('Lyr '), 1);
// // var idplacedLayerEditContents = stringIDToTypeID("placedLayerEditContents");
// // var desc211 = new ActionDescriptor();
// // ref.putProperty(charIDToTypeID('Prpr'), charIDToTypeID("Nm  "));
// // ref.putIndex(charIDToTypeID('Lyr '), 1);
// // executeActionGetForUXP(ref);
// var idplacedLayerEditContents = stringIDToTypeID("placedLayerEditContents");
// var desc218 = new ActionDescriptor();
// executeActionForUXP(idplacedLayerEditContents, desc218);
// var layer = app.activeDocument.activeLayer;
// ActionDescriptor.prototype.getFlatType = function( ID )
// {
// 	return getFlatType( this, ID );
// }
// ActionDescriptor.prototype.getFlatType(layer.id)
// var ref = new ActionReference();
// //ref.putProperty(charIDToTypeID('Prpr'), stringIDToTypeID("targetLayers"));
// ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID('Ordn'), charIDToTypeID('Trgt'));
// var a = executeActionGet(ref);
// executeAction(idsetd, desc2082, DialogModes.NO);

if (ExternalObject.AdobeXMPScript == undefined) ExternalObject.AdobeXMPScript = new ExternalObject("lib:AdobeXMPScript");

var xmp = new XMPMeta(activeDocument.xmpMetadata.rawData);

// Begone foul Document Ancestors!

xmp.deleteProperty(XMPConst.NS_PHOTOSHOP, "DocumentAncestors");//TextLayers  DocumentAncestors

app.activeDocument.xmpMetadata.rawData = xmp.serialize();
$.writeln("清理");
//executeActionGetForUXP(ref);
