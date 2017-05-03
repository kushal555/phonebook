angular.module('adminApp').controller('dashboardCtrl', [
    '$scope',
    'contactsFactory',
    'DTOptionsBuilder',
    'DTColumnBuilder',
    '$compile',
    'DTColumnDefBuilder',
    function ($scope,
        contactsFactory,
        DTOptionsBuilder,
        DTColumnBuilder,
        $compile,
        DTColumnDefBuilder) {


        $scope.pageName = 'Dashboard';
        $scope.dtInstance = {};

        $scope.createdRow = function (row, data, dataIndex) {
            $compile(angular.element(row).contents())($scope);
        };

        $scope.reloadData = function () {
            $scope.dtInstance.rerender();
        };

        $scope.contactAction = function (data, type, full) {
            var del = "<a title='Delete' href='javascript:void(0);' ng-click='deleteRow(" + full.id + ")' ><i class='fa fa-trash'></i></a>";
            return del;
        }


        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withDataProp('data')
            .withOption('processing', true)
            .withOption('serverSide', true)
            .withOption('createdRow', $scope.createdRow)
            .withPaginationType('simple_numbers')
            .withDOM('Alfrtip')
            .withOption('scrollX', 500)
             .withScroller()
            .withOption('deferRender', true)
        // Do not forget to add the scorllY option!!!
            .withOption('scrollY', 200)
            .withOption('rowCallback', rowCallback)
            .withOption('order', [0, 'desc'])
            .withOption('searchable', true)
            .withOption('ajax', function (data, callback, settings) {
                contactsFactory.getContactList(data).then(function (res) {
                    $scope.contacts = {};
                    callback(res.data);
                })
            });
        

        $scope.dtColumns = [];

        $scope.dtColumns.push(
            DTColumnBuilder.newColumn('name').withTitle("Contact Name").withOption('visible', true)
        );

        $scope.getDetailOfContact= function(data){
            console.log(data);
        }

        function rowCallback(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            // Unbind first in order to avoid any duplicate handler (see https://github.com/l-lin/angular-datatables/issues/87)
            $('td', nRow).unbind('click');
            $('td', nRow).bind('click', function () {
                $scope.$apply(function () {
                    $scope.getDetailOfContact(aData);
                });
            });
            return nRow;
        }

    }]);