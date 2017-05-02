angular.module('adminApp').controller('dashboardCtrl', [
    '$scope', 
    'contactsFactory',
function($scope,
    contactsFactory) {
    $scope.pageName = 'Dashboard';

    contactsFactory.getContactList().then(function(response){
            console.log(response);
    },function(){

    })
}]);