import * as React from 'react';
import styles from './RoomReservation.module.scss';
import { IRoomReservationProps } from './IRoomReservationProps';
import { IRoomReservationStates } from './IRoomReservationState';
import RoomFilters from '../components/RoomFilters/RoomFilters';
import RoomImage from '../components/RoomImage/RoomImage';
import Calendar from '../../../controls/Calendar/Calendar';
export default class RoomReservation extends React.Component<IRoomReservationProps, IRoomReservationStates> {
  constructor(props:IRoomReservationProps, state:IRoomReservationStates) { 
    super(props);
    
    this.state = {
      locationId: 0,
      areaId:0,
      buildingId: 0,
      sizeId: 0,
    };
    this.EventKeySelectionHandler = this.EventKeySelectionHandler.bind(this);
}

  // Get event once the all drop boxes have been selected. Get keys for all drop down here :)
  private EventKeySelectionHandler(locationId: number, areaId: number, buildingId:number, sizeId:number) {
    this.setState ({
      locationId: locationId,
      areaId: areaId,
      buildingId: buildingId,
      sizeId: sizeId
    });
  }

  private updatePropertyHandler(str: string) {
    this.props.updateProperty(str);
  }

  public render(): React.ReactElement<IRoomReservationProps> {
    return (
      <div className={ styles.roomReservation }>
        <div className="ms-Grid" dir="ltr">
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm6 block">
              <RoomFilters
                context={this.props.context}
                EventKeySelection={this.EventKeySelectionHandler}
                > 
              </RoomFilters>
            </div>
            <div className="ms-Grid-col ms-u-sm6 block">
              {this.state.sizeId <= 0 && <div>Image will be loaded for the selected options</div>}
              {this.state.sizeId > 0 &&
                <RoomImage
                  context={this.props.context}
                  locationId = {this.state.locationId}
                  areaId = {this.state.areaId}
                  buildingId = {this.state.buildingId}
                  sizeId = {this.state.sizeId}
                  ></RoomImage>
                }
            </div>
          </div>
        </div>
        <div className="ms-Grid" dir="ltr">
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm12 block">
            {this.state.sizeId <= 0 && <div>Schedule will be loaded according to the selection</div>}
              {this.state.sizeId > 0 &&
                <Calendar 
                   title= {this.props.title}
                   siteUrl= {this.props.siteUrl}
                   list = {this.props.list}
                   displayMode = {this.props.displayMode}
                   context ={ this.props.context}
                   eventStartDate = {this.props.eventStartDate}
                   eventEndDate = {this.props.eventEndDate}
                   updateProperty = {this.updatePropertyHandler}
                />
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
