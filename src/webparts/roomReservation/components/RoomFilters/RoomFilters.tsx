import * as React from 'react';
import styles from './RoomFilters.module.scss';
import { Dropdown } from 'office-ui-fabric-react';
import { IRoomFilterProps } from './IRoomFilterProps';
import { IRoomFilterStates } from './IRoomFilterState';
import  RoomService  from '../../roomService';

export default class RoomFilters extends React.Component<IRoomFilterProps, IRoomFilterStates> {
    constructor(props:IRoomFilterProps, state:IRoomFilterStates) { 
        super(props);
        this.state = {
            roomLocations : [],
            selectedRoomLocationKey : 0,
            roomAreas : [],
            selectedRoomAreaKey : 0,
            roomBuildings : [],
            selectedRoomBuildingKey : 0,
            roomSize : [],
            selectedRoomSizeKey : 0,
            errorMessage : ""
        };
    }

    public componentDidMount() : void {
        this._getRoomLocation();
    }

    private _getRoomLocation = () => {
        debugger;
        let service = new RoomService(this.props.context);
         service.GetRoomLocation().then(res=>{
            this.setState({
                roomLocations : res,
            });
         }).catch((error)=>{
            console.log("Error getting results from RoomLoaction - " + error);
         });
    }
    
    private _getRoomAreaBySelectedId = (obj) => { 
        // Reset the data once the Location get changed
        this.setState({
            roomAreas : [],
            selectedRoomAreaKey : 0,
            roomBuildings : [],
            selectedRoomBuildingKey : 0,
            roomSize : [],
            selectedRoomSizeKey : 0,
        });

        let service = new RoomService(this.props.context);
         service.GetRoomAreaByLocation(obj.key).then(res=>{
            this.setState({
                selectedRoomLocationKey: obj.key,
                roomAreas : res
            });
            this._notifyParentThatMyStateGetChanged(
                this.state.selectedRoomLocationKey, 
                this.state.selectedRoomAreaKey,
                this.state.selectedRoomBuildingKey,
                this.state.selectedRoomSizeKey
            );
         }).catch((error)=>{
            console.log("Error getting results from RoomLoaction - " + error);
         });
    }

    private _getRoomBuildingFloorBySelectedId = (obj) => {
        // Reset the data once the Location get changed
        this.setState({
            roomBuildings : [],
            selectedRoomBuildingKey : 0,
            roomSize : [],
            selectedRoomSizeKey : 0,
        });
        let service = new RoomService(this.props.context);
         service.GetRoomBuildingByArea(obj.key).then(res=>{
            this.setState({
                selectedRoomAreaKey: obj.key,
                roomBuildings : res
            });
            this._notifyParentThatMyStateGetChanged(
                this.state.selectedRoomLocationKey, 
                this.state.selectedRoomAreaKey,
                this.state.selectedRoomBuildingKey,
                this.state.selectedRoomSizeKey
            );
         }).catch((error)=>{
            console.log("Error getting results from RoomLoaction - " + error);
         });
    }

    private _getRoomSizeBySelectedId = (obj) => {
        this.setState({
            roomSize : [],
            selectedRoomSizeKey : 0,
        });
        let service = new RoomService(this.props.context);
        service.GetRoomSizeByBuilding(obj.key).then(res=>{
           this.setState({
               selectedRoomBuildingKey: obj.key,
               roomSize : res
           });
           this._notifyParentThatMyStateGetChanged(
                this.state.selectedRoomLocationKey, 
                this.state.selectedRoomAreaKey,
                this.state.selectedRoomBuildingKey,
                this.state.selectedRoomSizeKey
            );
        }).catch((error)=>{
           console.log("Error getting results from RoomLoaction - " + error);
        });
    }

    private _onChangeRoomSize = (e, obj) => { 
        this.setState({
            selectedRoomSizeKey : obj.key
        });
        this._notifyParentThatMyStateGetChanged(
            this.state.selectedRoomLocationKey, 
            this.state.selectedRoomAreaKey,
            this.state.selectedRoomBuildingKey,
            obj.key
        );
    }

    private _notifyParentThatMyStateGetChanged(locationId: number, areaId: number, buildingId:number, sizeId:number){
        this.props.EventKeySelection (locationId, areaId, buildingId, sizeId);
    }

    public render(): React.ReactElement<IRoomFilterProps> {
        return (
            <div className={ styles.roomFilters }>
                <div className="ms-Grid" dir="ltr">
                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-u-sm12 block">
                            <Dropdown
                                options={this.state.roomLocations}
                                selectedKey={this.state.selectedRoomLocationKey}
                                placeholder="Select Location"
                                onChange={(e, obj)=>this._getRoomAreaBySelectedId(obj)}
                                className = {styles.dropDown}
                            />
                        </div>
                    </div>
                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-u-sm12 block">
                            <Dropdown
                                options={this.state.roomAreas}
                                placeholder="Select Area"
                                onChange={(e, obj)=>this._getRoomBuildingFloorBySelectedId(obj)}
                                className = {styles.dropDown}
                            />
                        </div>
                    </div>
                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-u-sm12 block">
                            <Dropdown
                                options={this.state.roomBuildings}
                                placeholder="Select BuildingFloor"
                                onChange={(e, obj)=>this._getRoomSizeBySelectedId(obj)}
                                className = {styles.dropDown}
                            />
                        </div>
                    </div>
                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-u-sm12 block">
                            <Dropdown
                                options={this.state.roomSize}
                                placeholder="Select RoomSize"
                                onChange={(e, obj)=>this._onChangeRoomSize(e, obj)}
                                className = {styles.dropDown}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}