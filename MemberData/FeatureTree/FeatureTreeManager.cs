using System;
using System.Collections.Generic;
using System.Linq;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using System.Text;
using System.Threading.Tasks;
using UtilityPot.Logger;
using MaintenanceContracts.Contracts.MemberManagement;

namespace MemberData.FeatureTree
{
    public class FeatureTreeManager
    {
        public FeatureTreeGroups GetFeatureTreeGroups(ILogger Logger, Guid ApplicationId)
        {
            FeatureTreeGroups FeatureGroups = new FeatureTreeGroups { Groups = new List<FeatureGroup>() };
            FeatureGroups.Message = "";

            try
            {
                using (GenericMembershipDataContext Context = new GenericMembershipDataContext())
                {
                    var ReturnedGroups = Context.GetFeatureTreeGroups(ApplicationId);
                    FeatureGroups.Groups.AddRange(ReturnedGroups.Select(x => new FeatureGroup { FeatureGroupName = x.GroupName, FeatureGroupNameId = x.GroupNameId }));
                }
            }
            catch (Exception ex)
            {
                FeatureGroups.Message = "Failed to retrieve groups;";
                Logger.LogEvent("MemberData.FeatureTree.RetrieveFeatureList", ex);
            }
            return FeatureGroups;
        }

        public string AssignProfile(ILogger Logger, FeatureTreeItems TreeItems, Guid UserId, Guid ApplicationId)
        {
            string RetVal = "";
            try
            {
                using (GenericMembershipDataContext Context = new GenericMembershipDataContext())
                {
                    DataTable items = new DataTable();
                    items.Columns.Add("TreeItem", typeof(int));
                    items.Columns.Add("TreeItemValue", typeof(int));

                    foreach (FeatureTreeItem item in TreeItems.FeatureItems)
                    {
                        DataRow row = items.NewRow();
                        row.SetField<int>("TreeItem", item.FeatureTreeId);
                        row.SetField<int>("TreeItemValue", Convert.ToInt32(item.FeatureTreeAccess));
                        items.Rows.Add(row);
                    }

                    using (SqlCommand Cmd = new SqlCommand())
                    {
                        Cmd.CommandText = "AssignFeatureProfile";
                        Cmd.CommandType = CommandType.StoredProcedure;
                        Cmd.Connection = new SqlConnection();
                        Cmd.Connection.ConnectionString = Context.Connection.ConnectionString;

                        SqlParameter Items = Cmd.CreateParameter();
                        Items.ParameterName = "@TreeItems";
                        Items.SqlDbType = SqlDbType.Structured;
                        Items.Value = items;
                        Cmd.Parameters.Add(Items);

                        SqlParameter MemberId = Cmd.CreateParameter();
                        MemberId.ParameterName = "@UserId";
                        MemberId.SqlDbType = SqlDbType.UniqueIdentifier;
                        MemberId.Value = UserId;
                        Cmd.Parameters.Add(MemberId);

                        SqlParameter AppId = Cmd.CreateParameter();
                        AppId.ParameterName = "@ApplicationId";
                        AppId.SqlDbType = SqlDbType.UniqueIdentifier;
                        AppId.Value = ApplicationId;
                        Cmd.Parameters.Add(AppId);

                        SqlParameter GroupNameId = Cmd.CreateParameter();
                        GroupNameId.ParameterName = "@AssignGroupNameId";
                        GroupNameId.SqlDbType = SqlDbType.Int;
                        GroupNameId.Value = TreeItems.AssignGroupNameId;
                        Cmd.Parameters.Add(GroupNameId);

                        SqlParameter UserExtendedId = Cmd.CreateParameter();
                        UserExtendedId.ParameterName = "@UserExtendedId";
                        UserExtendedId.SqlDbType = SqlDbType.Int;
                        UserExtendedId.Direction = ParameterDirection.Output;
                        Cmd.Parameters.Add(UserExtendedId);

                        Cmd.Connection.Open();
                        Cmd.ExecuteNonQuery();

                        int RetId = (int)Cmd.Parameters["@UserExtendedId"].Value;
                        if (RetId == 0) RetVal = "Failed to assign feature items to user.";
                    }
                }
            }
            catch (Exception ex)
            {
                RetVal = "Failed to assign feature items to user.";
                Logger.LogEvent("MemberData.FeatureTree.AssignProfile", ex);
            }
            return RetVal;
        }

