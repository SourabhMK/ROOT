import { IDropdownOption } from "office-ui-fabric-react";

export interface IRoomsState {
  //roomsFilter: string[];
  //Display the dropdown data in the dropdown Array box
  roomsFilter: IDropdownOption[];
  roomsLocationData:IDropdownOption[];
  roomsAreaData: IDropdownOption[];
  roomsBuildingFloorData: IDropdownOption[];
  roomsSizeData:IDropdownOption[];
  roomsPictureData:[];
  //Pass the parameter dropdown id to next dropdown
  roomLocationId:number;
  roomAreaId:number;
  roomBuildingFloorId:number;
  roomSizeId:number;
  //Hide the dropdown option
  roomsAreaDropdownDisplay:boolean;
  roomsBuildingFloorDropdownDisplay:boolean;
  roomsSizeDropdownDisplay:boolean;
  //Image display purpose
  selectedImage: string; 
  images: string[];
  errorMessage: string;
}