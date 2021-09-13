import * as React from 'react';
import styles from './DepartmentalRequest.module.scss';
import { IDepartmentalRequestProps } from './IDepartmentalRequestProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { DefaultButton, PrimaryButton, CompoundButton } from '@fluentui/react/lib/Button';
import {IDepartmentalRequestState} from './IDepartmentalRequestState';
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
import {IMyIssueList} from '../MyRequestedIssues/IMyRequestedIssuesProps';
import MyRequestedIssues from '../MyRequestedIssues/MyRequestedIssues';
import PeoplePickerTestExample from '../TestFolder/PeoplePickerTestExample'
import { MSGraphClient } from '@microsoft/sp-http';


import {
  PropertyPaneTextField,
  PropertyPaneCheckbox,
  PropertyPaneLabel,
  PropertyPaneLink,
  PropertyPaneSlider,
  PropertyPaneToggle,
  PropertyPaneDropdown
} from '@microsoft/sp-property-pane';
//import DepartmentSelect from '../MyRequestedIssues/MyRequestedIssues';
import DispatcherView from '../DispatcherView/DispatcherView';
import AssignedToView from '../AssignedToView/AssignedToView';
import ManagerView from '../ManagerView/ManagerView';
import ChartView from '../ChartView/ChartView';
// import { PeoplePickerTestExample } from '../TestFolder/PeoplePickerTestExample';
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
var loggedInUserEmail, loggedInUserId,issueData:IMyIssueList[],archiveData:IMyIssueList[];
var myIssueCount:number = 0;
var textbody,EmailSubject;
 
debugger;
export default class DepartmentalRequest extends React.Component<IDepartmentalRequestProps, IDepartmentalRequestState> {

  constructor(props:any){
    super(props);
    this.state = {
      count : 0,
      dataFilledCheck:0,
      myIssueUnlock:0,
      nextCount:0,
      initialRaisedCount:0,
      totalRaisedIssuesCount:0,
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
      dispatcherViewUnlock:0,
      assignedToViewUnlock:0,
      managerViewUnlock:0,
      archiveTimeSpan:0,
      fileAddition:null,
      managerCheckForManagerView:0
    }
    this.handleChange = this.handleChange.bind(this);
    this.onChangeDeptHandle = this.onChangeDeptHandle.bind(this);
    
  }

  componentDidMount(){
    this.loadDepartmentOptions();
    loggedInUserEmail = this.props.loggedInUserEmail;
    //this. getUserId (loggedInUserEmail);    
  }

  // public getUserId(loggedInUserEmail: string): Promise<number> {
  //   return pnp.sp.site.rootWeb.ensureUser(loggedInUserEmail).then(result => {
  //     loggedInUserId = result.data.Id   
  //     return result.data.Id;
  //   });  
  //   }

  private loadDepartmentOptions():void{
    
    const headers: HeadersInit = new Headers();
    // suppress metadata to minimize the amount of data loaded from SharePoint
    headers.append("accept", "application/json;odata.metadata=none");
    this.props.spHttpClient
      .get(`${this.props.webUrl}/_api/web/lists/getbytitle('Department')/items?$select=*,GroupName/Title,DepartmentGroup/Title,Manager/Title&$expand=GroupName,DepartmentGroup,Manager&$orderby=Title asc`,
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
    });
    this.checkManagerId();
    this.GetIssueArchiveSettings();
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

