var gFile;
var mFile = new Array();
var obj_list = new Array();
var obj_index = 0;
var last_index = 0;
var function_list = new Array();
var func_list = new Array();
var frame_id = 0;
var random_id = 0;
var source_dir = "static/lib/JSRootIO-2.1/";
var re = /[\/]/;


function loadScript(url, callback) {
   // dynamic script loader using callback
   // (as loading scripts may be asynchronous)
   var script = document.createElement("script");
   script.type = "text/javascript";
   if (script.readyState) { // Internet Explorer specific
      script.onreadystatechange = function(){
         if (script.readyState == "loaded" || script.readyState == "complete"){
            script.onreadystatechange = null;
            callback();
         }
      };
   } else { // Other browsers
      script.onload = function(){
         callback();
      };
   }
   var rnd = Math.floor(Math.random()*80000);
   script.src = url;
   document.getElementsByTagName("head")[0].appendChild(script);
}

function assertPrerequisitesAndRead(){
   if (typeof JSROOTIO == "undefined"){
      // if JSROOTIO is not defined, then dynamically load the required scripts
      loadScript('static/lib/d3.v2.min.js', function(){
         loadScript(source_dir+'jquery.mousewheel.js', function(){
            loadScript(source_dir+'dtree.js', function(){
               loadScript(source_dir+'rawinflate.js', function(){
                  loadScript(source_dir+'JSRootCore.js', function(){
                     loadScript(source_dir+'three.min.js', function(){
                        loadScript(source_dir+'JSRootD3Painter.js', function(){
                           loadScript(source_dir+'JSRootIOEvolution.js', function(){
                              loadScript('static/js/JSRootIO_Overrides.js', function(){
                              });
                           });
                        });
                     });
                  });
               });
            });
         });
      });
   }
}

function readRootFiles(rootFile) {
   console.log("readRootFiles<");
   // Check for browser version 
   var navigator_version = navigator.appVersion;
   if (typeof ActiveXObject == "function") { // Windows
      // detect obsolete browsers
      if ((navigator_version.indexOf("MSIE 8") != -1) || 
          (navigator_version.indexOf("MSIE 7") != -1)) {
         alert("You need at least MS Internet Explorer version 9.0. Note you can also use any other web browser (except Opera)");
         return;
      }
   } else {
      // Safari 5.1.7 on MacOS X doesn't work properly
      if ((navigator_version.indexOf("Windows NT") == -1) &&
          (navigator_version.indexOf("Safari") != -1) &&
          (navigator_version.indexOf("Version/5.1.7") != -1)) {
         alert("There are know issues with Safari 5.1.7 on MacOS X. It may become unresponsive or even hangs. You can use any other web browser (except Opera)");
         return;
      }
   }
   //TODO multiple files
   //Use Object to link which file is used, for which histogram 
   if (rootFile.toString().search(re) != -1) {
      bootstrapDialogDynamic("Warning", "  Current Datacard.txt path to Datacard.root(s) need to be changed. \n "+
        " Datacard.root(s) locates in same directory as Datacard.txt \n" +
	"Current path: " + rootFile);
      return; 
    }
    gFile = null;
    gFile = new JSROOTIO.RootFile("datacards/files/" + rootFile);
 console.log("readRootFiles >");
}

function getHistogramNumber(binProcNuisArr){
   console.log("getHistogramNumber<");
   var index = 0;
   var histoBin = binProcNuisArr[0];
   var histoProc = binProcNuisArr[1];
   var histoNuis = binProcNuisArr[2];
   for (aBin in datacardShapeMap){
      for (aProcess in datacardShapeMap[aBin]){
         var tempNuis = datacardShapeMap[aBin][aProcess].slice(3);
         for (var j = 0; j < tempNuis.length; j++){
            if (aBin == histoBin && aProcess == histoProc && tempNuis[j] == histoNuis){
               return index;
            }
            else{
               index++;
            }
         }
      }
   }
   console.log("getHistogramNumber >");
}

// to show single object
function showObject(obj_name, cycle) {
   console.log("showObject<");
   gFile.ReadObject(obj_name, cycle);
   console.log("showObject >");
}

// Called from ReadStreamerInfo
function readRootContent(file, bName, callback) {
  console.log("readRootContent<");
  var keys = file.fKeys;
  var dir_id;
  var cycle
  jQuery.grep(key_tree.aNodes, function(obj) {
    cycle = obj.name.substr(obj.name.indexOf(";") + 1, obj.name.length);
    var dirNameWithCycle = bName + obj.name.substr(obj.name.indexOf(";"), obj.name.length);
    if (obj.name === dirNameWithCycle) {	  
      return dir_id = obj.id;
    }   
  });
  callback(bin, cycle, dir_id);
  console.log("readRootContent >");
}//readRootContent

// Called by ReadStreamerInfo
function displayListOfKeys(keys) {
  // Here passed all keys and creating nodes with them. Here should be passed one key 
  console.log("displayListOfKeys<");
    JSROOTPainter.displayListOfKeys(keys);
  console.log("displayListOfKeys >");
}

function getHistogramPath(aBin, aProcess, aNuissance) {
   console.log("getHistogramPath<");
   var path = datacardShapeMap[aBin][aProcess][2];
   path = path.replace("$CHANNEL", aBin);
   path = path.replace("$PROCESS", aProcess);
   path = path.replace("$MASS", massValue[aProcess]);
   path = path.replace("$SYSTEMATIC", aNuissance);
   console.log("-----------------------path to histogram------------------------------");
   console.log(path);
   return path;
   console.log("getHistogramPath >");
}

