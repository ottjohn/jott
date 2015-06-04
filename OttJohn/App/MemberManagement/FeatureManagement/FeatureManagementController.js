(function () {
    angular.module('App.MemberManagement').controller('FeatureManagementController',
    ['$q', '$timeout', '$location', 'ManageService', 'ManageUserContracts', 'FeatureManagementModel', '$rootScope', 'AppState', FeatureManagementController]);

    function FeatureManagementController($q, $timeout, $location, ManageService, ManageUserContracts, FeatureManagementModel, $rootScope, AppState) {

        var FeatureManagement = this;
        var scope = $rootScope.$new();

        //////////////////////////////////////////////////////////////////////////////////////
        //  Global variables
        //////////////////////////////////////////////////////////////////////////////////////
        FeatureManagement.Apps;                                     //  App list returned from model.
        FeatureManagement.SelectedApp;                              //  Selected app bound to app dropdown

        FeatureManagement.ManageTreeGroups;                         //  Returned group name list
        FeatureManagement.SelectedGroup;                            //  Selected group name bound to group dropdown
        FeatureManagement.NewGroupName;                             //  Bound to field for add group              
        FeatureManagement.CurrentGroupIdx;                          //  Placeholder for update refresh 
        FeatureManagement.AddGroupFlag;                             //  Flag to indicate that group has been added ... placeholder for selected group now end of returned list

        FeatureManagement.ProcessHelper;                            //  Process helper contract. I really do not nee this.
        FeatureManagement.ModalAttribute = {};                      //  Modal dialog attribute
        FeatureManagement.TreeAttribute = '';                       //  Feature tree attribute

        //////////////////////////////////////////////////////////////////////////////////////
        //  Accessors
        //////////////////////////////////////////////////////////////////////////////////////
        FeatureManagement.FeatureManagementFields = function () {

            var FeatureManagementFields = {

                NewGroupName: $("#txtGroupName")

            }

            return FeatureManagementFields;

        }

        FeatureManagement.DropItems = function () {

            var Drops = {

                AppGroups: $("#drpFeatureManageGroups"),
                Apps: $("#drpApplications")

            }

            return Drops;

        }

        FeatureManagement.UserManageButtons = function () {

            var UserManageButtons = {

                Exit: $("#btnFeatureManagementExit"),
                AddProfile: $("#btnFeatureManagementAddProfile"),
                SubmitGroup: $("#btnFeatureManagementSubmitGroup"),
                UpdateGroup: $("#btnFeatureManagementUpdateGroupProfile")

            }

            return UserManageButtons;

        }

        FeatureManagement.MessageFromDirective = function () {

            mdlContract = FeatureManagement.ModalAttribute;
            FeatureManagement.ModalAttribute = {};
            FeatureManagement.CheckToAdoptCurrentFeatureSet(mdlContract);

        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Get Apps
        //
        //  GetApps                         Retrieves app list for maintenance
        //  GetAppsResult                   Callback, preps for app select
        //////////////////////////////////////////////////////////////////////////////////////
        FeatureManagement.GetApps = function () {

            FeatureManagementModel.GetApps().then(GetAppsResult).catch(GetAppsResult);
            function GetAppsResult(Message) { FeatureManagement.GetAppsResult(Message) };

        }

        FeatureManagement.GetAppsResult = function (Message) {

            if (Message == "") {

                FeatureManagement.Message = "Please select an application from the dropdown to begin.";
                FeatureManagement.Apps = FeatureManagementModel.GetAppList();
                if (FeatureManagement.Apps.length > 0) FeatureManagement.DropItems().Apps.removeAttr("disabled");

            } else {

                FeatureManagement.Message = Message;

            }

            scope.$apply();

        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Get group names for app
        //
        //  SetAppDetails                   OnChange hanlder for app dropdown. 
        //                                  Calls GetAppGroupNames after prepping environment
        //  GetAppGroupNamesResult          Callback. Finishes setting up environment
        //////////////////////////////////////////////////////////////////////////////////////
        FeatureManagement.SetAppDetails = function () {

            if (FeatureManagement.SelectedApp != null) {

                FeatureManagement.TreeAttribute = "";
                FeatureManagement.HideAllButtons();
                FeatureManagement.DropItems().AppGroups.attr("disabled", true);

                FeatureManagementModel.GetAppGroupNames(FeatureManagement.SelectedApp.ApplicationId).then(GetAppGroupNamesResult).catch(GetAppGroupNamesResult);
                function GetAppGroupNamesResult(Message) { FeatureManagement.GetAppGroupNamesResult(Message) };

            }
        }

        FeatureManagement.GetAppGroupNamesResult = function (Message) {

            if (Message == "") {

                FeatureManagement.ManageTreeGroups = FeatureManagementModel.GetAppGroups();
                FeatureManagement.ShowHideButtons(new Array("Exit", "AddProfile"), false);
                if (FeatureManagement.ManageTreeGroups != null) {

                    FeatureManagement.DropItems().AppGroups.removeAttr("disabled");
                    FeatureManagement.Message = "Please select a group from the dropdown or click Add Group Profile to continue.";

                } else {

                    FeatureManagement.Message = "No groups associated with application. Click Add Group Profile to create one.";

                }

            } else {

                FeatureManagement.Message = Message;

            }

            scope.$apply();

        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Get Feature Tree group 
        //
        //  GetNamedGroup                   OnChange handler for group dropdown
        //  GetFeatureTree                  Gets feature tree based on GroupNameId
        //  GetFeatureTreeResult            Callback. Preps for user edit
        //////////////////////////////////////////////////////////////////////////////////////
        FeatureManagement.GetNamedGroup = function () {

            if (FeatureManagement.SelectedGroup == null) {

                FeatureManagement.ShowHideButtons(new Array("UpdateGroup"), true);

            } else {

                FeatureManagement.AddGroupFlag = 0;
                FeatureManagement.GetFeatureTree("", FeatureManagement.SelectedGroup.FeatureGroupNameId);

            }
        }

        FeatureManagement.GetFeatureTree = function (ApplicationId, GroupNameId) {

            FeatureManagementModel.GetFeatureTree(ApplicationId, GroupNameId).then(GetFeatureTreeResult).catch(GetFeatureTreeResult);
            function GetFeatureTreeResult(Message) { FeatureManagement.GetFeatureTreeResult(Message) }

        }

        FeatureManagement.GetFeatureTreeResult = function (Message) {

            if (Message == "") {

                FeatureManagement.TreeAttribute = FeatureManagementModel.GetGroupFeatureTreeCollection();
                if (FeatureManagement.AddGroupFlag == 1) {

                    FeatureManagement.AddGroupNameInit();

                } else {

                    FeatureManagement.Message = "Select features to include in group in the feature menu on the left, the click Update to save.";
                    FeatureManagement.ShowHideButtons(new Array("UpdateGroup"), false);
                    FeatureManagement.ShowHideButtons(new Array("SubmitGroup"), true)

                }

            } else {

                var ValidationMessage = "Error finding feature tree group.";

            }

            scope.$apply();

        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Update feature access group
        //
        //  UpdateFeatureTreeGroup          Validates groups, then updates through model
        //  SetCurrentGroupIdx              Update brings the group list back, so the 
        //                                  index needs to be saved between calls
        //  UpdateFeatureTreeGroupResult    Callback. Rests environment
        //////////////////////////////////////////////////////////////////////////////////////
        FeatureManagement.UpdateFeatureTreeGroup = function () {

            var isValid = FeatureManagement.ValidateGroup(FeatureManagement.TreeAttribute.FeatureItems, "");
            if (isValid == "") {

                FeatureManagement.Message = "Please wait. Updating feature tree group.";
                FeatureManagement.SetCurrentGroupIdx();
                FeatureManagementModel.UpdateFeatureTreeGroup(FeatureManagement.TreeAttribute.FeatureItems, FeatureManagement.SelectedGroup.FeatureGroupNameId, FeatureManagement.SelectedApp.ApplicationId).then(UpdateFeatureTreeGroupResult).catch(UpdateFeatureTreeGroupResult);
                function UpdateFeatureTreeGroupResult(Message) { FeatureManagement.UpdateFeatureTreeGroupResult(Message) };

            } else {

                FeatureManagement.Message = isValid;

            }
        }

        FeatureManagement.UpdateFeatureTreeGroupResult = function (Message) {

            if (Message == "") {

                FeatureManagement.ManageTreeGroups = FeatureManagementModel.GetGroupFeatureTreeCollection();
                FeatureManagement.SelectedGroup = FeatureManagement.ManageTreeGroups[FeatureManagement.CurrentGroupIdx];
                FeatureManagement.Message = "Please select a different application, a different group, or add a group to continue.";

            } else {

                FeatureManagement.Message = Message;

            }
        }

        FeatureManagement.SetCurrentGroupIdx = function () {

            var iLen = FeatureManagement.ManageTreeGroups.length;
            for (var i = 0; i < iLen; i++) {

                if (FeatureManagement.ManageTreeGroups[i].FeatureGroupNameId == FeatureManagement.SelectedGroup.FeatureGroupNameId) {

                    FeatureManagement.CurrentGroupIdx = i;
                    break;

                }
            }
        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Add feature access group
        //
        //  AddGroupInit                    Check if a group is already selected. If so, shows
        //                                  modal to ask if that group should be used as a
        //                                  template. Otherwise, it's a blank template.
        //  CheckToAdoptCurrentFeatureSet   Helper for above
        //  AddGroupNameInit                Checks to ensure there is a feature tree template
        //                                  available. If so, shows the add group field.
        //  AddFeatureTreeGroup             Validates group name and feature tree. If valid, submits.
        //  AddFeatureTreeGroupResult       Callback. Restores environment for update/add
        //////////////////////////////////////////////////////////////////////////////////////
        FeatureManagement.AddGroupInit = function () {

            FeatureManagement.AddGroupFlag = 1;
            if (FeatureManagement.SelectedGroup && FeatureManagement.SelectedGroup != null) {

                FeatureManagement.ModalAttribute = {ModalType: "mdlYesNo", ModalMessage: "Would you like to adopt the feature set of the selected group?", ModalHeight: 80, ModalWidth: 350, ModalTitle: "Membership Confirm", ValidationMessage: ""};
                scope.$apply();

            } else {

                FeatureManagement.GetFeatureTree(FeatureManagement.SelectedApp.ApplicationId, "");

            }
        }

        FeatureManagement.CheckToAdoptCurrentFeatureSet = function (mdlContractRetFlag) {

            if (mdlContractRetFlag == 1) {

                FeatureManagement.AddGroupNameInit();

            } else {

                FeatureManagement.GetFeatureTree(FeatureManagement.SelectedApp.ApplicationId, "");

            }
        }

        FeatureManagement.AddGroupNameInit = function () {

            if (FeatureManagement.TreeAttribute.FeatureItems.length == 0) {

                FeatureManagement.Message = "No feature tree associated with application. Please see system admin to create one.";

            } else {

                $("#AddTreeGroupComp").show();
                FeatureManagement.ShowHideButtons(new Array("AddProfile", "UpdateGroup"), true);
                FeatureManagement.ShowHideButtons(new Array("SubmitGroup"), false);
                FeatureManagement.Message = "Enter new group name and select all features that apply to the new group. Click submit to save.";
                FeatureManagement.FeatureManagementFields().NewGroupName.focus();

            }
        }

        FeatureManagement.AddFeatureTreeGroup = function () {

            FeatureManagement.ProcessHelper.CurrentKey = "NewGroupName";
            isValid = FeatureManagement.ValidateGroup(FeatureManagement.TreeAttribute.FeatureItems, FeatureManagement.NewGroupName);

            if (isValid != "") {

                FeatureManagement.ProcessHelper.ValidationMessage = isValid;
                FeatureManagement.GiveDirection();
                FeatureManagement.ProcessHelper.ValidationMessage = "";

            } else {

                FeatureManagement.Message = "Please wait. Adding feature tree group.";
                FeatureManagementModel.AddFeatureTreeGroup(FeatureManagement.TreeAttribute.FeatureItems, FeatureManagement.NewGroupName, FeatureManagement.SelectedApp.ApplicationId).then(AddFeatureTreeGroupResult).catch(AddFeatureTreeGroupResult);
                function AddFeatureTreeGroupResult(Message) { FeatureManagement.AddFeatureTreeGroupResult(Message) };

            }
        }

        FeatureManagement.AddFeatureTreeGroupResult = function (Message) {

            if (Message == "") {

                FeatureManagement.ManageTreeGroups = FeatureManagementModel.GetGroupFeatureTreeCollection();
                FeatureManagement.SelectedGroup = FeatureManagement.ManageTreeGroups[FeatureManagement.ManageTreeGroups.length - 1];
                FeatureManagement.ShowHideButtons(new Array("UpdateGroup", "AddProfile"), false);
                FeatureManagement.ShowHideButtons(new Array("SubmitGroup"), true);
                FeatureManagement.FeatureManagementFields().NewGroupName.val("");
                $("#AddTreeGroupComp").hide();
                FeatureManagement.Message = "Please select a different application, a different group, or add a group to continue.";

            } else {

                FeatureManagement.Message = Message;

            }
        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Validation
        //////////////////////////////////////////////////////////////////////////////////////
        FeatureManagement.ValidateElement = function (key) {

            var isValid = FeatureManagementModel.ValidateFieldEntry(null, key, null, true, FeatureManagement.FeatureManagementFields()[key].val());
            return isValid;
        }
        
        FeatureManagement.ValidateGroup = function (FeatureItems, NewGroupName) {

            var isValid = "";
            if(FeatureManagement.AddGroupFlag == 1) isValid = FeatureManagement.ValidateElement("NewGroupName");
            if (isValid == "" && FeatureManagement.AddGroupFlag == 1) isValid = FeatureManagementModel.ValidateGroup(FeatureItems, NewGroupName);
            if (isValid == "") isValid = FeatureManagementModel.ValidateGroupItems(FeatureItems);
            if (isValid == "" && FeatureManagement.AddGroupFlag == 0) isValid = FeatureManagementModel.CompareFeatureSelectToActiveGroup(FeatureItems);
            return isValid;

        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  GUI Manip
        //////////////////////////////////////////////////////////////////////////////////////
        FeatureManagement.ShowHideButtons = function (ButtonArray, isHide) {

            if (ButtonArray) {

                var iLen = ButtonArray.length;
                for (var i = 0; i < iLen; i++) {

                    if (isHide)
                        FeatureManagement.UserManageButtons()[ButtonArray[i]].hide();
                    else
                        FeatureManagement.UserManageButtons()[ButtonArray[i]].show();

                }
            }
        }

        FeatureManagement.HideAllButtons = function () {

            for (var key in FeatureManagement.UserManageButtons()) FeatureManagement.UserManageButtons()[key].hide();

        }

        FeatureManagement.GiveDirection = function () {

            if (FeatureManagement.ProcessHelper.CurrentKey) {

                FeatureManagement.Message = FeatureManagement.ProcessHelper.ValidationMessage;
                FeatureManagement.FeatureManagementFields()[FeatureManagement.ProcessHelper.CurrentKey].select();
                FeatureManagement.ProcessHelper.CurrentKey = null;

            }
        }

        FeatureManagement.ReturnToMainScreen = function () {

            $location.url(AppState.GetPreviousRoute());

        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Process
        //////////////////////////////////////////////////////////////////////////////////////
        FeatureManagement.RegisterRoute = function (CallingRoute) {

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
            var ProcessName = FeatureManagement.RegisterRoute(CallingRoute);
            FeatureManagement.ProcessHelper = FeatureManagementModel.GetProcessHelperContract();
            FeatureManagement.GetApps();

        });

        $("#ManageContainer input").off("focus").on("focus",
        function (event) {

            FeatureManagement.GiveDirection();

        });

        $("#btnManageSubmit").off("click").on("click",
        function () {

            FeatureManagement.CheckProcess();

        }
        );

        $(function () {
            $(this).off("OnGridItemSelected").on("OnGridItemSelected", function (EventArgs) {
                var EventProperty = EventArgs.ReturnedContext;
                FeatureManagement.GotoUpdateUser(EventArgs.ReturnedContext);
            });
        });
    }
})();