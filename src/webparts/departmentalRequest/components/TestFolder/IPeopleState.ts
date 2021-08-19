import { IPersonaProps } from '@fluentui/react/lib/Persona';

export interface IPeopleState {
    loading:false,
    errorMessage:string,
    mostRecentlyUsed:IPersonaProps[],
    peopleList:IPersonaProps[]
}