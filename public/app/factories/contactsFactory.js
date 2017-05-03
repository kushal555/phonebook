angular.module('adminApp').factory('contactsFactory', ['$http', '$q', '$config', function($http, $q, $config) {
    var contactsFactory = {};

    contactsFactory.getContactList = function(data) {
       return $http({
                method: 'POST',
                url: $config.apiBase + 'get-contacts',
                data: $.param(data),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
    };

    contactsFactory.saveContact = function(data) {
       return $http.post($config.apiBase + 'contacts', data);
    };

    return contactsFactory;
}]);