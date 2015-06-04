(function () {

    angular.module('App.MemberManagement').controller('RegistrationController',
    ['$q', '$timeout', '$location', 'RegisterUserModel', '$rootScope', 'AppState', RegistrationController]);

    function RegistrationController($q, $timeout, $location, RegisterUserModel, $rootScope, AppState) {

        var Registration = this;
        var scope = $rootScope.$new();

        //////////////////////////////////////////////////////////////////////////////////////
        //  Global variables
        //////////////////////////////////////////////////////////////////////////////////////
        Registration.Message;                                       //  Model value for messages to user
        Registration.RegistrationFields;                            //  Contract to manage registration-related entries
        Registration.RegistrationDirections;                        //  Contract to manage validation messages for registration
        Registration.CurrentKey;                                    //  Current key for element being validated
        Registration.ValidationMessage;                             //  Holds onto validation message when field has to be revisited

        //////////////////////////////////////////////////////////////////////////////////////
        //  Controller initialization
        //////////////////////////////////////////////////////////////////////////////////////
        Registration.Init = function () {

            Registration.RegistrationFields = RegisterUserModel.GetRegContract().RegInfo;
            Registration.RegistrationDirections = RegisterUserModel.GetRegDirections();
            Registration.RegistrationInputs().FirstName.focus();

        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Registration
        //
        //  AddUser                         Call to backend to add user
        //  AddUserResult                   Callback
        //////////////////////////////////////////////////////////////////////////////////////
        Registration.AddUser = function () {

            Registration.Message = "Registering new user ...";
            RegisterUserModel.SubmitAddUser(Registration.RegistrationFields).then(AddUserResult).catch(AddUserResult);
            function AddUserResult(Message) { Registration.AddUserResult(Message) }

        }

        Registration.AddUserResult = function (Message) {

            if (Message.indexOf("success") == -1) {

                Registration.Message = Message;

            } else {

                Registration.ClearFields();
                Registration.DisableFields();
                Registration.DisableButtons(new Array("Clear", "Add"));
                Registration.Message = Message + " Click the Exit button to return to the main page";
            }
        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Input element control. I may try to change some of this.
        //////////////////////////////////////////////////////////////////////////////////////
        Registration.RegistrationInputs = function () {

            var RegistrationInputs = {

                FirstName: $("#txtFirstName"),
                LastName: $("#txtLastName"),
                Email: $("#txtEmail"),
                UserName: $("#txtUserName"),
                Password: $("#txtPassword"),
                Password1: $("#txtPassword1"),
                Question: $("#txtQuestion"),
                Answer: $("#txtAnswer")
            }

            return RegistrationInputs;

        }

        Registration.RegistrationButtons = function () {

            var RegistrationButtons = {

                Exit: $("#btnExit"),
                Clear: $("#btnClear"),
                Add: $("#btnAdd")
            }

            return RegistrationButtons;

        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  GUI-Related functionality
        //
        //  GiveDirection                   Gives error validation message
        //  ClearFields                     Clears all fields
        //  DisableFields                   Disables all fields
        //  DisableButtons                  Disables a given collection of buttons
        //////////////////////////////////////////////////////////////////////////////////////
        Registration.GiveDirection = function (ElementId) {

            var ElementName = ElementId.replace("txt", "");
            if (Registration.ValidationMessage != null)
                Registration.Message = Registration.ValidationMessage;
            else
                Registration.Message = Registration.RegistrationDirections[ElementName];

            Registration.ValidationMessage = null;
            scope.$apply();

        }

        Registration.ClearFields = function () {

            for (var key in Registration.RegistrationInputs()) {

                Registration.RegistrationInputs()[key].val("");
            }
        }

        Registration.DisableFields = function () {

            for (var key in Registration.RegistrationInputs()) {

                Registration.RegistrationInputs()[key].attr("disabled", true);
            }
        }

        Registration.DisableButtons = function (ButtonArray) {

            if (ButtonArray != null) {

                var iLen = ButtonArray.length;
                for (var i = 0; i < iLen; i++) {

                    Registration.RegistrationButtons()[ButtonArray[i]].attr("disabled", true);

                }
            }
        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Validation caller. This needs to go through the model
        //
        //  CheckValidation                 Keydown event handler
        //  ValidateFields                  Validator for registration elements, works through model
        //////////////////////////////////////////////////////////////////////////////////////
        Registration.CheckValidation = function (event) {

            if (event.keyCode == 13 || event.keyCode == 9) {

                Registration.ValidateFields();
                return false;

            }
        }

        Registration.ValidateFields = function () {

            var isValid = "";
            Registration.Message = "";

            for (var key in Registration.RegistrationFields) {

                if (!Registration.RegistrationInputs()[key].is(":disabled")) {

                    Registration.CurrentKey = key;
                    isValid = RegisterUserModel.ValidateFieldEntry(Registration.RegistrationFields, key, Registration.RegistrationFields[key].MapToKey, Registration.RegistrationFields[key].Required, Registration.RegistrationFields[key].Value);

                    if (isValid != "") {

                        break;

                    } else {

                        Registration.CurrentKey = "";

                    }
                }
            }

            if (isValid != "") {

                Registration.ValidationMessage = isValid;

            } else {

                if (Registration.RegistrationInputs().Password.val() == Registration.RegistrationInputs().Password1.val()) {

                    Registration.CurrentKey = "Registering";
                    Registration.AddUser();

                } else {

                    Registration.Message = "The passwords are not the same. Please re-enter your password.";
                    Registration.RegistrationFields.Password.Value = "";
                    Registration.RegistrationFields.Password1.Value = "";
                    Registration.CurrentKey = "Password";

                }
            }
        };

        //////////////////////////////////////////////////////////////////////////////////////
        //  Process
        //////////////////////////////////////////////////////////////////////////////////////
        Registration.RegisterRoute = function (CallingRoute) {

            var AppName = CallingRoute.split(".");
            AppState.SetRoute(AppName[0], CallingRoute);
            return AppName[1];

        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Event handlers
        //////////////////////////////////////////////////////////////////////////////////////
        scope.$watch('$viewContentLoaded', function (event, viewConfig) {

            var CallingRoute = $location.$$path.replace("/", "");
            Registration.RegisterRoute(CallingRoute);
            Registration.Init();
            event.stopImmediatePropagation();

        });

        $("#RegistrationContainer input").off("focus").on("focus",
        function (event) {

            if (Registration.CurrentKey != "Registering") {

                if (!Registration.CurrentKey || Registration.CurrentKey == null) {

                    Registration.GiveDirection($(this).attr("id"));
                    $(this).select();

                } else {

                    var CurrentKey = Registration.CurrentKey;
                    Registration.CurrentKey = null;
                    Registration.RegistrationInputs()[CurrentKey].select();

                }
            }

            event.stopImmediatePropagation();

        });

        $("#btnClear").off("click").on("click",
        function (event) {

            Registration.ClearFields();
            event.stopImmediatePropagation();

        });

        Registration.ReturnToMainScreen = function () {

            $location.url(AppState.GetPreviousRoute());

        }
    }

})();
