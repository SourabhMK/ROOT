import { SPHttpClient } from "@microsoft/sp-http";
import { IPersonaProps } from '@fluentui/react/lib/Persona';

export interface IPeopleProps {
    description: string;
    emailType:number;
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
    msGraphClientFactory:any
}