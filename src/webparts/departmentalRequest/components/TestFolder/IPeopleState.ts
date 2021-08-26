import { IPersonaProps } from '@fluentui/react/lib/Persona';
import {IExampleExtendedPersonaProps} from './PeoplePickerTestExample'

export interface IPeopleState {
    loading:false;
    errorMessage:string;
    mostRecentlyUsed:IPersonaProps[];
    peopleList:IPersonaProps[];
    loadPeoplePicker:number;
    newPeoplePickerUser:string;
}