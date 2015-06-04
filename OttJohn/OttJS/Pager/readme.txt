Pager Control
================================================

Features:
================================================
1. First and Last buttons. These can be hiden. See below.
2. Go to specific page functionality. This can be hidden. See below.
3. Current page of total page display.
4. Next/Previous buttons.

Instantiation: 
================================================
The pager control has all of its constructor items passed in through a context array:

        var PagerContextArray = new Array();
        PagerContextArray['PageSize'] = 5;
        PagerContextArray['RecordCount'] = -1;
        PagerContextArray['CurrentPage'] = 1;
        PagerContextArray['ShowEndButtons'] = true;
        PagerContextArray['ShowGoToControl'] = true;
        PagerContextArray['WrapWithDiv'] = true;
        PagerContextArray['DivId'] = 'PagerDiv';
        PagerContextArray['DivPadding'] = 2;
        PagerContextArray['AttachToObjectId'] = "PanelCell2";
        PagerControl = new PagerObject(PagerContextArray);
        PagerControl.BuildControl();

PageSize: sets the number of rows that are returned.
RecordCount: this is just a flag that allows the code behind the pager to retrieve the record count so the total number of pages can be 
calculated.
CurrentPage: Pretty self-explanatory, huh?
ShowEndButtons: this is a flag that tells the pager whether the first and last buttons should be displayed.
ShowGoToControl: this is a flag that tells the pager whether the go to control should be displayed.
WrapWithDiv: boolean to indicate whether the pager control should be wrapped with a div. Style function for alignment and color.
DivId: string to indicate the id of the div that wraps the pager control.
DivPadding: int to indicate the padding for the div.
ApplyStyles: Since this is not a dynamically built control, this needs to be called.
BuildControl(): Builds the control and attaches it to the specified DOM object.

Population:
================================================
After the grid control is populated, the pager needs to be initialized. Do it with the following command:

            PagerControl.SetTotalPages(SomeObject.RecordCount);


Events:
================================================
The pager control fires a single event: OnPageChanged. This event must be handled in the Javascript that manages the page 
that controls the pager. Here is how you do that:

        $(function() {
            $(document).on("OnPageChanged", function() {
                //Call relevant code here;
            });
        });

Relevant Accessor Methods:
================================================
When sending calls to the DAL, you will need to make the following calls: PagerControl.GetPageSize(), PagerControl.GetCurrentPage()