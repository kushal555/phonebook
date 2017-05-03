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
    'ngMap'
    
    // 'angularSpinner',
]);

App.constant('$config', {
    apiBase: document.location.origin + '/phonebook/public/api/',
});

App.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$locationProvider', '$ocLazyLoadProvider', 'ngToastProvider', function ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider, $ocLazyLoadProvider, ngToastProvider) {

    app.config(['ngToastProvider', function (ngToastProvider) {
        ngToastProvider.configure({
            animation: 'slide', // or 'fade'
            timeout : 2000,
            className : 'alert-'
        });
    }]);

    $stateProvider.state('dashboard', {
        url: "/",
        templateUrl: 'app/views/dashboard.html',
        controller: 'dashboardCtrl',
        data: { bodyClasses: 'sidebar-mini' },
        resolve: {
            loadMyFiles: ['$ocLazyLoad', function ($ocLazyLoad) {
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
            loadMyFiles: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['app/factories/contactsFactory.js', 'app/controllers/contactAddCtrl.js']);
            }]
        }
    });
    $urlRouterProvider.otherwise("/");
    // $locationProvider.html5Mode(true);
}]);

var checkLogin = ['$http', '$q', '$config', '$state', '$rootScope', function ($http, $q, $config, $state, $rootScope) {

    var defer = $q.defer();
    $http.get($config.apiBase + 'checkLogin')
        .then(function (success) {
            $rootScope.user = success.data;
            defer.resolve(success);
        },
        function (error) {
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
    function (
        $scope,
        $state,
        $config,
        $http,
        $rootScope,
        ngDialog,
        Upload
    ) {

        $rootScope.state = $state;
        //Add body class from state if exists
        $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $scope.curState = toState;
            // Set class from routes dta property to body            
            if (angular.isDefined(toState.data) && angular.isDefined(toState.data.bodyClasses)) {
                $scope.bodyClasses = toState.data.bodyClasses;
                return;
            }
        });

        $scope.logout = function () {
            $http.post($config.apiBase + 'logout')
                .then(function (res) {
                    $state.go('login');
                });
        };

        $rootScope.uploadImagePopup = function () {
            return ngDialog.open({
                template: 'app/common/templates/file_upload_popup_tmpl.html',
                className: 'ngdialog-theme-default',
                closeByEscape: false,
                closeByDocument: false,
                width: '40%',
                controller: ['$scope', 'Upload', '$timeout', function ($scope, Upload, $timeout) {

                    $scope.submit = function (croppedDataUrl, picFile) {
                        $scope.file = Upload.dataUrltoBlob(croppedDataUrl, picFile.name);
                        if ($scope.file) {
                            $scope.closeThisDialog($scope.file);
                        }
                    };
                }],
            }).closePromise;
        };
    }]);

App.directive('numbersOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
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

App.directive('disallowSpaces', function () {
    return {
        restrict: 'A',

        link: function ($scope, $element) {
            $element.bind('input', function () {
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