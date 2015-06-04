(function () {

    var AppState = function () {

        this.UserCreds = [];
        this.CurrentRoute = "blank";
        this.PreviousRoute = "blank";
        this.TaskName = "";
        this.AppStart = false;
        this.FrontPageLineChart = null;

        ////////////////////////////////////////////////////////////////////////////////////////
        //  Acccessors
        //  Shouldn't there be a task list here, too?
        ////////////////////////////////////////////////////////////////////////////////////////
        this.DumpUserValues = function () {

            for (var key in this.UserCreds) this.UserCreds[key] = "";
            this.CurrentRoute = "blank";
            this.PreviousRoute = "blank";
            this.TaskName = "";

        }

        this.GetAppStart = function () {

            return this.AppStart;

        }

        this.SetUserCreds = function (UserCreds) {

            UserCreds.FeatureAccessPipe = this.CreateFeatureAccessPipe(UserCreds.FeatureAccessList);
            this.UserCreds = UserCreds;

        }

        this.GetUserCreds = function () {

            return this.UserCreds;

        }

        this.GetUserRoles = function () {

            return this.UserCreds.UserRoles;

        }

        this.GetFeatureAccessList = function () {

            return this.UserCreds.FeatureAccessList;

        }

        this.GetFeatureAccessListPipe = function () {

            return this.UserCreds.FeatureAccessListPipe;

        }

        this.GetUserId = function () {

            return this.UserCreds.UserId;

        }

        this.GetUserName = function () {

            return this.UserCreds.UserName;

        }

        this.SetTaskName = function (TaskName) {

            this.TaskName = TaskName;

        }

        this.GetTaskName = function () {

            return this.TaskName;

        }

        this.SetRoute = function (AppName, RouteName) {

            if (this.CurrentRoute.indexOf(AppName) == -1) {
                this.PreviousRoute = this.CurrentRoute;
                this.CurrentRoute = RouteName;
            }
        }

        this.GetPreviousRoute = function () {

            return this.PreviousRoute;

        }

        ////////////////////////////////////////////////////////////////////////////////////////
        //  Helper function, but this should probably not be here
        ////////////////////////////////////////////////////////////////////////////////////////
        this.CreateFeatureAccessPipe = function (FeatureAccessList) {

            var FeatureTreePipe = "|";
            var iLen = FeatureAccessList.length;
            for(var i = 0; i < iLen; i++) {

                if (FeatureAccessList[i].FeatureTreeAccess) FeatureTreePipe += FeatureAccessList[i].FeatureTreeName + "|";

            }

            return FeatureTreePipe;
        }
    }

    angular.module('App.AppState').service('AppState', AppState);

})();