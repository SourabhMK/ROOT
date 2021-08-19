import { SPHttpClient } from "@microsoft/sp-http";
import { IPersonaProps } from '@fluentui/react/lib/Persona';

export interface IPeopleProps {
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
}