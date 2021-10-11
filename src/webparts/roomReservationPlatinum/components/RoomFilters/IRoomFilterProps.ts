export interface IRoomFilterProps {
    context:any;
    siteUrl: string;
    EventKeySelection(locationId: number, areaId: number, buildingId:number, sizeId:number) : void;
}