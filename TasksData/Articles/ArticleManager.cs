using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MaintenanceContracts.Contracts.OttJohn;
using UtilityPot.Logger;
using MaintenanceContracts.Contracts.Tasks;

namespace TasksData.Articles
{
    public class ArticleManager
    {
        public Article RetrieveArticle(ILogger Logger, int ArticleId) 
        {
            Article _Article = new Article { Chapters = new List<ArticleChapter>() };
            _Article.Message = "";
            try
            {
                using (TaskManagerDataContext Context = new TaskManagerDataContext())
                {
                    var RetArticle = Context.GetArticle(ArticleId);
                    _Article.Chapters.AddRange(RetArticle.Select(x => new ArticleChapter { 
                        ChapterId = x.id, ChapterTitle = x.Title, ChapterURL = x.ContentUrl, DateStamp = x.DateStamp, ArticleNumber = x.ArticleNumber.Value  }));

                    _Article.ArticleNumber = _Article.Chapters[0].ArticleNumber;
                    RetrieveArticleComments(Logger, ref _Article);
                }
            }
            catch (Exception ex)
            {
                _Article.Message = "Failed to retrieve article";
                Logger.LogEvent("TasksData.ArticleManager.RetrieveArticle", ex);
            }
            return _Article;
        }

        public void RetrieveArticleComments(ILogger Logger, ref Article _Article)
        {
            _Article.ArticleComments = new MaintenanceContracts.Contracts.OttJohn.Comments { CommentList = new List<Comment>() };

            try
            {
                using (TaskManagerDataContext Context = new TaskManagerDataContext())
                {
                    var RetList = Context.ArticleComments(_Article.ArticleNumber);
                    _Article.ArticleComments.CommentList.AddRange(RetList.Select(x => new Comment
                    {

                        UserComment = x.content,
                        UserName = x.UserName,
                        UserId = x.UserId,
                        ArticleNumber = x.ArticleNumber.Value,
                        DateStamp = x.DateStamp

                    }));
                }
            }
            catch (Exception ex)
            {
                _Article.Message = "Could not retrieve article comments";
                Logger.LogEvent("TasksData.ArticleManager.RetrieveArticle", ex);
            }
        }

        private int GetSynopsisRecordCount(ILogger Logger, string CategoryFilter)
        {
            int RetVal = 0;

            try
            {
                using (TaskManagerDataContext Context = new TaskManagerDataContext())
                {
                    Nullable<int> ReturnedVal = null;
                    Context.GetSynopsisRecordCount(CategoryFilter, ref ReturnedVal);
                    RetVal = ReturnedVal.Value;
                }
            }
            catch (Exception ex)
            {
                Logger.LogEvent("TasksData.ArticleManager.GetSynopsisRecordCount", ex);
            }

            return RetVal;
        }

        public FlashCardAndMeta RetrieveFlashCard(ILogger Logger, FlashCardDetail CardDetails)
        {
            FlashCardAndMeta FlashCards = new FlashCardAndMeta();
            FlashCards.Message = "";

            try
            {
                using (TaskManagerDataContext Context = new TaskManagerDataContext())
                {
                    var ReturnedData = Context.GetFlashCard(CardDetails.CategoryIdx, CardDetails.SelectedCatItem, CardDetails.CategoryItemsChosen).ToList();
                    FlashCards.FlashCardQuestion = ReturnedData.Single().FlashCardQuestion;
                    FlashCards.FlashCardAnswer = ReturnedData.Single().FlashCardAnswer;
                }
            }
            catch (Exception ex)
            {
                FlashCards.Message = "Failed to retrieve flash card details.";
                Logger.LogEvent("TasksData.ArticleManager.RetrieveCardAndMetaData", ex);
            }

            return FlashCards;
        }

        public ArticleSearch RetrieveSpecificCategories(ILogger Logger, List<int> CatIdList)
        {
            ArticleSearch Search = new ArticleSearch { Categories = new SynopsisTopics { Categories = new List<SynopsisTopic>() } };
            Search.Message = "";

            string CatList = String.Join(",", CatIdList);

            try
            {
                using (TaskManagerDataContext Context = new TaskManagerDataContext())
                {
                    var ReturnedCategories = Context.GetSpecificCategories(CatList);
                    Search.Categories.Categories.AddRange(ReturnedCategories.Select(x => new SynopsisTopic
                    {
                        CategoryId = x.id.Value,
                        Category = x.name,
                        BackColor = x.BackColor,
                        ForeColor = x.ForeColor,
                        CategoryCount = x.CardCount.Value,
                        CategorySelected = 0,
                        CategoryItemsChosen = ""
                    }));
                }
            }
            catch (Exception ex)
            {
                Search.Message = "Could not retrieve categories from system";
                Logger.LogEvent("TasksData.ArticleManager.RetrieveViewCategories", ex);
            }

            return Search;
        }

