import * as React from 'react';
import styles from './AssignedToView.module.scss';
import { Checkbox } from '@fluentui/react/lib/Checkbox';
import { IPersonaProps } from '@fluentui/react/lib/Persona';
import { IBasePickerSuggestionsProps, IPeoplePickerProps, NormalPeoplePicker, ValidationState } from '@fluentui/react/lib/Pickers';
//import { people, mru } from '@fluentui/example-data';
import DepartmentalRequest from '../DepartmentalRequest/DepartmentalRequest'
import { IAssignState } from './IAssignState';
import { IAssignProps } from './IAssignProps';
import { SPHttpClient, ISPHttpClientOptions, SPHttpClientResponse } from '@microsoft/sp-http';
import {IDepartmentList, IDispacherList} from '../DepartmentalRequest/IDepartmentList'
import { DefaultButton, PrimaryButton, CompoundButton } from '@fluentui/react/lib/Button';
import 'office-ui-fabric-react/dist/css/fabric.css';
import { IconButton } from '@fluentui/react/lib/Button';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
initializeIcons();
import { Icon } from '@fluentui/react/lib/Icon';
import { Dropdown, IDropdown, IDropdownOption, optionProperties, TextField } from 'office-ui-fabric-react';
import { Item } from '@pnp/sp/items';
import { result } from 'lodash';
import NoDataDispatcherView from '../NoDataDispatcherView/NoDataDispatcherView';
import { Stack, IStackProps, IStackStyles } from '@fluentui/react/lib/Stack';
import AllAssignedToView from '../AllAssignedToView/AllAssignedToView';

debugger;
export const people: (IPersonaProps)[] = [];

export var mru:(IPersonaProps)[]=[];

var grpName:string = 'IT Support';
var pickerGroupNames:(IPersonaProps)[]=[];

