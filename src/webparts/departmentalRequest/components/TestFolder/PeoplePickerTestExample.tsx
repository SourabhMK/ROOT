import * as React from 'react';
import styles from './PeoplePickerTestExample.module.scss';
import { Checkbox } from '@fluentui/react/lib/Checkbox';
import { IPersonaProps } from '@fluentui/react/lib/Persona';
import { IBasePickerSuggestionsProps, IPeoplePickerProps, NormalPeoplePicker, ValidationState } from '@fluentui/react/lib/Pickers';
//import { people, mru } from '@fluentui/example-data';
import DepartmentalRequest from '../DepartmentalRequest/DepartmentalRequest'
import { IPeopleState } from './IPeopleState';
import { IPeopleProps } from './IPeopleProps';
import { SPHttpClient, ISPHttpClientOptions, SPHttpClientResponse } from '@microsoft/sp-http';
import {IDepartmentList, IDispacherList} from '../DepartmentalRequest/IDepartmentList'
import PeoplePicker from './PeoplePicker';
import { DefaultButton, PrimaryButton, CompoundButton } from '@fluentui/react/lib/Button';
import 'office-ui-fabric-react/dist/css/fabric.css';
import { IconButton } from '@fluentui/react/lib/Button';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
initializeIcons();
import { Icon } from '@fluentui/react/lib/Icon';
import { Dropdown, IDropdown, IDropdownOption } from 'office-ui-fabric-react';
import { Item } from '@pnp/sp/items';
import { result } from 'lodash';


const suggestionProps: IBasePickerSuggestionsProps = {
  suggestionsHeaderText: 'Suggested People',
  mostRecentlyUsedHeaderText: 'Suggested Contacts',
  noResultsFoundText: 'No results found',
  loadingText: 'Loading',
  showRemoveButtons: true,
  suggestionsAvailableAlertText: 'People Picker Suggestions available',
  suggestionsContainerAriaLabel: 'Suggested contacts',
};
debugger;
const checkboxStyles = {
  root: {
    marginTop: 10,
  },
};
export interface IExampleExtendedPersonaProps {
    imageUrl?: string;
    imageInitials?: string;
    text?: string;
    secondaryText?: string;
    tertiaryText?: string;
    optionalText?: string;
    presence?: number;
    isValid: boolean;
    canExpand?: boolean;
  }

  export interface IExtendedPersonaProps {
    text:string;
  }

  enum PersonaPresence {
    none = 0,
    offline = 1,
    online = 2,
    away = 3,
    dnd = 4,
    blocked = 5,
    busy = 6,
  }  

// export var people1:(IPersonaProps)[]=[
//   {
//     text:'Dipal Bhavsar'
//   },
//   {
//     text:'Vrushali'
//   }

// ]


export const people: (IPersonaProps)[] = [
    {
    key: 1,
    imageUrl: ' ',
    imageInitials: 'PV',
    text: 'Annie Lindqvist',
    secondaryText: 'Designer',
    tertiaryText: 'In a meeting',
    optionalText: 'Available at 4:00pm',
     //isValid: true,
    presence: PersonaPresence.online,
  },
  {
    key: 2,
    imageUrl: ' ',
    imageInitials: 'AR',
    text: 'Aaron Reid',
    secondaryText: 'Designer',
    tertiaryText: 'In a meeting',
    optionalText: 'Available at 4:00pm',
    // isValid: true,
    presence: PersonaPresence.busy,
  },
  {
    key: 3,
    imageUrl: ' ',
    imageInitials: 'AL',
    text: 'Alex Lundberg',
    secondaryText: 'Software Developer',
    tertiaryText: 'In a meeting',
    optionalText: 'Available at 4:00pm',
     //isValid: true,
    presence: PersonaPresence.dnd,
  }
];

export var mru:(IPersonaProps)[]=[];

var grpName:string = 'IT Support';
var pickerGroupNames:(IPersonaProps)[]=[];