        public FeatureTreeGroups UpdateFeatureTreeGroup(ILogger Logger, List<FeatureTreeItem> TreeItems, int FeatureGroupNameId, Guid ApplicationId)
        {
            FeatureTreeGroups FeatureGroups = new FeatureTreeGroups { Groups = new List<FeatureGroup>() };
            try
            {
                using (GenericMembershipDataContext Context = new GenericMembershipDataContext())
                {
                    DataTable items = new DataTable();
                    items.Columns.Add("TreeItem", typeof(int));
                    items.Columns.Add("TreeItemValue", typeof(int));

                    foreach (FeatureTreeItem item in TreeItems)
                    {
                        DataRow row = items.NewRow();
                        row.SetField<int>("TreeItem", item.FeatureTreeId);
                        row.SetField<int>("TreeItemValue", Convert.ToInt32(item.FeatureTreeAccess));
                        items.Rows.Add(row);
                    }

                    using (SqlCommand Cmd = new SqlCommand())
                    {
                        Cmd.CommandText = "AddFeatureTreeGroup";
                        Cmd.CommandType = CommandType.StoredProcedure;
                        Cmd.Connection = new SqlConnection();
                        Cmd.Connection.ConnectionString = Context.Connection.ConnectionString;

                        SqlParameter Items = Cmd.CreateParameter();
                        Items.ParameterName = "@TreeItems";
                        Items.SqlDbType = SqlDbType.Structured;
                        Items.Value = items;
                        Cmd.Parameters.Add(Items);

                        SqlParameter GroupName = Cmd.CreateParameter();
                        GroupName.ParameterName = "@GroupName";
                        GroupName.SqlDbType = SqlDbType.VarChar;
                        GroupName.Value = "";
                        Cmd.Parameters.Add(GroupName);

                        SqlParameter AppId = Cmd.CreateParameter();
                        AppId.ParameterName = "@ApplicationId";
                        AppId.SqlDbType = SqlDbType.UniqueIdentifier;
                        AppId.Value = ApplicationId;
                        Cmd.Parameters.Add(AppId);

                        SqlParameter GroupNameId = Cmd.CreateParameter();
                        GroupNameId.ParameterName = "@GroupNameId";
                        GroupNameId.SqlDbType = SqlDbType.Int;
                        GroupNameId.Direction = ParameterDirection.InputOutput;
                        GroupNameId.Value = FeatureGroupNameId;
                        Cmd.Parameters.Add(GroupNameId);

                        Cmd.Connection.Open();
                        Cmd.ExecuteNonQuery();

                        int RetVal = (int)Cmd.Parameters["@GroupNameId"].Value;
                        if (RetVal != 0) FeatureGroups = GetFeatureTreeGroups(Logger, ApplicationId);
                    }
                }
            }
            catch (Exception ex)
            {
                FeatureGroups.Message = "Failed to update feature tree group.";
                Logger.LogEvent("MemberData.FeatureTree.UpdateFeatureTreeGroup", ex);
            }
            return FeatureGroups;
        }

        public FeatureTreeGroups RetrieveAppGroupNames(ILogger Logger, Guid ApplicationId)
        {
            FeatureTreeGroups GroupList = new FeatureTreeGroups { Groups = new List<FeatureGroup>() };
            GroupList.Message = "";

            try
            {
                using (GenericMembershipDataContext Context = new GenericMembershipDataContext())
                {
                    var ReturnedGroupList = Context.GetFeatureTreeGroups(ApplicationId);
                    GroupList.Groups.AddRange(ReturnedGroupList.Select(x => new FeatureGroup { FeatureGroupName = x.GroupName, FeatureGroupNameId = x.GroupNameId }));
                }
            }
            catch (Exception ex)
            {
                GroupList.Message = "Failed to retrieve group names for application.";
                Logger.LogEvent("MemberData.FeatureTree.RetrieveAppGroupNames", ex);
            }

            return GroupList;
        }

        public ApplicationList RetrieveAppList(ILogger Logger)
        {
            ApplicationList Applications = new ApplicationList { AppList = new List<Application>() };
            Applications.Message = "";

            try
            {
                using (GenericMembershipDataContext Context = new GenericMembershipDataContext())
                {
                    var ReturnedApps = Context.GetApplicationNames();
                    Applications.AppList.AddRange(ReturnedApps.Select(x => new Application { ApplicationId = x.ApplicationId, ApplicationName = x.ApplicationName }));
                }
            }
            catch (Exception ex)
            {
                Applications.Message = "Failed to retrieve application list.";
                Logger.LogEvent("MemberData.FeatureTree.RetrieveAppList", ex);
            }

            return Applications;
        }

