(function () {
    angular.module('App.MemberManagement').factory('FeatureManagementModel',
    ['$q', '$http', '$timeout', 'ManageService', 'ManageUserContracts', 'Validation', 'AppState', FeatureManagementModel]);

    function FeatureManagementModel($q, $http, $timeout, ManageService, ManageUserContracts, Validation, AppState) {

        var serviceName = 'FeatureManagementModel';        // route to the same origin Web Api controller - root directory

        //////////////////////////////////////////////////////////////////////////////////////
        //  Global variables
        //////////////////////////////////////////////////////////////////////////////////////
        var GroupFeatureTreeCollection;                             //  Feature tree belonging to a selected group
        var PristineGroupTree;                                      //  Keeps prinstine copy of group tree
        var AppList;                                                //  List of apps for maintenance app
        var AppGroups;                                              //  Returned list of groups for application 

        var FeatureManagementModelMethods = {

            GetApps: GetApps,
            GetAppList: GetAppList,
            GetAppGroupNames: GetAppGroupNames,
            GetAppGroups: GetAppGroups,
            ValidateFieldEntry: ValidateFieldEntry,
            GetFeatureTree: GetFeatureTree,
            AddFeatureTreeGroup: AddFeatureTreeGroup,
            GetGroupFeatureTreeCollection: GetGroupFeatureTreeCollection,
            UpdateFeatureTreeGroup: UpdateFeatureTreeGroup,
            GetProcessHelperContract: GetProcessHelperContract,
            ValidateGroup: ValidateGroup,
            ValidateGroupItems: ValidateGroupItems,
            CompareFeatureSelectToActiveGroup: CompareFeatureSelectToActiveGroup
        };

        return FeatureManagementModelMethods;

        //////////////////////////////////////////////////////////////////////////////////////
        //  Accessors
        //////////////////////////////////////////////////////////////////////////////////////
        function GetGroupFeatureTreeCollection() {

            return GroupFeatureTreeCollection;

        }

        function GetAppList() {

            if(AppList.length > 0)
                return AppList;
            else
                return null;

        }

        function GetAppGroups() {

            if (AppGroups.length > 0)
                return AppGroups;
            else
                return null;

        }

        function GetProcessHelperContract() {

            return ManageUserContracts.GetProcessHelperContract();

        }

        function GetPristineGroupTree() {

            return PristineGroupTree;

        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Service Calls
        //////////////////////////////////////////////////////////////////////////////////////
        //  Get Application Groups
        //////////////////////////////////////////////////////////////////////////////////////
        function GetAppGroupNames(ApplicationId) {

            var deferred = $q.defer();

            $timeout(GetAppGroupNamesImpl, 0);

            function GetAppGroupNamesImpl() {

                var request = ManageUserContracts.GetApplicationGroupsRequest();
                request.ApplicationId = ApplicationId;
                ManageService.SendRequest(request, 'GetAppGroupNames').then(ShowResult).catch(showError);

            }

            function ShowResult(data) {

                AppGroups = data.data.AppGroupNames.Groups;
                deferred.resolve(data.data.AppGroupNames.Message);

            }

            function showError() {

                deferred.reject("Communication failed");

            }

            return deferred.promise;

        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Get Application List
        //////////////////////////////////////////////////////////////////////////////////////
        function GetApps() {

            var deferred = $q.defer();

            $timeout(GetAppsImpl, 0);

            function GetAppsImpl() {

                ManageService.SendRequest('', 'GetAppList').then(ShowResult).catch(showError);

            }

            function ShowResult(data) {

                AppList = data.data.AppList.AppList;
                deferred.resolve(data.data.AppList.Message);

            }

            function showError() {

                deferred.reject("Communication failed");

            }

            return deferred.promise;

        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Get Feature Tree Group
        //////////////////////////////////////////////////////////////////////////////////////
        function GetFeatureTree(ApplicationId, GroupNameId) {

            var deferred = $q.defer();
            var FeatureTreeRequest = ManageUserContracts.GetFeatureTreeRequest();
            FeatureTreeRequest.GroupNameId = GroupNameId;
            FeatureTreeRequest.ApplicationId = ApplicationId;
            if(GroupNameId == 0) FeatureTreeRequest.UserId = AppState.GetUserId();

            $timeout(GetFeatureTreeImpl, 0);

            function GetFeatureTreeImpl() {

                ManageService.SendRequest(FeatureTreeRequest, 'GetFeatureList').then(ShowResult).catch(showError);

            }

            function ShowResult(data) {

                GroupFeatureTreeCollection = data.data.TreeItems;
                PristineGroupTree = jQuery.extend(true, {}, data.data.TreeItems);
                deferred.resolve(data.data.TreeItems.Message);

            }

            function showError() {

                deferred.reject("Communication failed");

            }

            return deferred.promise;

        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Update feature tree group 
        //////////////////////////////////////////////////////////////////////////////////////
        function UpdateFeatureTreeGroup(FeatureItems, GroupNameId, ApplicationId) {

            var deferred = $q.defer();
            var UpdateFeatureGroupRequest = ManageUserContracts.GetAddUpdateFeatureTreeGroupRequest();
            UpdateFeatureGroupRequest.TreeItems = FeatureItems;
            UpdateFeatureGroupRequest.FeatureGroupNameId = GroupNameId;
            UpdateFeatureGroupRequest.ApplicationId = ApplicationId;
            //AddFeatureGroupRequest.UserId = AppState.GetUserId();

            $timeout(UpdateFeatureTreeGroupImpl, 0);

            function UpdateFeatureTreeGroupImpl() {

                ManageService.SendRequest(UpdateFeatureGroupRequest, 'UpdateFeatureTreeGroup').then(ShowResult).catch(showError);

            }

            function ShowResult(data) {

                GroupFeatureTreeCollection = data.data.FeatureTreeGroups.Groups;
                deferred.resolve(data.data.FeatureTreeGroups.Message);

            }

            function showError() {

                deferred.reject("Communication failed");

            }

            return deferred.promise;

        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Add feature tree group 
        //////////////////////////////////////////////////////////////////////////////////////
        function AddFeatureTreeGroup(FeatureItems, GroupName, ApplicationId) {

            var deferred = $q.defer();
            var AddFeatureGroupRequest = ManageUserContracts.GetAddUpdateFeatureTreeGroupRequest();
            AddFeatureGroupRequest.TreeItems = FeatureItems;
            AddFeatureGroupRequest.FeatureGroupName = GroupName;
            AddFeatureGroupRequest.ApplicationId = ApplicationId;
            AddFeatureGroupRequest.UserId = AppState.GetUserId();

            $timeout(AddFeatureTreeGroupImpl, 0);

            function AddFeatureTreeGroupImpl() {

                ManageService.SendRequest(AddFeatureGroupRequest, 'AddFeatureTreeGroup').then(ShowResult).catch(showError);

            }

            function ShowResult(data) {

                GroupFeatureTreeCollection = data.data.FeatureTreeGroups.Groups;
                deferred.resolve(data.data.FeatureTreeGroups.Message);

            }

            function showError() {

                deferred.reject("Communication failed");

            }

            return deferred.promise;

        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Model Validators -- Cannot do the update at this level. This is just a validator
        //
        //  ValidateFieldEntry                      Works with Validator service
        //  ValidateGroup                           Validates group name against name in list --- this stuff definitely needs to be re-validated on the other side.
        //  ValidateGroupItems                      Validates to ensure there is a selection against the items
        //  CompareFeatureSelectToActiveGroup       Validates selections against pristine group
        //////////////////////////////////////////////////////////////////////////////////////
        function ValidateFieldEntry(ContractEntryField, key, MapToKey, Required, value) {

            return Validation.ValidateFieldEntry(ContractEntryField, key, MapToKey, Required, value);

        }

        function ValidateGroup(FeatureItems, NewGroupName) {

            var isValid = "";
            var iLen = AppGroups.length;
            for (var i = 0; i < iLen; i++) {

                if (AppGroups[i].FeatureGroupName == NewGroupName) {

                    isValid = "Group name already taken. Please select another name.";
                    break;
                }
            }

            return isValid;
        }

        function ValidateGroupItems(FeatureItems) {

            var isValid = "";
            var TrueCount = 0;
            var iLen = FeatureItems.length;

            if (iLen > 0) {

                for (var i = 0; i < iLen; i++) {

                    if (FeatureItems[i].FeatureTreeAccess) {

                        TrueCount++;
                        break;

                    }
                }

                if (TrueCount == 0) isValid = "Group must have selected items.";

            }

            return isValid;

        }

        function CompareFeatureSelectToActiveGroup(FeatureItems) {

            var RetVal = "No change has occurred. No need to update.";
            var ActiveGroup = GetPristineGroupTree();
            if (ActiveGroup && ActiveGroup.FeatureItems.length > 0) {

                var iLen = ActiveGroup.FeatureItems.length;
                for (var i = 0; i < iLen; i++) {

                    if (ActiveGroup.FeatureItems[i].FeatureTreeAccess != FeatureItems[i].FeatureTreeAccess) {

                        RetVal = "";
                        break;

                    }
                }
            } 

            return RetVal;

        }
    }
})();