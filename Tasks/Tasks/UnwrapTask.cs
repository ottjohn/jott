using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using MaintenanceContracts.Contracts.Tasks;
using TasksData;
using Tasks.Validate;

namespace Tasks.Tasks
{
    public class UnwrapTask
    {
        public SubmitTaskResult SubmitTask(TaskContract TaskDetail)
        {
            SubmitTaskResult Result = new SubmitTaskResult();
            Result.TaskReturnMessage = "";

            try
            {
                if (TaskDetail.RequiresMemberValidation)
                {
                    TaskValidate TV = new TaskValidate();
                    Result.TaskReturnMessage = TV.ValidateUser(TaskDetail.UserId, TaskDetail.Password);
                }

                if (Result.TaskReturnMessage == "")
                {
                    string TaskMethodName = "Process" + TaskDetail.TaskName;
                    TaskInvoker TI = new TaskInvoker();

                    Type type = Type.GetType("Tasks.Tasks.TaskInvoker");
                    if (type != null)
                    {
                        var method = type.GetMethod(TaskMethodName);

                        if (method != null)
                        {
                            object[] ObjectArray = new object[1];
                            ObjectArray[0] = TaskDetail;
                            Result.DocumentPath = method.Invoke(TI, ObjectArray).ToString();
                            if (Result.DocumentPath.IndexOf("Problem") > -1)
                            {
                                Result.TaskReturnMessage = Result.DocumentPath;
                                Result.DocumentPath = "";
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Result.TaskReturnMessage = "problem extracting task payload.";
            }

            return Result;
        }
    }
}
