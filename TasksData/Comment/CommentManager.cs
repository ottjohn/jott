using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UtilityPot.Logger;
using MaintenanceContracts.Contracts.OttJohn;

namespace TasksData.Comments
{
    public class CommentManager
    {
        public string AddComment(ILogger Logger, Comment UserComment)
        {
            string RetValue = "";
            try 
            {
                using (TaskManagerDataContext Context = new TaskManagerDataContext())
                {
                    Nullable<int> RetVal = 0;
                    Context.AddComment(UserComment.UserComment, UserComment.UserId, UserComment.ArticleNumber, ref RetVal);
                    if (RetVal.Value == 1) RetValue = "Failed to insert comment";
                }
            }
            catch (Exception ex)
            {
                RetValue = "Failed to add comment";
                Logger.LogEvent("TasksData.Comments.AddComment", ex);
            }

            return RetValue;
        }
    }
}
