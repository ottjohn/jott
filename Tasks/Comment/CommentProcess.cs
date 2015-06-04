using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MaintenanceContracts.Contracts.OttJohn;
using TasksData;

namespace Tasks.Comments
{
    public class CommentProcess
    {
        public string AddComment(Comment UserComment)
        {
            MemberTaskManager MTM = new MemberTaskManager();
            return MTM.AddComment(UserComment);
        }
    }
}
