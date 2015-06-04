(function () {
    angular.module('App.MemberManagement').controller('PasswordManagementController',
    ['$q', '$timeout', '$location', 'ManageService', 'ManageUserContracts', 'PasswordManagementModel', '$rootScope', 'AppState', PasswordManagementController]);

    function PasswordManagementController($q, $timeout, $location, ManageService, ManageUserContracts, PasswordManagementModel, $rootScope, AppState) {

        var PasswordManagement = this;
        var scope = $rootScope.$new();

        //////////////////////////////////////////////////////////////////////////////////////
        //  Global variables
        //////////////////////////////////////////////////////////////////////////////////////
        PasswordManagement.ManagePassword;                          //  Contract to manage password-related entries
        PasswordManagement.ProcessHelper;                           //  Contract to help with process flow and shrink global variable count
        PasswordManagement.ReNewPassword;                           //  Model value for re-type password fields
        PasswordManagement.ConfirmNewEmail;                         //  Model value for re-type email field
        PasswordManagement.Message = "";                            //  Model value for messages to user
        PasswordManagement.UserName;                                //  Container for user name from AppState

        //////////////////////////////////////////////////////////////////////////////////////
        //  Accessors
        //////////////////////////////////////////////////////////////////////////////////////
        PasswordManagement.ManageUserNameItem = function () {

            var ManageUserNameItem = {

                UserNameItem: $("#tdUserName")

            }

            return ManageUserNameItem;

        }

        PasswordManagement.ManagePasswordScreens = function () {

            var ManagePasswordScreens = {

                ChangePassword: $("#tdPasswordContent"),
                RetrievePassword: $("#tdSecurityContent"),
                ChangeEmail: $("#tdEmailContent")

            }

            return ManagePasswordScreens;

        }

        PasswordManagement.PasswordManageFields = function () {

            var PasswordManageFields = {

                UserName: $("#txtUserName"),
                OldPassword: $("#txtOldPassword"),
                NewPassword: $("#txtNewPassword"),
                ReNewPassword: $("#txtReNewPassword"),
                SecurityQuestion: $("#txtSecurityQuestion"),
                SecurityAnswer: $("#txtSecurityAnswer"),
                NewEmail: $("#txtNewEmail"),
                ConfirmNewEmail: $("#txtConfirmNewEmail")


            }

            return PasswordManageFields;

        }

        PasswordManagement.UserManageButtons = function () {

            var UserManageButtons = {

                Exit: $("#btnManageExit"),
                Submit: $("#btnManageSubmit")

            }

            return UserManageButtons;

        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Change Password functionality. Should just make one contract for everything
        //
        //  ChangePasswordInit              Sets up environment for change password
        //  ChangePassword                  Call to backend process
        //  ChangePasswordResult            Callback
        //////////////////////////////////////////////////////////////////////////////////////
        PasswordManagement.ChangePasswordInit = function () {

            PasswordManagement.InitializeProcess(new Array("OldPassword", "NewPassword"), "Please enter your user name followed by the relevant passwords and click Submit.", "ChangePassword");

        }

        PasswordManagement.ChangePassword = function () {

            PasswordManagement.Message = "Changing Password ...";
            PasswordManagementModel.ChangePassword(PasswordManagement.ManagePassword).then(ChangePasswordResult).catch(ChangePasswordResult);
            function ChangePasswordResult(Message) { PasswordManagement.ChangePasswordResult(Message) }

        }

        PasswordManagement.ChangePasswordResult = function (Message) {

            if (Message.indexOf("success") == -1) {

                PasswordManagement.Message = Message;

            } else {

                PasswordManagement.ShowEndOfProcessMessage(Message);

            }
        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Change email functionality
        //
        //  ChangeEmailInit                 Initialize change email screen
        //  ChangeEmail                     Backend call to change email
        //  ChangeEmailResult               Callback
        //////////////////////////////////////////////////////////////////////////////////////
        PasswordManagement.ChangeEmailInit = function () {

            PasswordManagement.InitializeProcess(new Array("NewEmail"), "Please enter your new email address and click Submit.", "ChangeEmail");

        }

        PasswordManagement.ChangeEmail = function () {

            PasswordManagement.Message = "Changing Email ...";
            PasswordManagementModel.ChangeEmail(PasswordManagement.ManagePassword).then(ChangeEmailResult).catch(ChangeEmailResult);
            function ChangeEmailResult(Message) { PasswordManagement.ChangeEmailResult(Message) }

        }

        PasswordManagement.ChangeEmailResult = function (Message) {

            if (Message.indexOf("success") == -1) {

                PasswordManagement.Message = Message;

            } else {

                PasswordManagement.ShowEndOfProcessMessage(Message);

            }
        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Get Password functionality
        //
        //  GetPasswordInit                 Initialize screen for get password function
        //  GetUserSecurityQuestion         Call to backend to retrieve security question
        //  GetSecurityQuestionResult       Callback, set up screen for answer
        //  GetPassword                     Call to backend to fetch password
        //  GetSecurityAnswerResult         Callback to notifiy if password info sent
        //////////////////////////////////////////////////////////////////////////////////////
        PasswordManagement.GetPasswordInit = function () {

            PasswordManagement.InitializeProcess(new Array("SecurityQuestion", "SecurityAnswer"), "Please enter your user name and click submit.", "RetrievePassword");

        }

        PasswordManagement.GetUserSecurityQuestion = function () {

            PasswordManagement.Message = "Looking up security question ...";
            PasswordManagementModel.GetSecurityQuestion(PasswordManagement.ManagePassword.UserName).then(GetSecurityQuestionResult).catch(GetSecurityQuestionResult);
            function GetSecurityQuestionResult(Message) { PasswordManagement.GetSecurityQuestionResult(Message) }

        }

        PasswordManagement.GetSecurityQuestionResult = function (Message) {

            if (Message != "") {

                PasswordManagement.Message = Message;

            } else {

                PasswordManagement.ProcessHelper.PreviousProcess = PasswordManagement.ProcessHelper.Process;
                PasswordManagement.ProcessHelper.Process = "SecurityAnswer";
                PasswordManagement.ManagePassword.SecurityQuestion.Value = PasswordManagementModel.GetSecurityQuestionValue();
                PasswordManagement.Message = "Please enter the answer to your security question and click the Submit button";
                PasswordManagement.PasswordManageFields().SecurityAnswer.removeAttr("disabled");
                PasswordManagement.PasswordManageFields().SecurityAnswer.focus();

            }
        }

        PasswordManagement.GetPassword = function () {

            PasswordManagement.Message = "Retrieving Password ...";
            PasswordManagementModel.GetPassword(PasswordManagement.ManagePassword.SecurityAnswer).then(GetSecurityAnswerResult).catch(GetSecurityAnswerResult);
            function GetSecurityAnswerResult(Message) { PasswordManagement.GetSecurityAnswerResult(Message) }

        }

        PasswordManagement.GetSecurityAnswerResult = function (Message) {

            if (Message.indexOf("success") == -1) {

                PasswordManagement.Message = Message;

            } else {

                PasswordManagement.ShowEndOfProcessMessage(Message);

            }
        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Validation
        //  
        //  GetSecurityAnswerResult         Validation passthrough to model
        //  CheckChangePasswordManageFields Validates fields based on requirement, uses above method
        //  ExecuteOnChangeEmailValidate    Supports above method for email validation
        //  ExecuteOnChangePasswordValidate Supports above method for password validation
        //  QuickCheck                      Quick check non-terminating validation
        //////////////////////////////////////////////////////////////////////////////////////
        PasswordManagement.ValidateElement = function (key) {

            var isValid = PasswordManagementModel.ValidateFieldEntry(PasswordManagement.ManagePassword, key, PasswordManagement.ManagePassword[key].MapToKey, PasswordManagement.ManagePassword[key].Required, PasswordManagement.ManagePassword[key].Value);
            return isValid;

        }

        PasswordManagement.CheckChangePasswordManageFields = function () {

            var isValid = "";
            PasswordManagement.Message = "";

            for (var key in PasswordManagement.ManagePassword) {

                if (PasswordManagement.ManagePassword[key].Required) {

                    PasswordManagement.ProcessHelper.CurrentKey = key;
                    isValid = PasswordManagementModel.ValidateFieldEntry(PasswordManagement.ManagePassword, key, PasswordManagement.ManagePassword[key].MapToKey, PasswordManagement.ManagePassword[key].Required, PasswordManagement.ManagePassword[key].Value);

                    if (isValid != "") {

                        break;

                    } else {

                        PasswordManagement.ProcessHelper.CurrentKey = "";

                    }
                }
            }

            if (isValid != "") {

                PasswordManagement.ProcessHelper.ValidationMessage = isValid;

            } else {

                if (PasswordManagement.ProcessHelper.Process == "ChangePassword")
                    PasswordManagement.ExecuteOnChangePasswordValidate();
                else if (PasswordManagement.ProcessHelper.Process == "ChangeEmail")
                    PasswordManagement.ExecuteOnChangeEmailValidate();

            }
        };

        PasswordManagement.ExecuteOnChangeEmailValidate = function () {

            if (PasswordManagement.ConfirmNewEmail) {

                if (PasswordManagement.ManagePassword.NewEmail.Value == PasswordManagement.ConfirmNewEmail.Value) {

                    PasswordManagement.ChangeEmail();

                } else {

                    PasswordManagement.ProcessHelper.ValidationMessage = "The emails are not the same. Please re-enter your email.";
                    PasswordManagement.ProcessHelper.CurrentKey = "NewEmail";
                    PasswordManagement.ManagePassword.NewEmail.Value = "";
                    PasswordManagement.ConfirmNewEmail = "";

                }
            }
        }

        PasswordManagement.ExecuteOnChangePasswordValidate = function () {

            if (PasswordManagement.ReNewPassword) {

                if (PasswordManagement.ManagePassword.NewPassword.Value == PasswordManagement.ReNewPassword) {

                    PasswordManagement.ChangePassword();

                } else {

                    PasswordManagement.Message = "The passwords are not the same. Please re-enter your password.";
                    PasswordManagement.ManagePassword.OldPassword.Value = "";
                    PasswordManagement.ManagePassword.NewPassword.Value = "";
                    PasswordManagement.PasswordManageFields().OldPassword.focus();

                }
            }
        }

        PasswordManagement.QuickCheck = function (key) {

            var isValid = PasswordManagement.ValidateElement(key);
            if (isValid == "") {

                if (key == "UserName")
                    PasswordManagement.GetUserSecurityQuestion();
                else
                    PasswordManagement.GetPassword();

            } else {

                PasswordManagement.ProcessHelper.CurrentKey = key;
                PasswordManagement.ProcessHelper.ValidationMessage = isValid;

            }
        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  GUI Manip -- many of these can be placed in a library and shared
        //
        //  ShowEndOfProcessMessage         Handles exit gui processing
        //  ShowHideButtons                 Hides or shows array of buttons
        //  GiveDirection                   Validation helper, shows messages, returns to invalid field
        //  HideContainers                  Hides screens in app
        //  ReturnToMainScreen              Returns to initial manage screen or main screen
        //  CheckSetUserNameField           Initializes UserName field depending on AppState
        //////////////////////////////////////////////////////////////////////////////////////
        PasswordManagement.ShowEndOfProcessMessage = function (Message) {

            for (var key in PasswordManagement.PasswordManageFields()) PasswordManagement.PasswordManageFields()[key].attr("disabled", true);
            for (var key in PasswordManagement.UserManageButtons()) PasswordManagement.UserManageButtons()[key].attr("disabled", true);
            PasswordManagement.UserManageButtons().Exit.removeAttr("disabled");
            PasswordManagement.Message = Message + "Click Exit to return to the main screen.";
        }

        PasswordManagement.ShowHideButtons = function (ButtonArray, isHide) {

            if (ButtonArray) {

                var iLen = ButtonArray.length;
                for (var i = 0; i < iLen; i++) {

                    if (isHide)
                        PasswordManagement.UserManageButtons()[ButtonArray[i]].hide();
                    else
                        PasswordManagement.UserManageButtons()[ButtonArray[i]].show();

                }
            }
        }

        PasswordManagement.GiveDirection = function () {

            if (PasswordManagement.ProcessHelper.CurrentKey) {

                PasswordManagement.Message = PasswordManagement.ProcessHelper.ValidationMessage;
                PasswordManagement.ProcessHelper.ValidationMessage = "";
                PasswordManagement.PasswordManageFields()[PasswordManagement.ProcessHelper.CurrentKey].select();
                PasswordManagement.ProcessHelper.CurrentKey = null;
                scope.$apply();

            }
        }
        PasswordManagement.HideContainers = function () {

            for (var key in PasswordManagement.UserManageScreens()) PasswordManagement.UserManageScreens()[key].hide();

        }

        PasswordManagement.ReturnToMainScreen = function () {

            if (PasswordManagement.ProcessHelper.Process == "UpdateUser") {

                PasswordManagement.ProcessHelper.ProcessName = PasswordManagement.ProcessHelper.PreviousProcess;
                PasswordManagement.ProcessHelper.PreviousProcess = "";
                PasswordManagement.SetProcess(PasswordManagement.ProcessHelper.ProcessName);

            } else {

                $location.url(AppState.GetPreviousRoute());

            }
        }

        PasswordManagement.CheckSetUserNameField = function () {

            PasswordManagement.UserName = AppState.GetUserName();
            if (PasswordManagement.UserName && PasswordManagement.UserName != "") {

                PasswordManagement.ManagePassword.UserName.Value = PasswordManagement.UserName;
                PasswordManagement.PasswordManageFields().UserName.attr("disabled", true);

                if(PasswordManagement.ProcessHelper.Process == "GetPassword") PasswordManagement.GetUserSecurityQuestion();

            } else {

                PasswordManagement.PasswordManageFields().UserName.focus();

            }
        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Process
        //  
        //  InitializeProcess               Initializes all of the processes in this app
        //  GetPasswordContract             Retrieves contract and sets required fields
        //  CheckValidation                 Keydown manager for app. 
        //  CheckProcess                    Manages internal app process routing works with above
        //  SetProcess                      Sets initial app function based on route
        //  RegisterRoute                   Registers route with AppState, previous route
        //////////////////////////////////////////////////////////////////////////////////////
        PasswordManagement.InitializeProcess = function (FieldArray, UserMessage, ShowScreenItem) {

            PasswordManagement.GetPasswordContract(FieldArray);
            PasswordManagement.UserManageButtons().Submit.removeAttr("disabled");
            PasswordManagement.Message = UserMessage;
            PasswordManagement.ManagePasswordScreens()[ShowScreenItem].show();
            PasswordManagement.CheckSetUserNameField();

        }

        PasswordManagement.GetPasswordContract = function (FieldArray) {

            PasswordManagement.ManagePassword = PasswordManagementModel.GetManagePasswordContract();
            var iLen = FieldArray.length;
            for(var i = 0; i < iLen; i++) {

                for(var key in PasswordManagement.ManagePassword) {

                    if(key == FieldArray[i]) PasswordManagement.ManagePassword[key].Required = true;

                }

            }
        }

        PasswordManagement.CheckValidation = function (event) {

            if (event.keyCode == 13 || event.keyCode == 9) {

                PasswordManagement.CheckProcess();
                return false;

            }
        }

        PasswordManagement.CheckProcess = function () {

            if (PasswordManagement.ProcessHelper.Process == "GetPassword") {

                PasswordManagement.QuickCheck("UserName");

            } else if (PasswordManagement.ProcessHelper.Process == "SecurityAnswer") {

                PasswordManagement.QuickCheck("SecurityAnswer");

            } else if (PasswordManagement.ProcessHelper.Process == "ChangePassword") {

                PasswordManagement.CheckChangePasswordManageFields();

            } else if (PasswordManagement.ProcessHelper.Process == "ChangeEmail") {

                PasswordManagement.CheckChangePasswordManageFields();

            }
        }

        PasswordManagement.SetProcess = function (ProcessName) {

            if (!PasswordManagement.ProcessHelper || PasswordManagement.ProcessHelper == null) PasswordManagement.ProcessHelper = PasswordManagementModel.GetProcessHelperContract();
            PasswordManagement.ProcessHelper.PreviousProcess = PasswordManagement.ProcessHelper.Process;
            PasswordManagement.ProcessHelper.Process = ProcessName;

            if (ProcessName == "GetPassword") {

                PasswordManagement.GetPasswordInit();

            } else if (ProcessName == "ChangePassword") {

                PasswordManagement.ChangePasswordInit();

            } else if (ProcessName == "ChangeEmail") {

                PasswordManagement.ChangeEmailInit();

            }
        }

        PasswordManagement.RegisterRoute = function (CallingRoute) {

            var AppName = CallingRoute.split(".");
            if (CallingRoute == "MemberManagement") CallingRoute = "Membership";
            AppState.SetRoute(AppName[1], CallingRoute);
            return AppName[1];

        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Event Handlers
        //////////////////////////////////////////////////////////////////////////////////////
        scope.$watch('$viewContentLoaded', function (event, viewConfig) {

            PasswordManagement.UserManageButtons().Submit.attr("disabled", true);
            var CallingRoute = "MemberManagement." + $location.$$path.replace("/App/MemberManagement", "");
            var ProcessName = PasswordManagement.RegisterRoute(CallingRoute);
            PasswordManagement.SetProcess(ProcessName);

        });

        $("#ManageContainer input").off("focus").on("focus",
        function (event) {

            PasswordManagement.GiveDirection();

        });

        $("#btnManageSubmit").off("click").on("click",
        function () {

            PasswordManagement.CheckProcess();

        }
        );
    }
})();