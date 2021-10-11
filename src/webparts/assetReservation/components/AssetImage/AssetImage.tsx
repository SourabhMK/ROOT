import * as React from 'react';
import styles from './AssetImage.module.scss';
import { IAssetImageProps } from './IAssetImageProps';
import { IAssetImageStates } from './IAssetImageState';
import spRoomService from '../../../../services/spRoomService';
import { IAssetInfo } from '../../../../models/IAssetInfo';

export default class RoomImage extends React.Component<IAssetImageProps, IAssetImageStates> {
    private spRoomService: spRoomService = null;
    constructor(props:IAssetImageProps, state:IAssetImageStates) { 
        super(props);
        this.state = {
            selectedImage: '',
            imagePaths: [],
            errorMessage : ""
        };
        this.spRoomService = new spRoomService(this.props.context);
    }

    public componentDidMount() : void {
        // this. _getAssetPhotoByPara();
    }

    private _getAssetPhotoByPara(assetInfo: IAssetInfo) {
        this.spRoomService.getRoomImagesBySize(this.props.siteUrl, assetInfo.Id).then(res=>{
            this.setState({
                imagePaths : res,
            });
         }).catch((error)=>{
            console.log("Error getting results from RoomLoaction - " + error);
         });
    }

    public render(): React.ReactElement<IAssetImageProps> {
        return (
            <div className={ styles.assetFilters }>
                <div className="ms-Grid" dir="ltr">
                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-u-sm12 block">
                            {this.state.imagePaths.map(img => {
                                return <img src={`${img}`} height="100%" width="100%" className={this.state.selectedImage == img ? styles.selected:''} margin-top="15px"/>;
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
