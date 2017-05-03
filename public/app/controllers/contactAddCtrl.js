angular.module('adminApp').controller('contactAddCtrl', [
    '$scope', 
    'contactsFactory',
    '$state',
    'ngToast',
function($scope,
    contactsFactory,
    $state,
    ngToast) {
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
        if(form){
            contactsFactory.saveContact($scope.contact).then(function(response){
                ngToast.success({content: response.data.message});
                $state.go("dashboard")
            },function(error){
                ngToast.error({content: error.data.message|| "Something went wrong"});
            })
        }
    }

}]);