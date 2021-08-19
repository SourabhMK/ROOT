import * as React from 'react';
import { Checkbox } from '@fluentui/react/lib/Checkbox';
import { IPersonaProps } from '@fluentui/react/lib/Persona';
import { IBasePickerSuggestionsProps, IPeoplePickerProps, NormalPeoplePicker, ValidationState } from '@fluentui/react/lib/Pickers';
//import { people, mru } from '@fluentui/example-data';
import DepartmentalRequest from '../DepartmentalRequest/DepartmentalRequest'
import { IPeopleState } from './IPeopleState';
import { IPeopleProps } from './IPeopleProps';
import { SPHttpClient, ISPHttpClientOptions, SPHttpClientResponse } from '@microsoft/sp-http';


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

export var people1:(IPersonaProps)[]=[
  // {
  //   text:'Dipal Bhavsar'
  // },
  // {
  //   text:'Vrushali'
  // }

]
// test(props);



// people1 = 
export const people: (IExampleExtendedPersonaProps & { key: string | number })[] = [
    {
    key: 1,
    imageUrl: ' ',
    imageInitials: 'PV',
    text: 'Annie Lindqvist',
    secondaryText: 'Designer',
    tertiaryText: 'In a meeting',
    optionalText: 'Available at 4:00pm',
    isValid: true,
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
    isValid: true,
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
    isValid: true,
    presence: PersonaPresence.dnd,
  }
];

export var mru:(IPersonaProps)[]=[];

// export interface IPeoplePickerTestExampleState{
//   peopleList:IPersonaProps[];
//   mostRecentlyUsed:IPersonaProps[];
// }

var grpName:string = 'IT Support';
var pickerGroupNames: IPersonaProps[];


// export const PeoplePickerTestExample: React.FunctionComponent = (props) => {
  export default class  PeoplePickerTestExample extends React.Component<IPeopleProps, IPeopleState > {
 // const [delayResults, setDelayResults] = React.useState(false);
 // const [isPickerDisabled, setIsPickerDisabled] = React.useState(false);
 
 constructor(props){
   super(props)
   this.state = {
    mostRecentlyUsed:[],
    peopleList:[],
    loading:false,
    errorMessage:''
   }

  //  people1 = this.props.deptBelongingNames

  //  this.setMostRecentlyUsed(mru);
  //  this.setPeopleList(people1);
  
  }

  componentDidMount(){
    this.loadDepartmentOptions();
    this.testPart();
  }

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

//  setMostRecentlyUsed(mru:IPersonaProps[]){
//    return mru;
//  }

//  setPeopleList(people1:IPersonaProps[]){
   
//  }

  //  people1 = props.pickerGroupNames;
//  testPart();
//  const [mostRecentlyUsed, setMostRecentlyUsed] = React.useState<IPersonaProps[]>(mru);
//   const [peopleList, setPeopleList] = React.useState<IPersonaProps[]>(people1);

 private testPart():void{
    people1 = pickerGroupNames;
     mru = people1.slice(0, 5);
    
      this.setState({
        peopleList:people1,
        mostRecentlyUsed:mru
      })
  };
  // const peopleList = people1;

   picker = React.useRef(null);

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

  // const returnMostRecentlyUsed = (currentPersonas: IPersonaProps[]): IPersonaProps[] | Promise<IPersonaProps[]> => {
  //   return filterPromise(removeDuplicates(mostRecentlyUsed, currentPersonas));
  // };

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
    <div>
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
        componentRef={this.picker}
        onInputChange={onInputChange}
        resolveDelay={300}
        // disabled={isPickerDisabled}
      />
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
