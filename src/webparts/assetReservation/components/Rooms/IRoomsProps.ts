import { SPHttpClient } from "@microsoft/sp-http";
import { IDropdownOption } from "office-ui-fabric-react/lib/Dropdown";

export interface IRoomsProps {
    description: string; 
    context:any;
    siteurl: string;
    spHttpClient: SPHttpClient;
    //roomsOptionsName: IDropdownOption[];
}

// export interface IDropdownOption {
//     key: number;
//     Title : string;
//   }

