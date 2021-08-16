import * as React from 'react';
import styles from './AssetReservation.module.scss';
import { IAssetReservationProps } from './IAssetReservationProps';
import { IRoomsProps} from './Rooms/IRoomsProps';
import Rooms from '../components/Rooms/Rooms';

export default class AssetReservation extends React.Component<IAssetReservationProps, {}> {
  public render(): React.ReactElement<IAssetReservationProps> {
    return (
      <div className={ styles.assetReservation }>
        {/* <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }> */}
              {/* <span className={ styles.title }>Room Reservation</span>
              <p className={ styles.subTitle }>Room Reservation widget helps to add reservation and find available slot for room reservation</p> */}
              <Rooms description={this.props.description}
              context={this.props.context}
              //roomsOptionsName={this.props.roomsOptionsName}
              />
            {/* </div>
          </div>
        </div> */}
      </div>
    );
  }
}
