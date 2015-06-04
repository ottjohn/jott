(function () {

    angular.module('App.Paylocity').factory('PaylocityModel',
    ['$q', '$http', '$timeout', 'PaylocityService', 'PaylocityContracts', 'Validation', PaylocityModel]);

    function PaylocityModel($q, $http, $timeout, PaylocityService, PaylocityContracts, Validation) {

        var serviceName = 'PaylocityModel'; // route to the same origin Web Api controller - root directory

        var PaylocityModelMethods = {

            AddEmployeeBenefitData: AddEmployeeBenefitData,
            ValidateFieldEntry: ValidateFieldEntry

        };

        return PaylocityModelMethods;

        //////////////////////////////////////////////////////////////////////////////////////
        //  Service Calls
        //////////////////////////////////////////////////////////////////////////////////////
        function AddEmployeeBenefitData() {

            var deferred = $q.defer();
            $timeout(AddEmployeeBenefitDataImpl, 0);

            function AddEmployeeBenefitDataImpl() {

                PaylocityModelService.SendRequest(null, 'AddEmployeeBenefitData').then(ShowResult, showError);

            }

            function ShowResult(data) {

                VisitorData = data.data.Visitor.Data;
                deferred.resolve(data.data.Visitor.Message);

            }

            function showError() {

                deferred.reject("Communication failed");

            }

            return deferred.promise;

        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Model Validators -- Cannot do the update at this level. This is just a validator
        //////////////////////////////////////////////////////////////////////////////////////
        function ValidateFieldEntry(ContractEntryField, key, MapToKey, Required, value) {

            return Validation.ValidateFieldEntry(ContractEntryField, key, MapToKey, Required, value);

        }
    }
})();