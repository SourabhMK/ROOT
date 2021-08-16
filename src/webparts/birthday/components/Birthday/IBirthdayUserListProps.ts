import { IBirthday } from "../../../../Models/IBirthday";
import { SPHttpClient } from "@microsoft/sp-http";

export interface IBirthdayUserListProps {
    people: IBirthday[]; 
    spHttpClient: SPHttpClient; 
    siteurl: string;  
}

export interface IBirthdayUserListState {
    showCallOut: boolean;
    calloutElement: number;
    person: IBirthday;
}
