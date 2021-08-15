import * as React from 'react';
import styles from './DispatcherView.module.scss';
import { IDispatcherViewProps } from './IDispatcherViewProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { DefaultButton, PrimaryButton, CompoundButton } from '@fluentui/react/lib/Button';
import {IDispatcherViewState} from './IDispatcherViewState';
import { TextField } from '@fluentui/react/lib/TextField';
import { Stack, IStackProps, IStackStyles } from '@fluentui/react/lib/Stack';
import {  IStackTokens } from '@fluentui/react';
import { Dropdown, DropdownMenuItemType, IDropdownStyles, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { SPHttpClient, ISPHttpClientOptions, SPHttpClientResponse } from '@microsoft/sp-http';
import {IDepartmentList} from './IDepartmentList'
//import Select from 'react-select';
import 'office-ui-fabric-react/dist/css/fabric.css';
//import { ChevronIcon } from '@fluentui/react-icons-mdl2';
import { IconButton } from '@fluentui/react/lib/Button';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
initializeIcons();
import { Icon } from '@fluentui/react/lib/Icon';
import pnp from 'sp-pnp-js';
import {IMyIssueList} from '../MyRequestedIssues/IMyRequestedIssuesProps'


import {
  PropertyPaneTextField,
  PropertyPaneCheckbox,
  PropertyPaneLabel,
  PropertyPaneLink,
  PropertyPaneSlider,
  PropertyPaneToggle,
  PropertyPaneDropdown
} from '@microsoft/sp-property-pane';
import DepartmentSelect from '../MyRequestedIssues/MyRequestedIssues';

const stackTokens = { childrenGap: 50  };
const stackStyles: Partial<IStackStyles> = { root: { width: 650 } };
const columnProps: Partial<IStackProps> = {
  tokens: { childrenGap: 10 },
  styles: { root: { width: 125, textAlign: "Center"  } },
};

//Dropdown options
const dropdownStyles: Partial<IDropdownStyles> = {
  dropdown: { width: 200 },
};

var departmentOptions: IDropdownOption[] = [];
var departmentCategoryOptions: IDropdownOption[] = [];
var	departmentFAQ_ArchiveTimeSpan:number = 0;
var departmentFAQ_deptList: IDepartmentList[] = Array();
var loggedInUserEmail, loggedInUserId,issueData:IMyIssueList[];
var myIssueCount:number = 0;
var SPGroupList = new Array();
var AssignedToFilter="";
var htmlcontent;

 
debugger;
export default class DispatcherView extends React.Component<IDispatcherViewProps, IDispatcherViewState> {

  constructor(props:any){
    super(props);
    this.state = {
      count : 0,
      dataFilledCheck:0,
      myIssueUnlock:0,
      nextCount:0,
      bgColorRaiseRequest:"#ef8700",
      bgColorFollowers:"white",
      bgColorFollowing:"white",
      colorRaiseRequest:"white",
      colorFollowers:"black",
      colorFollowing:"black",
      loading:false,
      errorMessage:null,
      selectedDept:"",
      selectedDeptCategory:"",
      requestDescription:"",
    }
    this.handleChange = this.handleChange.bind(this);
    this.onChangeDeptHandle = this.onChangeDeptHandle.bind(this);
    
  }

  componentDidMount(){
    this.getDepartmentsDetails();
    this.GetIssueArchiveSettings();
    loggedInUserEmail = this.props.loggedInUserEmail;
    this. getUserId (loggedInUserEmail);
    
  }

  public getUserId(loggedInUserEmail: string): Promise<number> {
    return pnp.sp.site.rootWeb.ensureUser(loggedInUserEmail).then(result => {
      loggedInUserId = result.data.Id
      this.myIssue();
      return result.data.Id;
    });

    
    }

  handleChange(e:any) {
    console.log("Fruit Selected!!");
    this.setState({ selectedDept: e.target.defaultValue },()=>alert(
      "Selected Option = " + this.state.selectedDept
    ));
  }

 private getDepartmentsDetails():void{
  const headers: HeadersInit = new Headers();
  // suppress metadata to minimize the amount of data loaded from SharePoint
  headers.append("accept", "application/json;odata.metadata=none");
  this.props.spHttpClient
    .get(`${this.props.webUrl}/_api/web/lists/getbytitle('Department')/items?$select=*,GroupName/Title,DepartmentGroup/Title,Manager/Title&$expand=GroupName,DepartmentGroup,Manager&$orderby=Title asc`,
    SPHttpClient.configurations.v1, {
      headers: headers
    })
    .then((res: SPHttpClientResponse): Promise<any> => {
      return res.json();
    })
    .then((res: any): void => {
      if (res.error) {
      //   // There was an error loading information about people.
      //   // Notify the user that loading data is finished and return the
         this.setState({
           loading: false,
           errorMessage: res.error.message,
            });
        return;
      }
      if (res.value == 0) {
        // No results were found. Notify the user that loading data is finished
        this.setState({
          loading: false
        });
        return;
      }
      this.getLoggedInUserIdSPGroups(res.value);

    
      departmentFAQ_deptList = res.value.map((r,index)=>{
        return {
          deptName:r.Title,
          deptGroup:r.DepartmentGroup.Title,
          deptManager:r.ManagerId,
          dispatcherName:r.GroupName.Title
        };
      });


 departmentOptions =  res.value.map((r,index) => {
  return {
    key:index,
    text:r.Title,
  };
});
  // debugger;
  if(departmentOptions.length>0){
    // alert("I have arrived to people.length = " + people.length);
  this.setState({
    loading:false,
    //Users : people,
  })
  }
}, (error: any): void => {
  // An error has occurred while loading the data. Notify the user
  // that loading data is finished and return the error message.
  this.setState({
    loading: false,
    errorMessage: error
  });
})
.catch((error: any): void => {
  // An exception has occurred while loading the data. Notify the user
  // that loading data is finished and return the exception.
  this.setState({
    loading: false,
    errorMessage: error
  });
});
 }

 getLoggedInUserIdSPGroups(departmentDetailsArray){
  const headers: HeadersInit = new Headers();
  // suppress metadata to minimize the amount of data loaded from SharePoint
  headers.append("accept", "application/json;odata.metadata=none");
  this.props.spHttpClient
    .get(`${this.props.webUrl}/_api/web/currentuser/?$expand=groups`,
    SPHttpClient.configurations.v1, {
      headers: headers
    })
    .then((res: SPHttpClientResponse): Promise<any> => {
      return res.json();
    })
    .then((res: any): void => {
      if (res.error) {
      //   // There was an error loading information about people.
      //   // Notify the user that loading data is finished and return the
         this.setState({
           loading: false,
           errorMessage: res.error.message,
            });
        return;
      }
      if (res.value == 0) {
        // No results were found. Notify the user that loading data is finished
        this.setState({
          loading: false
        });
        return;
      }
      this.getLoggedInUserIdSPGroupsSuccess(res,departmentDetailsArray);
    
      departmentFAQ_deptList = res.value.map((r,index)=>{
        return {
          deptName:r.Title,
          deptGroup:r.DepartmentGroup.Title,
          deptManager:r.ManagerId,
          dispatcherName:r.GroupName.Title
        };
      });


 departmentOptions =  res.value.map((r,index) => {
  return {
    key:index,
    text:r.Title,
  };
});
  // debugger;
  if(departmentOptions.length>0){
    // alert("I have arrived to people.length = " + people.length);
  this.setState({
    loading:false,
    //Users : people,
  })
  }
}, (error: any): void => {
  // An error has occurred while loading the data. Notify the user
  // that loading data is finished and return the error message.
  this.setState({
    loading: false,
    errorMessage: error
  });
})
.catch((error: any): void => {
  // An exception has occurred while loading the data. Notify the user
  // that loading data is finished and return the exception.
  this.setState({
    loading: false,
    errorMessage: error
  });
});  
 }

 getLoggedInUserIdSPGroupsSuccess(res,departmentDetailsArray){
	var obj = res.Groups, currentLoggedInUserDispatcherGroups = 0;
  var test1:number=0;

  for (var loggedInTemp = 0; loggedInTemp < obj.length; loggedInTemp++) {
    obj[loggedInTemp].Added = false;
    for (var dispatcherTemp = 0; dispatcherTemp < departmentDetailsArray.length; dispatcherTemp++) {
        if (obj[loggedInTemp].Title == departmentDetailsArray[dispatcherTemp].GroupName.Title && obj[loggedInTemp].Added == false) {  
            obj[loggedInTemp].Added = true;
            SPGroupList[currentLoggedInUserDispatcherGroups] = new Object();
            SPGroupList[currentLoggedInUserDispatcherGroups].groupname = obj[loggedInTemp].Title;
            currentLoggedInUserDispatcherGroups++;
        }
    }
}

if(SPGroupList.length==0)
{
  console.log("User not in any dispatch group");
}

else
{
  var count = 0;
      for(var i=0;i<SPGroupList.length;i++)
      {
      if(count==0)
      {
        AssignedToFilter = "(AssignedTo eq '"+SPGroupList[i].groupname+"' ";
        count++;
      }
      else
      {
        AssignedToFilter = AssignedToFilter + " or "+ "AssignedTo eq '"+SPGroupList[i].groupname+"'";
      }
      }

}

this.loadAssignedTask(obj);


 }

 loadAssignedTask(obj){
    // var htmlcontent = htmlcontent + "<tr><td id='Author" + obj[0].ID + "' align='left' valign='top'>" + obj[0].Author.Title + "</td>";
    // htmlcontent = htmlcontent + "<td id='Craeted" + obj[0].ID + "' align='left' valign='top'>" + "</td>";
    // htmlcontent = htmlcontent + "<td id='Description" + obj[0].ID + "' align='left' valign='top'>" + obj[0].Description + "</td>";
    // htmlcontent = htmlcontent + "<td id='Category" + obj[0].ID + "' align='left' valign='top'>" + obj[0].Category + "</td>";
    // htmlcontent = htmlcontent + "<td id='Department" + obj[0].ID + "' align='left' valign='top'>" + obj[0].Department + "</td>";

     htmlcontent = "<table id='tbl' class='table table-hover'><thead><tr><th align='left' valign='top'>Raised By</th><th align='left' valign='top' style='width: 80px;'>Issue Date</th><th align='left' valign='top'>Description</th><th align='left' valign='top'>Category</th><th align='left' valign='top'>Department</th><th align='left' valign='top'>Comment</th><th align='left' valign='top'>Status</th><th align='left' valign='top'>Assign To</th><th>Attachments</th><th align='left' valign='top'>Action</th></tr><tbody id='myAssignedTask'>";

    var cope:string;
 }
 
   onChangeDeptHandle = async (selectedDept)=> {
    //const check : string = "";  
    await this.setState({
       selectedDept :  selectedDept.text,
       dataFilledCheck: 1,
      selectedDeptCategory: this.state.selectedDeptCategory,
    });

    this.deptCategorySelect();
 }

 private deptCategorySelect():void{
  const headers: HeadersInit = new Headers();
  // suppress metadata to minimize the amount of data loaded from SharePoint
  headers.append("accept", "application/json;odata.metadata=none");
  this.props.spHttpClient
    .get(`${this.props.webUrl}/_api/web/lists/GetByTitle('Departmental_Category')/items?$select=*,Department/Title&$expand=Department`,
    SPHttpClient.configurations.v1, {
      headers: headers
    })
    .then((res: SPHttpClientResponse): Promise<any> => {
      //console.log("res value = " + res.json());
      // alert("res.Json() of UserList = " + res.json());
      return res.json();
    })
    .then((res: any): void => {
      if (res.error) {
      //   // There was an error loading information about people.
      //   // Notify the user that loading data is finished and return the
      //   // error message that occurred
         this.setState({
           loading: false,
           errorMessage: res.error.message,
            });
        return;
      }
      if (res.value == 0) {
        // No results were found. Notify the user that loading data is finished
        this.setState({
          loading: false
        });
        return;
      }
    const getOptionsBySelectedDept = [];
    for(var i=0;i<res.value.length;++i){
      if(res.value[i].Department.Title === this.state.selectedDept){
        getOptionsBySelectedDept.push(res.value[i])
      }
    }

departmentCategoryOptions =  getOptionsBySelectedDept.map((r,index) => {
  return {
    key:index,
    text:r.Title,
  };
});

  if(departmentCategoryOptions.length>0){
  this.setState({
    loading:false,
  })
  }
}, (error: any): void => {
  // An error has occurred while loading the data. Notify the user
  // that loading data is finished and return the error message.
  this.setState({
    loading: false,
    errorMessage: error
  });
})
.catch((error: any): void => {
  // An exception has occurred while loading the data. Notify the user
  // that loading data is finished and return the exception.
  this.setState({
    loading: false,
    errorMessage: error
  });
});
}

 async onChangeDeptCategoryHandle (selectedDeptCategory:any) {
  //const check : string = "";  
   this.setState({
    selectedDeptCategory :await selectedDeptCategory.text,
    dataFilledCheck:1
  });
}

async onChangeRequestDescriptionHandle(requestDescription:any){
  this.setState({
       requestDescription:await requestDescription.currentTarget.value,
       dataFilledCheck:1

      })
}


GetIssueArchiveSettings():void{
	departmentFAQ_ArchiveTimeSpan = 0;
  const headers: HeadersInit = new Headers();
  // suppress metadata to minimize the amount of data loaded from SharePoint
  headers.append("accept", "application/json;odata.metadata=none");
  this.props.spHttpClient
    .get(`${this.props.webUrl}/_api/web/lists/GetByTitle('IssueArchiveSettings')/items`,
    SPHttpClient.configurations.v1, {
      headers: headers
    })
    .then((res: SPHttpClientResponse): Promise<any> => {
      return res.json();
    })
    .then((res: any): void => {
      if (res.error) {
      //   // There was an error loading information about people.
      //   // Notify the user that loading data is finished and return the
      //   // error message that occurred
         this.setState({
           loading: false,
           errorMessage: res.error.message,
            });
        return;
      }
      if (res.value == 0) {
        // No results were found. Notify the user that loading data is finished
        this.setState({
          loading: false
        });
        return;
      }
      if(res.value !=null && res.value.length>0){
        departmentFAQ_ArchiveTimeSpan = res.value[0].NumberOfDays;
      }
      else{
        departmentFAQ_ArchiveTimeSpan = 0;

      }

  if(departmentFAQ_ArchiveTimeSpan>0){
  this.setState({
    loading:false,
  })
  }
}, (error: any): void => {
  // An error has occurred while loading the data. Notify the user
  // that loading data is finished and return the error message.
  this.setState({
    loading: false,
    errorMessage: error
  });
})
.catch((error: any): void => {
  // An exception has occurred while loading the data. Notify the user
  // that loading data is finished and return the exception.
  this.setState({
    loading: false,
    errorMessage: error
  });
});

}
  
 addEmployeeRequest(issueDescription, selectedDept, selectedDeptCategory,departmentFAQ_ArchiveTimeSpan){
   var selectedDeptGroup, selectedDeptManager, selectedDispatcherName;
   var selectedTitle:string = selectedDeptCategory + ' Request';
  var currentUserName = this.props.loggedInUserName;
  var currentUserEmail = this.props.loggedInUserEmail;

  for(let i=0;i<departmentFAQ_deptList.length;++i){
    if(departmentFAQ_deptList[i].deptName === selectedDept){
      selectedDeptGroup = departmentFAQ_deptList[i].deptGroup;
      selectedDispatcherName = departmentFAQ_deptList[i].dispatcherName;
      selectedDeptManager = departmentFAQ_deptList[i].deptManager;
    }
  }

  if(issueDescription !== "" && selectedDept !== "" && selectedDeptCategory !== ""){
  const headers: HeadersInit = new Headers();
  headers.append("accept", "application/json;odata.metadata=none");
  headers.append("Content-Type", "application/json;odata.metadata=none");

    const spOpts: string = JSON.stringify({
     'Title': selectedTitle,
     'Description': issueDescription,
     'Category': selectedDeptCategory,
     'Department':selectedDept,
     'Status':'Pending',
     'AssignedTo': selectedDispatcherName,
     'ArchivedTimeSpan': departmentFAQ_ArchiveTimeSpan,
     'DepartmentManagerId': selectedDeptManager
  });

  this.props.spHttpClient.post(`${this.props.webUrl}/_api/web/lists/GetByTitle('EmployeeRequest')/items`, SPHttpClient.configurations.v1, 
  {
    body:spOpts
  })
      .then((response: SPHttpClientResponse) => {
        // Access properties of the response object. 
        console.log(`Status code: ${response.status}`);
        console.log(`Status text: ${response.statusText}`);

        //response.json() returns a promise so you get access to the json in the resolve callback.
        response.json().then((responseJSON: JSON) => {
          console.log(responseJSON);
          this.myIssue();
        });
      });
   }
   
 }
 
 myIssue(){
  const headers: HeadersInit = new Headers();
  // suppress metadata to minimize the amount of data loaded from SharePoint
  headers.append("accept", "application/json;odata.metadata=none");
  this.props.spHttpClient
    .get(`${this.props.webUrl}/_api/web/lists/GetByTitle('EmployeeRequest')/items?&$filter=Author eq ${loggedInUserId} &$orderby=ID desc&$top=10`,
    SPHttpClient.configurations.v1, {
      headers: headers
    })
    .then((res: SPHttpClientResponse): Promise<any> => {
      //console.log("res value = " + res.json());
      // alert("res.Json() of UserList = " + res.json());
      return res.json();
    })
    .then((res: any): void => {
      if (res.error) {
      //   // There was an error loading information about people.
      //   // Notify the user that loading data is finished and return the
      //   // error message that occurred
         this.setState({
           loading: false,
           errorMessage: res.error.message,
            });
        return;
      }
      if (res.value == 0) {
        // No results were found. Notify the user that loading data is finished
        this.setState({
          loading: false
        });
        return;
      }

       issueData = res.value.map(r =>{
         let createdDateFormat = new Date(r.Created).toLocaleDateString();
         myIssueCount= myIssueCount + 1;
         console.log("createdDateFormat= " + createdDateFormat);
        return {
          created:createdDateFormat,
          description:r.Description,
          category:r.Category,
          department:r.Department,
          assignedTo:r.AssignedTo,
          comment:r.Comment,
          status:r.Status,
          attachments:r.Attachments
        }
      });
      console.log("myIssueCount= " + myIssueCount);

  if(issueData.length>0){
  this.setState({
    loading:false,
  })
  }
}, (error: any): void => {
  // An error has occurred while loading the data. Notify the user
  // that loading data is finished and return the error message.
  this.setState({
    loading: false,
    errorMessage: error
  });
})
.catch((error: any): void => {
  // An exception has occurred while loading the data. Notify the user
  // that loading data is finished and return the exception.
  this.setState({
    loading: false,
    errorMessage: error
  });
  });
}

  raiseRequestClick=()=>{
    this.setState({
      count: 1,
    bgColorRaiseRequest:"#ef8700",
    bgColorFollowers:"white",
    bgColorFollowing:"white",
    colorRaiseRequest:"white",
    colorFollowers:"black",
    colorFollowing:"black",
    })
  }

  previousClick=()=>{
    this.setState({
      count:this.state.count - 1,
      dataFilledCheck:0
    })
  }

  nextClick=()=>{
    if(this.state.dataFilledCheck === 1){
    this.setState({
      count:this.state.count + 1,
      dataFilledCheck:0
    });
  }
  }

  nextClickWithNotCompulsary=()=>{
    this.setState({
      count:this.state.count + 1,
    })
  }

  myIssueClick= ()=>{
       this.setState({
      myIssueUnlock:  1,
    });
  }
  
  public render(): React.ReactElement<IDispatcherViewProps> {
    return (
      <div className={ styles.dispatcherView }>
        {/* Main page display */}
        {(this.state.count === 0) && (this.state.myIssueUnlock === 0) &&
          <div className="ms-Grid" dir="ltr">
            <h1>Welcome to Departmental Request Facility!!</h1>
            <div className="ms-Grid-row">
              <div className="ms-Grid-col ms-lg4  ms-sm12">
                <CompoundButton style={{width:'100%',marginBottom:'15px',maxWidth:'100%', borderRadius:'10px'}} onClick={this.myIssueClick} >My Requested Issues = {myIssueCount} </CompoundButton>
              </div>
              <div className="ms-Grid-col ms-lg4 ms-sm12 ">
                <CompoundButton style={{width:'100%',marginBottom:'15px',maxWidth:'100%', borderRadius:'10px'}}>Assigned Issues</CompoundButton>
              </div>
              <div className="ms-Grid-col ms-lg4 ms-sm12">
                <CompoundButton style={{width:'100%',marginBottom:'15px',maxWidth:'100%', borderRadius:'10px'}}>Manager View</CompoundButton>
              </div>
            </div>
            <div className="ms-Grid-row">
              <div className="ms-Grid-col ms-sm12">
              <CompoundButton className="raisebtn" style={{backgroundColor:this.state.bgColorRaiseRequest, color:this.state.colorRaiseRequest,border:'1px solid #ddd', width:'100%',maxWidth:'100%', borderRadius:'10px'}} onClick={this.raiseRequestClick}>Raise a Request</CompoundButton>
              </div>
            </div>
          </div>
        }
         {/* Display raise request data filling operation */}
          {(this.state.count === 1) &&
            <div className="ms-Grid" dir="ltr">
            <h1>Please select the Department</h1>
              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-lg2 ms-sm12">
                  <Icon iconName="ChevronLeft" style={{fontSize:'80px'}} onClick={this.previousClick}></Icon>
                </div>
                <div className="ms-Grid-col ms-lg8 ms-sm12">
                  {/* <DefaultButton>Select Department</DefaultButton> */}
                  <Stack tokens={stackTokens}>
                         <Dropdown
                           placeholder="Select Department"
                          //  label="Select Department"
                           options={departmentOptions}
                           onChange={(e,selectedDept) => this.onChangeDeptHandle(selectedDept)}
                           //styles={dropdownStyles}
                           styles={{ dropdown: { width: 350 } }}
                           className={styles.dropdownStyle}
                         />
                    </Stack>
                </div>
                <div className="ms-Grid-col ms-lg2 ms-sm12">
                  <Icon iconName='ChevronRight' style={{fontSize:'80px'}} onClick={this.nextClick}></Icon>
                </div>
              </div>
            </div>                
              }

          {(this.state.count === 2) &&
            <div className="ms-Grid" dir="ltr">
            <h1>Please select the Department category</h1>
              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-lg2 ms-sm12">
                <Icon iconName="ChevronLeft" style={{fontSize:'80px'}} onClick={this.previousClick}></Icon>
                </div>
                <div className="ms-Grid-col ms-lg8 ms-sm12">
                  {/* <DefaultButton>Select Department</DefaultButton> */}
                  <Stack tokens={stackTokens}>
                     <Dropdown
                           placeholder="Select Department Category"
                          //  label="Select Category"
                           options={departmentCategoryOptions}
                           defaultSelectedKey={" "}
                           onChange={(e,selectedDeptCategory)=>this.onChangeDeptCategoryHandle(selectedDeptCategory)}
                           //styles={dropdownStyles}
                           styles={{ dropdown: { width: 350 } }}
                         />
                     </Stack>
                </div>
                <div className="ms-Grid-col ms-lg2 ms-sm12">
                <Icon iconName='ChevronRight' style={{fontSize:'80px'}} onClick={this.nextClick}></Icon>
                </div>
              </div>
            </div>       
          }
          {(this.state.count === 3) &&
            <div className="ms-Grid" dir="ltr">
            <h1>Please type your issue</h1>
              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-lg2 ms-sm12">
                <Icon iconName="ChevronLeft" style={{fontSize:'80px'}} onClick={this.previousClick}></Icon>
                </div>
                <div className="ms-Grid-col ms-lg8 ms-sm12">
                <TextField label="Type your issue" multiline rows={3}
                      //  onChange={e => this.setState({
                      //    requestDescription:e.currentTarget.value
                      //  })} 
                           onChange={(requestDescription)=>this.onChangeRequestDescriptionHandle(requestDescription)}
                        />
                </div>
                <div className="ms-Grid-col ms-lg2 ms-sm12">
                <Icon iconName='ChevronRight' style={{fontSize:'80px'}} onClick={this.nextClick}></Icon>
                </div>
              </div>
            </div>       
          }
          {(this.state.count === 4) &&
            <div className="ms-Grid" dir="ltr">
            <h1>Please add file if any</h1>
              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-lg2 ms-sm12">
                <Icon iconName="ChevronLeft" style={{fontSize:'80px'}} onClick={this.previousClick}></Icon>
                </div>
                <div className="ms-Grid-col ms-lg8 ms-sm12">
                 <input type="file"/>
                </div>
                <div className="ms-Grid-col ms-lg2 ms-sm12">
                <Icon iconName='ChevronRight' style={{fontSize:'80px'}} onClick={this.nextClickWithNotCompulsary}></Icon>
                </div>
              </div>
            </div>       
          }
          {(this.state.count === 5) &&
            <div className="ms-Grid" dir="ltr">
            <h1>Please add file if any</h1>
              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-lg6 ms-sm12">
                <Icon iconName="ChevronLeft" style={{fontSize:'80px'}} onClick={this.previousClick}></Icon>
                </div>
                <div className="ms-Grid-col ms-lg6 ms-sm12">
                  <DefaultButton style={{backgroundColor:this.state.bgColorRaiseRequest, color:this.state.colorRaiseRequest,border:'1px solid #ddd', top:'8px', bottom:'100px'}} onClick={()=>this.addEmployeeRequest(this.state.requestDescription, this.state.selectedDept,this.state.selectedDeptCategory,departmentFAQ_ArchiveTimeSpan)}>Submit</DefaultButton>
                </div>
              </div>
            </div>       
          }
          {/* My Issue page display operation */}

          {
            (this.state.myIssueUnlock === 1) &&
            <div>
              <DepartmentSelect issueDataList={issueData} groupType={this.props.groupType} description={this.props.description} loggedInUserEmail={this.props.loggedInUserEmail} loggedInUserName={this.props.loggedInUserName} spHttpClient={this.props.spHttpClient} webUrl={this.props.webUrl}/> 
            </div>

          }
      </div>
    );
  }
}
  