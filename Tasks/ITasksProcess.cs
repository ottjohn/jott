using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using MaintenanceContracts.Contracts.Tasks;
using MaintenanceContracts.Contracts.OttJohn;
using TasksData;
using Tasks.Tasks;
using UtilityPot.CommonValidation;
using Tasks.Validate;
using System.Threading.Tasks;

namespace Tasks
{
    public interface ITasksProcess
    {
        //Task<VisitorData> RetrieveVisitorData();
        VisitorData RetrieveVisitorData();
        string AddComment(Comment UserComment);
        SubmitTaskResult SubmitTask(TaskContract TaskDetail);
        TaskItemList RetieveTasks(Guid UserId);
        string RetrieveHealthcareReport();
        TaskReportList RetieveTaskReport();
        Article RetrieveArticle(int ArticleId);
        ArticleSynopsisCollection RetrieveArticleSynopsis(string CategoryFilter, int CurrentPage, int PageSize, int ResetRecordCount, int PageCount);
        ArticleSearch RetrieveCategories();
        ArticleSearch RetrieveViewCategories();
        string SaveFlashCard(string FlashCardQuestion, string FlashCardAnswer, int FlashCardCategory);
        FlashCardAndMeta RetrieveFlashCard(FlashCardDetail CardDetails);
        string CheckForMessages();
        ArticleSearch RetrieveSpecificCategories(List<int> CatIdList);
    }
}
