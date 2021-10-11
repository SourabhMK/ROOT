import * as React from 'react';
import styles from './AssetFilters.module.scss';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react';
import { IAssetFilterProps } from './IAssetFilterProps';
import { IAssetFilterState } from './IAssetFilterState';
import spRoomService from '../../../../services/spRoomService';
import { IAssetInfo } from '../../../../models/IAssetInfo';

export default class AssetFilters extends React.Component<IAssetFilterProps, IAssetFilterState> {
    private spRoomService: spRoomService = null;

    constructor(props:IAssetFilterProps, state:IAssetFilterState) { 
        super(props);
        this.state = {
            assetList : [],
            assetInfo: [],
            selectedAsset: null,
            errorMessage : ""
        };
        this.spRoomService = new spRoomService(this.props.context);
    }

    public componentDidMount() : void {
        this._getAssetInfo();
    }

    private _getAssetInfo = () => {
        this.spRoomService.getAssetInfo(this.props.siteUrl).then(res=>{
            let assets: IDropdownOption[] = [];
            for (const option of res) {
                assets.push({key: option.Id, text: option.Title});
            }

            this.setState({
                assetList: assets,
                assetInfo: res
            });
         }).catch((error)=>{
            console.log("Error getting results from RoomLoaction - " + error);
         });
    }

    private _notifyParentThatMyStateGetChanged(info: IAssetInfo){
        this.props.EventKeySelection (info);
    }

    private _getRoomAreaBySelectedId(info: IDropdownOption) {

        
    }

    public render(): React.ReactElement<IAssetFilterProps> {
        return (
            <div className={ styles.assetFilters }>
                <div className="ms-Grid" dir="ltr">
                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-u-sm12 block">
                            <Dropdown
                                options={this.state.assetList}
                                selectedKey={0}
                                placeholder="Select Asset"
                                onChange={(e, obj)=>this._getRoomAreaBySelectedId(obj)}
                                className = {styles.dropDown}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}