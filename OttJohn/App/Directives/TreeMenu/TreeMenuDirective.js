angular.module('App').directive('treemenu', ['Validation', function (Validation) {
    return {
        restrict: 'EA',
        scope: {

            treeattribute: '='

        },

        controller: ['$scope', function ($scope) {


        }],

        templateUrl: 'App/Directives/TreeMenu/TreeMenu.html',
        link: function (scope, element, attrs) {

            var TreeHtml;
            var TreeMenuCollection;

            ////////////////////////////////////////////////////////////////////////////////////////////////
            //  Behaviors
            ////////////////////////////////////////////////////////////////////////////////////////////////
            var ExpandCollapse = function (TreeNode) {

                var Sibling = TreeNode.next();
                if (Sibling.attr("tag") == "parent") {
                    if (Sibling.is(":visible"))
                        Sibling.hide();
                    else
                        Sibling.show();
                }
            }

            var UpdateProfileTemplate = function (ChkObject) {

                var IsSelected;
                var ItemId = $(ChkObject).attr("id");

                if ($(ChkObject).attr("checked"))
                    IsSelected = true;
                else
                    IsSelected = false;

                SetProfileTemplate(IsSelected, ItemId);

            }

            var SetProfileTemplate = function (IsSelected, ItemId) {

                if (!this.TreeMenuCollection || this.TreeMenuCollection == null) this.TreeMenuCollection = scope.treeattribute.FeatureItems;
                var FeatureItemLen = this.TreeMenuCollection.length;
                if (FeatureItemLen > 0) {

                    for (var i = 0; i < FeatureItemLen; i++) {

                        if (this.TreeMenuCollection[i].FeatureTreeId == ItemId) {

                            this.TreeMenuCollection[i].FeatureTreeAccess = IsSelected;
                            scope.treeattribute.FeatureItems = this.TreeMenuCollection;
                            break;

                        }
                    }
                }
            }

            var InitializeMenu = function () {

                var iLen = this.TreeMenuCollection.length;
                for (var i = 0; i < iLen; i++) {

                    if (this.TreeMenuCollection[i].FeatureTreeAccess) {

                        $("#" + this.TreeMenuCollection[i].FeatureTreeId).attr("checked", true);
                        GetParent($("#" + this.TreeMenuCollection[i].FeatureTreeId)).show();

                    }
                }
            }

            var GetParent = function (Obj) {

                var ObjParent = Obj.parent();
                while (ObjParent.attr("tag") != "parent") {

                    ObjParent = ObjParent.parent();

                }

                return ObjParent;

            }

            ////////////////////////////////////////////////////////////////////////////////////////////////
            //  Build Tree Menu
            ////////////////////////////////////////////////////////////////////////////////////////////////
            var CheckContract = function (TreeItems) {

                if (TreeItems.FeatureItems.length > 0) {

                    for (var i = 0; i < TreeItems.FeatureItems.length; i++) {

                        if (TreeItems.FeatureItems[i].FeatureTreeParentId == '00000000-0000-0000-0000-000000000000')
                            TreeItems.FeatureItems[i].FeatureTreeParentId = 0;
                    }
                }


                if (TreeItems.Message != "") {

                    ShowValidationMessage(TreeItems.Message);

                } else if (TreeItems.FeatureItems) {

                    this.TreeMenuCollection = TreeItems.FeatureItems;
                    if (this.TreeMenuCollection.length > 0) {

                        TreeHtml = BuildTreeMenu(TreeItems.FeatureItems);
                        if (TreeHtml != "") {

                            $("#Maingroups").html(TreeHtml);
                            InitializeMenu(this.TreeMenuCollection);

                        }

                    } else {

                        TreeHtml = "";
                        $("#Maingroups").html("No Feature Tree");

                    }
                }
            }

            function BuildTreeMenu(FeatureTreeItems) {

                TreeHtml = "";
                TreeHtml = GetTreeComponents(FeatureTreeItems, 0);
                return TreeHtml;

            }

            function GetTreeComponents(FeatureTreeItems, id) {

                var Children = GetTreeItemChildren(FeatureTreeItems, id);
                var iLen = Children.length;

                for (var i = 0; i < iLen; i++) {

                    TreeHtml += BuildComponentItem(i, Children, FeatureTreeItems);
                    GetTreeComponents(FeatureTreeItems, Children[i].FeatureTreeId);

                    if (i == iLen - 1 || Children[i].FeatureTreeParentId == 0) {

                        TreeHtml += "</ul>";

                    }
                }

                return TreeHtml;

            }

            function BuildComponentItem(i, Children, FeatureTreeItems) {

                var ComponentItem = "";
                var UlAtTermination = CheckForRedundantULNew(Children[i].FeatureTreeParentId);

                if ((CheckChildren(Children[i].FeatureTreeId, FeatureTreeItems)) && (i == 0 || Children[i].FeatureTreeParentId == 0)) {

                    ComponentItem = UlAtTermination + "<li class = 'FolderIcon'><div>" + Children[i].FeatureTreeName + "</div></li>";

                }
                else if (Children[i].Selectable == 0 || CheckChildren(Children[i].FeatureTreeId, FeatureTreeItems)) {

                    ComponentItem = "<li class = 'FolderIcon'><div>" + Children[i].FeatureTreeName + "</div></li><ul tag = 'parent' style='display: none;'>";

                }
                else if (i == 0) {

                    ComponentItem = UlAtTermination + "<li class='TreeChildStyle'><div><input tag = '" + Children[i].FeatureTreeParentId + "' id = '" + Children[i].FeatureTreeId + "'  type = 'checkbox' />" + Children[i].FeatureTreeName + "</div></li>";

                }
                else {

                    ComponentItem = "<li class='TreeChildStyle'><div><input tag = '" + Children[i].FeatureTreeParentId + "' id = '" + Children[i].FeatureTreeId + "' type = 'checkbox' />" + Children[i].FeatureTreeName + "</div></li>";

                }

                TreeHtml = TreeHtml.replace(/<ul><ul>/g, "<ul>");
                return ComponentItem;
            }

            function CheckForRedundantULNew(ParentId) {

                var RetVal = "<ul>";
                if (ParentId != 0) RetVal = "<ul tag = 'parent' style = 'display: none;'>";

                if (TreeHtml.length > 4) {

                    var TempString = TreeHtml.substring(TreeHtml.length - 4, TreeHtml.length);
                    if (TempString == "e;'>" || TempString == "<ul>") RetVal = "";

                }

                return RetVal;

            }

            function GetTreeItemChildren(FeatureTreeItems, ParentId) {

                var Counter = 0;
                var FeatureTreeArray = new Array();

                var iLen = FeatureTreeItems.length;
                for (var i = 0; i < iLen; i++) {

                    if (FeatureTreeItems[i].FeatureTreeParentId == ParentId) {

                        FeatureTreeArray[Counter] = FeatureTreeItems[i];
                        Counter++;

                    }
                }

                return FeatureTreeArray;

            }

            function CheckChildren(i, FeatureTreeItems) {

                var RetVal = false;
                var Children = GetTreeItemChildren(FeatureTreeItems, i)
                if (Children.length > 0) RetVal = true;
                return RetVal;

            }

            ////////////////////////////////////////////////////////////////////////////////////////////////
            //  Scope watch/Events 
            ////////////////////////////////////////////////////////////////////////////////////////////////
            scope.$watch('treeattribute', function () {
                if (scope.treeattribute && scope.treeattribute != null && scope.treeattribute != "") {

                    CheckContract(scope.treeattribute);

                } else if (scope.treeattribute == "") {

                    $("#Maingroups").html("");

                }
            });

            $(document).off("click").on("click", "#Maingroups LI", function () {

                ExpandCollapse($(this));

            });

            $(document).on("click", "#Maingroups div INPUT", function (event) {

                UpdateProfileTemplate(this);
                event.stopPropagation();

            });
        }
    };
}]);