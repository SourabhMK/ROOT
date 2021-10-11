import * as React from 'react';
import styles from './AssetReservation.module.scss';
import { IAssetReservationProps } from './IAssetReservationProps';
import { IAssetReservationState } from './IAssetReservationState';
import { escape } from '@microsoft/sp-lodash-subset';
import AssetFilter from '../components/AssetFilter/AssetFilter';
import AssetImage from '../components/AssetImage/AssetImage';
import Calendar from '../../../controls/Calendar/Calendar';
import { IAssetInfo } from '../../../models/IAssetInfo';
import { Logger, LogLevel} from "@pnp/logging";

export default class AssetReservation extends React.Component<IAssetReservationProps, IAssetReservationState> {
  constructor(props:IAssetReservationProps, state:IAssetReservationState) { 
    
    super(props);
    
    this.state = {
      assetInfo: null
    };
    this.EventKeySelectionHandler = this.EventKeySelectionHandler.bind(this);
    Logger.write("AssetReservation class triggered.", LogLevel.Info);
  }

     // Get event once the all drop boxes have been selected. Get keys for all drop down here :)
    private EventKeySelectionHandler(assetInfo: IAssetInfo) {
      this.setState ({
       assetInfo: assetInfo
      });
    }

    private updatePropertyHandler() {
      this.props.updateProperty("");
    }

  public render(): React.ReactElement<IAssetReservationProps> {
    return (
      <div className={ styles.assetReservation }>
        <div className="ms-Grid" dir="ltr">
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm6 block">
              <AssetFilter
                siteUrl= {this.props.siteUrl}
                context={this.props.context}
                EventKeySelection={this.EventKeySelectionHandler}
                > 
              </AssetFilter>
            </div>
            <div className="ms-Grid-col ms-u-sm6 block">
            <AssetImage
                  siteUrl= {this.props.siteUrl}
                  context={this.props.context}
                  assetInfo={ this.state.assetInfo }
                ></AssetImage>
            </div>
          </div>
        </div>
        <div className="ms-Grid" dir="ltr">
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm12 block">
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
            </div>
          </div>
        </div>
      </div>
    );
  }
}
