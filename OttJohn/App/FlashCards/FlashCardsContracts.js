(function () {

    angular.module('App.FlashCards').factory('FlashCardsContracts',
    ['$http', '$timeout', FlashCardsContracts]);

    function FlashCardsContracts() {

        var serviceName = 'FlashCardsContracts'; // route to the same origin Web Api controller - root directory

        var FlashCardsContracts = {

            GetSaveFlashCardRequest: GetSaveFlashCardRequest,
            GetFlashCardAndMetaRequest: GetFlashCardAndMetaRequest,
            GetFlashCardRequest: GetFlashCardRequest,
            GetFlashCardDetail: GetFlashCardDetail

        };

        return FlashCardsContracts;

        //////////////////////////////////////////////////////////////////////////////////////
        //  Contracts and messages
        //////////////////////////////////////////////////////////////////////////////////////
        function GetSaveFlashCardRequest() {

            var SaveFlashCardRequest = {

                FlashCardQuestion: null,
                FlashCardAnswer: null,
                FlashCardCategory: null

            }

            return SaveFlashCardRequest;

        }

        function GetFlashCardDetail() {

            var FlashCardDetail = {

                CategoryIdx: null,
                SelectedCatItem: null,
                CategoryItemsChosen: null

            }

            return FlashCardDetail;
        }

        function GetFlashCardRequest() {

            var FlashCardRequest = {

                CardDetail: null

            }

            return FlashCardRequest;

        }

        function GetFlashCardAndMetaRequest() {

            var FlashCardAndMetaRequest = {

                CategoryIdList: null

            }

            return FlashCardAndMetaRequest;

        }
    }
})();