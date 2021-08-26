import { IPersonaProps } from '@fluentui/react/lib/Persona';
import {IExampleExtendedPersonaProps} from './PeoplePickerTestExample';
import {IDepartmentList, IDispacherList} from '../DepartmentalRequest/IDepartmentList'


export interface IPeopleState {
    loading:false;
    errorMessage:string;
    mostRecentlyUsed:IPersonaProps[];
    peopleList:IPersonaProps[];
    loadPeoplePicker:number;
    newPeoplePickerUser:string;
    deptDetails:IDispacherList[];
}