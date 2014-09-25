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
}

// to show single object
function showObject(obj_name, cycle) {
   gFile.ReadObject(obj_name, cycle);
}

// Called from ReadStreamerInfo
function getID(file, bName, callback) {
  var keys = file.fKeys;
  var dir_id;
  var cycle;
  jQuery.grep(key_tree.aNodes, function(obj) {
    cycle = obj.name.substr(obj.name.indexOf(";") + 1, obj.name.length);
    var dirNameWithCycle = bName + obj.name.substr(obj.name.indexOf(";"), obj.name.length);
    if (obj.name === dirNameWithCycle) {	  
      return dir_id = obj.id;
    }   
  });
  callback(bName, cycle, dir_id);
}

function getHistogramPath(aBin, aProcess, aNuissance) {
   var path = datacardShapeMap[aBin][aProcess][2];
   path = path.replace("$CHANNEL", aBin);
   path = path.replace("$PROCESS", aProcess);
   path = path.replace("$MASS", massValue[aProcess]);
   path = path.replace("$SYSTEMATIC", aNuissance);
   return path;
}

function showElement(element) {
   if ($(element).next().is(":hidden")) {
      $(element)
         .toggleClass("ui-accordion-header-active ui-state-active ui-state-default ui-corner-bottom")
         .find("> .ui-icon").toggleClass("ui-icon-triangle-1-e ui-icon-triangle-1-s").end()
         .next().toggleClass("ui-accordion-content-active").slideDown(0);
   }
   $(element)[0].scrollIntoView();
}

function findObject(obj_name) {
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
}

function displayCollection(cont, cycle, c_id) {
   var url = $("#urlToLoad").val();
   $("#status").html("file: " + url + "<br/>");
   JSROOTPainter.addCollectionContents(cont, '#status', c_id);
}

function showCollection(name, cycle, id) {
   gFile.ReadCollection(name, cycle, id);
}

function readTree(tree_name, cycle, node_id) {
   gFile.ReadObject(tree_name, cycle, node_id);
}

function displayObject(obj, cycle, idx) {
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
   JSROOTPainter.drawObject(obj, idx);
   Root.showHistogram(obj.fTitle, idx);
}

function displayThreeObject(obj, cycle, idx) {
   console.log("displayThreeObject<");
   var entryInfo = "<div id='histogram" + idx + "'>\n";
   $("#report").append(entryInfo);
   JSROOTPainter.drawThreeObject(obj, idx); 
   Root.showHistogram(obj.fTitle, idx);
   console.log("displayThreeObject >");
}

function displayMappedObject(obj_name, list_name, offset) {
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
   JSROOTPainter.drawObject(obj, obj_index);
   obj_list.push(obj['fName']);
   obj_index++;
};
