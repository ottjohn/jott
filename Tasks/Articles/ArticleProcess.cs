using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MaintenanceContracts.Contracts.OttJohn;
using MaintenanceContracts.Contracts.Tasks;
using TasksData;

namespace Tasks.Articles
{
    public class ArticleProcess
    {
        public Article RetrieveArticle(int ArticleId)
        {
            MemberTaskManager MTM = new MemberTaskManager();
            return MTM.RetrieveArticle(ArticleId);
        }

        public ArticleSynopsisCollection RetrieveArticleSynopsis(string CategoryFilter, int CurrentPage, int PageSize, int ResetRecordCount, int PageCount)
        {
            MemberTaskManager MTM = new MemberTaskManager();
            return MTM.RetrieveArticleSynopsis(CategoryFilter, CurrentPage, PageSize, ResetRecordCount, PageCount);
        }

        public ArticleSearch RetrieveCategories()
        {
            MemberTaskManager MTM = new MemberTaskManager();
            return MTM.RetrieveCategories();
        }

        public ArticleSearch RetrieveViewCategories()
        {
            MemberTaskManager MTM = new MemberTaskManager();
            return MTM.RetrieveViewCategories();
        }

        public ArticleSearch RetrieveSpecificCategories(List<int> CatIdList)
        {
            MemberTaskManager MTM = new MemberTaskManager();
            return MTM.RetrieveSpecificCategories(CatIdList);
        }

        public FlashCardAndMeta RetrieveFlashCard(FlashCardDetail CardDetails)
        {
            MemberTaskManager MTM = new MemberTaskManager();
            return MTM.RetrieveFlashCard(CardDetails);
        }
    }
}
