using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using MaintenanceContracts.Contracts.Tasks;
using MaintenanceContracts.Contracts.OttJohn;
using TasksData.Tasks;
using UtilityPot.Logger;

namespace TasksData
{
    interface IMemberTaskManager
    {
        VisitorData RetrieveVisitorData();
        string AddComment(Comment UserComment);
        string SubmitHealthcareTask(HealthcareElectionContract HealthcareElection, Guid UserId, int TaskId);
        TaskItemList RetieveTasks(Guid UserId);
        TaskReportList RetieveTaskReport();
        string RetrieveHealthcareReport();
        string RetrieveHandbookReport();
        Article RetrieveArticle(int ArticleId);
        ArticleSynopsisCollection RetrieveArticleSynopsis(string CategoryFilter, int CurrentPage, int PageSize, int ResetRecordCount, int PageCount);
        ArticleSearch RetrieveCategories();
        ArticleSearch RetrieveViewCategories();
        string SaveFlashCard(string FlashCardQuestion, string FlashCardAnswer, int FlashCardCategory);
        FlashCardAndMeta RetrieveFlashCard(FlashCardDetail CardDetails);
        ArticleSearch RetrieveSpecificCategories(List<int> CatIdList);
    }
}
