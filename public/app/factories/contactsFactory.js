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

    contactsFactory.getGenderRatio = function() {
        return $http.get($config.apiBase + 'get-gender-ratio');
    };
    contactsFactory.getContact = function(id) {
        return $http.get($config.apiBase + 'contacts/' + id + '/edit');
    };
    contactsFactory.saveContact = function(data) {
        return $http.post($config.apiBase + 'contacts', data);
    };

    contactsFactory.imporFromCsv = function(data) {

        var formData = objectToFormData(data);
        console.log(formData);
        return $http.post($config.apiBase + "import-contacts", formData, { headers: { 'Content-Type': undefined } });
    }

    contactsFactory.updateContact = function(id, data) {
        return $http.put($config.apiBase + 'contact/' + id, data);
    }

    return contactsFactory;
}]);