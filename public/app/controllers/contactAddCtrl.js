angular.module('adminApp').controller('contactAddCtrl', [
    '$scope', 
    'contactsFactory',
function($scope,
    contactsFactory) {
    $scope.pageName = 'Add Contact';
    $scope.btnName = "Add";
    $scope.number_types = [{label:'Select your number type',value : null},{value :'mobile', label: 'Mobile'},
                            {value:'office',label:'Office'},
                            {value:'home',label:'Home'}];
    $scope.contact = {
        phone_numbers : [{number_type : null}]
    }
    
    $scope.removecontactNumber = function($index){
        $scope.contact.phone_numbers.splice($index,1);
    }

    $scope.addMoreNumber = function() {
        $scope.contact.phone_numbers.push({number_type : null});
    };

    $scope.submitContact = function(form){
        if(form.$valid){
            console.log($scope.contact);

            contactsFactory.saveContact($scope.contact).then(function(response){
                
            },function(error){

            })
        }
    }

}]);