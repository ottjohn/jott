using System;
using System.IO;
using System.Web;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Data;
using System.Data.SqlClient;
using MaintenanceContracts.Contracts.Tasks;
using UtilityPot.Logger;

namespace TasksData.Tasks
{
    public class GetTasks
    {
        public TaskItemList RetieveTasks(ILogger Logger, Guid UserId)
        {
            TaskItemList TaskList = new TaskItemList { Tasks = new List<TaskItem>() };
            TaskList.TaskMessage = "";

            try
            {
                using (TaskManagerDataContext Context = new TaskManagerDataContext())
                {
                    var ReturnedTaskItems = Context.GetUserTasks(UserId);
                    TaskList.Tasks.AddRange(ReturnedTaskItems.Select(x => new TaskItem { TaskId = x.TaskId, TaskName = x.TaskName }));
                }
            }
            catch (Exception ex)
            {
                TaskList.TaskMessage = "Failed to retrieve user tasks";
                Logger.LogEvent("TasksData.Tasks.RetieveTasks", ex);
            }

            return TaskList;
        }
    }
}
