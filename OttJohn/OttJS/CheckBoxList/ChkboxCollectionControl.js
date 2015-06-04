var CheckboxCollectionObject = function(ContextArray) {

    var CheckboxCollectionControl = {

        ControlType: ContextArray['ControlType'],
        Title: ContextArray.Title,
        Columns: ContextArray['Columns'],
        LabelWidth: ContextArray['LabelWidth'],
        LabelHeight: ContextArray['LabelHeight'],
        AttachToObjectId: ContextArray['AttachToObjectId'],
        CheckBoxValueField: ContextArray['CheckBoxValueField'],
        CheckBoxLabelField: ContextArray['CheckBoxLabelField'],
        CheckBoxCheckedFlag: ContextArray['CheckBoxCheckedFlag'],
        EventOnInputClick: ContextArray['EventOnInputClick'],
        ContainerID: ContextArray['ContainerID']
    };

    var ControlType;                    // String       [setting to tell control if this is a radio or checkbox collection]
    var Title;                          // String       [Title for control. If null, then no title box will appear]
    var Columns;                        // int          [setting for number of columns in checkbox control]
    var LabelWidth;                     // int          [setting for the widths of all of the checkbox labels]
    var LabelHeight;                    // int          [setting for the heights of all of the checkbox labels]
    var ChkCollection;                  // Array        [initial array containing state of check boxes]
    var AttachToObjectId;               // string       [External object to which grid is attached]
    var CheckBoxValueField;             // string       [The dictionary item on JSON identifying the value for the checkbox]
    var CheckBoxLabelField;             // string       [The dictionary item on JSON identifying the label for the checkbox]
    var CheckBoxCheckedFlag;            // string       [The dictionary item on JSON that indicates whether the item is checked]
    var CurrentRadioIdx;                // int          [Currently selected radio button]
    var ContainerID;                    // string       [name for checkbox collection container]
    var EventOnInputClick;              // string       [Name of event to fire when a checkbox/radio button is clicked]
    var ClickedValue;                   // string       [Used for radio buttons as checkboxes would not make much sense here]

    ///////////////////////////////////////////////////////////////////////////////
    //  Functionality to maintain control checked state.
    ///////////////////////////////////////////////////////////////////////////////
    $("#" + CheckboxCollectionControl.ContainerID + " input").live("click",
        function() {

            if (CheckboxCollectionControl.ControlType == "radio") {

                if (CheckboxCollectionControl.CurrentRadioIdx != null)
                    CheckboxCollectionControl.ChkCollection[CheckboxCollectionControl.CurrentRadioIdx][CheckboxCollectionControl.CheckBoxCheckedFlag] = 0;
            }

            var AttribChecked = 0;
            if ($(this).is(":checked")) AttribChecked = 1;

            var idx = $("#" + CheckboxCollectionControl.ContainerID + " input").index($(this));
            CheckboxCollectionControl.CurrentRadioIdx = idx;
            CheckboxCollectionControl.ChkCollection[idx][CheckboxCollectionControl.CheckBoxCheckedFlag] = AttribChecked;
            if (AttribChecked == 1) CheckboxCollectionControl.ClickedValue = CheckboxCollectionControl.ChkCollection[idx][CheckboxCollectionControl.CheckBoxValueField];
            CheckboxCollectionControl.FireEvent();
        }
    );

    CheckboxCollectionControl.FireEvent = function() {

        if (CheckboxCollectionControl.EventOnInputClick != null) {

            $(document).triggerHandler({ type: CheckboxCollectionControl.EventOnInputClick,
                ReturnedContext: CheckboxCollectionControl.CurrentRadioIdx
            });
        }
    }

    ///////////////////////////////////////////////////////////////////////////////
    //  Getter for control check state. 
    ///////////////////////////////////////////////////////////////////////////////
    CheckboxCollectionControl.ReturnCollectionValues = function() {

        return CheckboxCollectionControl.ChkCollection;

    }

    ///////////////////////////////////////////////////////////////////////////////
    //  Functionality to auto-set lable width. 
    ///////////////////////////////////////////////////////////////////////////////
    CheckboxCollectionControl.DefineColumnWidth = function(CheckCollection) {

        var TempWidth = 0;
        var CollectionCount = CheckboxCollectionControl.ChkCollection.length;

        for (var i = 0; i < CollectionCount; i++) {

            $("#spnContent").text(CheckboxCollectionControl.ChkCollection[i][CheckboxCollectionControl.CheckBoxLabelField]);
            var ContentLength = $("#spnContent").width();
            $("#spnContent").text("");

            if (TempWidth == 0) {
                TempWidth = ContentLength;
            } else {
                if (ContentLength > TempWidth) TempWidth = ContentLength;
            }

        }

        CheckboxCollectionControl.LabelWidth = TempWidth;

    }

    CheckboxCollectionControl.ChangeColCount = function(ColCount) {

        CheckboxCollectionControl.Columns = ColCount;
        CheckboxCollectionControl.BuildControl(CheckboxCollectionControl.ChkCollection);

    }

    ///////////////////////////////////////////////////////////////////////////////
    //  Functionality to build grid. 
    ///////////////////////////////////////////////////////////////////////////////
    CheckboxCollectionControl.BuildControl = function(CheckCollection) {

        CheckboxCollectionControl.ChkCollection = CheckCollection;
        var CollectionCount = CheckboxCollectionControl.ChkCollection.length;
        if (CheckboxCollectionControl.LabelWidth == null) CheckboxCollectionControl.DefineColumnWidth(CheckboxCollectionControl.ChkCollection);
        if (CheckboxCollectionControl.Columns == null) CheckboxCollectionControl.Columns = 1;

        var ColCount = 0;
        var RowConcat = "";
        var InnerTable = "";

        for (var i = 0; i < CollectionCount; i++) {


            if (ColCount == CheckboxCollectionControl.Columns) {

                ColCount = 0;
                InnerTable += "<tr>" + RowConcat + "</tr>";
                RowConcat = "";
            }

            if (CheckboxCollectionControl.ChkCollection[i][CheckboxCollectionControl.CheckBoxCheckedFlag] == null)
                CheckboxCollectionControl.ChkCollection[i][CheckboxCollectionControl.CheckBoxCheckedFlag] = 0;
            if (CheckboxCollectionControl.ChkCollection[i][CheckboxCollectionControl.CheckBoxValueField] == null)
                CheckboxCollectionControl.ChkCollection[i][CheckboxCollectionControl.CheckBoxLabelField] = 0;

            RowConcat += CheckboxCollectionControl.BuildRow(
                        CheckboxCollectionControl.ChkCollection[i][CheckboxCollectionControl.CheckBoxValueField],
                        CheckboxCollectionControl.ChkCollection[i][CheckboxCollectionControl.CheckBoxLabelField],
                        CheckboxCollectionControl.ChkCollection[i][CheckboxCollectionControl.CheckBoxCheckedFlag]
                        );

            ColCount++;
        }

        InnerTable += "<tr>" + RowConcat + "</tr>";

        var TitleBox = "";
        if (CheckboxCollectionControl.Title != null) {

            TitleBox = "<tr><td colspan = '" + 2 * CheckboxCollectionControl.Columns + "' class = 'ChkColTitle'>" + CheckboxCollectionControl.Title + "</td></tr>";
        }

        var CheckboxTable = "<table id = '$CONTAINERID$' class = 'ChkColTable' cellpadding = '0' cellspacing = '0' border = '0'>" + TitleBox + InnerTable + "</table>";
        CheckboxTable = CheckboxTable.replace("$CONTAINERID$", CheckboxCollectionControl.ContainerID);
        $("#" + CheckboxCollectionControl.AttachToObjectId).html(CheckboxTable);
    }

    ///////////////////////////////////////////////////////////////////////////////
    //  Helper function for grid build. 
    ///////////////////////////////////////////////////////////////////////////////
    CheckboxCollectionControl.BuildRow = function(CheckValue, CheckLabel, CheckboxChecked) {

        var RadioID = "RdoMarket";
        if (CheckboxCollectionControl.ControlType == null) {
            CheckboxCollectionControl.ControlType = "checkbox";
            RadioID = "";
        }
        var LabelCellContainerOpen = "<td class = 'ChkColTdLabel' style = 'width: $WIDTH$px; height: $HEIGHT$px;'>";
        var LabelCellContainerClose = "</td>";
        var CheckBoxTemplate = "<td class = 'ChkColTdChk'><input name = '$NAME$' id = '$ID$' type = '$INPUTTYPE$' $CHECKED$ /></td>";

        var CheckedFlag = "";
        if (parseInt(CheckboxChecked)) {
            if (CheckboxChecked == 1) CheckedFlag = "checked";
        }

        CheckBoxTemplate = CheckBoxTemplate.replace("$CHECKED$", CheckedFlag);
        CheckBoxTemplate = CheckBoxTemplate.replace("$ID$", CheckValue);
        CheckBoxTemplate = CheckBoxTemplate.replace("$INPUTTYPE$", CheckboxCollectionControl.ControlType);
        CheckBoxTemplate = CheckBoxTemplate.replace("$NAME$", RadioID);
        LabelCellContainerOpen = LabelCellContainerOpen.replace("$WIDTH$", CheckboxCollectionControl.LabelWidth);
        LabelCellContainerOpen = LabelCellContainerOpen.replace("$HEIGHT$", CheckboxCollectionControl.LabelHeight);

        

        return CheckBoxTemplate + LabelCellContainerOpen + CheckLabel + LabelCellContainerClose;

    }

    return CheckboxCollectionControl;
}