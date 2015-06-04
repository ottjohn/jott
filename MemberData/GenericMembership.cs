using System.Configuration;

namespace MemberData
{
    partial class GenericMembershipDataContext
    {
        partial void OnCreated()
        {
            this.Connection.ConnectionString =
            ConfigurationManager.ConnectionStrings["Membership"].ConnectionString;
        }
    }
}
