import { SPHttpClient } from "@microsoft/sp-http";
import { IPersonaProps } from '@fluentui/react/lib/Persona';

export interface IDispatcherViewProps {
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
    passGroupName:string;
}