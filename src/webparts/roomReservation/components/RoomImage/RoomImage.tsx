import * as React from 'react';
import styles from './RoomImage.module.scss';
import { IRoomImageProps } from './IRoomImageProps';
import { IRoomImageStates } from './IRoomImageState';
import Carousel from 'react-elastic-carousel';
import  RoomService  from '../../roomService';

export default class RoomImage extends React.Component<IRoomImageProps, IRoomImageStates> {
    constructor(props:IRoomImageProps, state:IRoomImageStates) { 
        super(props);
        this.state = {
            selectedImage: '',
            imagePaths: [],
            errorMessage : ""
        };
    }

    public componentDidMount() : void {
        this. _getRoomPhotoByPara(this.props.locationId, this.props.areaId, this.props.buildingId, this.props.sizeId);
    }

    private _getRoomPhotoByPara(locationId:number, areaId:number, buildingId:number, sizeId:number) {
        let service = new RoomService(this.props.context);
         service.GetRoomImagesBySize(sizeId).then(data => {
             console.log("data : " + data);
            debugger;
            // this.setState({
            //     imagePaths : data
            // });
         });
    }

    public render(): React.ReactElement<IRoomImageProps> {
        return (
            <div className={ styles.roomFilters }>
                <div className="ms-Grid" dir="ltr">
                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-u-sm12 block">
                        <Carousel
                            pagination={false}
                            itemsToShow={1}
                            itemsToScroll={1}
                            isRTL={false}
                            focusOnSelect={true}>
                            {this.state.imagePaths.map((img, index) => {
                                return <img src={`${this.context.pageContext.web.absoluteUrl}/Images1/${img}`} height="100px" width="100%" margin-top="15px"/>
                            })}
                        </Carousel>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}