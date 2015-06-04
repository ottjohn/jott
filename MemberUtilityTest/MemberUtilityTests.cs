using System;
using System.Data;
using System.IO;
using System.Web;
using System.Configuration;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UtilityPot;
using System.Reflection;
using UtilityPot.CommonValidation;
using CustomerUtility.Validation;
using CustomerUtility.FeatureTree;
using CustomerUtility.Members;
using MaintenanceContracts.Contracts.Common;
using MaintenanceContracts.Contracts.MemberManagement;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace MemberUtilityTest
{
    [TestClass]
    public class MemberUtilityTests
    {
        private TestContext testContextInstance;
        public TestContext TestContext
        {
            get { return testContextInstance; }
            set { testContextInstance = value; }
        }

        /////NEED TO ADD VALIDATION FOR USER AS WELL. ALL CALLS
        /// <summary>
        /// Ensures that the configuration contract is present and that there are some apps in the configuration
        /// GENERAL MEMBERAPPCONFIG AND APPLICATION VALIDATION GENERAL MEMBERAPPCONFIG AND APPLICATION VALIDATION GENERAL MEMBERAPPCONFIG AND APPLICATION VALIDATION 
        /// </summary>
        [TestMethod]
        [DeploymentItem("MaintenanceDataTests\\AppsTest.xml")]
        [DataSource("Microsoft.VisualStudio.TestTools.DataSource.XML",
                           "D:\\StoreMaintenanceRepository\\MemberUtilityTest\\Parent\\AppsTest.xml",
                           "row",
                            DataAccessMethod.Sequential)]
        public void ValidateAppContainer_Test()
        {
            //Arrange
            MemberAppConfiguration MemberConfiguration = GetAppConfiguration(Convert.ToInt32(testContextInstance.DataRow["State"]));
            bool Expected = Convert.ToBoolean(testContextInstance.DataRow["ReturnValue"]);

            //Act
            MemberConfigStructure MCS = new MemberConfigStructure();
            bool Actual = (MCS.ValidateAppContainer(MemberConfiguration)) == "" ? true : false;

            //Assert
            Assert.AreEqual(Expected, Actual, "No Text Required");
        }

        /// <summary>
        /// FEATURE SET TESTS FEATURE SET TESTS FEATURE SET TESTS FEATURE SET TESTS FEATURE SET TESTS FEATURE SET TESTS FEATURE SET TESTS FEATURE SET TESTS 
        /// </summary>
        [TestMethod]
        [DeploymentItem("MaintenanceDataTests\\FeatureTest.xml")]
        [DataSource("Microsoft.VisualStudio.TestTools.DataSource.XML",
                           "D:\\StoreMaintenanceRepository\\MemberUtilityTest\\Parent\\FeatureTest.xml",
                           "row",
                            DataAccessMethod.Sequential)]
        public void ValidateFeatureContainer_Test()
        {
            //Arrange
            MemberAppConfiguration MemberConfiguration = GetAppConfiguration(Convert.ToInt32(testContextInstance.DataRow["State"]));
            bool Expected = Convert.ToBoolean(testContextInstance.DataRow["ReturnValue"]);

            //Act
            MemberConfigStructure MCS = new MemberConfigStructure();
            bool Actual = (MCS.ValidateFeatureContainer(MemberConfiguration.TreeItems)) == "" ? true : false;

            //Assert
            Assert.AreEqual(Expected, Actual, "No Text Required");
        }

        /// <summary>
        /// Test to ensure that the information required to retrieve feature tree is available
        /// </summary>
        [TestMethod()]
        [DeploymentItem("MaintenanceDataTests\\GetFeatureTreeList.xml")]
        [DataSource("Microsoft.VisualStudio.TestTools.DataSource.XML",
                           "D:\\StoreMaintenanceRepository\\MemberUtilityTest\\FeatureManagement\\GetFeatureTreeList.xml",
                           "row",
                            DataAccessMethod.Sequential)]
        public void ValidateRetrieveFeatureList_Test()
        {
            //Arrange
            MemberValidate MV = new MemberValidate();
            Guid UserId;
            Guid ApplicationId;
            int GroupNameId;
            string UserName = Convert.ToString(testContextInstance.DataRow["UserName"]);
            Guid.TryParse(testContextInstance.DataRow["UserId"].ToString(), out UserId);
            Guid.TryParse(testContextInstance.DataRow["ApplicationId"].ToString(), out ApplicationId);
            Int32.TryParse(testContextInstance.DataRow["GroupNameId"].ToString(), out GroupNameId);
            bool Expected = Convert.ToBoolean(testContextInstance.DataRow["ReturnValue"]);

            //Act
            bool RetValue = (MV.ValidateRetrieveFeatureParams(UserName, UserId, GroupNameId, ApplicationId) == "") ? true : false;

            //Assert
            Assert.AreEqual(Expected, RetValue, "No message required");
        }

        /// <summary>
        /// Test to ensure that the information required to retrieve feature tree is available
        /// </summary>
        [TestMethod()]
        [DeploymentItem("MaintenanceDataTests\\AddUpdateGroupScalars.xml")]
        [DataSource("Microsoft.VisualStudio.TestTools.DataSource.XML",
                           "D:\\StoreMaintenanceRepository\\MemberUtilityTest\\FeatureManagement\\AddUpdateGroupScalars.xml",
                           "row",
                            DataAccessMethod.Sequential)]
        public void ValidateAddUpdateGroupScalars_Test()
        {
            //Arrange
            Guid ApplicationId;
            int FeatureGroupNameId;
            string FeatureGroupName = Convert.ToString(testContextInstance.DataRow["FeatureGroupName"]);
            Int32.TryParse(Convert.ToString(testContextInstance.DataRow["FeatureGroupNameId"]), out FeatureGroupNameId);
            Guid.TryParse(Convert.ToString(testContextInstance.DataRow["ApplicationId"]), out ApplicationId);
            bool Expected = Convert.ToBoolean(testContextInstance.DataRow["ReturnValue"]);

            //Act
            bool Actual = (ValidateAddUpdateGroupScalars(FeatureGroupName, FeatureGroupNameId, ApplicationId)) == "" ? true : false;

            //Assert
            Assert.AreEqual(Expected, Actual, "No message necessary");
        }

        /// <summary>
        /// Test to ensure something has been checked in the Feature Tree
        /// </summary>
        [TestMethod()]
        [DeploymentItem("MaintenanceDataTests\\AddUpdateGroup.xml")]
        [DataSource("Microsoft.VisualStudio.TestTools.DataSource.XML",
                           "D:\\StoreMaintenanceRepository\\MemberUtilityTest\\FeatureManagement\\AddUpdateGroup.xml",
                           "row",
                            DataAccessMethod.Sequential)]
        public void ValidateFeatureTreeForEntries_Test()
        {
            //Arrange
            FeatureTreeValidator FTV = new FeatureTreeValidator();
            FeatureTreeItems FeatureTree = GetFeatureTree(Convert.ToInt16(testContextInstance.DataRow["ExampleType"]));
            bool Expected = Convert.ToBoolean(testContextInstance.DataRow["ReturnValue"]);

            //Act
            bool RetValue = (FTV.ValidateFeatureTreeForEntries(FeatureTree)) ? true : false;

            //Assert
            Assert.AreEqual(Expected, RetValue, "No message required");
        }

        [TestMethod()]
        [DeploymentItem("MaintenanceDataTests\\CheckForChange.xml")]
        [DataSource("Microsoft.VisualStudio.TestTools.DataSource.XML",
                           "D:\\StoreMaintenanceRepository\\MemberUtilityTest\\FeatureManagement\\CheckForChange.xml",
                           "row",
                            DataAccessMethod.Sequential)]
        public void CheckForDifferenceInTrees()
        {
            //Arrange
            FeatureTreeItems FeatureTree1 = GetFeatureTree(Convert.ToInt16(testContextInstance.DataRow["Example1"]));
            FeatureTreeItems FeatureTree2 = GetFeatureTree(Convert.ToInt16(testContextInstance.DataRow["Example2"]));
            bool Expected = Convert.ToBoolean(testContextInstance.DataRow["ReturnValue"]);

            //Act
            bool RetValue = ValidateFeatureTreesForDifference(FeatureTree1, FeatureTree2);

            //Assert
            Assert.AreEqual(Expected, RetValue, "");
        }

        /// <summary>
        /// ROLES TESTS ROLES TESTS ROLES TESTS ROLES TESTS ROLES TESTS ROLES TESTS ROLES TESTS ROLES TESTS ROLES TESTS ROLES TESTS ROLES TESTS ROLES TESTS ROLES TESTS 
        /// </summary>
        [TestMethod]
        [DeploymentItem("MaintenanceDataTests\\RolesTest.xml")]
        [DataSource("Microsoft.VisualStudio.TestTools.DataSource.XML",
                           "D:\\StoreMaintenanceRepository\\MemberUtilityTest\\Parent\\RolesTest.xml",
                           "row",
                            DataAccessMethod.Sequential)]
        public void ValidateRolesContainer_Test()
        {
            //Arrange
            MemberAppConfiguration MemberConfiguration = GetAppConfiguration(Convert.ToInt32(testContextInstance.DataRow["State"]));
            bool Expected = Convert.ToBoolean(testContextInstance.DataRow["ReturnValue"]);

            //Act
            MemberConfigStructure MCS = new MemberConfigStructure();
            bool Actual = (MCS.ValidateRolesContainer(MemberConfiguration.Roles)) == "" ? true : false;

            //Assert
            Assert.AreEqual(Expected, Actual, "No Text Required");
        }

        /// <summary>
        /// HELPERS. I THINK MOST OF THESE SHOULD BE MOVED OUT AND INTO ORDINARY CODE. UNLESS IT IS WORKAROUND CODE OR FACTYORY CODE
        /// </summary>
        /// <param name="FeatureTree1"></param>
        /// <param name="FeatureTree2"></param>
        /// <returns></returns>
        public bool ValidateFeatureTreesForDifference(FeatureTreeItems FeatureTree1, FeatureTreeItems FeatureTree2)
        {
            bool RetVal = false;
            foreach (FeatureTreeItem item in FeatureTree1.FeatureItems)
            {
                FeatureTreeItem CompareItem = FeatureTree2.FeatureItems.Find(x => x.FeatureTreeId == item.FeatureTreeId);
                if (CompareItem.FeatureTreeAccess != item.FeatureTreeAccess)
                {
                    RetVal = true;
                    break;
                }
            }

            return RetVal;
        }

        public FeatureTreeItems GetFeatureTree(int ExampleType)
        {
            //ExampleType = 0: null return
            //ExampleType = 1: null tree items
            //ExampleType = 2: zero count tree items -- do nothing
            //ExampleType = 3: valid tree, no selections
            //ExampleType = 4: valid tree, selections
            //ExampleType = 5: valid tree, one off
            FeatureTreeItems TreeItems = new FeatureTreeItems { FeatureItems = new List<FeatureTreeItem>() };

            if (ExampleType == 0)
            {
                TreeItems = null;
            }
            else if (ExampleType == 1)
            {
                TreeItems.FeatureItems = null;
            }
            else if (ExampleType == 3)
            {
                TreeItems = CreateFeatureTree();
            }
            else if (ExampleType == 4)
            {
                TreeItems = AddSelectedItemsToFeatureTree(false, CreateFeatureTree());
            }
            else if (ExampleType == 5)
            {
                TreeItems = AddSelectedItemsToFeatureTree(true, CreateFeatureTree());
            }
            return TreeItems;
        }

        public FeatureTreeItems AddSelectedItemsToFeatureTree(bool OneMore, FeatureTreeItems FeatureTree)
        {
            FeatureTreeItem TreeItem = FeatureTree.FeatureItems.Find(x => x.FeatureTreeId == 2);
            TreeItem.FeatureTreeAccess = true;

            TreeItem = FeatureTree.FeatureItems.Find(x => x.FeatureTreeId == 3);
            TreeItem.FeatureTreeAccess = true;

            TreeItem = FeatureTree.FeatureItems.Find(x => x.FeatureTreeId == 5);
            TreeItem.FeatureTreeAccess = true;

            TreeItem = FeatureTree.FeatureItems.Find(x => x.FeatureTreeId == 6);
            TreeItem.FeatureTreeAccess = true;

            TreeItem = FeatureTree.FeatureItems.Find(x => x.FeatureTreeId == 7);
            TreeItem.FeatureTreeAccess = true;

            TreeItem = FeatureTree.FeatureItems.Find(x => x.FeatureTreeId == 8);
            TreeItem.FeatureTreeAccess = true;

            if (OneMore)
            {
                TreeItem = FeatureTree.FeatureItems.Find(x => x.FeatureTreeId == 9);
                TreeItem.FeatureTreeAccess = true;
            }

            return FeatureTree;
        }

        public FeatureTreeItems CreateFeatureTree()
        {
            FeatureTreeItems TreeItems = new FeatureTreeItems { FeatureItems = new List<FeatureTreeItem>() };
            TreeItems.FeatureItems.Add(CreateTreeItem(1, 0, "StoreTax", false));
            TreeItems.FeatureItems.Add(CreateTreeItem(2, 1, "State", false));
            TreeItems.FeatureItems.Add(CreateTreeItem(3, 1, "Local", false));
            TreeItems.FeatureItems.Add(CreateTreeItem(4, 0, "MemberManagement", false));
            TreeItems.FeatureItems.Add(CreateTreeItem(5, 4, "ManageMembers", false));
            TreeItems.FeatureItems.Add(CreateTreeItem(6, 4, "FindUser", false));
            TreeItems.FeatureItems.Add(CreateTreeItem(7, 4, "ChangeEmail", false));
            TreeItems.FeatureItems.Add(CreateTreeItem(8, 4, "GetPassword", false));
            TreeItems.FeatureItems.Add(CreateTreeItem(9, 4, "ChangePassword", false));
            TreeItems.FeatureItems.Add(CreateTreeItem(10, 4, "MembershipMerge", false));
            TreeItems.FeatureItems.Add(CreateTreeItem(11, 4, "FeatureManagement", false));
            return TreeItems;
        }

        public FeatureTreeItem CreateTreeItem(int FeatureTreeId, int FeatureTreeParentId, string FeatureTreeName, bool FeatureTreeAccess)
        {
            FeatureTreeItem TreeItem = new FeatureTreeItem();
            TreeItem.FeatureTreeId = FeatureTreeId;
            TreeItem.FeatureTreeParentId = FeatureTreeParentId;
            TreeItem.FeatureTreeName = FeatureTreeName;
            TreeItem.FeatureTreeAccess = FeatureTreeAccess;
            return TreeItem;
        }

        public string ValidateAddUpdateGroupScalars(string FeatureGroupName, int FeatureGroupNameId, Guid ApplicationId)
        {
            string RetVal = ValidateGUIDId(ApplicationId, "ApplicationId");
            if (RetVal == "")
            {
                if (FeatureGroupNameId <= 0)
                {
                    RetVal = StringExpressionDictionary.ValidateStringExpression(FeatureGroupName, "NewGroupName");
                }
            }

            return RetVal;
        }

        public string ValidateGUIDId(Guid GUIDValue, string GUIDType)
        {
            string RetVal = "";
            if (GUIDValue == Guid.Empty) RetVal = "Process requires a valid " + GUIDType + ".";
            return RetVal;
        }

        private MemberAppConfiguration GetAppConfiguration(int State)
        {
            MemberAppConfiguration MemberConfiguration = new MemberAppConfiguration
            {
                UserApps = new UserApplicationList { UserInApp = new List<UserInApplication>() },
                Roles = new UserRolesList { UserRoles = new List<UserInRoles>() },
                TreeItems = new FeatureTreeItems
                {
                    FeatureItems = new List<FeatureTreeItem>(),
                    FeatureGroups = new FeatureTreeGroups { Groups = new List<FeatureGroup>() }
                }
            };

            if (State == 1)
            {
                MemberConfiguration = null;
            }
            else if (State == 2)
            {
                MemberConfiguration.UserApps = null;
            } 
            else if(State == 3) 
            {
                MemberConfiguration.UserApps.UserInApp = null;
            }
            else if (State == 11)
            {
                MemberConfiguration.UserApps.IsDirty = true;
            }
            else if (State == 4)
            {
                MemberConfiguration.Roles.UserRoles = null;
                MemberConfiguration.Roles.RolesActiveInApp = true;
            }
            else if(State == 5)
            {
                MemberConfiguration.Roles.RolesActiveInApp = false;
            }
            else if (State == 6)
            {
                MemberConfiguration.Roles.RolesActiveInApp = true;
            }
            else if (State == 11)
            {
                MemberConfiguration.Roles.IsDirty = true;
            }
            else if (State == 7)
            {
                MemberConfiguration.TreeItems.FeatureItems = null;
                MemberConfiguration.TreeItems.areTreeItemsAvailable = true;
            }
            else if (State == 8)
            {
                MemberConfiguration.TreeItems.areTreeItemsAvailable = false;
            }
            else if (State == 9)
            {
                MemberConfiguration.TreeItems.areTreeItemsAvailable = true;
            }
            else if (State == 10)
            {
                MemberConfiguration.TreeItems.isDirty = true;
            } 

            return MemberConfiguration;
        }

        [TestMethod()]
        [DeploymentItem("MaintenanceDataTests\\RetrieveUser.xml")]
        [DataSource("Microsoft.VisualStudio.TestTools.DataSource.XML",
                           "D:\\StoreMaintenanceRepository\\MemberUtilityTest\\MemberManagement\\RetrieveUser.xml",
                           "row",
                            DataAccessMethod.Sequential)]
        public void RetrieveUser_Test()
        {
            //Arrange
            Guid UserId;
            Guid.TryParse(testContextInstance.DataRow["UserId"].ToString(), out UserId);
            string UserName = Convert.ToString(testContextInstance.DataRow["UserName"]);
            bool IsSuccess = Convert.ToBoolean(testContextInstance.DataRow["IsSuccess"]);
            bool Expected = Convert.ToBoolean(testContextInstance.DataRow["ReturnValue"]);

            //Act
            bool RetValue = (ValidateRetrieveUser(UserId, UserName, IsSuccess) != Guid.Empty) ? true : false;

            //Assert
            Assert.AreEqual(Expected, RetValue, "No message required");
        }

        private Guid ValidateRetrieveUser(Guid UserId, string UserName, bool IsSuccess)
        {
            Guid RetVal = Guid.Empty;
            if (UserId != Guid.Empty)
                RetVal = UserId;
            else
                RetVal = ValidateUserName(UserName, IsSuccess);

            return RetVal;
        }

        private Guid ValidateUserName(string UserName, bool IsSuccess)
        {
            Guid RetVal;
            if (IsSuccess) 
                Guid.TryParse("F3DC6743-3A33-476B-85BE-336F83FE12CC", out RetVal);
            else
                Guid.TryParse("00000000-0000-0000-0000-000000000000", out RetVal);

            return RetVal;
        }
    }
}