//var deptDetails : IDispacherList[] = Array();


// export const PeoplePickerTestExample: React.FunctionComponent = (props) => {
  export default class PeoplePickerTestExample extends React.Component<IPeopleProps, IPeopleState> {

 
 constructor(props){
   super(props)
   this.state = {
    mostRecentlyUsed:[],
    peopleList:[],
    loadPeoplePicker:0,
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
    deleteSelectedTicket:''
   }
  }

  componentDidMount(){
    this.loadDepartmentOptions();
    this.loadPeoplePickerInfo();
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





   private loadPeoplePickerInfo():void{
    const headers: HeadersInit = new Headers();
    // suppress metadata to minimize the amount of data loaded from SharePoint
    headers.append("accept", "application/json;odata.metadata=none");
    this.props.spHttpClient
      .get(`${this.props.webUrl}/_api/web/lists/getbytitle('EmployeeRequest')/items?$select=*,Author/Title&$expand=Author &$orderby=ID desc`,
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
        console.log("deptDetail = " + this.state.deptDetails[0].supportDeptName);
  
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

   private loadNewGrpName(val,indexId){
     grpName = val;
     console.log("grpName = " +  val);
     console.log("index = " +  indexId);
     this.setState({
       loadPeoplePicker: 1,
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
        loadPeoplePicker:0,
        homeButton:0
      })  
  }

   onSubmitDropDownHandle(newPeoplePicker:any,idRequest:number,assignedToUser,ticketNumberCheck){
  //  await this.setState({
  //     newPeoplePickerUser: newPeoplePicker[0].text
  //     //loadPeoplePicker:0
  //       },()=> this.addReAssignedToData(this.state.newPeoplePickerUser,idRequest))
        if(this.state.deleteSelectedTicket === ticketNumberCheck){
        this.addReAssignedToData(assignedToUser,idRequest);
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

          ///////////////////////////////////////////////////////////
          

          ////////////////////////////////////////////////////////////
          var metaTest ={
            // __metadata: { 'type': 'SP.Data.EmployeeRequestListItem' },
            'ReAssignToId': newReAssignedToUser.id
          }
          const spOpts: string = JSON.stringify({
            // metaTest
            // __metadata: { 'type': 'SP.Data.EmployeeRequestListItem' },
            'ReAssignToId': newReAssignedToUser.id
                // 'Comment': 'Comment is working'
                // OnOffBoardTask:1
          })
      
          this.props.spHttpClient.post(`${this.props.webUrl}/_api/web/lists/GetByTitle('EmployeeRequest')/items(${res.Id})`, SPHttpClient.configurations.v1, 
          {
            // __metadata: { 'type': 'SP.Data.EmployeeRequestListItem' },
            headers: {  
              'Accept': 'application/json;odata=nometadata',  
              'Content-type': 'application/json;odata=nometadata',  
              'odata-version': '',  
              'IF-MATCH': '*',  
              'X-HTTP-Method': 'MERGE',
              // "X-RequestDigest": $("#__REQUESTDIGEST").val()
            },  
            // body:spOpts
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
                    passAssignedToUser:{
                      id:null,
                      text:''
                    }
                  },()=>{console.log("deptDetails = " + this.state.deptDetails[0].ticketNumber); console.log("passAssignedToUser= " + this.state.passAssignedToUser.id)})
                  console.log(responseJSON);
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


  onSubmitHandle(){
    this.setState({
      loadPeoplePicker:0
    })
  }

  homeButtonClick(){
    this.setState({
      homeButton:1,
    })
  }

  onUserSelect(userName,selectedName, ticketNumber){
    this.setState({
      passAssignedToUser:selectedName,
      deleteSelectedTicket:ticketNumber
    },()=> console.log(this.state.passAssignedToUser.id))
    console.log(userName,selectedName);

  }

//   picker = React.useRef(null);

   onFilterChanged = (
    filterText: string,
    currentPersonas: IPersonaProps[],
    limitResults?: number,
  ): IPersonaProps[] | Promise<IPersonaProps[]> => {
    if (filterText) {
      let filteredPersonas: IPersonaProps[] = this.filterPersonasByText(filterText);

      filteredPersonas = removeDuplicates(filteredPersonas, currentPersonas);
      filteredPersonas = limitResults ? filteredPersonas.slice(0, limitResults) : filteredPersonas;
      return this.filterPromise(filteredPersonas);
    } else {
      return [];
    }
  };

   filterPersonasByText = (filterText: string): IPersonaProps[] => {
    return this.state.peopleList.filter(item => doesTextStartWith(item.text as string, filterText));
  };

   filterPromise = (personasToReturn: IPersonaProps[]): IPersonaProps[] | Promise<IPersonaProps[]> => {
    // if (delayResults) {
    //   return convertResultsToPromise(personasToReturn);
    // } else {
      return personasToReturn;
    // }
  };

   returnMostRecentlyUsed = (currentPersonas: IPersonaProps[]): IPersonaProps[] | Promise<IPersonaProps[]> => {
    return this.filterPromise(removeDuplicates(this.state.mostRecentlyUsed, currentPersonas));
  };

   onRemoveSuggestion = (item: IPersonaProps): void => {
    const indexPeopleList: number = this.state.peopleList.indexOf(item);
    const indexMostRecentlyUsed: number = this.state.mostRecentlyUsed.indexOf(item);

    if (indexPeopleList >= 0) {
      const newPeople: IPersonaProps[] = this.state.peopleList
        .slice(0, indexPeopleList)
        .concat(this.state.peopleList.slice(indexPeopleList + 1));
      // setPeopleList(newPeople);
      this.setState({
        peopleList:newPeople
      })
    }

    if (indexMostRecentlyUsed >= 0) {
      const newSuggestedPeople: IPersonaProps[] = this.state.mostRecentlyUsed
        .slice(0, indexMostRecentlyUsed)
        .concat(this.state.mostRecentlyUsed.slice(indexMostRecentlyUsed + 1));
      // setMostRecentlyUsed(newSuggestedPeople);
      this.setState({
        mostRecentlyUsed:newSuggestedPeople
      })
    }
  };

  // const onDisabledButtonClick = (): void => {
  //   setIsPickerDisabled(!isPickerDisabled);
  // };

  // const onToggleDelayResultsChange = (): void => {
  //   setDelayResults(!delayResults);
  // };
  public render(): React.ReactElement<IPeopleProps> {
  return (
    <div className={styles.peoplePickerTestExample}>
    {/* <iframe 
    src="https://gns11.sharepoint.com/sites/SiriusTeams/Lists/EmployeeRequest/AllItems.aspx"
    width="100%"
    height="100%"
      /> */}
      {(this.state.homeButton === 0) && (this.state.loadPeoplePicker === 0) &&
      <div className="ms-Grid">
        <div className="ms-Grid-row">
          <div className="ms-Grid-col ms-lg12">
             <Icon iconName='Home' style={{fontSize:'25px', cursor:'pointer'}} onClick={()=>this.homeButtonClick()} ></Icon>
          </div>
        </div>
      {
      // (this.state.deptDetails.length === 0) &&
      //   <div>
      //   <h2>You have no tickets to be dispatched</h2>
      //   {/* <h2>{"deptLength= " + this.state.deptDetails.length}</h2> */}
      //   </div>
      }
      {(this.state.deptDetails.length > 0) &&
      <div className="ms-Grid-row">
      <div className="ms-Grid-col ms-lg12">
      {/* <h2>{"deptLength= " + this.state.deptDetails.length}</h2> */}
      <table className={styles.tableSet} >
          <thead>
            <tr>
              <th>Ticket Number</th>
              <th>Raised By</th>
              <th>Issue Date</th>
              <th>Assign To</th>
              <th>Update</th>
              {/* <th>Description</th>
              <th>Category</th>
              <th>Department</th>
              <th>Status</th>
              <th>Dispatcher Group</th>
              <th>Assigned To</th>
              <th>ReAssigned To</th> */}
              {/* <th>Update</th> */}
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
                    <td>
                      {/* <select
                       id={res.ticketNumber + '_dropDown'} 
                       placeholder={'Select option'}
                      onClick={(e)=>this.getUserByDept(res.ticketNumber + '_dropDown',res.reAssignedTo,res.supportDeptName)}
                      >
                        {this.state.deptListDropDown.map((item,index)=>
                          (
                            <option key={item.id} value={item.text} >
                              {item.text}
                            </option>
                          )
                        )}
                      </select> */}
                      <Dropdown
                       id={res.ticketNumber + '_dropDown'} 
                       placeholder='Select option'
                       defaultSelectedKey={" "}
                      onClick={(e)=>this.getUserByDept(res.ticketNumber + '_dropDown',res.reAssignedTo,res.supportDeptName,res.dataId)} 
                      options={this.state.deptListDropDown}
                      onChange={(e,selectedName)=>this.onUserSelect(e,selectedName,res.ticketNumber)}
                      >

                      </Dropdown>
                    </td>
                    {/* <td>
                      <PrimaryButton onClick={()=>this.loadNewGrpName(res.supportDeptName,index)} >AssignTo</PrimaryButton>
                    </td>
                    <td>{res.reAssignedTo}</td> */}
                    <td>
                      <DefaultButton onClick={(e)=>this.onSubmitDropDownHandle(e,res.dataId,this.state.passAssignedToUser,res.ticketNumber)}>Submit</DefaultButton>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
      </table>
      </div>
    </div>
  }
  {(this.state.deptDetails.length === 0) &&
       <div>
        <h2>You have no tickets to be dispatched</h2>
        {/* <h2>{"deptLength= " + this.state.deptDetails.length}</h2> */}
       </div>
      }
  </div>
  }
  {
    (this.state.loadPeoplePicker === 1) && (this.state.homeButton === 0) &&
    <div className="ms-Grid">
      <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-lg12">
            <Icon iconName='NavigateBack' style={{fontSize:'25px', cursor:'pointer'}} onClick={()=>this.onBackButtonClick()} ></Icon>
            </div>
      </div>
    <div className="ms-Grid-row">
      <div className="ms-Grid-col ms-lg12">
      <h2>Please Assign User</h2>
    <NormalPeoplePicker
    // eslint-disable-next-line react/jsx-no-bind
    onResolveSuggestions={this.onFilterChanged}
    // eslint-disable-next-line react/jsx-no-bind
    // onEmptyInputFocus={returnMostRecentlyUsed}
    // items={(e)=>this.onChangePeoplePickerHandle(e,this.state.idSelect)}
    onChange={(e)=>this.onSubmitDropDownHandle(e,this.state.idSelect,this.state.passAssignedToUser,this.state.deleteSelectedTicket)}
    // onChange={()=>''}
    getTextFromItem={getTextFromItem}
    pickerSuggestionsProps={suggestionProps}
    className={`ms-PeoplePicker ${styles.normalPickerInput}`}
    key={'normal'}
    // eslint-disable-next-line react/jsx-no-bind
    onRemoveSuggestion={this.onRemoveSuggestion}
    onValidateInput={validateInput}
    selectionAriaLabel={'Selected contacts'}
    removeButtonAriaLabel={'Remove'}
    inputProps={{
      onBlur: (ev: React.FocusEvent<HTMLInputElement>) => console.log('onBlur called'),
      onFocus: (ev: React.FocusEvent<HTMLInputElement>) => console.log('onFocus called'),
      'aria-label': 'People Picker',
    }}
    // componentRef={this.picker}
    onInputChange={onInputChange}
    resolveDelay={300}
    // disabled={isPickerDisabled}
  /> 
  </div>
  </div>  
  <div className="ms-Grid-row">
    <div className="ms-Grid-col ms-lg12">
      <DefaultButton style={{marginTop:'20px'}} onClick={()=>this.onSubmitHandle()}>Submit</DefaultButton>
    </div>
  </div>
  </div>
  }

  {(this.state.homeButton === 1) &&
              <DepartmentalRequest groupType={this.props.groupType} description={this.props.description} loggedInUserEmail={this.props.loggedInUserEmail} loggedInUserName={this.props.loggedInUserName} spHttpClient={this.props.spHttpClient} webUrl={this.props.webUrl}  currentUserId={this.props.currentUserId}/>
  }

      {/* <h1>People Picker Test Example</h1>
      <NormalPeoplePicker
        // eslint-disable-next-line react/jsx-no-bind
        onResolveSuggestions={this.onFilterChanged}
        // eslint-disable-next-line react/jsx-no-bind
        // onEmptyInputFocus={returnMostRecentlyUsed}
        getTextFromItem={getTextFromItem}
        pickerSuggestionsProps={suggestionProps}
        className={'ms-PeoplePicker'}
        key={'normal'}
        // eslint-disable-next-line react/jsx-no-bind
        onRemoveSuggestion={this.onRemoveSuggestion}
        onValidateInput={validateInput}
        selectionAriaLabel={'Selected contacts'}
        removeButtonAriaLabel={'Remove'}
        inputProps={{
          onBlur: (ev: React.FocusEvent<HTMLInputElement>) => console.log('onBlur called'),
          onFocus: (ev: React.FocusEvent<HTMLInputElement>) => console.log('onFocus called'),
          'aria-label': 'People Picker',
        }}
        // componentRef={this.picker}
        onInputChange={onInputChange}
        resolveDelay={300}
        // disabled={isPickerDisabled}
      /> */}

      {/* <Checkbox
        label="Disable People Picker"
        checked={isPickerDisabled}
        // eslint-disable-next-line react/jsx-no-bind
        onChange={onDisabledButtonClick}
        styles={checkboxStyles}
      /> */}
      {/* <Checkbox
        label="Delay Suggestion Results"
        defaultChecked={delayResults}
        // eslint-disable-next-line react/jsx-no-bind
        onChange={onToggleDelayResultsChange}
        styles={checkboxStyles}
      /> */}
    </div>
  );
}
}

function doesTextStartWith(text: string, filterText: string): boolean {
  return text.toLowerCase().indexOf(filterText.toLowerCase()) === 0;
}

function removeDuplicates(personas: IPersonaProps[], possibleDupes: IPersonaProps[]) {
  return personas.filter(persona => !listContainsPersona(persona, possibleDupes));
}

function listContainsPersona(persona: IPersonaProps, personas: IPersonaProps[]) {
  if (!personas || !personas.length || personas.length === 0) {
    return false;
  }
  return personas.filter(item => item.text === persona.text).length > 0;
}

function convertResultsToPromise(results: IPersonaProps[]): Promise<IPersonaProps[]> {
  return new Promise<IPersonaProps[]>((resolve, reject) => setTimeout(() => resolve(results), 2000));
}

function getTextFromItem(persona: IPersonaProps): string {
  return persona.text as string;
}

function validateInput(input: string): ValidationState {
  if (input.indexOf('@') !== -1) {
    return ValidationState.valid;
  } else if (input.length > 1) {
    return ValidationState.warning;
  } else {
    return ValidationState.invalid;
  }
}

/**
 * Takes in the picker input and modifies it in whichever way
 * the caller wants, i.e. parsing entries copied from Outlook (sample
 * input: "Aaron Reid <aaron>").
 *
 * @param input The text entered into the picker.
 */
function onInputChange(input: string): string {
  const outlookRegEx = /<.*>/g;
  const emailAddress = outlookRegEx.exec(input);

  if (emailAddress && emailAddress[0]) {
    return emailAddress[0].substring(1, emailAddress[0].length - 1);
  }

  return input;
}
