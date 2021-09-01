import * as React from 'react';
import {IPeopleProps} from './IPeopleProps';
import {IPeopleState} from './IPeopleState';
import { SPHttpClient, ISPHttpClientOptions, SPHttpClientResponse } from '@microsoft/sp-http';
import { escape } from '@microsoft/sp-lodash-subset';
import  PeoplePickerTestExample  from './PeoplePickerTestExample';



export interface Props {
    
}
 
export interface State {
    
}
export interface IDepartmentList {
    deptName:string,
    deptGroup:string,
    deptManager:number,
    dispatcherName:string
}

var departmentFAQ_deptList: IDepartmentList[] = Array();
var pickerGroupNames = [];
var departmentOptions = [];

var grpName:string = 'IT Support';
 debugger;
export default class PeoplePicker extends React.Component<IPeopleProps, IPeopleState> {

    constructor(props){
        super(props);
        this.state = {
            loading:false,
            errorMessage:'',
            mostRecentlyUsed:[],
            peopleList:[],
            loadPeoplePicker:0,
            newPeoplePickerUser:'',
            deptDetails:[],
            indexSelect:0,
            homeButton:0,
            idSelect:0,
            deptListDropDown:[],
            passAssignedToUser:{
              id:0,
              text:''
            },
            deleteSelectedTicket:''
        };
      }
      
      componentDidMount(){        
        this.loadDepartmentOptions();
    }

    // this.loadDepartmentOptions();

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

            pickerGroupNames = res.value.map((r,index)=>{
              return{
                text:r.Title,
              }
            })
          
            // departmentFAQ_deptList = res.value.map((r,index)=>{
            //   return {
            //     deptName:r.Title,
            //     deptGroup:r.DepartmentGroup.Title,
            //     deptManager:r.ManagerId,
            //     dispatcherName:r.GroupName.Title
            //   };
            // });
      
      
      //  departmentOptions =  res.value.map((r,index) => {
      //   return {
      //     key:index,
      //     text:r.Title,
      //   };
      // });
        // debugger;
        if(pickerGroupNames.length>0){
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


       public render(): React.ReactElement<IPeopleProps> {
        return (
        <div>
            <h1>People picker</h1>
            {/* <PeoplePickerTestExample deptBelongingNames={pickerGroupNames} currentUserId={this.props.currentUserId} loggedInUserEmail={this.props.loggedInUserEmail} loggedInUserName={this.props.loggedInUserName} spHttpClient={this.props.spHttpClient} webUrl={this.props.webUrl} /> */}

        </div>  );
    }
}
 
