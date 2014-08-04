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
		
        //Template
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
        // Template
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
	             
        // this writen by Andrius 
        app.controller('ViewDatacardsController', [
            '$scope', '$http', '$filter', '$window', '$parse',
	    // This called when User presses Tab#1  
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
		    /*
		     * Asking for the Server to get (...)
		     * The $http service returns a promise object with a success method
		     * function(data) used to register 
		     */
                    $http.get(url+'/'+filename)
                    .success(function(data) {
                        show_datacard(data);
                    })
                }; //get_detacard
                
		// Feature added by Artiom  
	        $scope.remove_datacard = function() {   
	           var file = angular.element('#filename');
		   if (file.text() === '') return;
		   var confirmation = confirm("Sure, to delete datacard: " + file.text());
		   if (confirmation) {
	               $http.delete(url+'/'+file.text()).error(function(status) { });  
		       $scope.remove_datacard_table();
		       $scope.refresh();
		   } 
		   else {
		       return;
		   }
	        };//remove_datacard
	       
	       $scope.remove_datacard_table = function() {
	         angular.element('.handsontable').empty();
	         angular.element('#filename').empty();
	       }//remove_datacard_table
	       
            }//main func
        ]);
}())
