import { Environment, EnvironmentType } from '@microsoft/sp-core-library';
import { IDropdownOption } from '@fluentui/react';
import SPService from '../../../services/SPService';
import { ISPList, ISPLists, ISPRoomImageRef } from '../../../Models/Models';


export default class RoomService {
    private _context : any;

    constructor(private context: any) {
        this._context = context;
    }

    public GetRoomLocation() : Promise<IDropdownOption[]> {
        let query = '/_api/web/lists/getbytitle(\'RoomLocation\')/items?$select=ID,Title&$filter=IsActive eq 1';
        return this.FeedListDataByQuery(query, "Select Location");
    }

    public GetRoomAreaByLocation(locationId) : Promise<IDropdownOption[]> {
        let query = '/_api/web/lists/getbytitle(\'RoomArea\')/items?$select=ID,Title,RoomLocationId/Id&$expand=RoomLocationId/Id&$filter=RoomLocationId/Id eq ' + locationId ;
        return this.FeedListDataByQuery(query, "Select Area");
    }

    public GetRoomBuildingByArea(areaId) : Promise<IDropdownOption[]> {
        let query = '/_api/web/lists/getbytitle(\'RoomBuildingFloor\')/items?$select=ID,Title,RoomAreaId/Id&$expand=RoomAreaId/Id&$filter=RoomAreaId/Id eq ' + areaId ;
        return this.FeedListDataByQuery(query, "Select Building");
    }

    public GetRoomSizeByBuilding(buildingId) : Promise<IDropdownOption[]> {
        let query = '/_api/web/lists/getbytitle(\'RoomSize\')/items?$select=ID,Title,RoomBuildingFloorId/Id&$expand=RoomBuildingFloorId/Id&$filter=RoomBuildingFloorId eq ' + buildingId ;
        return this.FeedListDataByQuery(query, "Select Size");
    }

    public GetRoomImagesBySize(sizeId) :Promise<string[]> {
        let sp = new SPService(this._context);
        let promises:any = [];
        let imagePathes : string[] = [];
        return this.GetRoomImagesBySizeInturim(sizeId).then(data => {
            data.map(rec => {
                let query = '/_api/web/lists/getbytitle(\'RoomPicture\')/items('+ rec.RoomImageId +')?$select=EncodedAbsThumbnailUrl';
                let promise = sp._getListData1(query);
                promises.push(promise);
            });
            return Promise.all(promises).then(res=>{
                res.map(t => {
                    debugger;
                    // try{
                    //     let path = t.EncodedAbsThumbnailUrl;
                    //     imagePathes.push(path);
                    // }
                    // catch((error)=>{

                    // });
                });
                return imagePathes;
            });
        });
    }

    private GetRoomImagesBySizeInturim(sizeId: number): Promise<ISPRoomImageRef[]> {
        let query = '/_api/web/lists/getbytitle(\'RoomPicture\')/Items?$select=Id,RoomSizeId/Id&$expand=RoomSizeId/Id&$filter=RoomSizeId eq ' + sizeId;
        let sp = new SPService(this._context);
        return sp._getListData1(query).then(res=>{
            let data: ISPRoomImageRef[] =[];
            if(res.value.length > 0) {
                res.value.map(t => {
                    var item : ISPRoomImageRef = {
                        Id : t.Id,
                        RoomImageId : t.RoomSizeId.Id
                    };
                    data.push(item);
                });
                return data;
            }
        });
    } 

    private GetListDataByQuery(query) : Promise<ISPList[]> {
        let data : ISPList[] = [];
        let sp = new SPService(this._context);
        return sp._getListData(query).then(res=>{
            debugger;
            if(res.value.length > 0) {
                res.value.map((t,i)=>{
                    var item : ISPList = {
                        Id : t.Id,
                        Title : t.Title
                    };
                    data.push(item);
                });
                return Promise.resolve(data);
            } else {
                return Promise.reject("No data found");
            }
        }).catch((response) => {
            console.log("Error getting results from httpClient - " + response);
            return Promise.reject("Error getting results from httpClient - " + response);
        });
    }

    private FeedListDataByQuery(query, title):Promise<IDropdownOption[]> {
        let data: IDropdownOption[] = [];
        let item: IDropdownOption = {
            key : 0,
            text : title,
            index : 0
        };

        data.push(item);

        if(Environment.type == EnvironmentType.ClassicSharePoint || Environment.type == EnvironmentType.SharePoint){
            return this.GetListDataByQuery(query).then(res=>{
                res.map((r,i)=>{
                    item = {
                        key : r.Id,
                        text : r.Title,
                        index : i+1
                    };
                    data.push(item);
                });
                return Promise.resolve(data);
            });
        } else if(Environment.type === EnvironmentType.Local) {
            item = {
                key : 1,
                text : "Test",
                index : 1
            };
            data.push(item);

            item = {
                key : 2,
                text : "Test - 1",
                index : 2
            };
            data.push(item);
            return Promise.resolve(data);
        }
    }
}