    checkManagerId():void{
    for(let i=0;i<departmentFAQ_deptList.length;++i){
      if(this.props.currentUserId === departmentFAQ_deptList[i].deptManager){
        this.setState({
          managerCheckForManagerView:1
        },()=>console.log('this.state.managerCheckForManagerView =' + this.state.managerCheckForManagerView));
        break;
      }
    }
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
      archiveTimeSpan: departmentFAQ_ArchiveTimeSpan
    })
      this.myIssue();
      this.archieveIssues();
    }
    else{
      this.myIssue();
      this.archieveIssues();
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

  myIssue(){
    var todaydt = new Date();
    var day = todaydt.getDate();
    var month = todaydt.getMonth();
    var year = todaydt.getFullYear();
  
    var curdate = day + "/" + month + "/" + year;
    var curDate:Date = new Date(year, month, day);
  
    //alert("In Load my request ("+departmentFAQ_ArchiveTimeSpan +") "+curDate);
    curDate.setDate(curDate.getDate() - departmentFAQ_ArchiveTimeSpan);
    console.log('curDate= ' + curDate);
    var dtFilter:Date  = new Date();
     dtFilter = curDate;
     console.log(dtFilter);
    var fday = dtFilter.getDate();
    var fmonth = dtFilter.getMonth() + 1;
    var fyear = dtFilter.getFullYear();
    var dateFilter = fyear + "-" + fmonth + "-" + fday + "T00:00:00.000Z";
  
  
    if(departmentFAQ_ArchiveTimeSpan>0){
      var quaryText = `/_api/web/lists/GetByTitle('EmployeeRequest')/items?&$filter=((Author eq ${this.props.currentUserId} ) and ((Status ne 'Completed') or ((Status eq 'Completed') and (Created ge datetime'${dateFilter}'))))&$orderby=ID desc`
    }
    else{
      var quaryText = `/_api/web/lists/GetByTitle('EmployeeRequest')/items?&$filter=Author eq ${this.props.currentUserId} &$orderby=ID desc`
    }
    const headers: HeadersInit = new Headers();
    // suppress metadata to minimize the amount of data loaded from SharePoint
    headers.append("accept", "application/json;odata.metadata=none");
    this.props.spHttpClient
      .get(`${this.props.webUrl}${quaryText}`,
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
           this.setState({
            initialRaisedCount: this.state.initialRaisedCount + 1
           })
           console.log("createdDateFormat= " + createdDateFormat);
           console.log("initialRaisedCount= " + this.state.initialRaisedCount);
  
          return {
            created:createdDateFormat,
            description:r.Description,
            category:r.Category,
            department:r.Department,
            assignedTo:r.AssignedTo,
            comment:r.Comment,
            status:r.Status,
            attachments:r.Attachments,
            test:r.ReAssignTo
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

  archieveIssues(){
    var todaydt = new Date();
    var day = todaydt.getDate();
    var month = todaydt.getMonth();
    var year = todaydt.getFullYear();
  
    var curdate = day + "/" + month + "/" + year;
    var curDate:Date = new Date(year, month, day);
  
    //alert("In Load my request ("+departmentFAQ_ArchiveTimeSpan +") "+curDate);
    curDate.setDate(curDate.getDate() - departmentFAQ_ArchiveTimeSpan);
    console.log('curDate= ' + curDate);
    var dtFilter:Date  = new Date();
     dtFilter = curDate;
     console.log(dtFilter);
    var fday = dtFilter.getDate();
    var fmonth = dtFilter.getMonth() + 1;
    var fyear = dtFilter.getFullYear();
    // var dateFilter = fyear + "-" + fmonth + "-" + fday + "T00:00:00.000Z";
    var dateFilter = fyear + "-" + fmonth + "-" + fday + "T00:00:00.000Z";

    // var newdateFilter = fmonth + "-" + fday + "-" + fyear + "T00:00:00.000Z";
    // var newDateFilter1 = new Date(dateFilter);
  
  
    if(departmentFAQ_ArchiveTimeSpan>0){
      var archiveQuaryText = `/_api/web/lists/GetByTitle('EmployeeRequest')/items?&$filter=Author eq ${this.props.currentUserId} and Status eq 'Completed' and Created lt datetime'${dateFilter}'&$orderby=ID desc&$top=10`
      
    
    const headers: HeadersInit = new Headers();
    // suppress metadata to minimize the amount of data loaded from SharePoint
    headers.append("accept", "application/json;odata.metadata=none");
    this.props.spHttpClient
      .get(`${this.props.webUrl}${archiveQuaryText}`,
      SPHttpClient.configurations.v1, {
        headers: headers
      })
      .then((res: SPHttpClientResponse): Promise<any> => {
        return res.json();
      })
      .then((res: any): void => {
        if (res.error) {
           this.setState({
             errorMessage: res.error.message,
              });
              archiveData = null;
          return;
        }
        if (res.value == 0) {
          this.setState({
            loading: false
          });
          return;
        }
  
        archiveData = res.value.map(r =>{
           let createdDateFormat = new Date(r.Created).toLocaleDateString();
           myIssueCount= myIssueCount + 1;
           this.setState({
            initialRaisedCount: this.state.initialRaisedCount + 1
           })
           console.log("createdDateFormat= " + createdDateFormat);
           console.log("initialRaisedCount= " + this.state.initialRaisedCount);
  
          return {
            created:createdDateFormat,
            description:r.Description,
            category:r.Category,
            department:r.Department,
            assignedTo:r.AssignedTo,
            comment:r.Comment,
            status:r.Status,
            attachments:r.Attachments,
            test:r.ReAssignTo
          }
        });
        console.log("myIssueCount= " + myIssueCount);
  
    if(archiveData.length>0){
    this.setState({
      loading:false,
    })
    }
  }, (error: any): void => {
    this.setState({
      errorMessage: error
    });
  })
  .catch((error: any): void => {
    this.setState({
      errorMessage: error
    });
    });

  }
  else{
    return
  }
  }
  
  handleChange(e:any) {
    console.log("Fruit Selected!!");
    this.setState({ selectedDept: e.target.defaultValue },()=>alert(
      "Selected Option = " + this.state.selectedDept
    ));
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
      },()=>console.log('this.state.requestDescription =' + this.state.requestDescription))
}

onFileAddHandle(fileAdd){
  this.setState({
    fileAddition: fileAdd
  })
}



  
 addEmployeeRequest(issueDescription, selectedDept, selectedDeptCategory,departmentFAQ_ArchiveTimeSpan,fileAddition){
   this.setState({
    count: 0,
    totalRaisedIssuesCount:this.state.totalRaisedIssuesCount + 1,
    initialRaisedCount:0
   });
 
   var selectedDeptGroup, selectedDeptManager, selectedDispatcherName;
   var selectedTitle:string = selectedDeptCategory + ' Request';
  var currentUserName = this.props.loggedInUserName;
  var currentUserEmail = this.props.loggedInUserEmail;
  var selectedFileAddOn = fileAddition;

  for(let i=0;i<departmentFAQ_deptList.length;++i){
    if(departmentFAQ_deptList[i].deptName === selectedDept){
      selectedDeptGroup = departmentFAQ_deptList[i].deptGroup;
      selectedDispatcherName = departmentFAQ_deptList[i].dispatcherName;
      selectedDeptManager = departmentFAQ_deptList[i].deptManager;
    }
  }

      //for email body
       textbody = `<h3>The request details are as below:</h3><br><p>Raised by: " ${this.props.loggedInUserName} " <br>Category: " ${selectedDeptCategory} " <br>Description: " ${issueDescription} "<br><br>Thank you</p>`;

      console.log('textbody = ' + textbody);
       EmailSubject =` ${this.props.loggedInUserName} raised ${selectedDeptCategory} request`;

      console.log('EmailSubject = ' + EmailSubject);


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
     'DepartmentManagerId': selectedDeptManager,
     'DepartmentGroup':selectedDeptGroup,
     'Attachments': selectedFileAddOn
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
          this.SendAnEmilUsingMSGraph(this.props.loggedInUserEmail,textbody,EmailSubject);
          this.myIssue();
        });
      });
   }
   
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

  managerViewClick=()=>{
    if(this.state.managerCheckForManagerView === 1){
    this.setState({
      managerViewUnlock: 1,
    bgColorRaiseRequest:"#ef8700",
    bgColorFollowers:"white",
    bgColorFollowing:"white",
    colorRaiseRequest:"white",
    colorFollowers:"black",
    colorFollowing:"black",
    })
    }
  }

  previousClick=()=>{
    this.setState({
      count:this.state.count - 1,
      dataFilledCheck:0
    })
  }

  onKeyDownPress=(e)=>{
    alert("Key press is working= " + e.key);
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

  dispatcherViewClick=()=>{
    this.setState({
      dispatcherViewUnlock: 1,
    })
  }

  assignedToViewClick=()=>{
    this.setState({
      assignedToViewUnlock:1
    })
  }
  

  private SendAnEmilUsingMSGraph(to,textBody,emailSubject): void {  
  
    //Check if TextField value is empty or not    
  
      //Create Body fpr Email  
      let emailPostBody: any = {  
        "message": {  
          "subject": emailSubject,  
          "body": {  
            "contentType": "HTML",  
            "content": textBody  
          },  
          "toRecipients": [  
            {  
              "emailAddress": {  
                "address": 'sourabhk@globalnestsolutions.com'  
              }  
            }  
          ],  
        }  
      };  
  
      //Send Email uisng MS Graph  
      this.props.msGraphClientFactory  
        .getClient()  
        .then((client: MSGraphClient): void => {  
          client  
            .api('/me/sendMail')  
            .post(emailPostBody, (error, response: any, rawResponse?: any) => {  
              //Set Error Message Bar for any error  
              if (error) {  
                // this.setState({  
                //   statusMessage: { isShowMessage: true, message: error.message, messageType: 1 }  
                // });  
              }  
               //Set Success Message Bar after Sending Email  
              else {  
                // this.setState({  
                //   statusMessage: { isShowMessage: true, message: "Email Sent using MS Graph", messageType: 4 }  
                // });  
              }  
            });  
        });  
      
    
  }  
  
  
  

  public render(): React.ReactElement<IDepartmentalRequestProps> {
    return (
      <div className={ styles.departmentalRequest }>
        {/* Main page display */}
        {(this.state.count === 0) && (this.state.myIssueUnlock === 0)&& (this.state.dispatcherViewUnlock === 0) && (this.state.assignedToViewUnlock === 0) && (this.state.managerViewUnlock === 0) &&
          <div className="ms-Grid" dir="ltr">
            <h1>Welcome to Departmental Request Facility!!</h1>
            <div className="ms-Grid-row">
              <div className="ms-Grid-col ms-lg4 ms-md4 ms-sm12">
                <CompoundButton style={{width:'100%',marginBottom:'15px',maxWidth:'100%', borderRadius:'10px', textAlign:'left'}} onClick={this.myIssueClick} >Requested Issues = {this.state.initialRaisedCount} </CompoundButton>
              </div>
              <div className="ms-Grid-col ms-lg4 ms-md4 ms-sm12">
                <CompoundButton style={{width:'100%',marginBottom:'15px',maxWidth:'100%', borderRadius:'10px'}} onClick={this.assignedToViewClick}>Assigned Issues</CompoundButton>
              </div>
              <div className="ms-Grid-col ms-lg4 ms-md4 ms-sm12">
                <CompoundButton style={{width:'100%',marginBottom:'15px',maxWidth:'100%', borderRadius:'10px'}} onClick={this.dispatcherViewClick}>Dispatcher View</CompoundButton>
              </div>
            </div>
            <div className="ms-Grid-row" style={{marginTop:'12px'}}>
              <div className="ms-Grid-col ms-lg6 ms-md6 ms-sm6">
              <CompoundButton className="raisebtn" style={{backgroundColor:this.state.bgColorRaiseRequest, color:this.state.colorRaiseRequest,border:'1px solid #ddd', width:'100%',maxWidth:'100%', borderRadius:'10px', marginBottom:'20px'}} onClick={this.raiseRequestClick}>Raise a Request</CompoundButton>
              </div>
              <div className="ms-Grid-col ms-lg6 ms-md6 ms-sm6">
              <CompoundButton style={{backgroundColor:this.state.bgColorRaiseRequest, color:this.state.colorRaiseRequest,border:'1px solid #ddd', width:'100%',maxWidth:'100%', borderRadius:'10px', marginBottom:'20px'}} onClick={this.managerViewClick}>Manager View</CompoundButton>
              </div>
            </div>
            {/* <div className="ms-Grid-row">
              <div className="ms-Grid-col ms-lg12 ms-md12 ms-sm12">
                <ChartView departmentFAQ_deptList={departmentFAQ_deptList} deptBelongingNames={[]} currentUserId={this.props.currentUserId} loggedInUserEmail={this.props.loggedInUserEmail} loggedInUserName={this.props.loggedInUserName} spHttpClient={this.props.spHttpClient} webUrl={this.props.webUrl} chartType={this.props.chartType} description={this.props.description} />
              </div>
            </div> */}
          </div>
        }
         {/* Display raise request data filling operation */}
          {(this.state.count === 1) &&
            <div className="ms-Grid" dir="ltr">
               <div className="ms-Grid-row" style={{marginBottom:'20px'}}>
                <div className="ms-Grid-col ms-lg12 ms-md12 ms-sm12" onKeyDown={(e)=>this.onKeyDownPress(e)} tabIndex={40}>
                  <Icon iconName="Home" style={{fontSize:'25px', cursor:'pointer'}} onClick={this.previousClick} ></Icon>
                </div>
              </div>
            <div style={{borderBottom:'1px solid #f1f1f1', marginBottom:'20px'}}>
            <h2>Select the Department</h2>
            </div>           
                <div className="ms-Grid-row" style={{marginBottom:'20px'}}>
                 <div className="ms-Grid-col ms-lg8 ms-md8 ms-sm8">
                  {/* <DefaultButton>Select Department</DefaultButton> */}
                  <Stack tokens={stackTokens}>
                         <Dropdown
                           placeholder="Select Department"
                          //  label="Select Department"
                           options={departmentOptions}
                           onChange={(e,selectedDept) => this.onChangeDeptHandle(selectedDept)}
                           //styles={dropdownStyles}
                           styles={{ dropdown: { width:'100%',height:'34px' } }}
                           className={styles.dropdownStyle}
                         />
                    </Stack>
                 </div>
                </div>
              
              <div style={{borderBottom:'1px solid #f1f1f1', marginBottom:'20px'}}>
            <h2>Select the Department category</h2>
            </div>
              <div className="ms-Grid-row" style={{marginBottom:'20px'}}>
                <div className="ms-Grid-col ms-lg8 ms-sm8">
                  <Stack tokens={stackTokens}>
                     <Dropdown
                           placeholder="Select Department Category"
                          //  label="Select Category"
                           options={departmentCategoryOptions}
                           defaultSelectedKey={" "}
                           onChange={(e,selectedDeptCategory)=>this.onChangeDeptCategoryHandle(selectedDeptCategory)}
                           //styles={dropdownStyles}
                           styles={{ dropdown: { width: '100%' } }}
                         />
                     </Stack>
                </div>
              </div>
              <div className="ms-Grid-row">
               <div style={{borderBottom:'1px solid #f1f1f1', marginBottom:'20px'}}>
                <h2>Type your issue</h2>
               </div>
             </div>
             <div className="ms-Grid-row">
             <div className="ms-Grid-col ms-lg8 ms-sm8">
                <TextField label="Type your issue" multiline rows={3}
                      //  onChange={e => this.setState({
                      //    requestDescription:e.currentTarget.value
                      //  })} 
                           onChange={(requestDescription)=>this.onChangeRequestDescriptionHandle(requestDescription)}
                        />
              </div>
             </div>
             <div className="ms-Grid-row">
             <div style={{borderBottom:'1px solid #f1f1f1', marginBottom:'20px'}}>
               <h2>Add file if any</h2>
              </div>
             </div>
             <div className="ms-Grid-row">
             <div className="ms-Grid-col ms-lg8 ms-sm8">
                 <input type="file" style={{width:'100%',border:'1px solid #ddd',padding:'10px  10px' }}
                 onChange={(e)=> this.onFileAddHandle(e.target.files) }
                 />
              </div>
             </div>
             <div className="ms-Grid-row">
             <div className="ms-Grid-col ms-lg2 ms-sm2">
                <DefaultButton style={{backgroundColor:this.state.bgColorRaiseRequest, color:this.state.colorRaiseRequest,border:'1px solid #ddd', top:'8px', bottom:'100px',float:'right'}} onClick={()=>this.addEmployeeRequest(this.state.requestDescription, this.state.selectedDept,this.state.selectedDeptCategory,departmentFAQ_ArchiveTimeSpan,this.state.fileAddition)}>Submit</DefaultButton>
              </div>
             </div>
            </div>                
              }

          {(this.state.count === 2) &&
            <div className="ms-Grid" dir="ltr">
            <div style={{borderBottom:'1px solid #f1f1f1', marginBottom:'20px'}}>
            <h1>Please select the Department category</h1>
            </div>
              <div className="ms-Grid-row" style={{marginBottom:'20px'}}>
                <div className="ms-Grid-col ms-lg2 ms-sm2">
                <Icon iconName="ChevronLeft" style={{fontSize:'20px',cursor:'pointer'}} onClick={this.previousClick}></Icon>
                </div>
                <div className="ms-Grid-col ms-lg8 ms-sm8">
                  {/* <DefaultButton>Select Department</DefaultButton> */}
                  <Stack tokens={stackTokens}>
                     <Dropdown
                           placeholder="Select Department Category"
                          //  label="Select Category"
                           options={departmentCategoryOptions}
                           defaultSelectedKey={" "}
                           onChange={(e,selectedDeptCategory)=>this.onChangeDeptCategoryHandle(selectedDeptCategory)}
                           //styles={dropdownStyles}
                           styles={{ dropdown: { width: '100%' } }}
                         />
                     </Stack>
                </div>
                <div className="ms-Grid-col ms-lg2 ms-sm2">
                <Icon iconName='ChevronRight' style={{fontSize:'20px',cursor:'pointer', float:'right'}} onClick={this.nextClick}></Icon>
                </div>
              </div>
            </div>       
          }
          {(this.state.count === 3) &&
            <div className="ms-Grid" dir="ltr">
            <div style={{borderBottom:'1px solid #f1f1f1', marginBottom:'20px'}}>
            <h1>Please type your issue</h1>
            </div>
              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-lg2 ms-sm2">
                <Icon iconName="ChevronLeft" style={{fontSize:'20px',cursor:'pointer'}} onClick={this.previousClick}></Icon>
                </div>
                <div className="ms-Grid-col ms-lg8 ms-sm8">
                <TextField label="Type your issue" multiline rows={3}
                      //  onChange={e => this.setState({
                      //    requestDescription:e.currentTarget.value
                      //  })} 
                           onChange={(requestDescription)=>this.onChangeRequestDescriptionHandle(requestDescription)}
                        />
                </div>
                <div className="ms-Grid-col ms-lg2 ms-sm2">
                <Icon iconName='ChevronRight' style={{fontSize:'20px',cursor:'pointer', float:'right'}} onClick={this.nextClick}></Icon>
                </div>
              </div>
            </div>       
          }
          {(this.state.count === 4) &&
            <div className="ms-Grid" dir="ltr">
            <div style={{borderBottom:'1px solid #f1f1f1', marginBottom:'20px'}}>
            <h1>Please add file if any</h1>
            </div>
              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-lg2 ms-sm2">
                <Icon iconName="ChevronLeft" style={{fontSize:'20px',cursor:'pointer'}} onClick={this.previousClick}></Icon>
                </div>
                <div className="ms-Grid-col ms-lg8 ms-sm8">
                 <input type="file" style={{width:'100%',border:'1px solid #ddd',padding:'10px  10px' }}/>
                </div>
                <div className="ms-Grid-col ms-lg2 ms-sm2">
                <DefaultButton style={{backgroundColor:this.state.bgColorRaiseRequest, color:this.state.colorRaiseRequest,border:'1px solid #ddd', top:'8px', bottom:'100px',float:'right'}} onClick={()=>this.addEmployeeRequest(this.state.requestDescription, this.state.selectedDept,this.state.selectedDeptCategory,departmentFAQ_ArchiveTimeSpan,this.state.fileAddition)}>Submit</DefaultButton>
                </div>
              </div>
            </div>       
          }
          {(this.state.count === 5) &&
            <div className="ms-Grid" dir="ltr">
            <h1>Please add file if any</h1>
              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-lg6 ms-sm12">
                <Icon iconName="ChevronLeft" style={{fontSize:'20px',cursor:'pointer'}} onClick={this.previousClick}></Icon>
                </div>
                <div className="ms-Grid-col ms-lg6 ms-sm12">
                  <DefaultButton style={{backgroundColor:this.state.bgColorRaiseRequest, color:this.state.colorRaiseRequest,border:'1px solid #ddd', top:'8px', bottom:'100px'}} onClick={()=>this.addEmployeeRequest(this.state.requestDescription, this.state.selectedDept,this.state.selectedDeptCategory,departmentFAQ_ArchiveTimeSpan,this.state.fileAddition)}>Submit</DefaultButton>
                </div>
              </div>
            </div>       
          }
          {/* My Issue page display operation */}

          {
            (this.state.myIssueUnlock === 1) &&
              <MyRequestedIssues msGraphClientFactory={this.props.msGraphClientFactory} issueDataList={issueData} archiveIssueDataList={archiveData} emailType={this.props.emailType} description={this.props.description} loggedInUserEmail={this.props.loggedInUserEmail} loggedInUserName={this.props.loggedInUserName} spHttpClient={this.props.spHttpClient} webUrl={this.props.webUrl} currentUserId={this.props.currentUserId}/>
          }
          {
            (this.state.dispatcherViewUnlock === 1) &&
            <PeoplePickerTestExample msGraphClientFactory={this.props.msGraphClientFactory} deptBelongingNames={[]} currentUserId={this.props.currentUserId} loggedInUserEmail={this.props.loggedInUserEmail} loggedInUserName={this.props.loggedInUserName} spHttpClient={this.props.spHttpClient} webUrl={this.props.webUrl} emailType={this.props.emailType} description={this.props.description} />
          }
          {
            (this.state.assignedToViewUnlock === 1) &&
            <AssignedToView msGraphClientFactory={this.props.msGraphClientFactory} deptBelongingNames={[]} currentUserId={this.props.currentUserId} loggedInUserEmail={this.props.loggedInUserEmail} loggedInUserName={this.props.loggedInUserName} spHttpClient={this.props.spHttpClient} webUrl={this.props.webUrl} emailType={this.props.emailType} description={this.props.description}/>
          }
          {
            (this.state.managerViewUnlock === 1) && (this.state.managerCheckForManagerView === 1) &&
            <ManagerView msGraphClientFactory={this.props.msGraphClientFactory} deptAllDetails={departmentFAQ_deptList} deptBelongingNames={[]} currentUserId={this.props.currentUserId} loggedInUserEmail={this.props.loggedInUserEmail} loggedInUserName={this.props.loggedInUserName} spHttpClient={this.props.spHttpClient} webUrl={this.props.webUrl} emailType={this.props.emailType} description={this.props.description}/>
          }
      </div>
    );
  }
}
  