        public ArticleSearch RetrieveViewCategories(ILogger Logger)
        {
            ArticleSearch Search = new ArticleSearch { Categories = new SynopsisTopics { Categories = new List<SynopsisTopic>() } };
            Search.Message = "";

            try
            {
                using (TaskManagerDataContext Context = new TaskManagerDataContext())
                {
                    var ReturnedCategories = Context.GetUsedViewCategories();
                    Search.Categories.Categories.AddRange(ReturnedCategories.Select(x => new SynopsisTopic
                    {
                        CategoryId = x.id,
                        Category = x.name,
                        BackColor = x.BackColor,
                        ForeColor = x.ForeColor,
                        CategoryCount = x.CardCount.Value,
                        CategorySelected = 0,
                        CategoryItemsChosen = ""
                    }));
                }
            }
            catch (Exception ex)
            {
                Search.Message = "Could not retrieve categories from system";
                Logger.LogEvent("TasksData.ArticleManager.RetrieveViewCategories", ex);
            }

            return Search;
        }

        public ArticleSearch RetrieveCategories(ILogger Logger)
        {
            ArticleSearch SearchParams = GetSearchCategories(Logger, 1);
            return SearchParams;
        }

        public ArticleSynopsisCollection RetrieveArticleSynopsis(ILogger Logger, string CategoryFilter, int CurrentPage, int PageSize, int ResetRecordCount, int PageCount)
        {
            ArticleSynopsisCollection Synopses = new ArticleSynopsisCollection { SynopsisList = new List<ArticleSynopsisItem>() };
            Synopses.Message = "";

            if (ResetRecordCount == 1)
            {
                Synopses.RecordCount = GetSynopsisRecordCount(Logger, CategoryFilter);
                if (Synopses.RecordCount > 0)
                    Synopses.PageCount = Convert.ToInt32(Math.Ceiling((decimal)Synopses.RecordCount / PageSize));
                else
                    Synopses.PageCount = 0;
            }
            else
            {
                Synopses.PageCount = PageCount;
            }

            try
            {
                using (TaskManagerDataContext Context = new TaskManagerDataContext())
                {
                    var ReturnedList = Context.GetArticleSynopsisNew(PageSize, CurrentPage, CategoryFilter);
                    Synopses.SynopsisList.AddRange(ReturnedList.Select(x => new ArticleSynopsisItem
                    {
                        ArticleId = x.id.Value,
                        ArticleNumber = x.ArticleNumber.Value,
                        Title = x.Title,
                        Synopsis = x.synopsis,
                        Categories = x.Categories,
                        DateStamp = x.DateStamp.Value
                    }));

                    Synopses.SearchObject = GetSearchCategories(Logger, 0);
                }
            }
            catch (Exception ex)
            {
                Synopses.Message = "Could not retrieve article synopsis list";
                Logger.LogEvent("TasksData.ArticleManager.RetrieveArticleSynopsis", ex);
            }

            return Synopses;
        }

        private ArticleSearch GetSearchCategories(ILogger Logger, int IsFlashCard)
        {
            ArticleSearch Search = new ArticleSearch { Categories = new SynopsisTopics { Categories = new List<SynopsisTopic>() } };
            Search.Message = "";

            try
            {
                using (TaskManagerDataContext Context = new TaskManagerDataContext())
                {
                    var ReturnedCategories = Context.GetUsedCategories(IsFlashCard);
                    Search.Categories.Categories.AddRange(ReturnedCategories.Select(x => new SynopsisTopic
                    {
                        CategoryId = x.id,
                        Category = x.name,
                        CategorySelected = 0
                    }));
                }
            }
            catch (Exception ex)
            {
                Search.Message = "Could not retrieve categories from system";
                Logger.LogEvent("TasksData.ArticleManager.GetSearchCategories", ex);
            }

            return Search;
        }
    }
}
