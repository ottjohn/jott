(function () {
    angular.module('App.FlashCards').controller('FlashCardEntryController',
    ['$q', '$timeout', '$location', 'ExamplesService', 'ExamplesContracts', 'FlashCardEntryModel', '$rootScope', 'AppState', FlashCardEntryController]);

    function FlashCardEntryController($q, $timeout, $location, FlashCardsService, FlashCardsContracts, FlashCardEntryModel, $rootScope, AppState) {

        var FlashCardEntry = this;
        var scope = $rootScope.$new();

        //////////////////////////////////////////////////////////////////////////////////////
        //  Global variables
        //////////////////////////////////////////////////////////////////////////////////////
        FlashCardEntry.UsedCategories;
        FlashCardEntry.FlashCardQuestion;
        FlashCardEntry.FlashCardAnswer;
        FlashCardEntry.SelectedCat;

        //////////////////////////////////////////////////////////////////////////////////////
        //  Accessors
        //////////////////////////////////////////////////////////////////////////////////////
        FlashCardEntry.FlashCardParts = function () {

            var FlashCardParts = {

                FlashCardQuestion: $("#FlashCardEntryQuestion"),
                FlashCardAnswer: $("#FlashCardEntryAnswer")

            }

            return FlashCardParts;

        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Controller initialization
        //////////////////////////////////////////////////////////////////////////////////////
        FlashCardEntry.GetCategories = function () {

            FlashCardEntry.Message = "Please wait. Retrieving category list...";
            FlashCardEntryModel.GetCategories().then(GetCategoriesResult).catch(GetCategoriesResult);
            function GetCategoriesResult(Message) { FlashCardEntry.GetCategoriesResult(Message) }

        }

        FlashCardEntry.GetCategoriesResult = function (Message) {

            FlashCardEntry.Message = Message;
            if (Message == "") {

                FlashCardEntry.UsedCategories = FlashCardEntryModel.GetCategoryList();
                FlashCardEntry.Message = "Please select a single category for card, then fill out the question and answer.";

            }
        }

        FlashCardEntry.GetCategoryId = function (id) {

            FlashCardEntry.SelectedCat = id;

        }

        FlashCardEntry.RegisterRoute = function (CallingRoute) {

            var AppName = CallingRoute.split(".");
            AppState.SetRoute(AppName[1], CallingRoute);
            return AppName[1];

        }

        FlashCardEntry.Exit = function () {

            $location.url(AppState.GetPreviousRoute());

        }

        FlashCardEntry.SaveFlashCard = function () {

            var Message = FlashCardEntry.ValidateFields();
            if (Message == "") {

                FlashCardEntry.Message = "Please wait. Saving flashcard entry...";
                FlashCardEntryModel.SaveFlashCard(FlashCardEntry.FlashCardParts().FlashCardQuestion.text(), FlashCardEntry.FlashCardParts().FlashCardAnswer.text(), FlashCardEntry.SelectedCat).then(SaveFlashCardResult).catch(SaveFlashCardResult);
                function SaveFlashCardResult(Message) { FlashCardEntry.SaveFlashCardResult(Message) }

            } else {

                FlashCardEntry.Message = Message;

            }
        }

        FlashCardEntry.SaveFlashCardResult = function (Message) {

            if (Message == "") {

                FlashCardEntry.ResetCardDialog();

            } else {

                FlashCardEntry.Message = Message;

            }
        }

        FlashCardEntry.ResetCardDialog = function () {

            FlashCardEntry.Message = "Please select a single category for card, then fill out the question and answer.";
            FlashCardEntry.FlashCardParts().FlashCardQuestion.text("");
            FlashCardEntry.FlashCardParts().FlashCardAnswer.text("");

            $('input[type=radio]').prop('checked', false);

        }

        FlashCardEntry.ValidateFields = function () {

            var RetMessage = "";
            if (!(FlashCardEntry.SelectedCat != "undefined" && FlashCardEntry.SelectedCat != null && FlashCardEntry.SelectedCat > 0))
                RetMessage = "Please select a category for the flash card";
            else if(FlashCardEntry.FlashCardParts().FlashCardQuestion.text() == "")
                RetMessage = "Please provide a question for the flash card";
            else if (FlashCardEntry.FlashCardParts().FlashCardAnswer.text() == "")
                RetMessage = "Please provide an answer for the flash card";

            return RetMessage;

        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Event Handlers
        //////////////////////////////////////////////////////////////////////////////////////
        scope.$watch('$viewContentLoaded', function (event, viewConfig) {

            var CallingRoute = "FlashCardEntry." + $location.$$path.replace("/App/FlashCardEntry", "");
            //if (CallingRoute == "Examples.") CallingRoute = "Reporting.Reporting";
            var ProcessName = FlashCardEntry.RegisterRoute(CallingRoute);
            FlashCardEntry.GetCategories();

        });
    }
})();