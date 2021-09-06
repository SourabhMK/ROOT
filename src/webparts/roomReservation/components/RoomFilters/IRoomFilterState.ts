import { IDropdownOption } from "office-ui-fabric-react";

export interface IRoomFilterStates {
    roomLocations :IDropdownOption[];
    selectedRoomLocationKey: number;
    roomAreas :IDropdownOption[];
    selectedRoomAreaKey : number;
    roomBuildings:IDropdownOption[];
    selectedRoomBuildingKey:number;
    roomSize:IDropdownOption[];
    selectedRoomSizeKey:number;
    errorMessage: string;
}