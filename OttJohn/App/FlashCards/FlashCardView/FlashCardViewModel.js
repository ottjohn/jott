(function () {
    angular.module('App.FlashCards').factory('FlashCardViewModel',
    ['$q', '$http', '$timeout', 'FlashCardsService', 'FlashCardsContracts', 'Validation', 'AppState', FlashCardViewModel]);

    function FlashCardViewModel($q, $http, $timeout, FlashCardsService, FlashCardsContracts, Validation, AppState) {

        var serviceName = 'FlashCardViewModel'; // route to the same origin Web Api controller - root directory
        var FlashCardCategories;
        var FlashCardDetails;
        //////////////////////////////////////////////////////////////////////////////////////
        //  Global variables
        //////////////////////////////////////////////////////////////////////////////////////

        var FlashCardViewModelMethods = {

            GetCategories: GetCategories,
            GetCategoryList: GetCategoryList,
            GetFlashCard: GetFlashCard,
            GetFlashCardDetails: GetFlashCardDetails

        };

        return FlashCardViewModelMethods;

        //////////////////////////////////////////////////////////////////////////////////////
        //  Accessors
        //////////////////////////////////////////////////////////////////////////////////////
        function GetCategoryList() {

            return FlashCardCategories;

        }

        function GetFlashCardDetails() {

            return FlashCardDetails;

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

                FlashCardsService.SendRequest(null, 'GetViewCategories').then(ShowResult).catch(showError);

            }

            function ShowResult(data) {

                FlashCardCategories = data.data.SearchObject.Categories;
                deferred.resolve(data.data.SearchObject.Message);

            }

            function GetFlashCardDetails() {

                return FlashCardDetails;

            }

            function showError() {

                deferred.reject("Communication failed");

            }

            return deferred.promise;
        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Get card and meta data (if necessary)
        //////////////////////////////////////////////////////////////////////////////////////
        function GetFlashCard(FlashCardDetail) {

            var deferred = $q.defer();

            $timeout(GetFlashCardImpl, 0);

            function GetFlashCardImpl() {

                var request = FlashCardsContracts.GetFlashCardRequest()
                request.CardDetail = FlashCardDetail;
                FlashCardsService.SendRequest(request, 'GetFlashCard').then(ShowResult).catch(showError);

            }

            function ShowResult(data) {

                FlashCardDetails = data.data.FlashCardDetails;
                deferred.resolve(data.data.FlashCardDetails.Message);

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