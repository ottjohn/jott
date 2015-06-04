///////////////////////////////////////////////////////////////////////////////
//  HTML/JQuery Pager Object
//
//  Features:
//  
//  1. First and Last buttons
//  2. Option to hide First and Last Buttons
//  3. Go to specific page functionality
//  4. Option to hide go to specific page control
//  5. Current page of total page display
//  6. Next/Previous buttons
///////////////////////////////////////////////////////////////////////////////
var PagerObject = function (ContextArray) {

    var Pager = {

        PagerAttributes: ContextArray,

    };

    Pager.LocalAttributes = {

        CurrentPage: 1,
        TotalPages: 0,
        RecordCount: 0

    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    //  EVENT HANDLERS
    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    $("#" + Pager.PagerAttributes.PagerId + "_BtnFirst").live("click",
    function () {

        Pager.GotoBeginning();

    }
    );

    $("#" + Pager.PagerAttributes.PagerId + "_BtnLast").live("click",
    function () {

        Pager.GotoEnd();

    }
    );

    $("#" + Pager.PagerAttributes.PagerId + "_BtnPrev").live("click",
    function () {

        Pager.ChangePage(-1);

    }
    );

    $("#" + Pager.PagerAttributes.PagerId + "_BtnNext").live("click",
    function () {

        Pager.ChangePage(1);

    }
    );

    $("#" + Pager.PagerAttributes.PagerId + "_TxtGoto").live("change",
    function () {

        Pager.ProcessGotoPage();

    }
    );

    Pager.FireEvent = function (EventName, Value) {

        $(document).triggerHandler({ type: EventName,
            ReturnedContext: Value
        });
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    //  ACCESSOR METHODS
    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    Pager.SetCurrentPage = function (NewCurrentPage) {

        Pager.LocalAttributes.CurrentPage = NewCurrentPage;

    }

    Pager.GetPageSize = function () {

        return Pager.PagerAttributes.PageSize;

    }

    Pager.GetCurrentPage = function () {

        var CurrentPage = Pager.LocalAttributes.CurrentPage;
        if(CurrentPage == null) CurrentPage = 0;
        return CurrentPage;

    }

    Pager.GetRecordCount = function () {

        return Pager.LocalAttributes.RecordCount;

    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    //  MAIN NAV FUNCTIONS
    //  
    //  ChangePage          Changes page upon click of back and next buttons
    //  GotoBeginning       Changes page upon click of first button
    //  GotoEnd             Changes page upon click of last button
    //  SetTotalPages       Sets total pages upon passing in record count
    //  ProcessGotoPage     Changes page upon change in Goto text field
    //  ShowPager           Shows or hides pager
    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    Pager.ChangePage = function (Direction) {

        if (Pager.LocalAttributes.CurrentPage < Pager.LocalAttributes.TotalPages && Direction == 1 
            || 
            Pager.LocalAttributes.CurrentPage > 1 && Direction == -1) {

            Pager.LocalAttributes.CurrentPage += Direction;
            $("#" + Pager.PagerAttributes.PagerId + "_CurPage").text(Pager.LocalAttributes.CurrentPage);
            Pager.FireEvent("OnPageChanged", Pager.LocalAttributes.CurrentPage);

        }
    }

    Pager.GotoBeginning = function() {

        if(Pager.LocalAttributes.CurrentPage != 1) {

            $("#" + Pager.PagerAttributes.PagerId + "_CurPage").text("1");
            Pager.LocalAttributes.CurrentPage = 1;
            Pager.FireEvent("OnPageChanged", Pager.LocalAttributes.CurrentPage);

        }
    }

    Pager.GotoEnd = function() {

        if(Pager.LocalAttributes.CurrentPage != Pager.LocalAttributes.TotalPages) {

            $("#" + Pager.PagerAttributes.PagerId + "_CurPage").text(Pager.LocalAttributes.TotalPages);
            Pager.LocalAttributes.CurrentPage = Pager.LocalAttributes.TotalPages;
            Pager.FireEvent("OnPageChanged", Pager.LocalAttributes.CurrentPage);

        }
    }

    Pager.SetTotalPages = function (TotalRecordCount) {

        if (TotalRecordCount > 0) {

            var PageCount = Math.floor(parseFloat(TotalRecordCount / Pager.PagerAttributes.PageSize));
            if (TotalRecordCount % Pager.PagerAttributes.PageSize != 0) PageCount += 1;
            $("#" + Pager.PagerAttributes.PagerId + "_TotPage").text(PageCount);
            Pager.LocalAttributes.TotalPages = PageCount;

        }
    }

    Pager.ProcessGotoPage = function() {

        var GoToPage = $("#" + Pager.PagerAttributes.PagerId + "_TxtGoto").val();
        if (!isNaN(GoToPage)) {

            GoToPage = parseInt(GoToPage);
            if (GoToPage >= 1 && GoToPage <= Pager.TotalPages) {

                $("#" + Pager.PagerAttributes.PagerId + "_CurPage").text(GoToPage);
                Pager.LocalAttributes.CurrentPage = GoToPage;
                Pager.FireEvent("OnPageChanged", GoToPage);
            }
        }
        $("#" + Pager.PagerAttributes.PagerId + "_TxtGoto").val("");

    }

    Pager.ShowPager = function (ShowFlag) {

        if (!ShowFlag) 
            $("#" + Pager.PagerAttributes.PagerId).hide(); 
        else 
            $("#" + Pager.PagerAttributes.PagerId).show();

    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    //  BUILD OBJECT FUNCTIONALITY
    //
    //  BuildControl            Main GUI builder function and instantiator
    //  CreateContainerStyle    Creates style for table container
    //  CreateGotoTextStyle     Creates style for Goto text box
    //  CreateButtonStyle       Creates style for buttons
    //  GetPagerTemplate        Returns pager template
    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    Pager.BuildControl = function () {

        var PagerTemplate = Pager.GetPagerTemplate();
        var ContainerStyle = Pager.CreateContainerStyle();
        var ButtonStyle = Pager.CreateButtonStyle();
        var GotoTextStyle = Pager.CreateGotoTextStyle();

        PagerTemplate = PagerTemplate.replace("$CONTAINERSTYLE$", ContainerStyle);
        PagerTemplate = PagerTemplate.replace(/\$BUTTONSTYLE\$/g, ButtonStyle);
        PagerTemplate = PagerTemplate.replace("$GOTOTEXTSTYLE$", GotoTextStyle);

        PagerTemplate = PagerTemplate.replace("$PAGERID$", Pager.PagerAttributes.PagerId);
        PagerTemplate = PagerTemplate.replace("$PAGERFIRSTCONTAINER$", Pager.PagerAttributes.PagerId + "_BtnFirstContainer");
        PagerTemplate = PagerTemplate.replace("$BUTTONFIRSTID$",  Pager.PagerAttributes.PagerId + "_BtnFirst");
        PagerTemplate = PagerTemplate.replace("$BUTTONPREVID$",  Pager.PagerAttributes.PagerId + "_BtnPrev");
        PagerTemplate = PagerTemplate.replace("$CURPAGEID$",  Pager.PagerAttributes.PagerId + "_CurPage");
        PagerTemplate = PagerTemplate.replace("$TOTPAGEID$",  Pager.PagerAttributes.PagerId + "_TotPage");
        PagerTemplate = PagerTemplate.replace("$GOTOCONTAINERID$",  Pager.PagerAttributes.PagerId + "_GotoContainer");
        PagerTemplate = PagerTemplate.replace("$GOTOTEXTID$",  Pager.PagerAttributes.PagerId + "_TxtGoto");
        PagerTemplate = PagerTemplate.replace("$BUTTONNEXTID$",  Pager.PagerAttributes.PagerId + "_BtnNext");
        PagerTemplate = PagerTemplate.replace("$BUTTONLASTID$",  Pager.PagerAttributes.PagerId + "_BtnLast");
        PagerTemplate = PagerTemplate.replace("$PAGERLASTCONTAINER$",  Pager.PagerAttributes.PagerId + "_BtnLastContainer");

        $("#" + Pager.PagerAttributes.AttachToObjectId).html(PagerTemplate);

        if(!Pager.PagerAttributes.ShowGoToControl) $("#" + Pager.PagerAttributes.PagerId + "_GotoContainer").hide();
        if(!Pager.PagerAttributes.ShowEndButtons) {

            $("#" + Pager.PagerAttributes.PagerId + "_BtnFirstContainer").hide();
            $("#" + Pager.PagerAttributes.PagerId + "_BtnLastContainer").hide();

        }
    }

    Pager.CreateContainerStyle = function() {

        var Style = "font-family: $FAMILY$; font-size: $FONTSIZE$pt; color: $COLOR$; background: $BACKGROUND$; margin-left: $ALIGNLEFT$; margin-right: $ALIGNRIGHT$;";
        Style = Style.replace("$FONTSIZE$", Pager.PagerAttributes.PagerFontSize);
        Style = Style.replace("$FAMILY$", Pager.PagerAttributes.PagerFontFamily);
        Style = Style.replace("$BACKGROUND$", Pager.PagerAttributes.PagerBackGround);
        Style = Style.replace("$COLOR$", Pager.PagerAttributes.PagerTextColor);

        if(Pager.PagerAttributes.PagerAlign == "left") {

            Style = Style.replace("$ALIGNLEFT$", "0px");
            Style = Style.replace("$ALIGNRIGHT$", "auto");


        } else {

            Style = Style.replace("$ALIGNLEFT$", "auto");
            Style = Style.replace("$ALIGNRIGHT$", "0px");

        }

        return Style;

    }

    Pager.CreateGotoTextStyle = function() {

        var Style = "font-family: $FAMILY$; font-size: $FONTSIZE$pt; background: $BACKGROUND$; color: $COLOR$; text-align: center; width: 30px; border: solid; border-width: 0px 0px 1px 0px; border-color: $BORDERCOLOR$;";
        Style = Style.replace("$FONTSIZE$", Pager.PagerAttributes.PagerFontSize);
        Style = Style.replace("$FAMILY$", Pager.PagerAttributes.PagerFontFamily);
        Style = Style.replace("$BACKGROUND$", Pager.PagerAttributes.PagerBackGround);
        Style = Style.replace("$COLOR$", Pager.PagerAttributes.PagerTextColor);
        Style = Style.replace("$BORDERCOLOR$", Pager.PagerAttributes.PagerTextColor);
        return Style;

    }

    Pager.CreateButtonStyle = function () {

        var Style = "font-family: $FAMILY$; font-size: $FONTSIZE$pt; background:$BACKGROUND$; color: $COLOR$; cursor: pointer; margin: $MARGIN$px; border: $BORDERSTYLE$; border-width: $BORDERWIDTH$px;";
        Style = Style.replace("$FONTSIZE$", Pager.PagerAttributes.PagerFontSize);
        Style = Style.replace("$FAMILY$", Pager.PagerAttributes.PagerFontFamily);
        Style = Style.replace("$MARGIN$", Pager.PagerAttributes.PagerButtonMargin);

        if(Pager.PagerAttributes.PagerButtonStyle == "flat") {

            Style = Style.replace("$BORDERSTYLE$", "none");
            Style = Style.replace("$BORDERWIDTH$", "0");
            Style = Style.replace("$BACKGROUND$", Pager.PagerAttributes.PagerBackGround);
            Style = Style.replace("$COLOR$", Pager.PagerAttributes.PagerTextColor);

        } else {

            Style = Style.replace("$BORDERSTYLE$", "solid");
            Style = Style.replace("$BORDERWIDTH$", "1");
            Style = Style.replace("$BACKGROUND$", Pager.PagerAttributes.PagerButtonBackground);
            Style = Style.replace("$COLOR$", Pager.PagerAttributes.PagerButtonForeground);

        }

        return Style;

    }

    Pager.GetPagerTemplate = function() {

        var PagerTemplate = "<table cellpadding = '0' cellspacing = '2' border = '0' id = '$PAGERID$' style = '$CONTAINERSTYLE$'> \
                                            <tr> \
                                                <td id = 'PAGERFIRSTCONTAINER'> \
                                                    <input type = 'button' value = '|<' id = '$BUTTONFIRSTID$' style = '$BUTTONSTYLE$' /> \
                                                </td> \
                                                <td> \
                                                    <input type = 'button' value = '<' id = '$BUTTONPREVID$' style = '$BUTTONSTYLE$' /> \
                                                </td> \
                                                <td style = 'padding-left: 3px; padding-right: 3px;'> \
                                                    Page \
                                                </td> \
                                                <td style = 'text-align: center; width: 30px;' id = '$CURPAGEID$'> \
                                                    1 \
                                                </td> \
                                                <td style = 'padding-left: 3px; padding-right: 3px;'> \
                                                    of \
                                                </td> \
                                                <td style = 'text-align: center; width: 30px;' id = '$TOTPAGEID$'> \
                                                    1 \
                                                </td> \
                                                <td id = '$GOTOCONTAINERID$'> \
                                                    <table cellpadding = '0' cellspacing = '0' border = '0'> \
                                                        <tr> \
                                                            <td style = 'padding-left: 3px; padding-right: 3px;'> \
                                                                Go to \
                                                            </td> \
                                                            <td style = 'padding-left: 3px; padding-right: 3px;'> \
                                                                <input id = '$GOTOTEXTID$' type = 'text' style = '$GOTOTEXTSTYLE$' /> \
                                                            </td> \
                                                        </tr> \
                                                    </table> \
                                                </td> \
                                                <td> \
                                                    <input type = 'button' value = '>' id = '$BUTTONNEXTID$' style = '$BUTTONSTYLE$' /> \
                                                </td> \
                                                <td id = '$PAGERLASTCONTAINER$'> \
                                                    <input type = 'button' value = '>|' id = '$BUTTONLASTID$' style = '$BUTTONSTYLE$' /> \
                                                </td> \
                                            </tr> \
                                        </table>";

        return PagerTemplate;

    }

    return Pager;

};