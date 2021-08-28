import { IAnniversary } from "../../../../Models/IAnniversary";
import { SPHttpClient } from "@microsoft/sp-http";

export interface IAnniversaryUserListProps {
    people: IAnniversary[];
    spHttpClient: SPHttpClient;
    siteurl: string;
    loggedInUserEmail:string;
}

export interface IAnniversaryUserListState {
    showCallOut: boolean;
    calloutElement: number;
    person: IAnniversary;
}