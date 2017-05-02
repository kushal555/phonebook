angular.module('adminApp').factory('contactsFactory', ['$http', '$config', function ($http, $config) {

    return {

        getContactList: function () {
            return $http.get($config.apiBase + 'contacts'); 
        },
    }


}]);