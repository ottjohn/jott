Checkbox List Control
================================================

Features:
================================================
1. Number of columns may be set. If the number of columns is not set, then the value is set to one.
2. The width for each label may be set. If this is not set, then this value is auto-calculated.
3. The control list can either be checkbox or radio button.

Instantiation: 
================================================
The checkbox list control has all of its constructor items passed in through a context array

        var ChkContextArray = new Array();
        ChkContextArray['ControlType'] = "checkbox";
        ChkContextArray['Title'] = "Select an object for color styling";
        ChkContextArray['Columns'] = 2;
        ChkContextArray['LabelWidth'] = null;
        LabelHeight: ContextArray['LabelHeight'],
        ChkContextArray['CheckBoxValueField'] = "MarketID";
        ChkContextArray['CheckBoxLabelField'] = "MarketName";
        ChkContextArray['CheckBoxCheckedFlag'] = "CheckedFlag";
        ChkContextArray['AttachToObjectId'] = "CheckBoxCollectionContainer";
        ChkContextArray['ContainerID'] = "MarketListContainer";
        ChkContextArray['EventOnInputClick'] = "OnColorControlClick";
        CheckBoxColControl = new CheckboxCollectionObject(ChkContextArray);

ControlType: Can be either checkbox or radio button.
Title: Optional parameter that will add a row to the top of the collection holding the provided string value.
Columns: sets the number of columns for the control. If not set, this value defaults to one.
LabelWidth: sets the label width for all of the labels in the control. If not set, this value is auto calculated.
LabelHeight: sets the label height for all of the labels in the control. 
CheckBoxValueField: The item in JSON dictionary that indicates the values for the checkboxes or radio buttons (in case there are multiple items in the dictionary).
CheckBoxLabelField: The item in the JSON dictionary that indicates the values for the labels for the checkboxes or radio buttons.
CheckBoxCheckedFlag: The item in the JSON dictionary that indicates whether the checkbox or radio button is checked.
AttachToObject: sets the id of the element to which this object becomes a child.
ContainerID: The name for the container of the checkbox list (so multiple lists can be placed on one page).
EventOnInputClick: The name of the event to fire when an item in the list is clicked. Probably mostly used with radio lists.

Population
================================================
After you have instantiated the checkbox list, you may build it at any time by calling the following method:

    CheckBoxColControl.BuildControl(CheckCollection);


CheckCollection is specifically a JSON object that contains the items to populate the checkbox list object.

Events/Handlers
================================================
The control will fire one event when the control type is set to radio, which will simply deliver the currently selected index as an argument:

    CheckboxCollectionControl.FireEvent = function() {

        if (CheckboxCollectionControl.EventOnInputClick != null) {

            $(document).triggerHandler({ type: CheckboxCollectionControl.EventOnInputClick,
                ReturnedContext: CheckboxCollectionControl.CurrentRadioIdx
            });
        }
    }
    
This must be handled in the parent page in the following way:

        $(function() {
            $(document).on("OnColorControlClick", function(EventArgs) {
                SelectedColorObjectIdx = EventArgs.ReturnedContext;
                SetScrollBars();
            });
        });
        
If the event above fired is OnColorControlClick, then the handler on the main page will catch this and execute nested code appropriately.

Relevant Accessor Methods:
================================================
When sending calls to the DAL, you will need to make the following calls: CheckBoxColControl.ReturnCollectionValues().
This accessor method returns the current state of the checkbox list object.