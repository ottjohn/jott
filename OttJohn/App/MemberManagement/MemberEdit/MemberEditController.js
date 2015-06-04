(function () {
    angular.module('App.MemberManagement').controller('MemberEditController',
    ['$q', '$timeout', '$location', 'ManageService', 'ManageUserContracts', 'MemberEditModel', '$rootScope', 'AppState', MemberEditController]);

    function MemberEditController($q, $timeout, $location, ManageService, ManageUserContracts, MemberEditModel, $rootScope, AppState) {

        var MemberEdit = this;
        var scope = $rootScope.$new();

        //////////////////////////////////////////////////////////////////////////////////////
        //  Global variables
        //////////////////////////////////////////////////////////////////////////////////////
        MemberEdit.UnapprovedUser;                                  //  Basic user info -- this should probably be sent as a contract
        MemberEdit.MemberAccount;                                   //  Whole account returned by model
        MemberEdit.UserInApp;                                       //  App list from account
        MemberEdit.SelectedApp;                                     //  Selected app bound to app dropdown

        MemberEdit.ManageTreeGroups;                                //  Returned group name list
        MemberEdit.SelectedGroup;                                   //  Selected group name bound to group dropdown

        MemberEdit.ProcessHelper;                                   //  Contract to help with process flow and shrink global variable count
        MemberEdit.ModalAttribute = {};                             //  Modal dialog attribute
        MemberEdit.TreeAttribute = '';                              //  Feature tree attribute

        MemberEdit.DataGrid;                                        //  Data grid global variable
        MemberEdit.AppRoles;                                        //  Not used presently
        MemberEdit.UserName;                                        //  Bound to find user
        MemberEdit.Message;                                         //  Model to contain messages for user
        MemberEdit.MergeApplicationName                             //  Application name for member merge
        //////////////////////////////////////////////////////////////////////////////////////
        //  Accessors
        //////////////////////////////////////////////////////////////////////////////////////
        MemberEdit.MemberEditFields = function () {

            var MemberEditFields = {

                UserName: $("#txtUserNameEdit")

            }
            
            return MemberEditFields;

        }

        MemberEdit.ManageUserNameItem = function () {

            var ManageUserNameItem = {

                UserNameItem: $("#tdUserNameMemberEdit")

            }

            return ManageUserNameItem;

        }

        MemberEdit.UserManageScreens = function () {

            var UserManageScreens = {

                UserList: $("#MemberGridContainer"),
                UserApprove: $("#MemberApproveContainer")

            }

            return UserManageScreens;

        }

        MemberEdit.UpdateUserFields = function () {

            var UpdateUserFields = {

                MemberFirstName: $("#txtMemberFirstName"),
                MemberLastName: $("#txtMemberLastName"),
                MemberUserName: $("#txtMemberUserName"),
                MemberProfile: $("#drpMemberProfile"),
                AppRoles: $("#RoleListContainerParent")

            }

            return UpdateUserFields;

        }

        MemberEdit.UserManageButtons = function () {

            var UserManageButtons = {

                Exit: $("#btnMemberEditExit"),
                AssignProfile: $("#btnMemberEditAssignProfile"),
                Cancel: $("#btnMemberEditCancel"),
                Submit: $("#btnMemberEditSubmit")

            }

            return UserManageButtons;

        }

        MemberEdit.ManageMemberGrid = function () {

            var ManageMemberGrid = {

                Grid: $("#MemberGridContainer")

            }

            return ManageMemberGrid;

        }

        MemberEdit.MessageFromDirective = function () {

            mdlContract = MemberEdit.ModalAttribute;
            MemberEdit.ModalAttribute = {};
            MemberEdit.InactivateUserResponse(mdlContract);

        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  FindUser functionality
        //
        //  FindUserInit                    Preps screen, message for FindUser
        //  FindUser                        Calls ExecuteFindUser 
        //  GetUser                         Calls ExecuteFindUser (from grid)
        //  ExecuteFindUser                 Makes call to model to find user
        //  GetUserResult                   Post call execution, sets next process
        //////////////////////////////////////////////////////////////////////////////////////
        MemberEdit.FindUserInit = function () {

            MemberEdit.ShowHideButtons(new Array("Exit", "Submit"), false);
            MemberEdit.Message = "Enter the member's user name and click the Submit button.";
            MemberEdit.MemberEditFields().UserName.focus();

        }

        MemberEdit.FindUser = function (UserName, ApplicationId) {

            MemberEdit.ExecuteFindUser('', UserName, ApplicationId);

        }

        MemberEdit.GetUser = function (UserGuid) {

            MemberEdit.ExecuteFindUser(UserGuid, '', null);

        }

        MemberEdit.ExecuteFindUser = function (UserGuid, UserName, ApplicationId) {

            MemberEdit.Message = "Retrieving User ...";
            MemberEditModel.GetUser(UserGuid, UserName, ApplicationId).then(GetUserResult).catch(GetUserResult);
            function GetUserResult(Message) { MemberEdit.GetUserResult(Message) };

        }

        MemberEdit.GetUserResult = function (Message) {

            if (Message != "") {

                MemberEdit.Message = Message;

            } else {

                MemberEdit.ManageUserNameItem().UserNameItem.hide();
                MemberEdit.SetProcess("UpdateUser");
                MemberEdit.HideAllButtons();
                MemberEdit.ShowHideButtons(new Array("Exit", "AssignProfile"), false);
                MemberEdit.ShowMemberAccountForApp();

            }
        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Pending User Functionality. 
        //
        //  GetPendingUsers                 Retrieves all non--approved users
        //                                  Initializes grid
        //  GetPendingUsersResult           Callback, sets evnironment for users view
        //////////////////////////////////////////////////////////////////////////////////////
        MemberEdit.GetPendingUsers = function () {

            MemberEdit.ShowHideButtons(new Array("Exit"), false);
            MemberEdit.Message = "Retrieving pending users ...";
            if (MemberEdit.DataGrid == null) MemberEdit.DataGrid = new GridConfigObject(MemberEdit.GetMemberAttribs());

            var CurrentPage;
            if (MemberEdit.DataGrid.LocalAttributes.Pager == null)
                CurrentPage = 1;
            else
                CurrentPage = MemberEdit.DataGrid.LocalAttributes.Pager.GetCurrentPage();

            MemberEditModel.GetPendingUsers(CurrentPage, MemberEdit.DataGrid.GridAttributes.PageSize, MemberEdit.DataGrid.GetSortField(), MemberEdit.DataGrid.GetSortDirection()).then(GetPendingUsersResult).catch(GetPendingUsersResult);
            function GetPendingUsersResult(Message) { MemberEdit.GetPendingUsersResult(Message) }

        }

        MemberEdit.GetPendingUsersResult = function (Message) {

            if (Message != "") {

                MemberEdit.Message = Message;

            } else {

                var MemberManager = MemberEditModel.GetMemberManager();
                if (MemberManager.RecordCount > 0) {

                    MemberEdit.DataGrid.BuildGrid(MemberManager.ExtendedMemberInfo);
                    MemberEdit.DataGrid.LocalAttributes.Pager.SetTotalPages(MemberManager.RecordCount);
                    MemberEdit.ManageMemberGrid().Grid.show();
                    MemberEdit.Message = "Double-click on the member you wish to process.";

                } else {

                    MemberEdit.ManageMemberGrid().Grid.children().hide();
                    MemberEdit.Message = "There are no pending users to show.";

                }
            }
        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Get Feature Tree group 
        //
        //  GetNamedGroup                   OnChange handler for group dropdown
        //  GetFeatureTree                  Gets feature tree based on GroupNameId
        //  GetFeatureTreeResult            Callback. Preps for user edit
        //////////////////////////////////////////////////////////////////////////////////////
        MemberEdit.GetNamedGroup = function () {

            if (MemberEdit.SelectedGroup == null) {

                var MemberOriginalAccount = MemberEditModel.GetPristineAccountInfo();
                MemberEdit.TreeAttribute = MemberOriginalAccount.TreeItems;
                
            } else {

                MemberEdit.GetFeatureTree("", "", MemberEdit.SelectedGroup.FeatureGroupNameId);

            }
        }

        MemberEdit.GetFeatureTree = function (UserName, UserId, GroupNameId) {

            MemberEditModel.GetFeatureTree(UserName, UserId, GroupNameId).then(GetFeatureTreeResult).catch(GetFeatureTreeResult);
            function GetFeatureTreeResult(Message) { MemberEdit.GetFeatureTreeResult(Message) }

        }

        MemberEdit.GetFeatureTreeResult = function (Message) {

            if (Message == "") {

                MemberEdit.TreeAttribute = MemberEditModel.GetGroupFeatureTreeCollection();

            } else {

                var ValidationMessage = "Error finding feature tree group.";

            }

            scope.$apply();

        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Member Account Management
        //
        //  ShowMemberAccountForApp         action after member lookup. sets environment
        //  SetUserDetails                  Populates static information for user
        //  PopulateApplicationDrop         Sets selected item for app dropdown
        //  SetGroupAssociation             Sets selected group for group dropdown
        //  SetAppDetails                   Sets dynamic user infor and calls FindUser
        //                                  OnChange for app dropdown
        //  GetFeatureProfile               Handler for assign profile button
        //////////////////////////////////////////////////////////////////////////////////////
        MemberEdit.ShowMemberAccountForApp = function () {

            var Message = "";
            MemberEdit.MemberAccount = jQuery.extend({}, MemberEditModel.GetMemberInfo());
            var RetMessage = MemberEdit.CheckMemberAccount();
            if (RetMessage == "") {

                var RetVal = MemberEdit.PopulateApplicationDrop();
                if (RetVal) RetVal = MemberEdit.CheckForRoles();
                if (RetVal) RetVal = MemberEdit.CheckForFeatureTree();

                if (RetVal)
                    Message = "Make necessary changes to member account, then click Assign Member Profile to commit.";
                else
                    MemberEdit.ShutDownApp();

            } else {

                Message = RetMessage;

            }

            $timeout(MemberEdit.ShowMessage(Message));

        }

        MemberEdit.ShutDownApp = function () {


        }

        //////////////////////////////////////////////////////
        // Member account validation
        //////////////////////////////////////////////////////
        MemberEdit.CheckMemberAccount = function() {

            var RetMessage = "";
            if (!MemberEdit.MemberAccount || MemberEdit.MemberAccount == null)
                RetMessage = "Failed to retrieve member account.";
            else if (MemberEdit.MemberAccount.Message.toLowerCase().indexOf("success") == -1)
                RetMessage = MemberEdit.MemberAccount.Message;
            else if (!MemberEdit.MemberAccount.MemberConfiguration || MemberEdit.MemberAccount.MemberConfiguration == null)
                RetMessage = "Failed to return member account information";

            return RetMessage;

        }

        //////////////////////////////////////////////////////
        // Feature tree extract and validation
        //////////////////////////////////////////////////////
        MemberEdit.CheckFeatureTreeExists = function () {

            var RetMessage = "";
            if (!MemberEdit.MemberAccount.MemberConfiguration.TreeItems || MemberEdit.MemberAccount.MemberConfiguration.TreeItems == null)
                RetMessage = "Failed to retrieve user feature tree items";
            else if (MemberEdit.MemberAccount.MemberConfiguration.TreeItems.Message != "")
                RetMessage = MemberEdit.MemberAccount.TreeItems.Message;
            else if (MemberEdit.MemberAccount.MemberConfiguration.TreeItems.areTreeItemsAvailable &&
                        (MemberEdit.MemberAccount.MemberConfiguration.TreeItems.FeatureItems == null || MemberEdit.MemberAccount.MemberConfiguration.TreeItems.FeatureItems.length == 0))
                RetMessage = "Feature items available but failed to load.";

            return RetMessage;
        }

        MemberEdit.CheckForFeatureTree = function () {

            var RetVal = true;
            var TreeAttribute = '';
            var RetMessage = MemberEdit.CheckFeatureTreeExists();
            if (RetMessage == "") {

                if (MemberEdit.MemberAccount.MemberConfiguration.TreeItems.areTreeItemsAvailable) {

                    TreeAttribute = MemberEdit.MemberAccount.MemberConfiguration.TreeItems;
                    if (MemberEdit.MemberAccount.MemberConfiguration.TreeItems.FeatureGroups.Groups.length > 0) {

                        MemberEdit.ManageTreeGroups = MemberEdit.MemberAccount.MemberConfiguration.TreeItems.FeatureGroups.Groups;
                        if (MemberEdit.MemberAccount.MemberConfiguration.TreeItems.AssignGroupNameId != 0)
                            MemberEdit.SetGroupAssociation(MemberEdit.MemberAccount.MemberConfiguration.TreeItems.AssignGroupNameId);

                    }
                }

            } else {

                RetVal = false;
                MemberEdit.Message = RetMessage;

            }

            MemberEdit.TreeAttribute = TreeAttribute;
            return RetVal;

        }

        MemberEdit.SetGroupAssociation = function (AssignedGroupId) {

            MemberEdit.SelectedGroup = null;

            if (MemberEdit.ManageTreeGroups && MemberEdit.ManageTreeGroups.length > 0) {

                var iLen = MemberEdit.ManageTreeGroups.length;
                for (var i = 0; i < iLen; i++) {

                    if (MemberEdit.ManageTreeGroups[i].FeatureGroupNameId == AssignedGroupId) {

                        MemberEdit.SelectedGroup = MemberEdit.ManageTreeGroups[i];
                        break;

                    }
                }
            }
        }

        //////////////////////////////////////////////////////
        // Application extract and validation
        //////////////////////////////////////////////////////
        MemberEdit.CheckApplicationsExist = function () {

            var RetMessage = "";
            if (!MemberEdit.MemberAccount.MemberConfiguration.UserApps || MemberEdit.MemberAccount.MemberConfiguration.UserApps == null)
                RetMessage = "Failed to retrieve application list.";
            else if (MemberEdit.MemberAccount.MemberConfiguration.UserApps.Message != "")
                RetMessage = MemberEdit.MemberAccount.MemberConfiguration.UserApps.Message;
            else if(!MemberEdit.MemberAccount.MemberConfiguration.UserApps.UserInApp || MemberEdit.MemberAccount.MemberConfiguration.UserApps.UserInApp == null)
                RetMessage = "Failed to retrieve application list.";
            else if(MemberEdit.MemberAccount.MemberConfiguration.UserApps.UserInApp.length == 0)
                RetMessage = "No applications in application list.";

            return RetMessage;
        }

        MemberEdit.PopulateApplicationDrop = function () {

            var RetVal = true;
            var RetMessage = MemberEdit.CheckApplicationsExist();
            if (RetMessage == "") {

                MemberEdit.UserInApp = MemberEdit.MemberAccount.MemberConfiguration.UserApps.UserInApp;
                MemberEdit.SetUserDetails();

                var iLen = MemberEdit.UserInApp.length;
                for (var i = 0; i < iLen; i++) {

                    if (MemberEdit.UserInApp[i].ApplicationName == MemberEdit.UnapprovedUser.ApplicationName) {

                        MemberEdit.SelectedApp = MemberEdit.UserInApp[i];
                        MemberEdit.UnapprovedUser.ApplicationId = MemberEdit.SelectedApp.ApplicationID;
                        MemberEdit.UnapprovedUser.UserApproved = MemberEdit.SelectedApp.IsUserApproved;
                        break;

                    }
                }

            } else {

                MemberEdit.Message = MemberEdit.MemberConfiguration.UserApps.Message;
                RetVal = false;

            }

            return RetVal;
        }

        MemberEdit.SetUserDetails = function () {

            var ApplicationName = "";
            if (MemberEdit.UnapprovedUser && MemberEdit.UnapprovedUser.ApplicationName != "") ApplicationName = MemberEdit.UnapprovedUser.ApplicationName;
            MemberEdit.UnapprovedUser = MemberEditModel.GetUnapprovedUserContract();
            MemberEdit.UnapprovedUser.ApplicationName = (ApplicationName != "") ? ApplicationName : MemberEdit.MemberAccount.MemberConfiguration.UserApps.DefaultApplication;
            MemberEdit.UnapprovedUser.UnapprovedFirstName = MemberEdit.MemberAccount.UserInfo.FirstName;
            MemberEdit.UnapprovedUser.UnapprovedLastName = MemberEdit.MemberAccount.UserInfo.LastName;
            MemberEdit.UnapprovedUser.UnapprovedUserName = MemberEdit.MemberAccount.UserInfo.UserName;
            MemberEdit.UnapprovedUser.UnapprovedUserId = MemberEdit.MemberAccount.UserInfo.UserId;

        }

        //////////////////////////////////////////////////////
        // User roles extract and validation
        //////////////////////////////////////////////////////
        MemberEdit.CheckUserRolesExist = function() {

            var RetMessage = "";
            if (!MemberEdit.MemberAccount.MemberConfiguration.Roles || MemberEdit.MemberAccount.MemberConfiguration.Roles == null) 
                RetMessage = "Failed to retrieve user roles.";
            else if(MemberEdit.MemberAccount.MemberConfiguration.Roles.RolesActiveInApp && 
                    (!MemberEdit.MemberAccount.MemberConfiguration.Roles.UserRoles || MemberEdit.MemberAccount.MemberConfiguration.Roles.UserRoles == null))
                RetMessage = "Roles available for application but failed to retrieve them";
            else if(MemberEdit.MemberAccount.MemberConfiguration.Roles.RolesActiveInApp && MemberEdit.MemberAccount.MemberConfiguration.Roles.UserRoles.length == 0)
                RetMessage = "Roles available for application but failed to retrieve them";

            return RetMessage;

        }

        MemberEdit.CheckForRoles = function () {

            var RetVal = true;
            var RetMessage = MemberEdit.CheckUserRolesExist();

            if(RetMessage == "") {

                MemberEdit.UpdateUserFields().AppRoles.text("No roles available");
                if (MemberEdit.MemberAccount.MemberConfiguration.Roles.RolesActiveInApp) {

                    if (MemberEdit.AppRoles == null) MemberEdit.AppRoles = MemberEdit.GetCheckObject();
                    var RoleCount = MemberEdit.MemberAccount.MemberConfiguration.Roles.UserRoles.length;
                    var UserRollArray = new Array(RoleCount);
                    for (var i = 0; i < RoleCount; i++) {

                        UserRollArray[i] = {

                            'RoleValue': MemberEdit.MemberAccount.MemberConfiguration.Roles.UserRoles[i]['RoleName'],
                            'RoleName': MemberEdit.MemberAccount.MemberConfiguration.Roles.UserRoles[i]['RoleName'],
                            'InRole': MemberEdit.ConvertGUID(MemberEdit.MemberAccount.MemberConfiguration.Roles.UserRoles[i]['InRole'])

                        }
                    }

                    MemberEdit.AppRoles.BuildControl(UserRollArray);

                }

            } else {

                RetVal = false;
                MemberEdit.Message = RetMessage;

            }


            return RetVal;
        }

        MemberEdit.ConvertGUID = function (UserGUID) {

            var RetVal = 0;
            UserGUID = UserGUID.replace(/0|\-/g, "");
            if (UserGUID.length > 0) return 1;
            return RetVal;

        }

        MemberEdit.SetAppDetails = function () {

            MemberEdit.UnapprovedUser.ApplicationId = MemberEdit.SelectedApp.ApplicationID;
            MemberEdit.UnapprovedUser.ApplicationName = MemberEdit.SelectedApp.ApplicationName;
            MemberEdit.FindUser(MemberEdit.UnapprovedUser.UnapprovedUserName, MemberEdit.UnapprovedUser.ApplicationId);

        }

        MemberEdit.GetFeatureProfile = function (FeatureAction) {

            if (FeatureAction == "Assign") {

                MemberEdit.AssignProfile();

            } 
        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Assign profile.
        //
        //  AssignProfile                   Entryway for Check for user deactivation
        //  CheckForDeactivatedUser         Sets up confirm for user inactivation
        //  InactivateUserResponse          Callback from modal confirm
        //  ExecuteAssignProfile            Validation and execution of assignment
        //  AssignProfileResult             Callback on assignment. Resets environment
        //////////////////////////////////////////////////////////////////////////////////////
        MemberEdit.AssignProfile = function () {

            if (!MemberEdit.UnapprovedUser.UserApproved)
                MemberEdit.CheckForDeactivatedUser();
            else 
                MemberEdit.ExecuteAssignProfile();

        }

        MemberEdit.CheckForDeactivatedUser = function () {

            var UserBeingInactivated = false;
            var CurrentApp = MemberEdit.SelectedApp.ApplicationName;
            var UserInApp = MemberEditModel.GetPristineAccountInfo().MemberConfiguration.UserApps.UserInApp;
            var iLen = UserInApp.length;
            for (var i = 0; i < iLen; i++) {

                if (UserInApp[i].ApplicationName == CurrentApp) {

                    if (UserInApp[i].IsUserApproved) UserBeingInactivated = true;
                    break;

                }
            }

            if (UserBeingInactivated) {

                MemberEdit.ModalAttribute = {ModalType: "mdlYesNo", ModalMessage: "Are you sure you want to inactivate this user?", ModalHeight: 80, "ModalWidth": 350, ModalTitle: "Membership Confirm", ValidationMessage: ""};
                scope.$apply();

            } else {

                MemberEdit.ExecuteAssignProfile();

            }
        }

        MemberEdit.InactivateUserResponse = function (ConfirmId) {

            if (ConfirmId == 0) {

                MemberEdit.UnapprovedUser.UserApproved = true;

            }

            MemberEdit.ExecuteAssignProfile();

        }

        MemberEdit.ExecuteAssignProfile = function () {


            var AssignGroupId = 0;
            if (MemberEdit.SelectedGroup != null) AssignGroupId = MemberEdit.SelectedGroup.FeatureGroupNameId;
            var isValid = MemberEditModel.ValidateAssignment(MemberEdit.TreeAttribute, MemberEdit.UnapprovedUser, AssignGroupId);
            if (isValid == "") {

                //MemberConfiguration
                MemberEdit.Message = "Please wait. Assigning feature access.";
                MemberEditModel.AssignProfile(MemberEdit.UnapprovedUser).then(AssignProfileResult).catch(AssignProfileResult);
                function AssignProfileResult(Message) { MemberEdit.AssignProfileResult(Message) };

            } else {

                if (isValid.indexOf("unchanged") > -1) {

                    var GroupIdSelect = MemberEdit.MemberAccount.TreeItems.AssignGroupNameId;
                    MemberEdit.SetGroupAssociation(MemberEdit.MemberAccount.MemberConfiguration.TreeItems.AssignGroupNameId);

                }

                MemberEdit.Message = isValid;

            }
        }

        MemberEdit.AssignProfileResult = function (Message) {

            if (Message == "") {

                var GroupIdSelect = MemberEditModel.AssignAccountInfoAfterUpdate(MemberEdit.TreeAttribute);
                //MemberEdit.SetGroupAssociation(MemberEditModel.GetPristineAccountInfo().TreeItems.FeatureItems);
                MemberEdit.SetGroupAssociation(MemberEdit.MemberAccount.MemberConfiguration.TreeItems.AssignGroupNameId);
                MemberEdit.Message = "Please select another application to configure or click Exit.";

            } else {

                MemberEdit.Message = Message;

            }
        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Membership merge functionality
        //
        //  MembershipMergeTest             Simple call to Cricket db to see if I can get there
        //  CheckCricketConnectionResult    Callback
        //  MembershipMerge                 If I can get to Cricket, I should be able to merge
        //                                  members.
        //  MembershipMergeResult           Callback. Reset environment
        //////////////////////////////////////////////////////////////////////////////////////
        MemberEdit.MembershipMergeTest = function (ApplicationName) {

            MemberEdit.MergeApplicationName = ApplicationName;
            MemberEdit.Message = "Checking for Cricket Connection ...";
            MemberEditModel.CheckCricketConnection().then(CheckCricketConnectionResult).catch(CheckCricketConnectionResult);
            function CheckCricketConnectionResult(Message) { MemberEdit.CheckCricketConnectionResult(Message) }

        }

        MemberEdit.CheckCricketConnectionResult = function (Message) {

            if (Message.indexOf("success") == -1) {

                MemberEdit.Message = Message;

            } else {

                MemberEdit.MembershipMerge();

            }
        }

        MemberEdit.MembershipMerge = function () {

            MemberEdit.Message = "Cricket connection established. Moving Cricket members to Membership database ...";
            MemberEditModel.MembershipMerge(MemberEdit.MergeApplicationName).then(MembershipMergeResult).catch(MembershipMergeResult);
            function MembershipMergeResult(Message) { MemberEdit.MembershipMergeResult(Message) }

        }

        MemberEdit.MembershipMergeResult = function (Message) {

            MemberEdit.MergeApplicationName = "";
            if (Message.indexOf("success") == -1) {

                MemberEdit.Message = Message;

            } else {

                for (var key in MemberEdit.MemberEditFields()) MemberEdit.MemberEditFields()[key].attr("disabled", true);
                for (var key in MemberEdit.UserManageButtons()) MemberEdit.UserManageButtons()[key].attr("disabled", true);
                MemberEdit.UserManageButtons().Exit.removeAttr("disabled");
                MemberEdit.Message = Message + " Click Exit to return to the main screen.";

            }
        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Validation
        //////////////////////////////////////////////////////////////////////////////////////
        MemberEdit.ValidateElement = function (key) {

            var isValid = MemberEditModel.ValidateFieldEntry(null, key, null, true, MemberEdit.MemberEditFields()[key].val());
            return isValid;
        }

        MemberEdit.CheckFindUser = function () {

            var isValid = MemberEdit.ValidateElement("UserName");
            if (isValid == "") {

                MemberEdit.FindUser(MemberEdit.UserName, null);

            } else {

                MemberEdit.ProcessHelper.CurrentKey = "UserName";
                MemberEdit.ProcessHelper.ValidationMessage = sValid;

            }
        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Screen Manipulation
        //
        //  ShowHideButtons                 Hides array of buttons if isHide is true
        //  HideAllButtons                  Hides all buttons
        //  GiveDirection                   Validation helper. Displays retuned message
        //  HideContainers                  Hides all defined containers for screen
        //  ReturnToMainScreen              Returns to main screen or base edit screens
        //////////////////////////////////////////////////////////////////////////////////////
        MemberEdit.ShowMessage = function (Message) {

            MemberEdit.Message = Message;

        }

        MemberEdit.ShowHideButtons = function (ButtonArray, isHide) {

            if (ButtonArray) {

                var iLen = ButtonArray.length;
                for (var i = 0; i < iLen; i++) {

                    if (isHide)
                        MemberEdit.UserManageButtons()[ButtonArray[i]].hide();
                    else
                        MemberEdit.UserManageButtons()[ButtonArray[i]].show();

                }
            }
        }

        MemberEdit.HideAllButtons = function () {

            for (var key in MemberEdit.UserManageButtons()) MemberEdit.UserManageButtons()[key].hide();

        }

        MemberEdit.GiveDirection = function () {

            if (MemberEdit.ProcessHelper.CurrentKey) {

                MemberEdit.Message = MemberEdit.ProcessHelper.ValidationMessage;
                MemberEdit.ProcessHelper.ValidationMessage = "";
                MemberEdit.MemberEditFields()[MemberEdit.ProcessHelper.CurrentKey].select();
                MemberEdit.ProcessHelper.CurrentKey = null;
                scope.$apply();

            }
        }

        MemberEdit.HideContainers = function () {

            for (var key in MemberEdit.UserManageScreens()) MemberEdit.UserManageScreens()[key].hide();

        }

        MemberEdit.ReturnToMainScreen = function () {

            if (MemberEdit.ProcessHelper.Process == "UpdateUser") {

                MemberEdit.ProcessHelper.ProcessName = MemberEdit.ProcessHelper.PreviousProcess;
                MemberEdit.ProcessHelper.PreviousProcess = "";
                MemberEdit.SetProcess(MemberEdit.ProcessHelper.ProcessName);

            } else {

                $location.url(AppState.GetPreviousRoute());

            }
        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Process
        //
        //  CheckValidation                 Keydown handler on view
        //  CheckProcess                    Keydown helper
        //  GotoUpdateUser                  Grid selection helper
        //  SetProcess                      Helper for app entry
        //  RegisterRoute                   Registers round with State and sets process
        //////////////////////////////////////////////////////////////////////////////////////
        MemberEdit.CheckValidation = function (event) {

            if (event.keyCode == 13 || event.keyCode == 9) {

                MemberEdit.CheckProcess();
                return false;

            }
        }

        MemberEdit.CheckProcess = function () {

            if (MemberEdit.ProcessHelper.Process == "UpdateUser") {

                MemberEdit.CheckUpdateUser();

            } else if (MemberEdit.ProcessHelper.Process == "FindUser") {

                MemberEdit.CheckFindUser();

            }
        }

        MemberEdit.GotoUpdateUser = function (UserGuid) {

            if (UserGuid == null || UserGuid == "") {

                MemberEdit.Message = "Failed to retrieve user id.";

            } else {

                MemberEdit.GetUser(UserGuid);

            }
        }

        MemberEdit.SetProcess = function (ProcessName) {

            MemberEdit.HideAllButtons();
            if (!MemberEdit.ProcessHelper || MemberEdit.ProcessHelper == null) MemberEdit.ProcessHelper = MemberEditModel.GetProcessHelperContract();
            if (MemberEdit.ProcessHelper.Process != null && MemberEdit.ProcessHelper.Process != "UpdateUser") MemberEdit.ProcessHelper.PreviousProcess = MemberEdit.ProcessHelper.Process;
            MemberEdit.ProcessHelper.Process = ProcessName;
            MemberEdit.HideContainers();

            if (ProcessName == "FindUser") {

                MemberEdit.ManageUserNameItem().UserNameItem.show();
                MemberEdit.FindUserInit();

            } else if (ProcessName == "ManageMembers") {

                MemberEdit.UserManageScreens().UserList.show();
                MemberEdit.GetPendingUsers();

            } else if (ProcessName == "UpdateUser") {

                MemberEdit.UserManageScreens().UserApprove.show();

            } else if (ProcessName == "MembershipMergeCricket") {

                MemberEdit.MembershipMergeTest('Cricket');

            } else if (ProcessName == "MembershipMergePayday") {

                MemberEdit.MembershipMergeTest('Payday');

            } 
        }

        MemberEdit.RegisterRoute = function (CallingRoute) {

            var AppName = CallingRoute.split(".");
            if (CallingRoute == "MemberManagement") CallingRoute = "Membership";
            AppState.SetRoute(AppName[1], CallingRoute);
            return AppName[1];

        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Event Handlers --- Need to ensure that user name is begin shown!!!!
        //////////////////////////////////////////////////////////////////////////////////////
        scope.$watch('$viewContentLoaded', function (event, viewConfig) {

            var CallingRoute = "MemberManagement." + $location.$$path.replace("/App/MemberManagement", "");
            var ProcessName = MemberEdit.RegisterRoute(CallingRoute);
            MemberEdit.SetProcess(ProcessName);

        });

        $("#ManageContainer input").off("focus").on("focus",
        function (event) {

            MemberEdit.GiveDirection();

        });

        $("#btnManageSubmit").off("click").on("click",
        function () {

            MemberEdit.CheckProcess();

        });

        $(function () {
            $(this).off("OnPageChanged").on("OnPageChanged", function (EventArgs) {
                MemberEdit.GetPendingUsers(EventArgs.ReturnedContext);
            });
        });

        $(function () {
            $(this).off("OnGridItemSelected").on("OnGridItemSelected", function (EventArgs) {
                var EventProperty = EventArgs.ReturnedContext;
                MemberEdit.GotoUpdateUser(EventArgs.ReturnedContext);
            });
        });

        //////////////////////////////////////////////////////////////////////////////////////
        //  OttJS Helpers
        //////////////////////////////////////////////////////////////////////////////////////
        MemberEdit.GetCheckObject = function () {

            var ChkContextArray = new Array();
            ChkContextArray['ControlType'] = "checkbox";
            ChkContextArray['Title'] = "Select all roles that apply";
            ChkContextArray['Columns'] = 2
            ChkContextArray['LabelWidth'] = 100;
            ChkContextArray['LabelHeight'] = 16;
            ChkContextArray['CheckBoxValueField'] = "RoleValue";
            ChkContextArray['CheckBoxLabelField'] = "RoleName";
            ChkContextArray['CheckBoxCheckedFlag'] = "InRole";
            ChkContextArray['AttachToObjectId'] = "RoleListContainerParent";
            ChkContextArray['ContainerID'] = "RoleListContainer";
            ChkContextArray['EventOnInputClick'] = "OnRoleSelected";
            RoleCheckBoxes = new CheckboxCollectionObject(ChkContextArray);

            return RoleCheckBoxes;

        }

        MemberEdit.GetMemberAttribs = function () {

            var GridAttributes = {

                GridParent: 'MemberGridContainer',
                GridListContainer: 'GridListProduct',
                GridListIdField: 'UserId',
                GridWidth: 0,
                GridListHeight: 150,
                CellPadding: 30,
                CellHeight: 5,
                UseDefaultStyle: false,
                AutoComputeCellWidths: true,
                AutoComputeCellAlignment: true,
                ContentOverflow: false,
                ShowPager: true,
                PageSize: 5,
                PagerAlign: 'right',
                PagerStyle: 'flat',
                PagerButtonMargin: 0,
                PagerShowEndButtons: true,
                PagerShowGotoField: true,
                GridInitialSortField: 'LastName',
                CellBordersOn: true,
                GridFont: 'verdana',
                GridFontSize: 8,
                GridBackColor: '#dcdabc',
                HeaderBackColor: '#dcdabc',
                HeaderFontColor: 'gray',
                HeaderBorderColor: '#dddddd',
                GridListBackColor: 'silver',
                CellBackColor: '#fefefe',
                CellFontColor: 'gray',
                AltCellBackColor: '#eeeeee',
                AltCellFontColor: 'gray',
                CellBorderColor: '#dedede',
                ButtonBackground: null,
                ButtonForeground: null,
                CellAlign: new Array(),
                CellWidth: new Array(),
                HeaderAliasList: new Array("UserId", "User Name", "First Name", "Last Name", "Email"),
                GridColumnArrange: new Array("UserId", "UserName", "FirstName", "LastName", "Email"),
                GridColumnExcludeList: new Array("UserId")

            }

            return GridAttributes;

        }
    }
})();