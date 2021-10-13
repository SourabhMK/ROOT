import { SPHttpClient } from "@microsoft/sp-http";
import { IPersonaProps } from '@fluentui/react/lib/Persona';
import { IDispacherList, IDepartmentList } from "../DepartmentalRequest/IDepartmentList";

export interface IManagerProps {
    description: string;
    emailType:number;
    webUrl: string;
    /**
     * Instance of the SPHttpClient. Used to retrieve information about
     * people.
     */
    spHttpClient: SPHttpClient;

    loggedInUserName: string;
    loggedInUserEmail: string;
    currentUserId:number;
    msGraphClientFactory:any;
    passedDept:string;
    passedStatus:string;
}

export interface IAllAssignProps {
    description: string;
    groupType:number;
    deptBelongingNames:IPersonaProps[];
    webUrl: string;
    /**
     * Instance of the SPHttpClient. Used to retrieve information about
     * people.
     */
    spHttpClient: SPHttpClient;

    loggedInUserName: string;
    loggedInUserEmail: string;
    currentUserId:number;

    allDetailsProp:IDispacherList[];
}