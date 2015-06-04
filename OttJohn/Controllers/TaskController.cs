using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web;
using System.Web.Security;
using System.Web.SessionState;
using System.Web.Http.Description;
using System.Threading.Tasks;
using MaintenanceContracts.Messages.Common;
using MaintenanceContracts.Messages.StateTax;
using MaintenanceContracts.Contracts.StateTax;
using MaintenanceContracts.Messages.Tasks;
using MaintenanceContracts.Messages.OttJohn;
using MaintenanceContracts.Messages.MemberManagement;
using CustomerUtility;
using Tasks;

namespace OttJohn
{
    public class TaskController : ApiController
    {
        [Route("api/Tasks/GetArticle")]
        [ResponseType(typeof(GetArticleResponse))]
        public async Task<IHttpActionResult> RetrieveArticle(GetArticleRequest request)
        {
            GetArticleResponse response = new GetArticleResponse();
            TasksProcess TP = new TasksProcess();
            response.Topic = TP.RetrieveArticle(request.ArticleId);
            return Ok(response);
        }

        //[Route("api/Tasks/GetArticle")]
        //[ResponseType(typeof(GetArticleResponse))]
        //public async Task<IHttpActionResult> RetrieveArticle(GetArticleRequest request)
        //{
        //    GetArticleResponse response = new GetArticleResponse();
        //    TasksProcess TP = new TasksProcess();
        //    response.Topic = TP.RetrieveArticle(request.ArticleId);
        //    return Ok(response);
        //}

        [Route("api/Tasks/GetCategories")]
        [ResponseType(typeof(RetrieveCategoriesResponse))]
        public async Task<IHttpActionResult> RetrieveCategories()
        {
            RetrieveCategoriesResponse response = new RetrieveCategoriesResponse();
            TasksProcess TP = new TasksProcess();
            response.SearchObject = TP.RetrieveCategories();
            return Ok(response);
        }

        [Route("api/Tasks/GetViewCategories")]
        [ResponseType(typeof(RetrieveCategoriesResponse))]
        public async Task<IHttpActionResult> RetrieveViewCategories()
        {
            RetrieveCategoriesResponse response = new RetrieveCategoriesResponse();
            TasksProcess TP = new TasksProcess();
            response.SearchObject = TP.RetrieveViewCategories();
            return Ok(response);
        }

        [Route("api/Tasks/GetSpecificCategories")]
        [ResponseType(typeof(RetrieveCategoriesResponse))]
        public async Task<IHttpActionResult> RetrieveSpecificCategories(FlashCardCategoryRequest request)
        {
            RetrieveCategoriesResponse response = new RetrieveCategoriesResponse();
            TasksProcess TP = new TasksProcess();
            response.SearchObject = TP.RetrieveSpecificCategories(request.CatIdList);
            return Ok(response);
        }

        [Route("api/Tasks/GetFlashCard")]
        [ResponseType(typeof(GetFlashCardAndMetaResponse))]
        public async Task<IHttpActionResult> RetrieveFlashCard(GetFlashCardRequest request)
        {
            GetFlashCardAndMetaResponse response = new GetFlashCardAndMetaResponse();
            TasksProcess TP = new TasksProcess();
            response.FlashCardDetails = TP.RetrieveFlashCard(request.CardDetail);
            return Ok(response);
        }

        [Route("api/Tasks/GetArticleSynopsis")]
        [ResponseType(typeof(GetArticleSynopsisResponse))]
        public async Task<IHttpActionResult> RetrieveArticleSynopsis(GetArticleSynopisRequest request)
        {
            GetArticleSynopsisResponse response = new GetArticleSynopsisResponse();
            TasksProcess TP = new TasksProcess();
            response.ArticleList = TP.RetrieveArticleSynopsis(request.CategoryFilter, request.CurrentPage, request.PageSize, request.ResetRecordCount, request.PageCount);
            return Ok(response);
        }

        [Route("api/Tasks/AddComment")]
        [ResponseType(typeof(AddCommentResponse))]
        public async Task<IHttpActionResult> AddComment(AddCommentRequest request)
        {
            AddCommentResponse response = new AddCommentResponse();
            TasksProcess TP = new TasksProcess();
            response.Message = TP.AddComment(request.UserComment);
            return Ok(response);
        }

        [Route("api/Tasks/SaveFlashCard")]
        [ResponseType(typeof(SaveFlashCardResponse))]
        public async Task<IHttpActionResult> SaveFlashCard(SaveFlashCardRequest request)
        {
            SaveFlashCardResponse response = new SaveFlashCardResponse();
            TasksProcess TP = new TasksProcess();
            response.Message = TP.SaveFlashCard(request.FlashCardQuestion, request.FlashCardAnswer, request.FlashCardCategory);
            return Ok(response);
        }

        //[Route("api/Tasks/GetVisitorData")]
        //[ResponseType(typeof(GetVisitorDataResponse))]
        //public async Task<IHttpActionResult> RetrieveVisitorData()
        //{
        //    GetVisitorDataResponse response = new GetVisitorDataResponse();
        //    TasksProcess TP = new TasksProcess();
        //    response.Visitor = await TP.RetrieveVisitorData();
        //    //response.Visitor = TP.RetrieveVisitorData();
        //    return Ok(response);
        //}

        [Route("api/Tasks/GetVisitorData")]
        [ResponseType(typeof(GetVisitorDataResponse))]
        public GetVisitorDataResponse RetrieveVisitorData()
        {
            GetVisitorDataResponse response = new GetVisitorDataResponse();
            TasksProcess TP = new TasksProcess();
            response.Visitor = TP.RetrieveVisitorData();
            //response.Visitor = TP.RetrieveVisitorData();
            return response;
        }

        [Route("api/Tasks/CheckForMessages")]
        [ResponseType(typeof(CheckForMessagesResponse))]
        public async Task<IHttpActionResult> CheckForMessages()
        {
            CheckForMessagesResponse response = new CheckForMessagesResponse();
            TasksProcess TP = new TasksProcess();
            response.Message = TP.CheckForMessages();
            return Ok(response);
        }

        [Route("api/Tasks/GetSampleUsers")]
        [ResponseType(typeof(GetPendingUsersResponse))]
        public async Task<IHttpActionResult> RetrieveSampleUsers(GetUnapprovedMembersRequest request)
        {
            GetPendingUsersResponse response = new GetPendingUsersResponse();
            CustomerProcess CP = new CustomerProcess();
            response.MemberInfoManager = CP.RetrieveSampleUsers(request.CurrentPage, request.PageSize, request.SortField, request.SortDirection);
            if (response.MemberInfoManager == null)
                response.ErrorMessage = "Failed to retrieve pending user list.";
            else
                response.ErrorMessage = "";

            return Ok(response);
        }
    }
}
