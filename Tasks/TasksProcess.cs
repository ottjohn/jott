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
using Tasks.Articles;
using Tasks.Comments;
using Tasks.Visitors;
using Tasks.FlashCards;
using Tasks.Messages;
using System.Threading.Tasks;

namespace Tasks
{
    public class TasksProcess : ITasksProcess
    {
        //public Task<VisitorData> RetrieveVisitorData()
        //{
        //    VisitorProcess VP = new VisitorProcess();
        //    return Task.Run(() => { return VP.RetrieveVisitorData(); });
        //}

        public VisitorData RetrieveVisitorData()
        {
            VisitorProcess VP = new VisitorProcess();
            return VP.RetrieveVisitorData();
        }

        public string CheckForMessages()
        {
            ExternalMessage EM = new ExternalMessage();
            return EM.CheckForMessages();
        }

        public string SaveFlashCard(string FlashCardQuestion, string FlashCardAnswer, int FlashCardCategory)
        {
            FlashCardProcess FCP = new FlashCardProcess();
            return FCP.SaveFlashCard(FlashCardQuestion, FlashCardAnswer, FlashCardCategory);
        }

        public string AddComment(Comment UserComment)
        {
            CommentProcess CP = new CommentProcess();
            return CP.AddComment(UserComment);
        }

        public Article RetrieveArticle(int ArticleId)
        {
            ArticleProcess AP = new ArticleProcess();
            return AP.RetrieveArticle(ArticleId);
        }

        public ArticleSynopsisCollection RetrieveArticleSynopsis(string CategoryFilter, int CurrentPage, int PageSize, int ResetRecordCount, int PageCount)
        {
            ArticleProcess AP = new ArticleProcess();
            return AP.RetrieveArticleSynopsis(CategoryFilter, CurrentPage, PageSize, ResetRecordCount, PageCount);
        }

        public ArticleSearch RetrieveCategories()
        {
            ArticleProcess AP = new ArticleProcess();
            return AP.RetrieveCategories();
        }

        public ArticleSearch RetrieveViewCategories()
        {
            ArticleProcess AP = new ArticleProcess();
            return AP.RetrieveViewCategories();
        }

        public ArticleSearch RetrieveSpecificCategories(List<int> CatIdList)
        {
            ArticleProcess AP = new ArticleProcess();
            return AP.RetrieveSpecificCategories(CatIdList);
        }

        public FlashCardAndMeta RetrieveFlashCard(FlashCardDetail CardDetails)
        {
            ArticleProcess AP = new ArticleProcess();
            return AP.RetrieveFlashCard(CardDetails);
        }

        public SubmitTaskResult SubmitTask(TaskContract TaskDetail)
        {
            UnwrapTask UT = new UnwrapTask();
            return UT.SubmitTask(TaskDetail);
        }

        public DirectoryContent CheckDirectory()
        {
            Retriever Ret = new Retriever();
            return Ret.CheckDirectory();
        }

        public TaskItemList RetieveTasks(Guid UserId)
        {
            Retriever Ret = new Retriever();
            return Ret.RetieveTasks(UserId);
        }

        public string RetrieveHealthcareReport()
        {
            Reports Rep = new Reports();
            return Rep.RetrieveHealthcareReport();
        }

        public string RetrieveHandbookReport()
        {
            Reports Rep = new Reports();
            return Rep.RetrieveHandbookReport();
        }

        public TaskReportList RetieveTaskReport()
        {
            Reports Rep = new Reports();
            return Rep.RetieveTaskReport();
        }
    }
}
