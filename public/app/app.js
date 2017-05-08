var App = angular.module("adminApp", [
    'ngRoute',
    'ui.router',
    'oc.lazyLoad',
    'datatables',
    'datatables.scroller',
    'datatables.buttons',
    'ngTextTruncate',
    'ngFileUpload',
    'ngDialog',
    'ngImgCrop',
    'ngSanitize',
    'ngToast',
    'datatables.bootstrap',
    'datatables.colvis',
    'ngIntlTelInput',
    'ngMap',
    'chart.js',
    'ezfb'

    // 'angularSpinner',
]);

App.constant('$config', {
    apiBase: document.location.origin + '/phonebook/public/api/',
});

App.config(['$stateProvider',
    '$urlRouterProvider',
    '$httpProvider',
    '$locationProvider',
    '$ocLazyLoadProvider',
    'ngToastProvider',
    'ezfbProvider',
    function($stateProvider,
        $urlRouterProvider,
        $httpProvider,
        $locationProvider,
        $ocLazyLoadProvider,
        ngToastProvider,
        ezfbProvider) {

        app.config(['ngToastProvider', function(ngToastProvider) {
            ngToastProvider.configure({
                animation: 'slide', // or 'fade'
                timeout: 2000,
                className: 'alert-'
            });
        }]);

        ezfbProvider.setInitParams({
            // This is my FB app id for plunker demo app
            appId: '1441506302758635',

            // Module default is `v2.6`.
            // If you want to use Facebook platform `v2.3`, you'll have to add the following parameter.
            // https://developers.facebook.com/docs/javascript/reference/FB.init
            version: 'v2.9'
        });

        $stateProvider.state('dashboard', {
                url: "/",
                templateUrl: 'app/views/dashboard.html',
                controller: 'dashboardCtrl',
                data: { bodyClasses: 'sidebar-mini' },
                resolve: {
                    loadMyFiles: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load(['app/factories/contactsFactory.js', 'app/controllers/dashboardCtrl.js']);
                    }]
                }
            })
            .state('add_contact', {
                url: "/add-contact",
                templateUrl: 'app/views/add-cotnact.html',
                controller: 'contactAddCtrl',
                data: { bodyClasses: 'sidebar-mini' },
                resolve: {
                    loadMyFiles: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load(['app/factories/contactsFactory.js', 'app/controllers/contactAddCtrl.js']);
                    }]
                }
            }).state('edit_contact', {
                url: "/edit-contact/:id",
                templateUrl: 'app/views/add-cotnact.html',
                controller: 'contactEditCtrl',
                data: { bodyClasses: 'sidebar-mini' },
                resolve: {
                    loadMyFiles: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load(['app/factories/contactsFactory.js', 'app/controllers/contactEditCtrl.js']);
                    }]

                }
            });
        $urlRouterProvider.otherwise("/");
        // $locationProvider.html5Mode(true);
    }
]);

App.run(['ezfb', function(ezfb) {
    ezfb.init({
        // This is my FB app id for plunker demo app
        appId: '1441506302758635',
        version: 'V2.9'
    });
}]);

var checkLogin = ['$http', '$q', '$config', '$state', '$rootScope', function($http, $q, $config, $state, $rootScope) {

    var defer = $q.defer();
    $http.get($config.apiBase + 'checkLogin')
        .then(function(success) {
                $rootScope.user = success.data;
                defer.resolve(success);
            },
            function(error) {
                $state.go('login');
                defer.reject(error);
            });
    return defer.promise;
}];


