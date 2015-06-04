(function () {

    var Validation = function () {

        //                Password: /^(?=.{8,}$)(?=.*?[A-Z])(?=.*?[\d])(?=.*?[@!#$%]).*/,

        this.ValidationRules = function() {

            var ValidationRules = {

                Phone: /^([2-9]{1}[0-9]{2})?[0-9]{7}$/,
                FirstName: /^([a-z]{2,})|([a-z]+([ |-]{1}[a-z]+)+)$/,
                LastName: /^([a-z]{2,})|([a-z]{2,}([ |-]{1}[a-z]+)?)$/,
                Addy1: /[\w]{2,}/,
                City: /[\w]{2,}/,
                State: /[\w]{2,}/,
                Zip: /^[0-9]{5}$/,
                Email: /^[\w]+([\.]{1}[\w]+)*[@]{1}[\w]+([\.]{1}[\w]+)*[\.]{1}[a-z]{2,3}$/,
                //UserName: /^[\w]{6,30}$/,
                UserName: /^(?=.{6,}$)(?=.?[@!#$%-])?.*/,
                Password: /^(?=.{8,}$)(?=.*?[A-Z])(?=.*?[\d])(?=.*?[@!#$%]).*/,
                //Password: /^(?=.{8,}$)(?=.*?[\d])(?=.*?[@!#$%]).*/,
                //Password: /^[\w]{4,}$/,
                SecurityQuestion: /([\w]{1,}( )?)+/,
                SecurityAnswer: /([\w]{1,}( )?)+/,
                LocalTaxRateCode: /^[\w]{2,6}$/,
                Rate0100: 'Rate-0-100',
                DateDash422: /^[\d]{4}-[\d]{1,2}-[\d]{1,2}$/,
                DateDash4221: 'Date-422-1',
                NewGroupName: /[\w]{4,50}/,
            }

            return ValidationRules;

        }

        this.ValidationMessages = function () {

            var ValidationMessages = {

                Phone: 'Phone number must be ten digits long.',
                FirstName: 'First name must be alphanumeric and at least two characters in length.',
                LastName: 'Last name must be alphanumeric and at least two characters in length.',
                Addy1: 'Address line one must be at least three characters in length',
                City: 'City must be at least two characters in length.',
                State: 'State must be at least two characters in length.',
                Zip: 'Zip should be a string of five numerical digits.',
                Email: 'Email addresses must be expressed in the format somone@somedomain.com.',
                UserName: "User Name must be at least eight characters long.",
                Password: "Password must be at least 8 characters, have at least on upper case letter, one number, and one of the symbols @, !, #, $, %.",
                SecurityQuestion: "Security Question one must be at least two characters in length.",
                SecurityAnswer: "Security Answer one must be at least two characters in length.",
                LocalTaxRateCode: "Tax codes must be between two and six characters",
                DateDash422: "Date must be in YYYY-MM-DD format.",
                InvalidDate: "Please check your date. It appears to be invalid.",
                NewGroupName: "Profile names must be between 4 and 50 characters in length.",
                Rate0100: "Invalid rate. Number must lie between zero and one."

            }

            return ValidationMessages;

        }

        this.ValidateFieldEntry = function (ContractEntry, key, MapToKey, Required, value) {

            var RetVal = "";
            if (MapToKey == null) MapToKey = key;
            //MapToKey = MapToKey.toLowerCase();
            var Expression = this.ValidationRules()[MapToKey];

            if ((value == null || value == "") && !Required) {

                //Do nothing

            } else {

                if ((Expression.toString().indexOf("Rate") == -1) && (Expression.toString().indexOf("Date") == -1) &&
                        Expression != "drop" && Expression != "card" && Expression != "none") {

                    var TestVal = "";
                    if (MapToKey.indexOf("Password") > -1) {
                        TestVal = value;
                    } else {
                        TestVal = value.toLowerCase();
                    }

                    if (this.ValidateTextField(Expression, TestVal)) {

                        if (ContractEntry != null) ContractEntry[key].Value = value;

                    } else {

                        RetVal = this.ValidationMessages()[MapToKey];

                    }

                } else if (Expression.indexOf("Rate") > -1) {

                    if (this.ValidateRate(Expression, value)) {

                        if (ContractEntry != null) ContractEntry[key].Value = value;

                    } else {

                        RetVal = this.ValidationMessages()[MapToKey];

                    }

                } else if (Expression.indexOf("Date") > -1) {
                
                    if (this.ValidateDateAndFormat(Expression, value)) {

                        if (ContractEntry != null) ContractEntry[key].Value = value;

                    } else {

                        RetVal = this.ValidationMessages()["InvalidDate"];

                    }

                } else if (Expression == "card") {

                    var CCType = CCCheck_ManualCCNumberEntry(value);
                    if (CCType != "") {

                        if (ContractEntry != null) {

                            ContractEntry[key].Value = value;
                            ContractEntry["CardType"].Value = CCType;

                        }

                    } else {

                        RetVal = this.ValidationMessages()[MapToKey];

                    }

                } else if (Expression == "drop") {

                    if (MapToKey == "Year") value = value.substring(2);
                    if (value != -1) {

                        if (ContractEntry != null) ContractEntry[key].Value = value;

                    } else {

                        RetVal = this.ValidationMessages()[MapToKey];

                    }
                }
            }

            return RetVal;

        }

        this.ValidateTextField = function (Expression, FieldValue) {

            var RE = new RegExp(Expression);
            var ReturnedVal = RE.test(FieldValue);
            return RE.test(FieldValue);

        }

        /////////////////////////////////////////////////////////////////////////
        //  RateType -- 0                   Between 0, 1
        /////////////////////////////////////////////////////////////////////////
        this.ValidateRate = function (Expression, FieldValue) {

            var RetVal = true;
            var RateParts = Expression.split("-");
            var RateType = -1;
            var RateMultiplier = 1;
            var TestField = parseFloat(FieldValue + "");

            if (RateParts.length == 3) {

                RateType = RateParts[1];
                RateMultiplier = parseInt(RateParts[2]);

            } 

            if (parseFloat(FieldValue + "")) {

                if (RateType == 0) {

                    if(parseFloat(FieldValue) > 1*RateMultiplier || parseFloat(FieldValue) < 0)
                        RetVal = false;

                }

            } else {

                if(FieldValue != "0")
                    RetVal = false;

            }

            return RetVal;

        }

        //DateString, 1, DateFormat
        /////////////////////////////////////////////////////////////////////////
        //  DateFormat  -- 0                    Same date
        //              -- 1                    Test date < Current date
        //              -- 2                    Test date <= Current date
        //              -- 3                    Any date
        //              -- -1                   Test date > Current date
        //              -- -2                   Test date >= Current date
        /////////////////////////////////////////////////////////////////////////
        this.ValidateDateAndFormat = function(Expression, FieldValue) {

            var DateParts = Expression.split("-");
            var DateFlag = 1;
            var DateFormat = "";

            if (DateParts.length == 3) {

                DateFormat = DateParts[1];
                DateFlag = DateParts[2];

            }

            return this.ValidateDate(FieldValue, DateFlag, DateFormat);

        }

        this.ValidateDate = function (DateString, DateFlag, DateFormat) {

            var retVal = true;
            var GivenDate = this.CreateDate(DateString, DateFormat);
            var CurrentDate = this.GetCurrentDate();

            if (GivenDate != null) {

                if (DateFlag != 3) {

                    if (DateFlag == 0 && (CurrentDate.getTime() - GivenDate.getTime() != 0)) {

                        retVal = false;

                    } else if (DateFlag == 1 && (GivenDate.getTime() - CurrentDate.getTime() < 0)) {

                        retVal = false;

                    } else if (DateFlag == 2 && (GivenDate.getTime() - CurrentDate.getTime() <= 0)) {

                        retVal = false;

                    } else if (DateFlag == -1 && (GivenDate.getTime() - CurrentDate.getTime() > 0)) {

                        retVal = false;

                    } else if (DateFlag == -2 && (GivenDate.getTime() - CurrentDate.getTime() >= 0)) {

                        retVal = false;

                    }
                }

            } else {

                retVal = false;

            }

            return retVal;

        }

        this.GetCurrentDate = function () {

            var FooDate = new Date();
            var CurrentDate = new Date(FooDate.getFullYear(), FooDate.getMonth(), FooDate.getDate());
            return CurrentDate;

        }

        this.CreateDate = function (DateString, DateFormat) {

            var YearPart;
            var MonthPart;
            var DatePart;
            var DateItems;
            var ReturnDate;

            if (DateFormat == "") {

                ReturnDate = new Date(DateString);

            } else if (DateFormat.indexOf("422") > -1) {

                var DateItems = DateString.split("-");
                YearPart = parseInt(DateItems[0]);
                MonthPart = parseInt(DateItems[1]) - 1;
                DatePart = parseInt(DateItems[2]);

            }

            ReturnDate = new Date(YearPart, MonthPart, DatePart);
            if (ReturnDate == "Invalid Date") ReturnDate = null;
            return ReturnDate;

        }
    }

    angular.module('App.Validation').service('Validation', Validation);

})();