const stackStyles: Partial<IStackStyles> = { root: { width: 169 } };

  export default class AssignedToView extends React.Component<IAssignProps, IAssignState> {

 
 constructor(props){
   super(props)
   this.state = {
    mostRecentlyUsed:[],
    peopleList:[],
    ticketCount:0,
    newPeoplePickerUser:'',
    loading:false,
    errorMessage:'',
    deptDetails:[],
    indexSelect:0,
    homeButton:0,
    idSelect:0,
    deptListDropDown:[],
    passAssignedToUser:{
      id:0,
      text:''
    },
    deleteSelectedTicket:'',
    statusOptions:[],
    statusCompletedCheck:0,
    assignedIssuesButton:0,
    allIssuesButton:0,
    allDetails:[],
   }
  
 }

  componentDidMount(){
    // this.loadDepartmentOptions();
    this.loadAssignToListInfo();
    this.allAssignToListInfo();
      // this.testPart();
  }
//TODO: REMOVE THIS METHOD AFTER TSTING
  private loadDepartmentOptions():void{
    const headers: HeadersInit = new Headers();
    // suppress metadata to minimize the amount of data loaded from SharePoint
    headers.append("accept", "application/json;odata.metadata=none");
    this.props.spHttpClient
      .get(`${this.props.webUrl}/_api/web/sitegroups/GetByName('${grpName}')/Users?`,
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

        pickerGroupNames = res.value.map((r,index)=>{
          return{
            text:r.Title,
            id:r.Id
          }
        })
  
    if(pickerGroupNames.length>0){
    this.setState({
      loading:false,
    })   
    this.testPart();
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

   private loadDepartmentOptionsByGroupName(groupName):Promise<IDropdownOption[]>{
    const headers: HeadersInit = new Headers();
    headers.append("accept", "application/json;odata.metadata=none");
    return this.props.spHttpClient
      .get(`${this.props.webUrl}/_api/web/sitegroups/GetByName('${groupName}')/Users?`,
      SPHttpClient.configurations.v1, {
        headers: headers
      })
      .then((res: SPHttpClientResponse): Promise<any> => {
        return res.json();
      })
      .then((res: any) => {
        var groupUser:IDropdownOption[]=res.value.map((r,index)=>{
          return{
            text:r.Title,
            id:r.Id
          }
        })
      return Promise.resolve(groupUser);
  }) 
  
  //  return pickerGroupNames;
   }





   private loadAssignToListInfo():void{
    const headers: HeadersInit = new Headers();
    // suppress metadata to minimize the amount of data loaded from SharePoint
    headers.append("accept", "application/json;odata.metadata=none");
    this.props.spHttpClient
      .get(`${this.props.webUrl}/_api/web/lists/getbytitle('EmployeeRequest')/items?$select=*,Author/Title,ReAssignTo/Title,AttachmentFiles&$expand=Author,ReAssignTo,AttachmentFiles&$filter=Status eq 'In Process' and ReAssignToId eq ${this.props.currentUserId}&$orderby=ID desc`,
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
        let createdDateFormat = new Date('').toLocaleDateString();

        // deptDetails = res.value.map((r,index)=>{
        //   return{
        //     supportDeptName:r.DepartmentGroup,
        //     raisedBy:r.AuthorId,
        //     issueDate:r.Created,
        //     description:r.Description,
        //     category:r.Category,
        //     department:r.Department,
        //     status:r.Status,
        //     dispatcherDeptName:r.AssignedTo,
        //     reAssignedTo:r.ReAssignTo
        //   }
        // })
        this.setState({
          ticketCount:res.value.length,
          deptDetails:res.value.map((r,index)=>{
            return{
              ticketNumber:`INC_${r.Department}_000${r.ID}`,
              supportDeptName:r.DepartmentGroup,
              raisedBy:r.Author.Title,
              issueDate:r.Created,
              description:r.Description,
              category:r.Category,
              department:r.Department,
              status:r.Status,
              dispatcherDeptName:r.AssignedTo,
              reAssignedTo:r.ReAssignTo,
              dataId:r.ID
            }
          }) 
        })
        console.log("deptDetails[0].reAssignedTo.text = " + this.state.deptDetails[0].reAssignedTo.Title);
  
    if(this.state.deptDetails.length>0){
    this.setState({
      loading:false,
    })   
    this.testPart();
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

   private allAssignToListInfo():void{
    const headers: HeadersInit = new Headers();
    // suppress metadata to minimize the amount of data loaded from SharePoint
    headers.append("accept", "application/json;odata.metadata=none");
    this.props.spHttpClient
      .get(`${this.props.webUrl}/_api/web/lists/getbytitle('EmployeeRequest')/items?$select=*,Author/Title,ReAssignTo/Title,AttachmentFiles&$expand=Author,ReAssignTo,AttachmentFiles&$filter=ReAssignToId eq ${this.props.currentUserId}&$orderby=ID desc`,
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
        let createdDateFormat = new Date('').toLocaleDateString();

        // deptDetails = res.value.map((r,index)=>{
        //   return{
        //     supportDeptName:r.DepartmentGroup,
        //     raisedBy:r.AuthorId,
        //     issueDate:r.Created,
        //     description:r.Description,
        //     category:r.Category,
        //     department:r.Department,
        //     status:r.Status,
        //     dispatcherDeptName:r.AssignedTo,
        //     reAssignedTo:r.ReAssignTo
        //   }
        // })
        this.setState({
          // ticketCount:res.value.length,
          allDetails:res.value.map((r,index)=>{
            return{
              ticketNumber:`INC_${r.Department}_000${r.ID}`,
              supportDeptName:r.DepartmentGroup,
              raisedBy:r.Author.Title,
              issueDate:r.Created,
              description:r.Description,
              category:r.Category,
              department:r.Department,
              status:r.Status,
              dispatcherDeptName:r.AssignedTo,
              reAssignedTo:r.ReAssignTo,
              dataId:r.ID
            }
          }) 
        })
        console.log("allDetails[0].reAssignedTo.text = " + this.state.allDetails[0].reAssignedTo.Title);
  
    if(this.state.allDetails.length>0){
    this.setState({
      loading:false,
    })   
    this.testPart();
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

   private loadNewGrpName(val,indexId){
     grpName = val;
     console.log("grpName = " +  val);
     console.log("index = " +  indexId);
     this.setState({
      //  loadPeoplePicker: 1,
       idSelect:indexId

      //  homeButton:1
     })
     this.loadDepartmentOptions();
    console.log("object = " + this.state.deptDetails[indexId].reAssignedTo);
   }

 private testPart():void{
    // people1 = pickerGroupNames;
      //  people1 = people1;
     mru = pickerGroupNames.slice(0, 5);
    
      this.setState({
        peopleList:pickerGroupNames,
        mostRecentlyUsed:mru,
      },()=>console.log("peopleList= " + this.state.peopleList))
      console.log("object= " + this.state.mostRecentlyUsed);
  };

  onBackButtonClick(){
      this.setState({
        // loadPeoplePicker:0,
        homeButton:0
      })  
  }

   onSubmitDropDownHandle(newPeoplePicker:any,idRequest:number,assignedToUser,ticketNumberCheck){
  //  await this.setState({
  //     newPeoplePickerUser: newPeoplePicker[0].text
  //     //loadPeoplePicker:0
  //       },()=> this.addReAssignedToData(this.state.newPeoplePickerUser,idRequest))
        if(this.state.deleteSelectedTicket === ticketNumberCheck){
          if(assignedToUser.text != ''){
            this.addReAssignedToData(assignedToUser,idRequest);
          }
          if(assignedToUser.text === '' && (this.state.statusCompletedCheck === 2) ){
            this.loadCompletedWithStatusUpdate(idRequest)
          }

      } 
  }

  addReAssignedToData(newReAssignedToUser:any,idRequest:number){
      console.log("newReAssignedToUser = " + newReAssignedToUser + idRequest);
      console.log("newReAssignedToUser = " + newReAssignedToUser);

      const headers: HeadersInit = new Headers();
      // suppress metadata to minimize the amount of data loaded from SharePoint
      headers.append("accept", "application/json;odata.metadata=none");
      this.props.spHttpClient
        .get(`${this.props.webUrl}/_api/web/lists/getbytitle('EmployeeRequest')/items('${idRequest}')?$select=*,ReAssignTo/Id&$expand=ReAssignTo`,
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

          const spOpts: string = JSON.stringify({
            'Status': "In Process",
            'ReAssignToId': newReAssignedToUser.id
                // 'Comment': 'Comment is working'
                // OnOffBoardTask:1
          })
      
          this.props.spHttpClient.post(`${this.props.webUrl}/_api/web/lists/GetByTitle('EmployeeRequest')/items(${res.Id})`, SPHttpClient.configurations.v1, 
          {
            headers: {  
              'Accept': 'application/json;odata=nometadata',  
              'Content-type': 'application/json;odata=nometadata',  
              'odata-version': '',  
              'IF-MATCH': '*',  
              'X-HTTP-Method': 'MERGE',
              // "X-RequestDigest": $("#__REQUESTDIGEST").val()
            },  
            body:spOpts
          })
              .then((response: SPHttpClientResponse) => {
                // Access properties of the response object. 
                console.log(`Status code: ${response.status}`);
                console.log(`Status text: ${response.statusText}`);
                
                //response.json() returns a promise so you get access to the json in the resolve callback.

              })
                .then((responseJSON: any) => {
                  var items = this.state.deptDetails.filter(item=> item.dataId !==idRequest);
                  this.setState({
                    deptDetails:items,
                    deptListDropDown:[],
                    ticketCount: this.state.ticketCount - 1,
                    passAssignedToUser:{
                      id:null,
                      text:''
                    },
                    statusCompletedCheck:0,
                    statusOptions:[]
                  })
                  // console.log(responseJSON);
                  // this.myIssue();
                });


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

  loadCompletedWithStatusUpdate(idRequest:number){
    console.log("newReAssignedToUser =  " + idRequest);
    const headers: HeadersInit = new Headers();
    // suppress metadata to minimize the amount of data loaded from SharePoint
    headers.append("accept", "application/json;odata.metadata=none");
    this.props.spHttpClient
      .get(`${this.props.webUrl}/_api/web/lists/getbytitle('EmployeeRequest')/items('${idRequest}')?$select=*,ReAssignTo/Id&$expand=ReAssignTo`,
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

        const spOpts: string = JSON.stringify({
          'Status': "Completed",
          // 'ReAssignToId': newReAssignedToUser.id
              // 'Comment': 'Comment is working'
              // OnOffBoardTask:1
        })
    
        this.props.spHttpClient.post(`${this.props.webUrl}/_api/web/lists/GetByTitle('EmployeeRequest')/items(${res.Id})`, SPHttpClient.configurations.v1, 
        {
          headers: {  
            'Accept': 'application/json;odata=nometadata',  
            'Content-type': 'application/json;odata=nometadata',  
            'odata-version': '',  
            'IF-MATCH': '*',  
            'X-HTTP-Method': 'MERGE',
            // "X-RequestDigest": $("#__REQUESTDIGEST").val()
          },  
          body:spOpts
        })
            .then((response: SPHttpClientResponse) => {
              // Access properties of the response object. 
              console.log(`Status code: ${response.status}`);
              console.log(`Status text: ${response.statusText}`);
              
              //response.json() returns a promise so you get access to the json in the resolve callback.

            })
              .then((responseJSON: any) => {
                var items = this.state.deptDetails.filter(item=> item.dataId !==idRequest);
                this.setState({
                  deptDetails:items,
                  deptListDropDown:[],
                  ticketCount: this.state.ticketCount - 1,
                  passAssignedToUser:{
                    id:null,
                    text:''
                  },
                  statusCompletedCheck:0,
                  statusOptions:[]
                })
                // console.log(responseJSON);
                // this.myIssue();
              });


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


  getUserByDept(control,reAssignTo,department,idNumber){
    grpName= department;
    // this.loadDepartmentOptions();
    console.log("reAssignTo = " + reAssignTo);
    if(this.state.statusCompletedCheck === 1) {
    this.loadDepartmentOptionsByGroupName(department)
    .then(
      data=>{
          console.log(data);
          this.setState({
            deptListDropDown:data,
            idSelect:idNumber
          },()=>console.log(this.state.deptListDropDown[0].id))
      }
    )
  }
  else
  {
    this.setState({
      deptListDropDown:[]
    })
  }
  
  }

  loadStatusList(){
    this.setState({
      statusOptions:[
        {key:1, text:'In Process'},
        {key:2, text:'Completed'},
      ]
    })
  }

  onStatusChangeHandle(selectedStatus,ticketNumber,department,idNumber){
        console.log(selectedStatus,ticketNumber);
        if(selectedStatus.text === 'Completed'){
          this.setState({
            deptListDropDown:[],
            statusCompletedCheck:2,
            deleteSelectedTicket:ticketNumber,
            passAssignedToUser:{
              id:null,
              text:''
            }
          })
        }
        if(selectedStatus.text === 'In Process'){
          this.loadDepartmentOptionsByGroupName(department)
          .then(
            data=>{
              this.setState({
                deptListDropDown:data,
                idSelect:idNumber,
                statusCompletedCheck:1,
                deleteSelectedTicket:ticketNumber
              })
            }
          )
        }
  }


  onSubmitHandle(){
    this.setState({
      // loadPeoplePicker:0
    })
  }

  homeButtonClick(){
    this.setState({
      homeButton:1,
    })
  }

  assignedIssuesButton(){
      this.setState({
        assignedIssuesButton:1,
        allIssuesButton:0
      })
  }

  allAssignedIssuesButton(){
    this.setState({
      allIssuesButton:1,
      assignedIssuesButton:0
    });
    // this.allAssignToListInfo();
  }

  onUserSelect(userName,selectedName, ticketNumber){
    this.setState({
      passAssignedToUser:selectedName,
      deleteSelectedTicket:ticketNumber
    },()=> console.log(this.state.passAssignedToUser.id))
    console.log(userName,selectedName);

  }

  public render(): React.ReactElement<IAssignProps> {
  return (
    <div className={styles.assignedToView}>
      {(this.state.homeButton === 0) && (this.state.ticketCount > 0) &&
      <div className="ms-Grid">
        <div className="ms-Grid-row">
          <div className="ms-Grid-col ms-lg4 ms-sm4">
             <Icon iconName='Home' style={{fontSize:'25px', cursor:'pointer'}} onClick={()=>this.homeButtonClick()} ></Icon>
          </div>
          <div className="ms-Grid-col ms-lg4 ms-sm4">
             <Icon iconName='Assign' style={{fontSize:'25px', cursor:'pointer'}} onClick={()=>this.assignedIssuesButton()} ></Icon>
          </div>
          <div className="ms-Grid-col ms-lg4 ms-sm4">
             <Icon iconName='ViewAll' style={{fontSize:'25px', cursor:'pointer'}} onClick={()=>this.allAssignedIssuesButton()} ></Icon>
          </div>
        </div>
      { (this.state.assignedIssuesButton === 1) && (this.state.allIssuesButton === 0) &&
      <div className="ms-Grid-row">
      <div className="ms-Grid-col ms-lg12 ms-sm12">
      <div style={{overflowX:'auto'}}>
      <table className={styles.tableSet} >
          <thead>
            <tr>
              <th>Ticket Number</th>
              <th>Raised By</th>
              <th>Issue Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Comment</th>
              <th>Status</th>
              <th>ReAssign To</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {
             this.state.deptDetails.map((res,index)=>{
             var issuedDate = new Date(res.issueDate).toLocaleDateString();
                return(
                  <tr
                  //  onClick={()=>this.loadNewGrpName(res.supportDeptName,res.dataId)} 
                  //  key={index}
                   >
                    <td>{res.ticketNumber}</td>
                    <td>{res.raisedBy}</td>
                    <td>{issuedDate}</td>
                    <td>{res.description}</td>
                    <td>{res.category}</td>
                    <td>
                    <Stack horizontal styles={stackStyles}>
                      <TextField multiline rows={3}
                        
                      />
                    </Stack>
                    </td>
                    <td>
                      <Dropdown
                        placeholder='Select option'
                        options={this.state.statusOptions}
                         defaultSelectedKey={" "}
                        onClick={()=>this.loadStatusList()}
                        onChange={(e,selectedStatusOption)=>this.onStatusChangeHandle(selectedStatusOption,res.ticketNumber,res.supportDeptName,res.dataId)}
                      >
                      </Dropdown>
                    </td>
                    <td>
                      <Dropdown
                       id={res.ticketNumber + '_dropDown'} 
                       placeholder='Select option'
                       defaultSelectedKey={" "}
                      onClick={(e,)=>this.getUserByDept(res.ticketNumber + '_dropDown',this,res.supportDeptName,res.dataId)} 
                      options={this.state.deptListDropDown}
                      onChange={(e,selectedName)=>this.onUserSelect(e,selectedName,res.ticketNumber)}>
                      </Dropdown>
                    </td>
                    <td>
                    <Icon iconName="Save" style={{fontSize:'20px', cursor:'pointer'}} onClick={(e)=>this.onSubmitDropDownHandle(e,res.dataId,this.state.passAssignedToUser,res.ticketNumber)}></Icon>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
          </table>
         </div>
        </div>
      </div> 
      }
      {
        (this.state.allIssuesButton === 1) && (this.state.assignedIssuesButton === 0) &&

        <AllAssignedToView allDetailsProp={this.state.allDetails} 
          groupType={this.props.groupType} description={this.props.description} loggedInUserEmail={this.props.loggedInUserEmail} loggedInUserName={this.props.loggedInUserName} spHttpClient={this.props.spHttpClient} webUrl={this.props.webUrl}  currentUserId={this.props.currentUserId} deptBelongingNames={[]}/>
         }
         {
      //         <div className="ms-Grid-row">
      //         <div className="ms-Grid-col ms-lg12 ms-sm12">
      //         <div style={{overflowX:'auto'}}>
      //         <table className={styles.tableSet} >
      //             <thead>
      //               <tr>
      //                 <th>Ticket Number</th>
      //                 <th>Raised By</th>
      //                 <th>Issue Date</th>
      //                 <th>Description</th>
      //                 <th>Category</th>
      //                 <th>Status</th>
      //                 <th>ReAssign To</th>
      //               </tr>
      //             </thead>
      //             <tbody>
      //               {
      //                this.state.allDetails.map((res,index)=>{
      //                var issuedDate = new Date(res.issueDate).toLocaleDateString();
      //                   return(
      //                     <tr>
      //                       <td>{res.ticketNumber}</td>
      //                       <td>{res.raisedBy}</td>
      //                       <td>{issuedDate}</td>
      //                       <td>{res.description}</td>
      //                       <td>{res.category}</td>
      //                       <td>{res.status}</td>
      //                       <td>{res.reAssignedTo}</td>
      //                     </tr>
      //                   )
      //                 })
      //               }
      //             </tbody>
      //             </table>
      //            </div>
      //           </div>
      //         </div> 
      }
    </div>
  }
  {
    (this.state.ticketCount === 0) && (this.state.homeButton === 0) &&
    <div className="ms-Grid">
       <div className="ms-Grid-row">
          <div className="ms-Grid-col ms-lg12">
             <Icon iconName='Home' style={{fontSize:'25px', cursor:'pointer'}} onClick={()=>this.homeButtonClick()} ></Icon>
          </div>
        </div>
    <div className="ms-Grid-row">
      <div className="ms-Grid-col ms-lg12">
        <h2>Hurry!! no tickets left</h2>
        <Icon iconName="Emoji2" style={{fontSize:'60px'}} />
      </div>
    </div>  
  </div>
  }

  {(this.state.homeButton === 1) &&
              <DepartmentalRequest groupType={this.props.groupType} description={this.props.description} loggedInUserEmail={this.props.loggedInUserEmail} loggedInUserName={this.props.loggedInUserName} spHttpClient={this.props.spHttpClient} webUrl={this.props.webUrl}  currentUserId={this.props.currentUserId}/>
  }
    </div>
  );
}
}

