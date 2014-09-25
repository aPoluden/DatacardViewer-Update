/*
   Function: 

   Loads fileupload module, containing ViewDatacardsController controller.
   ViewDatacardsController loads the whole application.
   
   This function belongs to AnguarJS. What we see here is:
   angular - global variable 
   module named datacardsApp 
   and three controllers: DemoFileUploadController; FileDestroyController; 
   ViewDatacardsController. Controllers uses $html interface to connect with 
   Python. Detailed Connections will be provided soon.
   See Also:
      https://github.com/blueimp/jQuery-File-Upload
*/

(function () {
    'use strict';

    var url = '/datacards';

   var app = angular.module('datacardsApp', [
        'blueimp.fileupload'
    ])
    // Template
        app.config([
            '$httpProvider', 'fileUploadProvider',
            function ($httpProvider, fileUploadProvider) {
                delete $httpProvider.defaults.headers.common['X-Requested-With'];
                fileUploadProvider.defaults.redirect = window.location.href.replace(
                    /\/[^\/]*$/,
                    '/cors/result.html?%s'
                );
                angular.extend(fileUploadProvider.defaults, {
                    maxFileSize: 50000000,
                    acceptFileTypes: /(\.|\/)(txt|root)$/i
                });
            }
        ]);
        app.controller('DemoFileUploadController', [
            '$scope', '$http', '$filter', '$window',
            function ($scope, $http) {
                $scope.options = {
                    url: url
                };
                $scope.loadingFiles = true;
                $http.get(url)
                    .then(
                        function (response) {
                            $scope.loadingFiles = false;
                            $scope.queue = response.data.files || [];
                        },
                        function () {
                            $scope.loadingFiles = false;
                        }
                    );
            }
        ]);
        app.controller('FileDestroyController', [
            '$scope', '$http',
            function ($scope, $http) {
                var file = $scope.file,
                    state;
                if (file.url) {
                    file.$state = function () {
                        return state;
                    };
                    file.$destroy = function () {
                        state = 'pending';
                        return $http({
                            url: file.deleteUrl,
                            method: file.deleteType
                        }).then(
                            function () {
                                state = 'resolved';
                                $scope.clear(file);
                            },
                            function () {
                                state = 'rejected';
                            }
                        );
                    };
                } else if (!file.$cancel && !file._index) {
                    file.$cancel = function () {
                        $scope.clear(file);
                    };
                }
            }
        ]);
        app.controller('ViewDatacardsController', [
            '$scope', '$http', '$filter', '$window', '$parse', 
            function ($scope, $http) {
                $scope.refresh = function() {
                    $scope.datacards = [];
                    $scope.total = 0;
                    $http.get(url+"/list")
                    .success(function(data) {
                    if ( angular.isArray(data.files) ) {
                        $scope.datacards = data.files;
                    }
                    else {
                        $scope.datacards = [data.files];
                    }
                    $scope.total = $scope.datacards.length;
                    })
                };
                $scope.get_datacard = function(filename) {
                    $http.get(url+'/'+filename)
                    .success(function(data) {
		        $('.dropdown-menu').parent().removeClass('open');
			$('input:checkbox').attr('checked', false);
                        show_datacard(data);
                    })
                }; //get_detacard
                
	        $scope.remove_datacard = function() {   
	           var file = angular.element('#filename');
		   if (file.text() === '') return;
		   var confirmation = confirm("Sure, to delete datacard : " + file.text() + "?");
		   if (confirmation) {
		       var rootjsFiles = get_rootjsFiles();
		       if (rootjsFiles != undefined) {
		         for (var i = 0; i < rootjsFiles.length; i++) {
		           $http.delete(url+'/'+rootjsFiles[i]).error(function(status) { });
		         }
		       }
	               $http.delete(url+'/'+file.text()).error(function(status) { });  
		       $scope.remove_datacard_table();
		       $scope.refresh();
		   } else {
		       return;
		   }   
	        };
		//remove_datacards
	        $scope.remove_datacards = function() {	  
		  if (allchekced.length === 0) {
		    alert("Select tabeles to delete");
		    return;
		  } else {
		 var confirmation = confirm("Sure, to delete selected datacards : \n" + allchekced + "?");
		    if (confirmation) {
		      var jsondata = angular.toJson({"datacards": allchekced}, false);
		      $http({method: 'POST', data: jsondata, url: '/da'}).
                         success(function(data, status, headers, config) {
                              reloadCheckBox();
			      reloadDropDown();
			      alert(data);
			      $scope.refresh();
                           }).error(function(data, status, headers, config) {
			      reloadCheckBox();
			      reloadDropDown();
                              alert(data);
                           });
		    }
		  }
	        };//remove_datacards
	       
	       $scope.remove_datacard_table = function() {
	         angular.element('.handsontable').empty();
	         angular.element('#filename').empty();
		 reloadDropDown();
	       }//remove_datacard_table
	       
            }//main func
        ]);
}())
