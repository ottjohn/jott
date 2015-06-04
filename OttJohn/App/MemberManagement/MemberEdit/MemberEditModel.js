(function () {
    angular.module('App.MemberManagement').factory('MemberEditModel',
    ['$q', '$http', '$timeout', 'ManageService', 'ManageUserContracts', 'Validation', 'AppState', MemberEditModel]);

    function MemberEditModel($q, $http, $timeout, ManageService, ManageUserContracts, Validation, AppState) {

        var serviceName = 'MemberEditModel';        // route to the same origin Web Api controller - root directory

        //////////////////////////////////////////////////////////////////////////////////////
        //  Global variables
        //////////////////////////////////////////////////////////////////////////////////////
        var MemberInfoManager;                                      //  Used to hold results of pending members for grid
        var MemberInfo;                                             //  Used to hold account info from retrieved member
        var OriginalFeatureTreeCollection;                          //  Feature tree collection that came in with user lookup
        var PristineAccount;                                        //  Unaltered close of account lookup
        var GroupFeatureTreeCollection;                             //  Group feature tree from group name lookup          
        var ManageTreeGroups;                                       //  All groups under app

        //////////////////////////////////////////////////////////////////////////////////////
        //  Public methods
        //////////////////////////////////////////////////////////////////////////////////////
        var MemberEditModelModelMethods = {

            GetPendingUsers: GetPendingUsers,
            GetUnapprovedUserContract: GetUnapprovedUserContract,
            GetUser: GetUser,
            GetMemberManager: GetMemberInfoManager,
            GetMemberInfo: GetMemberInfo,
            ValidateFieldEntry: ValidateFieldEntry,
            MembershipMerge: MembershipMerge,
            GetFeatureTree: GetFeatureTree,
            GetFeatureTreeGroup: GetFeatureTreeGroup,
            GetGroupFeatureTreeCollection: GetGroupFeatureTreeCollection,
            GetOriginalFeatureTreeCollection: GetOriginalFeatureTreeCollection,
            AssignProfile: AssignProfile,
            GetProcessHelperContract: GetProcessHelperContract,
            GetPristineAccountInfo: GetPristineAccountInfo,
            CheckCricketConnection: CheckCricketConnection,
            AssignAccountInfoAfterUpdate: AssignAccountInfoAfterUpdate,
            ValidateAssignment: ValidateAssignment

        };

        return MemberEditModelModelMethods;

        //////////////////////////////////////////////////////////////////////////////////////
        //  Accessors
        //////////////////////////////////////////////////////////////////////////////////////
        function GetMemberInfoManager() {

            return MemberInfoManager;

        }

        function GetMemberInfo() {

            return MemberInfo;

        }

        function SetDeleteUser() {

            MemberInfo.DeleteUser = true;

        }

        function GetFeatureTreeGroup() {

            return ManageTreeGroups;

        }

        function GetGroupFeatureTreeCollection() {

            return GroupFeatureTreeCollection;

        }

        function GetOriginalFeatureTreeCollection() {

            return OriginalFeatureTreeCollection;

        }

        function GetUnapprovedUserContract() {

            return ManageUserContracts.GetUnapprovedUserContract();

        }

        function GetProcessHelperContract() {

            return ManageUserContracts.GetProcessHelperContract();

        }

        function GetPristineAccountInfo() {

            return PristineAccount;

        }

        function AssignAccountInfoAfterUpdate() {

            MemberInfo.MemberConfiguration.TreeItems.isDirty = false;
            PristineAccount = jQuery.extend(true, {}, MemberInfo);
            return PristineAccount.MemberConfiguration.TreeItems.AssignGroupNameId;

        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Service Calls
        //////////////////////////////////////////////////////////////////////////////////////
        //  GetUser
        //////////////////////////////////////////////////////////////////////////////////////
        function GetUser(UserGuid, UserName, ApplicationId) {

            var deferred = $q.defer();
            var GetUserRequest = ManageUserContracts.GetUserRequest();
            GetUserRequest.UserId = UserGuid;
            GetUserRequest.UserName = UserName;
            GetUserRequest.ApplicationId = ApplicationId;

            $timeout(GetUserImpl, 0);

            function GetUserImpl() {

                ManageService.SendRequest(GetUserRequest, 'GetUser').then(ShowResult).catch(showError);

            }

            function ShowResult(data) {

                MemberInfo = data.data.MemberManager;
                PristineAccount = jQuery.extend(true, {}, data.data.MemberManager);
                if(PristineAccount.Message == "") OriginalFeatureTreeCollection = MemberInfo.MemberConfiguration.TreeItems;
                deferred.resolve(MemberInfo.Message);

            }

            function showError() {

                deferred.reject("Communication failed");

            }

            return deferred.promise;
        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  GetPendingUsers
        //////////////////////////////////////////////////////////////////////////////////////
        function GetPendingUsers(CurrentPage, PageSize, SortField, SortDirection) {

            var deferred = $q.defer();
            var MemberRequest = ManageUserContracts.GetUnapprovedMembersRequest();
            MemberRequest.CurrentPage = CurrentPage;
            MemberRequest.PageSize = PageSize;
            MemberRequest.SortField = SortField;
            MemberRequest.SortDirection = SortDirection;

            $timeout(AddUserImpl, 0);

            function AddUserImpl() {

                ManageService.SendRequest(MemberRequest, 'GetUnapprovedMembers').then(ShowResult).catch(showError);

            }

            function ShowResult(data) {

                MemberInfoManager = data.data.MemberInfoManager;
                deferred.resolve(data.data.ErrorMessage);

            }

            function showError() {

                deferred.reject("Communication failed");

            }

            return deferred.promise;
        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Assign feature tree access
        //////////////////////////////////////////////////////////////////////////////////////
        function AssignProfile(UnapprovedUser) {

            var deferred = $q.defer();
            var AssignFeatureItemsRequest = ManageUserContracts.GetAssignFeatureItemsRequest();
            AssignFeatureItemsRequest.UserId = UnapprovedUser.UnapprovedUserId;
            AssignFeatureItemsRequest.UserApproved = UnapprovedUser.UserApproved;
            AssignFeatureItemsRequest.ApplicationId = UnapprovedUser.ApplicationId;
            AssignFeatureItemsRequest.MemberConfiguration = MemberInfo.MemberConfiguration;
            AssignFeatureItemsRequest.MemberConfigurationOld = GetPristineAccountInfo();

            $timeout(AssignProfileImpl, 0);

            function AssignProfileImpl() {

                ManageService.SendRequest(AssignFeatureItemsRequest, 'AssignProfile').then(ShowResult).catch(showError);

            }

            function ShowResult(data) {

                deferred.resolve(data.data.Message);

            }

            function showError() {

                deferred.reject("Communication failed");

            }

            return deferred.promise;

        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Get Feature Tree Group
        //////////////////////////////////////////////////////////////////////////////////////
        function GetFeatureTree(UserName, UserId, GroupNameId) {

            var deferred = $q.defer();
            var FeatureTreeRequest = ManageUserContracts.GetFeatureTreeRequest();
            FeatureTreeRequest.UserName = "";
            FeatureTreeRequest.UserId = UserId;
            FeatureTreeRequest.GroupNameId = GroupNameId;

            $timeout(GetFeatureTreeImpl, 0);

            function GetFeatureTreeImpl() {

                ManageService.SendRequest(FeatureTreeRequest, 'GetFeatureList').then(ShowResult).catch(showError);

            }

            function ShowResult(data) {

                GroupFeatureTreeCollection = data.data.TreeItems;
                deferred.resolve(data.data.TreeItems.Message);

            }

            function showError() {

                deferred.reject("Communication failed");

            }

            return deferred.promise;

        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Membership Merge Check Cricket Connection
        //////////////////////////////////////////////////////////////////////////////////////
        function CheckCricketConnection() {

            var deferred = $q.defer();
            $timeout(CheckCricketConnectionImpl, 0);

            function CheckCricketConnectionImpl() {

                ManageService.SendRequest('', 'CheckCricketConnection').then(ShowResult).catch(showError);

            }

            function ShowResult(data) {

                deferred.resolve(data.data);

            }

            function showError() {

                deferred.reject("Communication failed");

            }

            return deferred.promise;
        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Membership Merge
        //////////////////////////////////////////////////////////////////////////////////////
        function MembershipMerge(ApplicationName) {

            var deferred = $q.defer();
            $timeout(MembershipMergeImpl, 0);

            function MembershipMergeImpl() {

                var request = ManageUserContracts.GetMembershipMergeRequest();
                request.ApplicationName = ApplicationName;
                ManageService.SendRequest(request, 'MembershipMerge').then(ShowResult).catch(showError);

            }

            function ShowResult(data) {

                deferred.resolve(data.data.Message);

            }

            function showError() {

                deferred.reject("Communication failed");

            }

            return deferred.promise;
        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Model Validators
        //
        //  ValidateFieldEntry                      Works with Validator service
        //  ValidateAssignment                      Parent for account validation
        //  ValidateFeatureItemsForEntries          Ensures that feature tree has at least one entry
        //  ValidateFeatureItemsForChange           Compares current feature tree with initial
        //                                          Also checks group name and checks for changes there
        //  CompareFeatureSelectToActiveGroup       Helper for ValidateFeatureItemsForChange
        //  CheckUnapprovedUserForChange            Checks for change in approval status
        //////////////////////////////////////////////////////////////////////////////////////
        function ValidateFieldEntry(ContractEntryField, key, MapToKey, Required, value) {

            return Validation.ValidateFieldEntry(ContractEntryField, key, MapToKey, Required, value);

        }

        function ValidateAssignment(TreeAttribute, UnapprovedUser, AssignGroupId) {

            var Action
            var RetMessage = "";
            var TreeItemsDirty = false;
            var UnapprovedUserChanged = CheckUnapprovedUserForChange(UnapprovedUser);

            //Validate tree items if available
            if (MemberInfo.MemberConfiguration.TreeItems.areTreeItemsAvailable) {

                var FeatureItems = TreeAttribute.FeatureItems;
                if (ValidateFeatureItemsForEntries(FeatureItems)) {

                    if (ValidateFeatureItemsForChange(FeatureItems, AssignGroupId)) {

                        TreeItemsDirty = true;

                    }

                } else {

                    RetMessage = "Member must have selections in feature tree";

                }
            }

            if (!TreeItemsDirty && !UnapprovedUserChanged) RetMessage = "User account unchanged.";

            return RetMessage;
        }

        ////////////////////////////////////////////
        //  Ensure at least one item is selected
        ////////////////////////////////////////////
        function ValidateFeatureItemsForEntries(FeatureItems) {

            var isValid = false;
            var iLen = FeatureItems.length;

            if (iLen > 0) {

                for (var i = 0; i < iLen; i++) {

                    if (FeatureItems[i].FeatureTreeAccess) {

                        isValid = true;
                        break;

                    }
                }
            }

            return isValid;

        }

        ////////////////////////////////////////////
        //  If submitted tree is different from
        //  original, change local copy for process
        ////////////////////////////////////////////
        function ValidateFeatureItemsForChange(FeatureItems, AssignGroupId) {

            var isValid = false;
            var OriginalGroupId = PristineAccount.MemberConfiguration.TreeItems.AssignGroupNameId;
            var OriginalFeatureSet = PristineAccount.MemberConfiguration.TreeItems.FeatureItems;
            var iLen = FeatureItems.length;
            if (iLen > 0) {

                if (!MemberInfo.MemberConfiguration.TreeItems.isDirty && (OriginalGroupId == 0 && AssignGroupId != 0)) {

                    MemberInfo.MemberConfiguration.TreeItems.FeatureItems = FeatureItems;
                    MemberInfo.MemberConfiguration.TreeItems.AssignGroupNameId = AssignGroupId;
                    for (var i = 0; i < iLen; i++) FeatureItems[i].GroupNameId = AssignGroupId;
                    MemberInfo.MemberConfiguration.TreeItems.isDirty = true;
                    isValid = true;

                } else {

                    for (var i = 0; i < iLen; i++) {

                        if (OriginalFeatureSet[i].FeatureTreeAccess != FeatureItems[i].FeatureTreeAccess) {

                            MemberInfo.MemberConfiguration.TreeItems.FeatureItems = FeatureItems;
                            if (AssignGroupId != 0) AssignGroupId = CompareFeatureSelectToActiveGroup(FeatureItems, AssignGroupId);
                            MemberInfo.MemberConfiguration.TreeItems.AssignGroupNameId = AssignGroupId;
                            MemberInfo.MemberConfiguration.TreeItems.isDirty = true;
                            isValid = true;
                            break;

                        }
                    }
                }
            }

            return isValid;

        }

        function CompareFeatureSelectToActiveGroup(FeatureItems, AssignGroupId) {

            var RetVal = AssignGroupId;
            var ActiveGroup = GetGroupFeatureTreeCollection();
            if (ActiveGroup && ActiveGroup.FeatureItems.length > 0) {

                var iLen = ActiveGroup.FeatureItems.length;
                for (var i = 0; i < iLen; i++) {

                    if (ActiveGroup.FeatureItems[i].FeatureTreeAccess != FeatureItems[i].FeatureTreeAccess) {

                        RetVal = 0;
                        break;

                    }
                }
            } else {

                RetVal = 0;

            }

            return RetVal;

        }

        function CheckUnapprovedUserForChange(UnapprovedUser) {

            var isChanged = false;
            var AppList = PristineAccount.MemberConfiguration.UserApps.UserInApp;
            var iLen = AppList.length;
            for (var i = 0; i < iLen; i++) {

                if (AppList[i].ApplicationName == UnapprovedUser.ApplicationName) {

                    if (AppList[i].IsUserApproved != UnapprovedUser.UserApproved) {

                        MemberInfo.MemberConfiguration.UserApps.UserInApp[i].IsUserApproved = UnapprovedUser.UserApproved;
                        isChanged = true;
                        break;

                    }
                }
            }

            return isChanged;

        }
    }
})();