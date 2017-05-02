angular.module('adminApp').controller('contactAddCtrl', [
    '$scope', 
    'contactsFactory',
function($scope,
    contactsFactory) {
    $scope.pageName = 'Add Contact';
    $scope.btnName = "Add";

    contactsFactory.getContactList().then(function(response){
            console.log(response);
    },function(){

    })
}]);