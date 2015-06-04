angular.module('App').directive('modaldialog', ['$timeout', 'Validation', function ($timeout, Validation) {
    return {
        restrict: 'EA',
        scope: {

            modalattribute: '=modalattribute',
            UserName: '=',
            onmodalresultready: '&'

        },

        controller: ['$scope', function ($scope) {


        }],

        templateUrl: 'App/Directives/Modal/ModalDialog.html',
        link: function (scope, element, attrs) {

            var mdlContract;
            var ValidationElement;

            ////////////////////////////////////////////////////////////////////////////////////////////////
            //  Directive gateway
            ////////////////////////////////////////////////////////////////////////////////////////////////
            var CheckContract = function (ContractString) {

                //mdlContract = JSON.parse(ContractString);
                mdlContract = ContractString;

                if (mdlContract.ValidationMessage)
                    ShowValidationMessage();
                else if (!mdlContract.UserName)
                    SetupDialog();

            }

            ////////////////////////////////////////////////////////////////////////////////////////////////
            //  Dialog-related functions
            ////////////////////////////////////////////////////////////////////////////////////////////////
            var SetupDialog = function () {

                var ModalNegative;
                var ModalPositive;

                if (mdlContract.ModalType == "mdlYesNo") {

                    ModalNegative = "No";
                    ModalPositive = "Yes";

                } else if (mdlContract.ModalType == "mdlOkCancel" || mdlContract.ModalType == "mdlLogin") {

                    ModalNegative = "Cancel";
                    ModalPositive = "OK";

                }

                BuildDialog(ModalNegative, ModalPositive, mdlContract.ModalTitle, mdlContract.ModalMessage, mdlContract.ModalType, mdlContract.ModalWidth, mdlContract.ModalHeight);

                $("#ModalWindowContainer").show();
                $("#ModalWindow").show();

                if (mdlContract.ModalType == "mdlLogin") {
                    $("#mdlLogin").show();
                    $("#mdlUserName").focus();
                } else {
                    $("#mdlConfirm").show();
                }
            }

            var BuildDialog = function (ModalNegativeText, ModalPositiveText, ModalTitleText, ModalContentText, ModalType, ModalWidth, ModalHeight) {

                $("#ModalNegative").val(ModalNegativeText);
                $("#ModalPositive").val(ModalPositiveText);
                $("#ModalTitle").text(ModalTitleText);
                $("#ModalContent").css({ "width": ModalWidth, "height": ModalHeight });
                if (ModalType != "mdlLogin") $("#ModalContent").text(ModalContentText);

                var DocWidth = $(window).width();
                var DocHeight = $(window).height();

                var ModalLeft = ($(window).width() - ModalWidth) / 2.5;
                var ModalTop = (DocHeight - ModalHeight - 20) / 2.5;
                $("#ModalWindow").css({ "left": ModalLeft + "px", "top": ModalTop + "px" });

            }

            var KillDialog = function () {

                $("#ModalWindowContainer").hide();
                $("#ModalWindow").hide();

            }

            var ShowValidationMessage = function () {

                $("#MdlMessageArea").text(mdlContract.ValidationMessage);
                if (mdlContract.ValidationMessage.toLowerCase().indexOf("username") > -1)
                    $("#mdlUserName").select();
                else
                    $("#mdlPassword").select();

            }

            var ShowValidationMessageNew = function (Message) {

                $("#MdlMessageArea").text(Message);

            }

            var ValidateFieldEntry = function (ContractEntryField, key, MapToKey, Required, value) {

                return Validation.ValidateFieldEntry(ContractEntryField, key, MapToKey, Required, value);

            }

            ////////////////////////////////////////////////////////////////////////////////////////////////
            //  Event handlers
            ////////////////////////////////////////////////////////////////////////////////////////////////
            scope.ValidateLogin = function () {

                var Type;
                var ValidationMessage = "";
                ValidationElement == null;
                var UserName = $("#mdlUserName").val();
                var Password = $("#mdlPassword").val();

                if (UserName != "") {

                    Type = 0;
                    //ValidationMessage = ValidateFieldEntry(null, 'UserName', null, true, UserName);
                    //if (ValidationMessage != "") ValidationElement = $("#mdlUserName");

                }

                if (Password != "" && ValidationElement == null) {

                    Type = 1;
                    //ValidationMessage = ValidateFieldEntry(null, 'Password', null, true, Password);
                    //if (ValidationMessage != "") ValidationElement = $("#mdlPassword");

                }

                ShowValidationMessageNew(ValidationMessage);
                if (ValidationMessage == "" && Type == 1) {

                    scope.LoginUser(UserName, Password);

                }
            }

            scope.CheckKeyAndValidate = function () {

                ValidationElement = null;

                if (event.keyCode == 13 || event.keyCode == 9) {

                    scope.ValidateLogin();

                }
            }

            scope.PositiveClick = function () {

                ModalButtonClick(1);

            }

            scope.NegativeClick = function () {

                ModalButtonClick(0);

            }

            var ModalButtonClick = function (RetVal) {

                if (mdlContract.ModalType == "mdlYesNo" || mdlContract.ModalType == "mdlOkCancel") {

                    scope.modalattribute = RetVal;
                    scope.$apply();
                    scope.onmodalresultready();

                } else if (mdlContract.ModalType == "mdlLogin") {

                    if (RetVal == 1) {

                        scope.ValidateLogin();

                    } else {

                        scope.LoginUser("", "");

                    }
                }
            };

            scope.LoginUser = function (UserName, Password) {

                $timeout(CallUpdate, 0);
                //scope.modalattribute = '{"UserName": "' + UserName + '", "Password": "' + Password + '"}';
                //scope.modalattribute = { UserName: UserName, Password: Password };
                scope.modalattribute = { UserName: UserName, Password: Password, ModalType: 'mdlLogin', ModalMessage: '', ModalHeight: 120, ModalWidth: 350, ModalTitle: 'Please enter credentials', ValidationMessage: '' };
                //scope.$apply();

                function CallUpdate() {

                    scope.onmodalresultready();

                }
            }

            ////////////////////////////////////////////////////////////////////////////////////////////////
            //  Scope watch
            ////////////////////////////////////////////////////////////////////////////////////////////////
            scope.$watch('modalattribute', function () {
                if (scope.modalattribute.ValidationMessage != null) {

                    CheckContract(scope.modalattribute);

                } else {

                    KillDialog();

                }
            });

            $("#ModalWindow input").off("focus").on("focus", function () {

                if (ValidationElement != null) {

                    ValidationElement.select();

                }
            });
        }
    };
}]);