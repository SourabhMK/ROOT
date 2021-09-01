import { IDropdownOption } from "office-ui-fabric-react";

export interface IRoomsState {
  //roomsFilter: string[];
  roomsFilter: IDropdownOption[];
  roomsLocationData:IDropdownOption[];
  roomsAreaData: IDropdownOption[];
  roomsBuildingFloorData: IDropdownOption[];
  roomsSizeData:IDropdownOption[];
  roomsPictureData:[];
  roomLocationId:number;
  roomAreaId:number;
  roomBuildingFloorId:string;
  roomSizeId:string;
  roomsAreaDropdownDisplay:boolean;
  roomsBuildingFloorDropdownDisplay:boolean;
  roomsSizeDropdownDisplay:boolean;
  errorMessage: string;
}