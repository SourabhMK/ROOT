import { IBirthday } from "../../../../Models/IBirthday";
import { SPHttpClient } from "@microsoft/sp-http";
// import { IMSGraphInterface } from "../../../../services/msGraphProvider";
import { IMSGraphInterface } from "../../../../Services/msGraphProvider";

import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IBirthdayUserListProps {
    people: IBirthday[]; 
    spHttpClient: SPHttpClient; 
    siteurl: string;
    loggedInUserEmail: string; 
    webPartContext: WebPartContext;
}

export interface IBirthdayUserListState {
    showCallOut: boolean;
    showCallOutTeams: boolean;
    calloutElement: number;
    person: IBirthday;
    currentMessage: string;
    msGraphProvider: IMSGraphInterface;
    errorMessage: string;
}