        public FeatureTreeGroups AddFeatureTreeGroup(ILogger Logger, List<FeatureTreeItem> TreeItems, string FeatureGroupName, Guid ApplicationId)
        {
            FeatureTreeGroups FeatureGroups = new FeatureTreeGroups { Groups = new List<FeatureGroup>() };
            try
            {
                using (GenericMembershipDataContext Context = new GenericMembershipDataContext())
                {
                    DataTable items = new DataTable();
                    items.Columns.Add("TreeItem", typeof(int));
                    items.Columns.Add("TreeItemValue", typeof(int));

                    foreach (FeatureTreeItem item in TreeItems)
                    {
                        DataRow row = items.NewRow();
                        row.SetField<int>("TreeItem", item.FeatureTreeId);
                        row.SetField<int>("TreeItemValue", Convert.ToInt32(item.FeatureTreeAccess));
                        items.Rows.Add(row);
                    }

                    using(SqlCommand Cmd = new SqlCommand()) 
                    {
                        Cmd.CommandText = "AddFeatureTreeGroup";
                        Cmd.CommandType = CommandType.StoredProcedure;
                        Cmd.Connection = new SqlConnection();
                        Cmd.Connection.ConnectionString = Context.Connection.ConnectionString;

                        SqlParameter Items = Cmd.CreateParameter();
                        Items.ParameterName = "@TreeItems";
                        Items.SqlDbType = SqlDbType.Structured;
                        Items.Value = items;
                        Cmd.Parameters.Add(Items);

                        SqlParameter GroupName = Cmd.CreateParameter();
                        GroupName.ParameterName = "@GroupName";
                        GroupName.SqlDbType = SqlDbType.VarChar;
                        GroupName.Value = FeatureGroupName;
                        Cmd.Parameters.Add(GroupName);

                        SqlParameter AppId = Cmd.CreateParameter();
                        AppId.ParameterName = "@ApplicationId";
                        AppId.SqlDbType = SqlDbType.UniqueIdentifier;
                        AppId.Value = ApplicationId;
                        Cmd.Parameters.Add(AppId);

                        SqlParameter GroupNameId = Cmd.CreateParameter();
                        GroupNameId.ParameterName = "@GroupNameId";
                        GroupNameId.SqlDbType = SqlDbType.Int;
                        GroupNameId.Direction = ParameterDirection.Output;
                        Cmd.Parameters.Add(GroupNameId);

                        Cmd.Connection.Open();
                        Cmd.ExecuteNonQuery();

                        int RetVal = (int)Cmd.Parameters["@GroupNameId"].Value;
                        if (RetVal != 0) FeatureGroups = GetFeatureTreeGroups(Logger, ApplicationId);
                    }
                }
            }
            catch (Exception ex)
            {
                FeatureGroups.Message = "Failed to add feature tree group.";
                Logger.LogEvent("MemberData.FeatureTree.AddFeatureTreeGroup", ex);
            }
            return FeatureGroups;
        }

        public FeatureTreeItems RetrieveFeatureList(ILogger Logger, string UserName, Guid UserId, int? GroupNameId, Guid ApplicationId)
        {
            FeatureTreeItems TreeItems = new FeatureTreeItems { FeatureItems = new List<FeatureTreeItem>() };
            TreeItems.Message = "";

            try
            {
                string ConString = Convert.ToString(ConfigurationManager.ConnectionStrings["Membership"]);
                using (GenericMembershipDataContext Context = new GenericMembershipDataContext(ConString)) 
                {
                    if (ApplicationId == Guid.Empty && UserId == Guid.Empty) ApplicationId = Guid.Parse(ConfigurationManager.AppSettings["LoginAppId"]);
                    var ReturnedTreeItems = Context.GetFeatureTree(@UserName, UserId, GroupNameId, ApplicationId);
                    TreeItems.FeatureItems.AddRange(ReturnedTreeItems.Select(x => new FeatureTreeItem
                    {
                        FeatureTreeId = x.FeatureCategoryId,
                        FeatureTreeName = x.FeatureCategoryName,
                        FeatureTreeParentId = x.FeatureCategoryParentId,
                        GroupNameId = x.GroupNameId.Value,
                        FeatureTreeAccess = Convert.ToBoolean(x.FeatureCategorySelected),
                        Selectable = -1
                    }));
                }
            }
            catch (Exception ex)
            {
                TreeItems.Message = "Failed to retrieve feature tree items.";
                Logger.LogEvent("MemberData.FeatureTree.RetrieveFeatureList", ex);
            }
            return TreeItems;
        }
    }
}
