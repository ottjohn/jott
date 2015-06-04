var GridConfigObject = function (ContextArray) {

    var Grid = {

        GridAttributes: ContextArray,
        LocalAttributes: null

    }

    Grid.LocalAttributes = {

        ExcludeColumnIdexes: new Array(),
        CellAlign: new Array(),
        CellWidth: new Array(),
        GridColumnCount: 0,
        GridHeader: '',
        GridHeaderIsBuilt: false,
        GridListContainerIsBuilt: false,
        GridLastColumnIdx: 0,
        GridCurrentSelectedRowId: null,
        GridCurrentSelectedRowBG: null,
        GridCurrentSelectedRowFG: null,
        DefaultCellBackColor: '#fefefe',
        DefaultCellFontColor: 'gray',
        DefaultAltCellBackColor: '#FFFFE0',
        DefaultAltCellFontColor: 'blue',
        DefaultHeaderBackColor: '#dcdabc',
        DefaultHeaderFontColor: 'gray',
        GridHeaderStyle: null,
        GridContentStyle: '',
        CurrentSelectedRow: null,
        CurrentSortField: null,
        CurrentSortDirection: null,
        GridCellStyle: null,
        GridHeaderStyle: null,
        Pager: null,
        DragSpanTest: new Array(),
        DragElement: null,
        IsValidDrop: false,
        BuildOverride: false,
        GridCollection: null

    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    //  BUILD OBJECT FUNCTIONALITY
    //
    //  BuildGrid               Primary function for building out html for object.
    //  BuildHeader             Functionality to build heading for grid.
    //  BuildContentCell        Builds out specific content cell.
    //  GetCell                 Helper to above two. Builds basic cell for header or content, returns to caller.
    //  GetCellRow              Builds specific cell row and returns to caller.
    //  SetHeaderColors         Helper for GetCellRow.
    //  SetContentColors        Helper for GetCellRow.
    //  GetGridTemplate         Returns template for grid container, plugs in styles.
    //  GetListContainer        Returns list container for list items in collection passed in.
    //  CreateStyle             Creates sytles for header and list items.
    //  CheckForPager           Checks for pager, builds toolbar to make room for it.
    //  GetToolbarTemplate      Returns toolbar template in case pager is included.
    //  BuildPager              Instantiates pager object, builds it.
    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    Grid.BuildGrid = function (Collection) {

        if (!(Collection.length == 0 || Collection == null)) {

            if (Grid.LocalAttributes.BuildOverride || Grid.GridAttributes.GridColumnArrange.length != 0) Collection = Grid.ArrangeColumns(Collection);

            if (Grid.LocalAttributes.BuildOverride || !Grid.LocalAttributes.GridListContainerIsBuilt) {

                Grid.SetMetaData(Collection);
                var GridContainer = Grid.GetGridTemplate();
                var ListContainer = Grid.GetListContainer();
                Grid.LocalAttributes.GridHeaderStyle = Grid.CreateStyle("Header");
                Grid.LocalAttributes.GridContentStyle = Grid.CreateStyle("Cell");

            }

            var ListItemConcat = "";

            for (var i = 0; i < Collection.length; i++) {

                var NewItem = "";
                var ColCount = 0;
                var GridRowId = "idGridRow_" + Collection[i][Grid.GridAttributes.GridListIdField];

                for (var key in Collection[i]) {

                    if (Grid.LocalAttributes.ExcludeColumnIdexes[ColCount] != 1) {

                        if (i == 0 && !Grid.LocalAttributes.GridHeaderIsBuilt) {

                            var HeaderText = key;
                            if (Grid.GridAttributes.HeaderAliasList.length != 0 && Grid.GridAttributes.HeaderAliasList[ColCount] != "")
                                HeaderText = Grid.GridAttributes.HeaderAliasList[ColCount]

                            Grid.BuildHeader(ColCount, HeaderText, Grid.LocalAttributes.GridHeaderStyle, key);

                        } else if (!Grid.LocalAttributes.GridHeaderIsBuilt) {

                            //Grid.GetCellRow(Grid.GridAttributes.GridListContainer + "_HeaderRow", "", "", "Header");
                            //var HeaderContainer = Grid.GetCellRow(Grid.GridAttributes.GridListContainer + "_HeaderRow", "", "", "Header");
                            Grid.LocalAttributes.GridHeaderIsBuilt = true;

                        }

                        NewItem += Grid.BuildContentCell(ColCount, Collection[i][key], Grid.LocalAttributes.GridContentStyle, GridRowId)

                    }

                    ColCount++;

                }

                var NewItemRow = Grid.GetCellRow(GridRowId, NewItem, i, "Cell");
                ListItemConcat += NewItemRow;

            }

            if (Grid.LocalAttributes.BuildOverride || !Grid.LocalAttributes.GridListContainerIsBuilt) {

                ListContainer = ListContainer.replace("$LIST$", ListItemConcat);

                Grid.GetCellRow(Grid.GridAttributes.GridListContainer + "_HeaderRow", "", "", "Header");

                GridContent = Grid.LocalAttributes.GridHeader + ListContainer;
                GridContainer = GridContainer.replace("$CONTENT$", GridContent);
                GridContainer = Grid.CheckForPager(GridContainer);
                $("#" + Grid.GridAttributes.GridParent).html(GridContainer);
                if (Grid.GridAttributes.ShowPager) Grid.BuildPager();
                Grid.LocalAttributes.GridListContainerIsBuilt = true;
                Grid.MakeColumnHeadersDraggable();
                Grid.LocalAttributes.GridCollection = Collection;
                //Grid.GridAttributes.NewCollection = Collection;
                Grid.LocalAttributes.BuildOverride = false;

            } else {

                $("#TableListContainer").html(ListItemConcat);

            }

        } else {

            //Return error message

        }

        return Collection;
    }

    Grid.MakeColumnHeadersDraggable = function () {

        var len = Grid.LocalAttributes.DragSpanTest.length;
        for (var i = 0; i < len; i++) {

            $("#" + Grid.LocalAttributes.DragSpanTest[i]).draggable({ revert: 'invalid' });
            //$("#" + Grid.LocalAttributes.DragSpanTest[i]).droppable();

        }
    }

    Grid.MakeColumnHeadersDroppable = function (ExcludeId) {

        var len = Grid.LocalAttributes.DragSpanTest.length;
        for (var i = 0; i < len; i++) {

            if (Grid.LocalAttributes.DragSpanTest[i] != ExcludeId) $("#" + Grid.LocalAttributes.DragSpanTest[i]).droppable();

        }

        Grid.LocalAttributes.DragElement = $("#" + ExcludeId);

    }

    Grid.BuildHeader = function (Idx, Content, HeaderStyle, Key) {

        var BorderValue = 0;
        if (Grid.GridAttributes.CellBordersOn && Idx < Grid.LocalAttributes.GridLastColumnIdx) BorderValue = 1;
        var CellTemplate = Grid.GetCell(Content, BorderValue, Grid.LocalAttributes.CellWidth[Idx], HeaderStyle, "Center");
        CellTemplate = CellTemplate.replace("$SPANID$", "id" + Key);
        Grid.LocalAttributes.DragSpanTest[Idx] = "id" + Key;
        Grid.LocalAttributes.GridHeader += CellTemplate;

    }

    Grid.BuildContentCell = function (Idx, Content, ContentStyle, GridRowId) {

        var BorderValue = 0;
        if (Grid.GridAttributes.CellBordersOn && Idx < Grid.LocalAttributes.GridLastColumnIdx) BorderValue = 1;
        var NewItem = Grid.GetCell(Content, BorderValue, Grid.LocalAttributes.CellWidth[Idx], ContentStyle, Grid.LocalAttributes.CellAlign[Idx]);
        NewItem = NewItem.replace("$SPANID$", GridRowId + "_" + Idx);
        return NewItem;

    }

    Grid.GetCell = function (Content, BorderValue, Width, Style, Alignment) {

        var CellTemplateBegin = "<span id = '$SPANID$' unselectable='on' class = 'GridCellClass' style = '$STYLE$'>";
        var CellTemplateEnd = "</span>";
        CellTemplateBegin = CellTemplateBegin.replace("$STYLE$", Style);
        CellTemplateBegin = CellTemplateBegin.replace("$WIDTH$", Width);
        CellTemplateBegin = CellTemplateBegin.replace("$ALIGN$", Alignment);
        CellTemplateBegin = CellTemplateBegin.replace("$ON$", BorderValue);
        return CellTemplateBegin + Content + CellTemplateEnd;

    }

    Grid.GetCellRow = function (GridRowId, Content, Idx, Type) {

        var CellRow = "<tr tabindex = '$TABINDEX$'><td class = 'RowCellClass' style = 'background: $BACKGROUND$; color: $COLOR$;' id = '$CELLID$'>$ROWCONTENT$</td></tr>";
        var RetCellRow = CellRow.replace("$CELLID$", GridRowId);
        var RetCellRow = RetCellRow.replace("$TABINDEX$", Idx);

        if (Type == "Header") {

            RetCellRow = Grid.SetHeaderColors(RetCellRow);
            Grid.LocalAttributes.GridHeader = RetCellRow.replace("$ROWCONTENT$", Grid.LocalAttributes.GridHeader);

        } else {

            RetCellRow = Grid.SetContentColors(RetCellRow, Idx);
            RetCellRow = RetCellRow.replace("$ROWCONTENT$", Content);

        }

        return RetCellRow;

    }

    Grid.SetHeaderColors = function (CellRow) {

        if (Grid.GridAttributes.UseDefaultStyles) {

            CellRow = CellRow.replace("$BACKGROUND$", Grid.LocalAttributes.DefaultHeaderBackColor);
            CellRow = CellRow.replace("$COLOR$", Grid.LocalAttributes.DefaultHeaderFontColor);

        } else {

            CellRow = CellRow.replace("$BACKGROUND$", Grid.GridAttributes.HeaderBackColor);
            CellRow = CellRow.replace("$COLOR$", Grid.GridAttributes.HeaderFontColor);

        }

        return CellRow;

    }

    Grid.SetContentColors = function (CellRow, Idx) {

        var BackColor = "";
        var FontColor = "";

        if (Grid.GridAttributes.UseDefaultStyles) {

            if ((Idx + 1) % 2 == 0) {

                BackColor = Grid.GridAttributes.DefaultAltCellBackColor;
                FontColor = Grid.GridAttributes.DefaultAltCellFontColor;

            } else {

                BackColor = Grid.GridAttributes.DefaultCellBackColor;
                FontColor = Grid.GridAttributes.DefaultCellFontColor;

            }

        } else {

            if ((Idx + 1) % 2 == 0) {

                BackColor = Grid.GridAttributes.AltCellBackColor;
                FontColor = Grid.GridAttributes.AltCellFontColor;

            } else {

                BackColor = Grid.GridAttributes.CellBackColor;
                FontColor = Grid.GridAttributes.CellFontColor;

            }
        }

        CellRow = CellRow.replace("$BACKGROUND$", BackColor);
        CellRow = CellRow.replace("$COLOR$", FontColor);
        return CellRow;

    }

    Grid.GetGridTemplate = function () {

        var GridTemplateBegin = "<table cellpadding = '0' cellspacing = '0' border = '0' style = 'background: $BACKCOLOR$; width: $WIDTH$px; border: solid; border-width: 1px 1px 1px 1px; font-family: $FAM$; font-size: $SIZE$pt;'>";
        var GridTemplateEnd = "$CONTENT$$TOOLBAR$</table>";

        var GridTemplate = GridTemplateBegin + GridTemplateEnd;
        GridTemplate = GridTemplate.replace("$BACKCOLOR$", Grid.GridAttributes.GridBackColor);
        GridTemplate = GridTemplate.replace("$WIDTH$", Grid.GridAttributes.GridWidth);
        GridTemplate = GridTemplate.replace("$FAM$", Grid.GridAttributes.GridFont);
        GridTemplate = GridTemplate.replace("$SIZE$", Grid.GridAttributes.GridFontSize);

        return GridTemplate;

    }

    Grid.GetListContainer = function () {

        var ListContainerBegin = "<tr><td style = 'vertical-align: top;'><div id = '$GRIDLISTCONTAINER$' style = 'height: $HEIGHT$px; overflow-y: hidden; background: $BACKCOLOR$;'><table id = 'TableListContainer' cellpadding = '0' cellspacing = '0' border = '0'>";
        var ListContainerEnd = "$LIST$</table></div></td></tr>";
        var ListContainer = ListContainerBegin + ListContainerEnd;

        ListContainer = ListContainer.replace("$HEIGHT$", Grid.GridAttributes.GridListHeight);
        ListContainer = ListContainer.replace("$BACKCOLOR$", Grid.GridAttributes.GridListBackColor);
        ListContainer = ListContainer.replace("$GRIDLISTCONTAINER$", Grid.GridAttributes.GridListContainer);

        return ListContainer;

    }

    Grid.CreateStyle = function (Type) {

        var style = 'text-align: $ALIGN$; $BORDER$ width: $WIDTH$PX; padding-top: $HEIGHT$px; padding-bottom: $HEIGHT$px; padding-right: $PADDING$px; padding-left: $PADDING$px; background: $BACKCOLOR$;'

        if (Grid.GridAttributes.UseDefaultStyles) {

            if (Type == "Header")
                style = 'text-align: $ALIGN$; border: solid; border-width: 0px $ON$px 0px 0px; border-color: #dddddd; width: $WIDTH$px; background: #dcdabc; color: gray; padding: 3px; font-weight: bold;';
            else if (Type == "Cell")
                style = 'text-align: $ALIGN$; border: solid; border-width: 0px $ON$px 0px 0px; border-color: #dedede;width: $WIDTH$px; background: #fefefe; color: gray; padding: 3px;';

        } else {

            style = style.replace(/\$PADDING\$/g, Grid.GridAttributes.CellPadding);
            style = style.replace(/\$HEIGHT\$/g, Grid.GridAttributes.CellHeight);

            var CellBorder = "border: solid; border-width: 0px $ON$px 0px 0px; border-color: $BORDERCOLOR$;";
            var BackColor = "";
            var FontColor = "";
            var BorderColor = "";

            if (Type == "Header") {

                BackColor = Grid.GridAttributes.HeaderBackColor;
                FontColor = Grid.GridAttributes.HeaderFontColor;
                BorderColor = Grid.GridAttributes.HeaderBorderColor;

            } else {

                BorderColor = Grid.GridAttributes.CellBorderColor;
                BackColor = Grid.GridAttributes.CellBackColor;
                FontColor = Grid.GridAttributes.CellFontColor;

            }

            style = style.replace("$BACKCOLOR$", BackColor);

            if (Grid.GridAttributes.CellBordersOn) {

                CellBorder = CellBorder.replace("$BORDERCOLOR$", BorderColor);
                style = style.replace("$BORDER$", CellBorder);

            } else {

                style = style.replace("$BORDER$", "");

            }
        }

        return style;

    }

    Grid.CheckForPager = function (GridContainer) {

        if (Grid.GridAttributes.ShowPager) {

            var ToolbarTemplate = Grid.GetToolbarTemplate();
            ToolbarTemplate = ToolbarTemplate.replace("$COMPONENT$", Grid.GridAttributes.GridListContainer + "_Pager");
            GridContainer = GridContainer.replace("$TOOLBAR$", ToolbarTemplate);

        } else {

            GridContainer = GridContainer.replace("$TOOLBAR$", "");

        }

        return GridContainer;
    }

    Grid.GetToolbarTemplate = function () {

        var ToolbarTemplateBegin = "<tr><td style = 'padding-top: 3px; padding-bottom: 3px; background: $BACKGROUND$; color: $COLOR$;'>";
        var ToolbarContent = "<table style = 'width: 100%;' cellpadding = '0' cellspacing = '0' border = '0'><tr>";
        var ContentCell = "<td id = '$COMPONENT$' style = 'width: 100%;'></td>";
        var ToolbarContentEnd = "</tr></table>";
        var ToolbarTemplateEnd = "</td></tr>";

        ToolbarTemplateBegin = ToolbarTemplateBegin.replace("$BACKGROUND$", Grid.GridAttributes.HeaderBackColor);
        ToolbarTemplateBegin = ToolbarTemplateBegin.replace("$COLOR$", Grid.GridAttributes.HeaderFontColor);
        return ToolbarTemplateBegin + ToolbarContent + ContentCell + ToolbarContentEnd + ToolbarTemplateEnd;

    }

    Grid.BuildPager = function () {

        var PagerAttributes = {

            PagerId: Grid.GridAttributes.GridListContainer + "_Pager",
            PageSize: Grid.GridAttributes.PageSize,
            PagerAlign: Grid.GridAttributes.PagerAlign,
            PagerBackGround: Grid.GridAttributes.HeaderBackColor,
            PagerTextColor: Grid.GridAttributes.HeaderFontColor,
            PagerFontFamily: Grid.GridAttributes.GridFont,
            PagerFontSize: Grid.GridAttributes.GridFontSize - 1,
            PagerButtonStyle: Grid.GridAttributes.PagerStyle,
            PagerButtonBackground: Grid.GridAttributes.ButtonBackground,
            PagerButtonForeground: Grid.GridAttributes.ButtonForeground,
            PagerButtonMargin: Grid.GridAttributes.PagerButtonMargin,
            ShowEndButtons: Grid.GridAttributes.PagerShowEndButtons,
            ShowGoToControl: Grid.GridAttributes.PagerShowGotoField,
            AttachToObjectId: Grid.GridAttributes.GridListContainer + "_Pager"

        }

        Grid.LocalAttributes.Pager = new PagerObject(PagerAttributes);
        Grid.LocalAttributes.Pager.BuildControl();
        $("#" + Grid.GridAttributes.GridListContainer + "_Pager").show();

    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    //  METADATA FUNCTIONS
    //
    //  ArrangeColumns                  Rearranges columns in Collection, specified externally by user.
    //  SetMetaData                     AutoCalc for column width, object width, cell alignment.
    //  SetColumnCount                  Caculates column count for later use.
    //  InitializePrivateArrays         Helper for SetMetaData. Initializes arrays to number of columns in Collection.
    //  PopulateExcludeColumnIndexArray Populates index of exluded columns in collection. Populated always.
    //  InitializeCellWidthArray        Intializes array, populates with column widths.
    //  InitializeCellAlignArray        initializes array.
    //  PopulateWidthAndAlignArrays     Populates above two arrays.
    //  AddSpanMetric                   Helper for SetMetaData. Helps find widths.
    //  RemoveSpanMetric                Helper for SetMetaData.
    //  SetGridWidth                    Helper for SetMetaData. Uses col widths and external attribs to set width.
    //  SetAlignment                    Helper for SetMetaData. Determines probably alignment for cells.
    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    Grid.ArrangeColumns = function (collection) {

        var RowCount = collection.length;
        var NewGridCollection = new Array(RowCount);
        for (var i = 0; i < RowCount; i++) {

            NewGridCollection[i] = new Array();
            for (var j = 0; j < Grid.GridAttributes.GridColumnArrange.length; j++) {

                NewGridCollection[i][Grid.GridAttributes.GridColumnArrange[j]] = collection[i][Grid.GridAttributes.GridColumnArrange[j]];

            }

        }

        return NewGridCollection;
    }

    Grid.SetMetaData = function (Collection) {

        Grid.AddSpanMetric();
        Grid.SetColumnCount(Collection[0]);
        Grid.InitializePrivateArrays(Collection);
        if (Grid.GridAttributes.AutoComputeCellWidths) Grid.SetGridWidth();
        Grid.RemoveSpanMetric();

    }

    Grid.SetColumnCount = function (Item) {

        for (var key in Item) Grid.LocalAttributes.GridColumnCount++;

    }

    Grid.InitializePrivateArrays = function (Collection) {

        Grid.PopulateExcludeColumnIndexArray(Collection[0]);
        if (Grid.GridAttributes.AutoComputeCellWidths || Grid.GridAttributes.AutoComputeCellAlignment) {

            Grid.InitializeCellWidthArray(Collection[0]);
            Grid.InitializeCellAlignArray();
            Grid.PopulateWidthAndAlignArrays(Collection);

        }
    }

    Grid.PopulateExcludeColumnIndexArray = function (Item) {

        var CurrentColumn = 0;
        var ColumnExcludeString = Grid.GridAttributes.GridColumnExcludeList.join("|");
        for (var key in Item) {

            if (ColumnExcludeString.indexOf(key) > -1) {

                Grid.LocalAttributes.ExcludeColumnIdexes[CurrentColumn] = 1;

            } else {

                Grid.LocalAttributes.ExcludeColumnIdexes[CurrentColumn] = 0;
                Grid.LocalAttributes.GridLastColumnIdx = CurrentColumn;

            }

            CurrentColumn++;

        }
    }

    Grid.InitializeCellWidthArray = function (Item) {

        if (Grid.GridAttributes.AutoComputeCellWidths) {

            var CurrentColumn = 0;
            for (var key in Item) {

                Grid.LocalAttributes.CellWidth[CurrentColumn] = Grid.CalcTextWidth(key);
                CurrentColumn++;

            }
        }
    }

    Grid.InitializeCellAlignArray = function () {

        if (Grid.GridAttributes.AutoComputeCellAlignment)
            Grid.LocalAttributes.CellAlign = new Array(Grid.LocalAttributes.GridColumnCount);

    }

    Grid.PopulateWidthAndAlignArrays = function (Collection) {

        var CellAlignSet = false;
        var ColCount = 0;

        for (var key in Collection[0]) {

            for (var j = 0; j < Collection.length; j++) {

                if (Grid.GridAttributes.AutoComputeCellWidths) {

                    var ColWidth = Grid.CalcTextWidth(Collection[j][key]);
                    if (ColWidth > Grid.LocalAttributes.CellWidth[ColCount]) Grid.LocalAttributes.CellWidth[ColCount] = ColWidth;

                }

                if (!CellAlignSet && Grid.GridAttributes.AutoComputeCellAlignment)
                    if (Grid.SetAlignment(ColCount, Collection[j][key])) CellAlignSet = true;

            }

            CellAlignSet = false;
            ColCount++;

        }
    }

    Grid.AddSpanMetric = function () {

        $("body").append("<span id = 'spnContent' style = 'white-space: nowrap;'></span>");
        var FontFamily = Grid.GridAttributes.GridFont;
        var FontSize = Grid.GridAttributes.GridFontSize + "pt";
        var FontWeight = "bold";
        $("#spnContent").css({ 'font-family': FontFamily, 'font-size': FontSize, 'font-weight': 'bold' });

    }

    Grid.RemoveSpanMetric = function () {

        $("#spnContent").remove();

    }

    Grid.CalcTextWidth = function (TextVal) {

        var Width = 0;
        $("#spnContent").text(TextVal);
        Width = $("#spnContent").width();
        $("#spnContent").text("");
        return Width;

    }

    Grid.SetGridWidth = function () {

        var TotalWidth = 0;
        var WidthArrLen = Grid.LocalAttributes.CellWidth.length;

        for (var i = 0; i < WidthArrLen; i++) {

            if (Grid.LocalAttributes.ExcludeColumnIdexes[i] != 1) {

                TotalWidth += parseInt(Grid.LocalAttributes.CellWidth[i]) + 2 * parseInt(Grid.GridAttributes.CellPadding);

            }
        }

        if (Grid.GridAttributes.CellBordersOn)
            TotalWidth += parseFloat(Grid.LocalAttributes.GridColumnCount) - Grid.GridAttributes.GridColumnExcludeList.length;
        else
            TotalWidth += 1;

        TotalWidth += 1;    //Covers browser weirdness or something I'm missing.
        Grid.GridAttributes.GridWidth = TotalWidth;

    }

    Grid.SetAlignment = function (Idx, value) {

        var RetVal = false;

        if (!(value === "" || value === null)) {

            if (isNaN(value)) {

                Grid.LocalAttributes.CellAlign[Idx] = "left";

            } else if (!isNaN(value)) {

                Grid.LocalAttributes.CellAlign[Idx] = "right";

            } else if (value.indexOf("$") > -1 || value.indexOf(".") > -1) {

                Grid.LocalAttributes.CellAlign[Idx] = "right";

            } else {

                Grid.LocalAttributes.CellAlign[Idx] = "center";

            }

            RetVal = true;

        }

        return RetVal;

    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    //  BEHAVIORS/ACCESSORS
    //
    //  SetCurrentSelectedRow       Highlights row on click
    //  MoveCurrentRow              Moves highlighted row on keyup or down
    //  TakeActionOnRow             Fires action event on double click
    //  SortOnColumn                Fires action event on click of header cell
    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    Grid.SetCurrentSelectedRow = function (SelectedRow) {


        if (Grid.LocalAttributes.GridCurrentSelectedRowId != null) {

            $("#" + Grid.LocalAttributes.GridCurrentSelectedRowId).children().css({ 'background-color': Grid.LocalAttributes.GridCurrentSelectedRowBG, 'color': Grid.LocalAttributes.GridCurrentSelectedRowFG });

        }

        Grid.LocalAttributes.GridCurrentSelectedRowId = SelectedRow.attr("id");
        Grid.LocalAttributes.GridCurrentSelectedRowBG = SelectedRow.css("background-color");
        Grid.LocalAttributes.GridCurrentSelectedRowFG = SelectedRow.css("color");
        SelectedRow.children().css({ 'background-color': Grid.LocalAttributes.DefaultAltCellBackColor, 'color': Grid.LocalAttributes.DefaultAltCellFontColor });

        Grid.LocalAttributes.CurrentSelectedRow = SelectedRow.attr("id").split("_")[1];
        SelectedRow.parent().focus();

    }

    Grid.MoveCurrentRow = function (Direction) {

        var count = $("#" + Grid.GridAttributes.GridListContainer + " table tr").length;
        var NewItem = null;
        if (Grid.LocalAttributes.GridCurrentSelectedRowId != null) {

            var NewIdx = -1;
            var idx = $("#" + Grid.GridAttributes.GridListContainer + " table tr").index($("#" + Grid.LocalAttributes.GridCurrentSelectedRowId).parent());

            if (Direction == 38 && idx > 0)
                NewIdx = idx - 1;
            else if (Direction == 40 && idx < count)
                NewIdx = idx + 1;

            if (NewIdx != -1) {

                NewItem = $("#" + Grid.GridAttributes.GridListContainer + " table tr").get(NewIdx);
                $(NewItem).children().click();

            }
        }

        return false;

    }

    Grid.TakeActionOnRow = function (SelectedRow) {

        Grid.SetCurrentSelectedRow(SelectedRow);
        Grid.FireEvent("OnGridItemSelected", Grid.GetCurrentSelectedRowId());

    }

    Grid.SortOnColumn = function (ClickedSortField) {

        ClickedSortField = ClickedSortField.replace("id", "");
        if (Grid.LocalAttributes.CurrentSortField == null) {

            Grid.LocalAttributes.CurrentSortField = ClickedSortField;
            Grid.LocalAttributes.CurrentSortDirection = "ASC";

        } else {

            if (ClickedSortField == Grid.LocalAttributes.CurrentSortField) {

                if (Grid.LocalAttributes.CurrentSortDirection == "ASC")
                    Grid.LocalAttributes.CurrentSortDirection = "DESC";
                else
                    Grid.LocalAttributes.CurrentSortDirection = "ASC";

            } else {

                Grid.LocalAttributes.CurrentSortField = ClickedSortField;
                Grid.LocalAttributes.CurrentSortDirection = "ASC";

            }
        }

        var SortInformation = {

            SortField: Grid.LocalAttributes.CurrentSortField,
            SortDirection: Grid.LocalAttributes.CurrentSortDirection

        }

        Grid.FireEvent("OnSortFieldChange", SortInformation);
        return false;

    }

    Grid.GetCurrentSelectedRowId = function () {

        return Grid.LocalAttributes.CurrentSelectedRow;

    }

    Grid.GetSortField = function () {

        var SortField = Grid.LocalAttributes.CurrentSortField;
        if (SortField == null) SortField = Grid.GridAttributes.GridInitialSortField;
        return SortField;

    }

    Grid.GetSortDirection = function () {

        var SortDirection = Grid.LocalAttributes.CurrentSortDirection;
        if (SortDirection == null) SortDirection = "desc";
        return SortDirection;

    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    //  EVENT HANDLERS
    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    $("#" + Grid.GridAttributes.GridListContainer + " table tr td").live("click",
    function (event) {

        Grid.SetCurrentSelectedRow($(this));

    });

    $("#" + Grid.GridAttributes.GridListContainer + " table tr td").live("dblclick",
    function (event) {

        Grid.TakeActionOnRow($(this));

    });

    $("#" + Grid.GridAttributes.GridListContainer + " table tr").live("keydown",
    function (event) {

        if (event.which == 40 || event.which == 38) Grid.MoveCurrentRow(event.which);

    });

    $("#" + Grid.GridAttributes.GridListContainer + "_HeaderRow span").live("click",
    function (event) {

        Grid.SortOnColumn($(this).attr("id"));

    });

    $("#" + Grid.GridAttributes.GridListContainer + "_HeaderRow span").live("dragstart",
    function (event) {

        Grid.MakeColumnHeadersDroppable($(this).attr("id"));

    });

    $("#" + Grid.GridAttributes.GridListContainer + "_HeaderRow span").live("drop",
    function (event) {

        Grid.LocalAttributes.IsValidDrop = true;
        Grid.AdjustGridColumnArrange($(this).attr("id"));

    });

    Grid.AdjustGridColumnArrange = function (DropId) {

        var ShiftElement = DropId.replace("id", "");
        var DragElement = $(Grid.LocalAttributes.DragElement).attr("id").replace("id", "");
        if (Grid.GridAttributes.GridColumnArrange == null) {

            var len = Grid.LocalAttributes.DragSpanTest.length;
            for (var i = 0; i < len; i++) {

                if (Grid.LocalAttributes.DragSpanTest[i] != "undefined") {

                    Grid.GridAttributes.GridColumnArrange[i] = Grid.LocalAttributes.DragSpanTest[i].replace("id", "");

                }
            }
        }

        var ShiftElementIdx = Grid.GridAttributes.GridColumnArrange.indexOf(ShiftElement);
        var DragElementIdx = Grid.GridAttributes.GridColumnArrange.indexOf(DragElement);
        Grid.GridAttributes.GridColumnArrange.splice(DragElementIdx, 1);
        Grid.GridAttributes.GridColumnArrange.splice(ShiftElementIdx, 0, DragElement);

        if (Grid.GridAttributes.HeaderAliasList.length != "") {

            var DragAlias = Grid.GridAttributes.HeaderAliasList[DragElementIdx];
            Grid.GridAttributes.HeaderAliasList.splice(DragElementIdx, 1);
            Grid.GridAttributes.HeaderAliasList.splice(ShiftElementIdx, 0, DragAlias);

        }

        Grid.LocalAttributes.BuildOverride = true;
        Grid.LocalAttributes.GridHeaderIsBuilt = false;
        Grid.LocalAttributes.GridColumnCount = 0;
        Grid.LocalAttributes.GridHeader = "";
        //Grid.BuildGrid(Grid.LocalAttributes.GridCollection);
        Grid.BuildGrid(Grid.LocalAttributes.GridCollection);

    }

    Grid.FireEvent = function (EventName, Value) {

        $(document).triggerHandler({
            type: EventName,
            ReturnedContext: Value
        });
    }

    return Grid;

}