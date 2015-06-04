using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using MaintenanceContracts.Contracts.Tasks;
using MaintenanceContracts.Contracts.OttJohn;
using TasksData.Tasks;
using UtilityPot.Logger;
using TasksData.Reports;
using TasksData.Articles;
using TasksData.Comments;
using TasksData.Visitors;
using TasksData.FlashCards;

namespace TasksData
{
    public class MemberTaskManager : IMemberTaskManager
    {
        private ILogger _Logger;

        public VisitorData RetrieveVisitorData()
        {
            VisitorManager VM = new VisitorManager();
            return VM.RetrieveVisitorData(_Logger);
        }

        public string AddComment(Comment UserComment)
        {
            CommentManager CM = new CommentManager();
            return CM.AddComment(_Logger, UserComment);
        }

        public string SaveFlashCard(string FlashCardQuestion, string FlashCardAnswer, int FlashCardCategory)
        {
            FlashCardManager FCM = new FlashCardManager();
            return FCM.SaveFlashCard(_Logger, FlashCardQuestion, FlashCardAnswer, FlashCardCategory);
        }

        public MemberTaskManager()
        {
            this._Logger = LoggerFactory.GetLogger(null);
        }

        public Article RetrieveArticle(int ArticleId)
        {
            ArticleManager AM = new ArticleManager();
            return AM.RetrieveArticle(_Logger, ArticleId);
        }

        public ArticleSynopsisCollection RetrieveArticleSynopsis(string CategoryFilter, int CurrentPage, int PageSize, int ResetRecordCount, int PageCount)
        {
            ArticleManager AM = new ArticleManager();
            return AM.RetrieveArticleSynopsis(_Logger, CategoryFilter, CurrentPage, PageSize, ResetRecordCount, PageCount);
        }

        public ArticleSearch RetrieveCategories()
        {
            ArticleManager AM = new ArticleManager();
            return AM.RetrieveCategories(_Logger);
        }

        public ArticleSearch RetrieveViewCategories()
        {
            ArticleManager AM = new ArticleManager();
            return AM.RetrieveViewCategories(_Logger);
        }

        public ArticleSearch RetrieveSpecificCategories(List<int> CatIdList)
        {
            ArticleManager AM = new ArticleManager();
            return AM.RetrieveSpecificCategories(_Logger, CatIdList);
        }

        public FlashCardAndMeta RetrieveFlashCard(FlashCardDetail CardDetails)
        {
            ArticleManager AM = new ArticleManager();
            return AM.RetrieveFlashCard(_Logger, CardDetails);
        }

        public string SubmitHealthcareTask(HealthcareElectionContract HealthcareElection, Guid UserId, int TaskId)
        {
            UpdateTask UT = new UpdateTask();
            return UT.SubmitHealthcareTask(_Logger, HealthcareElection, UserId, TaskId);
        }

        public string AckEmployeeHandbookTask(Guid UserId, int TaskId)
        {
            UpdateTask UT = new UpdateTask();
            return UT.SubmitAckEmployeeHandbook(_Logger, UserId, TaskId);
        }

        public TaskItemList RetieveTasks(Guid UserId)
        {
            GetTasks GT = new GetTasks();
            return GT.RetieveTasks(_Logger, UserId);
        }

        public string RetrieveHealthcareReport()
        {
            ReportManager RM = new ReportManager();
            return RM.RetrieveHealthcareReport(_Logger);
        }

        public string RetrieveHandbookReport()
        {
            ReportManager RM = new ReportManager();
            return RM.RetrieveHandbookReport(_Logger);
        }

        public TaskReportList RetieveTaskReport()
        {
            ReportManager RM = new ReportManager();
            return RM.RetieveTaskReport(_Logger);
        }
    }
}
