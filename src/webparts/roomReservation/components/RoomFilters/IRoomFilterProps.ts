export interface IRoomFilterProps {
    description: string; 
    context:any;
    EventKeySelection(locationId: number, areaId: number, buildingId:number, sizeId:number) : void;
}