import { IBirthday } from "../../../../Models/IBirthday";
import { IMSGraphInterface } from "../../../../services/msGraphProvider";
import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IBirthdayUserListProps {
    people: IBirthday[]; 
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