App.controller('rootCtrl', [
    '$scope',
    '$state',
    '$config',
    '$http',
    '$rootScope',
    'ngDialog',
    'Upload',
    'ezfb',
    '$window',
    '$location',
    function(
        $scope,
        $state,
        $config,
        $http,
        $rootScope,
        ngDialog,
        Upload,
        ezfb,
        $window, $location
    ) {

        $rootScope.state = $state;
        //Add body class from state if exists
        $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            $scope.curState = toState;
            // Set class from routes dta property to body            
            if (angular.isDefined(toState.data) && angular.isDefined(toState.data.bodyClasses)) {
                $scope.bodyClasses = toState.data.bodyClasses;
                return;
            }
        });


        updateLoginStatus(updateApiMe);

        $scope.login = function() {
            /**
             * Calling FB.login with required permissions specified
             * https://developers.facebook.com/docs/reference/javascript/FB.login/v2.0
             */
            ezfb.login(function(res) {
                /**
                 * no manual $scope.$apply, I got that handled
                 */
                if (res.authResponse) {
                    updateLoginStatus(updateApiMe);
                }
            }, { scope: 'email,user_likes' });
        };

        $scope.logout = function() {
            /**
             * Calling FB.logout
             * https://developers.facebook.com/docs/reference/javascript/FB.logout
             */
            ezfb.logout(function() {
                updateLoginStatus(updateApiMe);
            });
        };

        $scope.share = function() {
            ezfb.ui({
                    method: 'feed',
                    name: 'angular-easyfb API demo',
                    picture: 'http://plnkr.co/img/plunker.png',
                    link: 'http://plnkr.co/edit/qclqht?p=preview',
                    description: 'angular-easyfb is an AngularJS module wrapping Facebook SDK.' +
                        ' Facebook integration in AngularJS made easy!' +
                        ' Please try it and feel free to give feedbacks.'
                },
                function(res) {
                    // res: FB.ui response
                }
            );
        };

        /**
         * Update api('/me') result
         */
        function updateApiMe() {
            ezfb.api('/me', function(res) {
                $scope.apiMe = res;
            });
        }

        $scope.getContacts = function() {
            ezfb.api('me/friends?fields=id,name', function(res) {
                $scope.friend_list = res;
                console.log(res);
            })
        };

        /**
         * Update loginStatus result
         */
        function updateLoginStatus(more) {
            ezfb.getLoginStatus(function(res) {
                $scope.loginStatus = res;

                (more || angular.noop)();
            });
        }


        ezfb.getLoginStatus(function(res) {
            $scope.loginStatus = res;

            //(more || angular.noop)();
        });

        /**
         * Origin: FB.api
         */
        ezfb.api('/me', function(res) {
            $scope.apiMe = res;
        });

        $scope.logoutFB = function() {
            $http.post($config.apiBase + 'logout')
                .then(function(res) {
                    $state.go('login');
                });
        };

        $rootScope.uploadImagePopup = function() {
            return ngDialog.open({
                template: 'app/common/templates/file_upload_popup_tmpl.html',
                className: 'ngdialog-theme-default',
                closeByEscape: false,
                closeByDocument: false,
                width: '40%',
                controller: ['$scope', 'Upload', '$timeout', function($scope, Upload, $timeout) {

                    $scope.submit = function(croppedDataUrl, picFile) {
                        $scope.file = Upload.dataUrltoBlob(croppedDataUrl, picFile.name);
                        if ($scope.file) {
                            $scope.closeThisDialog($scope.file);
                        }
                    };
                }],
            }).closePromise;
        };
    }
]);

App.directive('numbersOnly', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});

App.directive('disallowSpaces', function() {
    return {
        restrict: 'A',

        link: function($scope, $element) {
            $element.bind('input', function() {
                $(this).val($(this).val().replace(/ /g, ''));
            });
        }
    };
});

App.directive('convertToNumber', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function(val) {
                return val != null ? parseInt(val, 10) : null;
            });
            ngModel.$formatters.push(function(val) {
                return val != null ? '' + val : null;
            });
        }
    };
});


App.directive('googleplace', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, model) {
            var options = {
                types: []
            };
            scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

            google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
                scope.$apply(function() {
                    model.$setViewValue(element.val());
                });
            });
        }
    };
});

App.directive('fileInput', ['$parse', function($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attributes) {
            element.bind('change', function() {
                $parse(attributes.fileInput)
                    .assign(scope, element[0].files)
                scope.$apply()
            });
        }
    };
}]);

App.directive('validFile', function() {
    return {
        require: 'ngModel',
        link: function(scope, el, attrs, ngModel) {

            ngModel.$render = function() {
                if (el[0].files && el[0].files.length) {
                    ngModel.$setViewValue(el[0].files[0]);
                    //scope.upload();
                }
            };

            el.bind('change', function() {
                scope.$apply(function() {
                    ngModel.$render();
                });
            });

        }
    }
});


App.directive('fileModel', ['$parse', function($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function() {
                scope.$apply(function() {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);