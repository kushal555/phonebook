angular.module('adminApp').controller('contactEditCtrl', [
    '$scope',
    'contactsFactory',
    '$state',
    'ngToast',
    '$stateParams',
    function($scope,
        contactsFactory,
        $state,
        ngToast,
        $stateParams
    ) {
        $scope.pageName = 'Edit Contact';
        $scope.btnName = "Update";
        $scope.number_types = [{ label: 'Select your number type', value: null }, { value: 'mobile', label: 'Mobile' },
            { value: 'office', label: 'Office' },
            { value: 'home', label: 'Home' }
        ];
        $scope.contact = {
            phone_numbers: [{ number_type: null }],
            home_address: "Ahmedabad, India"
        }



        contactsFactory.getContact($stateParams.id).then(function(response) {
            console.log(response.data.contact);
            $scope.contact = response.data.contact;
        });


        $scope.removecontactNumber = function($index) {
            $scope.contact.phone_numbers_delete = $scope.contact.phone_numbers_delete || [];
            if ($scope.contact.phone_numbers[$index].id) {
                $scope.contact.phone_numbers_delete.push($scope.contact.phone_numbers[$index].id);
            }

            $scope.contact.phone_numbers.splice($index, 1);
        }

        $scope.addMoreNumber = function() {
            $scope.contact.phone_numbers.push({ number_type: null });
        };

        $scope.submitContact = function(form) {
            if (form) {
                $scope.contact.phone_numbers_delete = $scope.contact.phone_numbers_delete || [];
                contactsFactory.updateContact($stateParams.id, $scope.contact).then(function(response) {
                    ngToast.success({ content: response.data.message });
                    $state.go("dashboard")
                }, function(error) {
                    ngToast.error({ content: error.data.message || "Something went wrong" });
                })
            }
        }

    }
]);