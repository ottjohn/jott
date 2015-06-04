(function () {
    angular.module('App.FlashCards').factory('FlashCardEntryModel',
    ['$q', '$http', '$timeout', 'FlashCardsService', 'FlashCardsContracts', 'Validation', 'AppState', FlashCardEntryModel]);

    function FlashCardEntryModel($q, $http, $timeout, FlashCardsService, FlashCardsContracts, Validation, AppState) {

        var serviceName = 'FlashCardEntryModel'; // route to the same origin Web Api controller - root directory
        var FlashCardCategories;
        //////////////////////////////////////////////////////////////////////////////////////
        //  Global variables
        //////////////////////////////////////////////////////////////////////////////////////

        var FlashCardEntryModelMethods = {

            GetCategories: GetCategories,
            GetCategoryList: GetCategoryList,
            SaveFlashCard: SaveFlashCard

        };

        return FlashCardEntryModelMethods;

        //////////////////////////////////////////////////////////////////////////////////////
        //  Accessors
        //////////////////////////////////////////////////////////////////////////////////////
        function GetCategoryList() {

            return FlashCardCategories;

        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Service Calls
        //////////////////////////////////////////////////////////////////////////////////////
        //  Get flashcard category list
        //////////////////////////////////////////////////////////////////////////////////////
        function GetCategories(UserName) {

            var deferred = $q.defer();

            $timeout(GetCategoriesImpl, 0);

            function GetCategoriesImpl() {

                FlashCardsService.SendRequest(null, 'GetCategories').then(ShowResult).catch(showError);

            }

            function ShowResult(data) {

                FlashCardCategories = data.data.SearchObject.Categories;
                deferred.resolve(data.data.SearchObject.Message);

            }

            function showError() {

                deferred.reject("Communication failed");

            }

            return deferred.promise;
        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Save flashcard
        //////////////////////////////////////////////////////////////////////////////////////
        function SaveFlashCard(FlashCardQuestion, FlashCardAnswer, FlashCardCat) {

            var deferred = $q.defer();

            $timeout(SaveFlashCardImpl, 0);

            function SaveFlashCardImpl() {

                var request = FlashCardsContracts.GetSaveFlashCardRequest();
                request.FlashCardQuestion = FlashCardQuestion;
                request.FlashCardAnswer = FlashCardAnswer;
                request.FlashCardCategory = FlashCardCat;
                FlashCardsService.SendRequest(request, 'SaveFlashCard').then(ShowResult).catch(showError);

            }

            function ShowResult(data) {

                deferred.resolve(data.data.Message);

            }

            function showError() {

                deferred.reject("Communication failed");

            }

            return deferred.promise;
        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Model Validators -- Cannot do the update at this level. This is just a validator
        //////////////////////////////////////////////////////////////////////////////////////
        function ValidateFieldEntry(ContractEntryField, key, MapToKey, Required, value) {

            return Validation.ValidateFieldEntry(ContractEntryField, key, MapToKey, Required, value);

        }
    }
})();