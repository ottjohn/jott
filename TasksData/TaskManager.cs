using System.Configuration;

namespace TasksData
{
    partial class TaskManagerDataContext
    {
        partial void OnCreated()
        {
            this.Connection.ConnectionString =
            ConfigurationManager.ConnectionStrings["Membership"].ConnectionString;
        }
    }
}
