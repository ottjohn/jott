(function () {
    angular.module('App.FlashCards').controller('FlashCardViewController',
    ['$q', '$timeout', '$location', 'ExamplesService', 'FlashCardsContracts', 'FlashCardViewModel', '$rootScope', 'AppState', FlashCardViewController]);

    function FlashCardViewController($q, $timeout, $location, FlashCardsService, FlashCardsContracts, FlashCardViewModel, $rootScope, AppState) {

        var FlashCardView = this;
        var scope = $rootScope.$new();

        //////////////////////////////////////////////////////////////////////////////////////
        //  Global variables
        //////////////////////////////////////////////////////////////////////////////////////
        FlashCardView.UsedCategories;
        FlashCardView.FlashCardBackground;
        FlashCardView.FlashCardForeground;
        FlashCardView.SelectedCategories;
        FlashCardView.FlashCardDetails;
        FlashCardView.IsQuestion;
        FlashCardView.Item;
        FlashCardView.Category;

        //////////////////////////////////////////////////////////////////////////////////////
        //  Accessors
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        //  Controller initialization
        //////////////////////////////////////////////////////////////////////////////////////
        FlashCardView.GetCategories = function () {

            FlashCardView.IsQuestion = false;
            FlashCardView.Message = "Please wait. Retrieving category list...";
            FlashCardViewModel.GetCategories().then(GetCategoriesResult).catch(GetCategoriesResult);
            function GetCategoriesResult(Message) { FlashCardView.GetCategoriesResult(Message) }

        }

        FlashCardView.GetCategoriesResult = function (Message) {

            FlashCardView.Message = Message;
            if (Message == "") {

                FlashCardView.UsedCategories = FlashCardViewModel.GetCategoryList();
                FlashCardView.Message = "Please select the categories you wish to be quizzed on.";

            }
        }

        FlashCardView.GetCategoryId = function (id) {

           var iLen = FlashCardView.UsedCategories.Categories.length;
            for (var i = 0; i < iLen; i++) {

                if (FlashCardView.UsedCategories.Categories[i].CategoryId == id) {

                    if (FlashCardView.UsedCategories.Categories[i].CategorySelected == 1)
                        FlashCardView.UsedCategories.Categories[i].CategorySelected = 0;
                    else
                        FlashCardView.UsedCategories.Categories[i].CategorySelected = 1;

                }
            }
        }

        FlashCardView.SelectRandomCategoryAndCard = function () {

            var FlashCardDetail = FlashCardsContracts.GetFlashCardDetail();
            var iLen = FlashCardView.SelectedCategories.length;
            var CategoryIdx = Math.floor(iLen * Math.random());

            FlashCardView.Category = FlashCardView.SelectedCategories[CategoryIdx].Category;
            FlashCardDetail.CategoryIdx = FlashCardView.SelectedCategories[CategoryIdx].CategoryId;
            FlashCardView.FlashCardBackground = FlashCardView.SelectedCategories[CategoryIdx].BackColor;
            FlashCardView.FlashCardForeground = FlashCardView.SelectedCategories[CategoryIdx].ForeColor;
            var CatLen = FlashCardView.SelectedCategories[CategoryIdx].CategoryCount;
            FlashCardDetail.SelectedCatItem = Math.ceil(CatLen * Math.random());

            if (FlashCardView.SelectedCategories[CategoryIdx].CategoryItemsChosen == "")
                FlashCardView.SelectedCategories[CategoryIdx].CategoryItemsChosen += FlashCardDetail.SelectedCatItem;
            else
                FlashCardView.SelectedCategories[CategoryIdx].CategoryItemsChosen += "," + FlashCardDetail.SelectedCatItem;

            FlashCardDetail.CategoryItemsChosen = FlashCardView.SelectedCategories[CategoryIdx].CategoryItemsChosen;

            return FlashCardDetail;

        }

        FlashCardView.GoSearch = function () {

            if (FlashCardView.CheckForSelectedCats() > 0) {

                FlashCardView.GoSearchImpl();

            } else {

                FlashCardView.Message = "Please select at least one category."

            }
        }

        FlashCardView.GoSearchImpl = function () {

            FlashCardView.Message = "Please wait. Retrieving card...";
            FlashCardViewModel.GetFlashCard(FlashCardView.SelectRandomCategoryAndCard()).then(GetCardAndMetaDataResult).catch(GetCardAndMetaDataResult);
            function GetCardAndMetaDataResult(Message) { FlashCardView.GetCardAndMetaDataResult(Message) }

        }

        FlashCardView.GetNext = function () {

            if (FlashCardView.IsQuestion) {

                $("#FlashCardContainer").html(FlashCardView.FlashCardDetails.FlashCardAnswer);
                FlashCardView.IsQuestion = false;
                FlashCardView.Message = "Please click on the card when you are ready for another card.";

            } else {

                FlashCardView.GoSearchImpl();

            }

        }

        FlashCardView.GetCardAndMetaDataResult = function (Message) {

            if (Message == "") {

                FlashCardView.FlashCardDetails = FlashCardViewModel.GetFlashCardDetails();
                //$("#FlashCardContainer").css({ background: FlashCardView.FlashCardBackground, color: FlashCardView.FlashCardForeground });
                $("#FlashCardContainer").css({ 'background': 'white', 'color': 'black' });
                $("#FlashCardContainer").html(FlashCardView.FlashCardDetails.FlashCardQuestion);
                FlashCardView.IsQuestion = true;
                FlashCardView.Message = "Category: " + FlashCardView.Category + ". Please click on the card when you are ready to view the answer.";

            } else {


                FlashCardView.Message = Message;

            }
        }

        FlashCardView.CheckForSelectedCats = function () {

            var Count = 0;
            FlashCardView.SelectedCategories = null;
            var iLen = FlashCardView.UsedCategories.Categories.length;
            for (var i = 0; i < iLen; i++) {

                if (FlashCardView.UsedCategories.Categories[i].CategorySelected == 1) {

                    if (FlashCardView.SelectedCategories == null) {

                        FlashCardView.SelectedCategories = new Array();
                        FlashCardView.SelectedCategories[0] = FlashCardView.UsedCategories.Categories[i];

                    } else {

                        var iIdx = FlashCardView.SelectedCategories.length;
                        FlashCardView.SelectedCategories[iIdx] = FlashCardView.UsedCategories.Categories[i];

                    }

                    Count++;
                }
            }

            return Count;
        }

        FlashCardView.RegisterRoute = function (CallingRoute) {

            var AppName = CallingRoute.split(".");
            AppState.SetRoute(AppName[1], CallingRoute);
            return AppName[1];

        }

        FlashCardView.Exit = function () {

            $location.url(AppState.GetPreviousRoute());

        }

        FlashCardView.ResetCardDialog = function () {

            FlashCardView.Message = "Please select a single category for card, then fill out the question and answer.";
            FlashCardView.FlashCardParts().Flash
            CardQuestion.text("");
            FlashCardView.FlashCardParts().FlashCardAnswer.text("");

            $('input[type=radio]').prop('checked', false);

        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  External FlashCard View
        //////////////////////////////////////////////////////////////////////////////////////
        FlashCardView.GoExternalSearch = function () {

            if (FlashCardView.CheckForSelectedCats() > 0) {

                //var QS = encodeURIComponent(JSON.stringify(FlashCardView.SelectedCategories));
                var QS = FlashCardView.BuildPopOutQS();
                var URL = "app/FlashCards/FlashCardView/PopOut/FlashCardPopOut.html?" + QS;
                open(URL);

            } else {

                FlashCardView.Message = "Please select at least one category.";

            }

        }

        FlashCardView.BuildPopOutQS = function () {

            var QSConcat = "";
            FlashCardView.SelectedCategories = null;
            var iLen = FlashCardView.UsedCategories.Categories.length;
            for (var i = 0; i < iLen; i++) {

                if (FlashCardView.UsedCategories.Categories[i].CategorySelected == 1) {

                    if (QSConcat == "")
                        QSConcat = "CatId=" + FlashCardView.UsedCategories.Categories[i].CategoryId;
                    else
                        QSConcat += "&CatId=" + FlashCardView.UsedCategories.Categories[i].CategoryId;

                }
            }

            return QSConcat;

        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Event Handlers
        //////////////////////////////////////////////////////////////////////////////////////
        scope.$watch('$viewContentLoaded', function (event, viewConfig) {

            var CallingRoute = "FlashCardView." + $location.$$path.replace("/App/FlashCardView", "");
            //if (CallingRoute == "Examples.") CallingRoute = "Reporting.Reporting";
            var ProcessName = FlashCardView.RegisterRoute(CallingRoute);
            FlashCardView.GetCategories();

        });
    }
})();