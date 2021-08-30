import { IDropdownOption } from "office-ui-fabric-react/lib/Dropdown";
import { SPHttpClient } from "@microsoft/sp-http"; 

export interface IAssetReservationProps {
  description: string;
  context:any;
  siteurl: string;
  spHttpClient: SPHttpClient;
  //roomsOptionsName:IDropdownOption[];
}
