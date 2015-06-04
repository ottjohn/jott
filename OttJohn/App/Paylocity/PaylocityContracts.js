(function () {

    angular.module('App.Paylocity').factory('PaylocityContracts',
    ['$http', '$timeout', PaylocityContracts]);

    function PaylocityContracts() {

        var serviceName = 'PaylocityContracts'; // route to the same origin Web Api controller - root directory

        var PaylocityContracts = {

            GetEmployeeBenefitsContract: GetEmployeeBenefitsContract,
            GetPersonContract: GetPersonContract,
            GetBenefitContract: GetBenefitContract

        };

        return PaylocityContracts;

        //////////////////////////////////////////////////////////////////////////////////////
        //  Contracts and messages
        //////////////////////////////////////////////////////////////////////////////////////
        //  EmployeeBenefitsContract: Manages the list of beneficiaries
        //////////////////////////////////////////////////////////////////////////////////////
        function GetEmployeeBenefitsContract() {

            var EmployeeBenefitsContract = {

                Beneficiaries: null

            }

            return EmployeeBenefitsContract;

        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  PersonContract: Describes beneficiaries.
        //  This is a sub contract of the Employee benefits contract.
        //////////////////////////////////////////////////////////////////////////////////////
        function GetPersonContract() {

            var PersonContract = {

                FirstName: { Value: '', MapToKey: 'FirstName', Required: true },
                LastName: { Value: '', MapToKey: 'LastName', Required: true },
                IsDependent: { Value: false, MapToKey: null, Required: false },

            }

            return PersonContract;

        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  BenefitContract: Manages benefit descriptions and pay description.
        //  Obviously, this would be populated on the data layer.
        //////////////////////////////////////////////////////////////////////////////////////
        function GetBenefitContract() {

            var BenefitContract = {

                PayDetail: GetPaymentContract(),
                CostOfEmployeeBenefitsPerYear: 1000,
                CostOfDependentEmployeesPerYear: 500,
                DiscountLetter: 'a',
                DiscountPercent: .1

            }

            return BenefitContract;

        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  PaymentContract: sub contact of benefit contract.
        //  Obviously, this would be populated on the data layer.
        //////////////////////////////////////////////////////////////////////////////////////
        function GetPaymentContract() {

            var PaymentContract = {

                BasePay: 2000,
                TotalDeductions: 0.00,
                MagicDiscount: 0.00,
                BiWeeklyPay: 0.00,
                YearlyPay: 0.00

            }

            return PaymentContract;

        }

    }
})();