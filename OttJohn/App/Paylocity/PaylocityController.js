(function () {

    angular.module('App.Paylocity').controller('PaylocityController',
    ['$q', '$timeout', '$location', 'PaylocityService', 'PaylocityContracts', 'PaylocityModel', '$rootScope', 'AppState', PaylocityController]);

    function PaylocityController($q, $timeout, $location, PaylocityService, PaylocityContracts, PaylocityModel, $rootScope, AppState) {

        var Paylocity = this;
        var scope = $rootScope.$new();
        Paylocity.Message;
        Paylocity.Beneficiaries;
        Paylocity.SelectedBeneficiary;
        Paylocity.Person;
        Paylocity.PayBenefitsPackage;

        //////////////////////////////////////////////////////////////////////////////////////
        //  Controller initialization
        //////////////////////////////////////////////////////////////////////////////////////
        Paylocity.Init = function () {

            Paylocity.Message = "Please enter employee's name.";
            Paylocity.HydrateEmployeeContracts();
            Paylocity.PersonInputs().FirstName.select();

        }

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //  JQuery Accessors
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        Paylocity.PersonInputs = function () {

            var PersonInputs = {

                FirstName: $("#txtFirstName"),
                LastName: $("#txtLastName")
            }

            return PersonInputs;

        }

        Paylocity.Buttons = function () {

            var Buttons = {

                Add: $("#btnAdd"),
                Remove: $("#btnRemove")

            }

            return Buttons;
            
        }

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //  Button Actions
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        Paylocity.RemovePerson = function () {

            Paylocity.RemovePersonFromBeneficiaries();
            Paylocity.PersonInputs().FirstName.select();

        }

        Paylocity.AddPerson = function () {

            if (Paylocity.ValidateFields() != "") Paylocity.LocateElement();
            Paylocity.PersonInputs().FirstName.select();

        }

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //  Benefit Calculations
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //  Recalculate benefits
        //
        //  Works with payment sub contract of the BenefitsPackageContract, which simply 
        //  describles base pay and deductions. Since the calculation here is so simply, 
        //  I did not split it out into subparts.
        //////////////////////////////////////////////////////////////////////////////////////
        Paylocity.RecalcBenefits = function () {

            var TotalDiscount = 0;
            Paylocity.PayBenefitsPackage.PayDetail.TotalDeductions = 0;
            Paylocity.PayBenefitsPackage.PayDetail.MagicDiscount = 0;

            iLen = Paylocity.Beneficiaries.Beneficiaries.length;
            for (var i = 0; i < iLen; i++) {

                var CoverageCost = 0;
                var MagicLetterRate = 1;
                var Person = Paylocity.Beneficiaries.Beneficiaries[i];

                if (Person.FirstName.Value.substring(0,1).toLowerCase() == Paylocity.PayBenefitsPackage.DiscountLetter) MagicLetterRate -= Paylocity.PayBenefitsPackage.DiscountPercent;

                if (!Person.IsDependent.Value) {

                    CoverageCost = Paylocity.PayBenefitsPackage.CostOfEmployeeBenefitsPerYear / 26;

                } else {

                    CoverageCost = Paylocity.PayBenefitsPackage.CostOfDependentEmployeesPerYear / 26;

                }

                Paylocity.PayBenefitsPackage.PayDetail.TotalDeductions += MagicLetterRate * CoverageCost;
                Paylocity.PayBenefitsPackage.PayDetail.MagicDiscount += (1 - MagicLetterRate) * CoverageCost;
                Paylocity.PayBenefitsPackage.PayDetail.BiWeeklyPay = Paylocity.PayBenefitsPackage.PayDetail.BasePay - Paylocity.PayBenefitsPackage.PayDetail.TotalDeductions;
                Paylocity.PayBenefitsPackage.PayDetail.YearlyPay = 26 * (Paylocity.PayBenefitsPackage.PayDetail.BasePay - Paylocity.PayBenefitsPackage.PayDetail.TotalDeductions);

            }
        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Remove dependent
        //
        //  Simple check for dependent, loop over beneficiaries, and remove the unwanted 
        //  node.
        //////////////////////////////////////////////////////////////////////////////////////
        Paylocity.RemovePersonFromBeneficiaries = function () {
            
            if (Paylocity.SelectedBeneficiary.IsDependent.Value) {

                iLen = Paylocity.Beneficiaries.Beneficiaries.length;
                for (var i = 0; i < iLen; i++) {

                    var Person = Paylocity.Beneficiaries.Beneficiaries[i];
                    if (Person.FirstName.Value.toLowerCase() == Paylocity.SelectedBeneficiary.FirstName.Value.toLowerCase()
                        && Person.LastName.Value.toLowerCase() == Paylocity.SelectedBeneficiary.LastName.Value.toLowerCase()) {

                        Paylocity.Beneficiaries.Beneficiaries.splice(i, 1);
                        Paylocity.SelectedBeneficiary = Paylocity.Beneficiaries.Beneficiaries[0];
                        break;
                    }
                }

                Paylocity.RecalcBenefits();

            } else {

                alert("You cannot remove the employee. If you need to remove someone, please select a dependent.");
                Paylocity.PersonInputs().FirstName.select();

            }
        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Add dependent
        //
        //  Simple check existence of beneficiaries, create if necessary, add person to 
        //  beneficiary list.
        //////////////////////////////////////////////////////////////////////////////////////
        Paylocity.AddPersonToBeneficiaries = function () {

            var iLen = 0;
            if (Paylocity.Beneficiaries.Beneficiaries != null)
                iLen = Paylocity.Beneficiaries.Beneficiaries.length;
            else
                Paylocity.Beneficiaries.Beneficiaries = new Array();

            Paylocity.Beneficiaries.Beneficiaries[iLen] = Paylocity.Person;
            Paylocity.SelectedBeneficiary = Paylocity.Beneficiaries.Beneficiaries[iLen];
            Paylocity.Person = PaylocityContracts.GetPersonContract();
            Paylocity.Person.IsDependent.Value = true;
            Paylocity.RecalcBenefits();

            Paylocity.EnableButtons(new Array("Remove"), true);
            Paylocity.CurrentKey = "FirstName";
            Paylocity.Message = "Continue to add names of dependents"

        }

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //  Validation
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //  Check Validation
        //
        //  Method entered upon the user pressing either the enter or tab key. If 
        //  either is depressed, then validation is performed.
        //////////////////////////////////////////////////////////////////////////////////////
        Paylocity.CheckValidation = function (event) {

            if (event.keyCode == 13 || event.keyCode == 9) {

                Paylocity.ValidateFields();
                return false;

            }
        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Validation of fields 
        //
        //  In many cases, what the user enters can be validated against regular expressions.
        //  This validator simply passes the validation effort to my model, which, then, 
        //  passes it along to a helper in the form of an Angular service.
        //  
        //  If element items are valid then the person is added to the beneficiary list
        //////////////////////////////////////////////////////////////////////////////////////
        Paylocity.ValidateFields = function () {

            var isValid = "";

            for (var key in Paylocity.Person) {

                Paylocity.CurrentKey = key;
                if (Paylocity.Person[key].Required)
                    isValid = PaylocityModel.ValidateFieldEntry(Paylocity.Person, key, Paylocity.Person[key].MapToKey, Paylocity.Person[key].Required, Paylocity.Person[key].Value);

                if (isValid != "") {

                    break;

                } else {

                    Paylocity.CurrentKey = "";

                }
            }

            if (isValid != "") {

                Paylocity.Message = isValid;

            } else {

                Paylocity.Message = "";
                Paylocity.AddPersonToBeneficiaries();

            }

            return isValid;
        }

        Paylocity.GiveDirection = function (ElementId) {

            scope.$apply();

        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Element location
        //
        //  Simple function that works with the validator to back up the cursor in case
        //  an element needs to be revisited due to an error.
        //////////////////////////////////////////////////////////////////////////////////////
        Paylocity.LocateElement = function (Element) {

            if (!Paylocity.CurrentKey || Paylocity.CurrentKey == null) {

                //Paylocity.GiveDirection();
                $(Element).select();

            } else {

                var CurrentKey = Paylocity.CurrentKey;
                Paylocity.CurrentKey = null;
                Paylocity.PersonInputs()[CurrentKey].select();

            }
        }

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //  Contract Management
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        Paylocity.HydrateEmployeeContracts = function () {

            Paylocity.Person = PaylocityContracts.GetPersonContract();
            Paylocity.PayBenefitsPackage = PaylocityContracts.GetBenefitContract();
            Paylocity.Beneficiaries = PaylocityContracts.GetEmployeeBenefitsContract();

        }

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //  Navigation
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        Paylocity.EnableButtons = function (ButtonList, Enable) {

            var iLen = ButtonList.length;
            for (var i = 0; i < iLen; i++) {

                if (Enable)
                    Paylocity.Buttons()[ButtonList[i]].removeAttr("disabled");
                else
                    Paylocity.Buttons()[ButtonList[i]].attr("disabled", true);
            }
        }

        Paylocity.ReturnToMainScreen = function () {

            $location.url("/home");

        }

        Paylocity.RegisterRoute = function (CallingRoute) {

            //At the moment, there is nothing to return to here.
            //When there is something to return to, get the code
            //from another controller.
            AppState.SetRoute("Index", "/");

        }

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //  Event handlers
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        scope.$watch('$viewContentLoaded', function (event, viewConfig) {

            Paylocity.Init();
            var CallingRoute = $location.$$path.replace("/", "");
            var ProcessName = Paylocity.RegisterRoute(CallingRoute);

        });

        $("#PaylocityContainer input").off("focus").on("focus",
        function (event) {

            Paylocity.LocateElement($(this));
            event.stopImmediatePropagation();

        });

    }

})();