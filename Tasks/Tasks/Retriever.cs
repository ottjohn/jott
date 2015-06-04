using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using MaintenanceContracts.Contracts.Tasks;
using TasksData;
using Tasks.Tasks;
using UtilityPot.CommonValidation;
using Tasks.Validate;
using System.IO;

namespace Tasks.Tasks
{
    public class Retriever
    {
        public TaskItemList RetieveTasks(Guid UserId)
        {
            TaskItemList TaskList = new TaskItemList();
            TaskList.TaskMessage = TypeValidation.ValidateGUIDId(UserId, "UserId");

            if (TaskList.TaskMessage == "")
            {
                MemberTaskManager TM = new MemberTaskManager();
                TaskList = TM.RetieveTasks(UserId);
            }

            return TaskList;
        }

        public DirectoryContent CheckDirectory()
        {
            DirectoryContent Dir = new DirectoryContent();
            Dir.Message = "";

            try
            {
                MemberTaskManager TM = new MemberTaskManager();
                //string[] filePaths = Directory.GetFiles(@"d:\TestFolder\");
                string[] filePaths = Directory.GetFiles(@"\\dev02\wcr\TestFolder\");
                Dir.ContractPath = new List<string>();
                Dir.ContractPath = filePaths.ToList();
            }
            catch (Exception ex)
            {

            }

            return Dir;
        }
    }
}