function readHistograms() {
  // all of them Points here
  console.log("readHistograms<");
  for (aBin in datacardShapeMap) {
    for (aProcess in datacardShapeMap[aBin]) {
      var tempNuis = datacardShapeMap[aBin][aProcess].slice(3);
      for (var j = 0; j < tempNuis.length; j++) {
        // TODO parse better datacardShapeMap, get separator from map for nuissance
	gFile.ReadThreeObject(getHistogramPath(aBin, aProcess, tempNuis[j]), '_'+tempNuis[j], 1);
      }
    }
  }
  console.log("readHistograms >");
}

function showElement(element) {
   console.log("showElement<");
   if ($(element).next().is(":hidden")) {
      $(element)
         .toggleClass("ui-accordion-header-active ui-state-active ui-state-default ui-corner-bottom")
         .find("> .ui-icon").toggleClass("ui-icon-triangle-1-e ui-icon-triangle-1-s").end()
         .next().toggleClass("ui-accordion-content-active").slideDown(0);
   }
   $(element)[0].scrollIntoView();
   console.log("showElement >");
}

function findObject(obj_name) {
   console.log("findObject<");
   for (var i in obj_list) {
      if (obj_list[i] == obj_name) {
         var findElement = $('#report').find('#histogram'+i);
         if (findElement.length) {
            var element = findElement[0].previousElementSibling.id;
            showElement('#'+element);
            return true;
         }
      }
   }
   return false;
   console.log("findObject >");
}

function displayCollection(cont, cycle, c_id) {
   console.log("displayCollection<");
   var url = $("#urlToLoad").val();
   $("#status").html("file: " + url + "<br/>");
   JSROOTPainter.addCollectionContents(cont, '#status', c_id);
   console.log("displayCollection >");
}

function showCollection(name, cycle, id) {
   console.log("showCollection<");
   gFile.ReadCollection(name, cycle, id);
   console.log("showCollection >");
}

function readTree(tree_name, cycle, node_id) {
   console.log("readTree<");
   gFile.ReadObject(tree_name, cycle, node_id);
   console.log("readTree >");
}

function displayObject(obj, cycle, idx) {
   console.log("displayObject<");
   if (!obj['_typename'].match(/\bJSROOTIO.TH1/) &&
       !obj['_typename'].match(/\bJSROOTIO.TH2/) &&
       !obj['_typename'].match(/\bJSROOTIO.TH3/) &&
       !obj['_typename'].match(/\bJSROOTIO.TGraph/) &&
       !obj['_typename'].match(/\bRooHist/) &&
       !obj['_typename'].match(/\RooCurve/) &&
       obj['_typename'] != 'JSROOTIO.TCanvas' &&
       obj['_typename'] != 'JSROOTIO.TF1' &&
       obj['_typename'] != 'JSROOTIO.TProfile') {
      if (typeof(checkUserTypes) != 'function' || checkUserTypes(obj) == false)
         return;
   }
   var entryInfo = "<div id='histogram" + idx + "'>\n";
   $("#report").append(entryInfo);
   // draw ?
   JSROOTPainter.drawObject(obj, idx);
   $("#histogram" + idx).hide();
   console.log("displayObject >");
}

/*
 * Function(): displayThreeObject
 * called by JSROOTIO.RootFile.prototype.ReadThreeObject
 * 
 */
function displayThreeObject(obj, cycle, idx) {
   console.log("displayThreeObject<");
   var entryInfo = "<div id='histogram" + idx + "'>\n";
   $("#report").append(entryInfo);
   
   JSROOTPainter.drawThreeObject(obj, idx);
   $("#histogram" + idx).hide();
   console.log("displayThreeObject >");
}

function displayMappedObject(obj_name, list_name, offset) {
   console.log("displayMappedObject<");
   var obj = null;
   for (var i = 0; i < gFile['fObjectMap'].length; ++i) {
      if (gFile['fObjectMap'][i]['obj']['_name'] == obj_name) {
         obj = gFile['fObjectMap'][i]['obj'];
         break;
      }
   }
   if (obj == null) {
      gFile.ReadCollectionElement(list_name, obj_name, 1, offset);
      return;
   }
   if (!obj['_typename'].match(/\bJSROOTIO.TH1/) &&
       !obj['_typename'].match(/\bJSROOTIO.TH2/) &&
       !obj['_typename'].match(/\bJSROOTIO.TH3/) &&
       !obj['_typename'].match(/\bJSROOTIO.TGraph/) &&
       !obj['_typename'].match(/\bRooHist/) &&
       !obj['_typename'].match(/\RooCurve/) &&
       obj['_typename'] != 'JSROOTIO.TCanvas' &&
       obj['_typename'] != 'JSROOTIO.TF1' &&
       obj['_typename'] != 'JSROOTIO.TProfile') {
      if (typeof(checkUserTypes) != 'function' || checkUserTypes(obj) == false)
         return;
   }
   var uid = "uid_accordion_"+(++last_index);
   var entryInfo = "<h5 id=\""+uid+"\"><a> " + obj['fName'] + "</a>&nbsp; </h5>\n";
   entryInfo += "<div id='histogram" + obj_index + "'>\n";
   $("#report").append(entryInfo);
   //draw ?
   JSROOTPainter.drawObject(obj, obj_index);
   obj_list.push(obj['fName']);
   obj_index++;
   console.log("displayMappedObject >");
};
