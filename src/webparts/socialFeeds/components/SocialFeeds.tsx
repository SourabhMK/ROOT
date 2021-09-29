import * as React from 'react';
import styles from './SocialFeeds.module.scss';
import { ISocialFeedsProps } from './ISocialFeedsProps';
import Facebook  from "./Facebook/Facebook";
import Instagram from "./Instagram/Instagram";
import { PivotItem, Pivot, IPivotItemProps } from 'office-ui-fabric-react/lib/Pivot';
import { Label } from 'office-ui-fabric-react';

export default class SocialFeeds extends React.Component<ISocialFeedsProps, {}> {

  constructor(props){
    super(props);
  }

  public render(): React.ReactElement<ISocialFeedsProps> {
    return (
      <div className={ styles.socialFeeds }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
              <div>Social Feeds</div>              
            </div>                      
          </div>
          <div className={ styles.row }>
            <div>
              <Pivot>
                <PivotItem headerText="Facebook">                  
                  <div className={ styles.column }>
                    <Facebook company={this.props.company} height={this.props.height} smallHeader={this.props.smallHeader} hideCover={this.props.hideCover} showFacepile={this.props.showFacepile}></Facebook>
                  </div>                  
                </PivotItem>
                <PivotItem headerText="Instagram">
                  <Label>Inside Instagram</Label>
                  {/* <Instagram username={this.props.username} showAlias={this.props.showAlias}></Instagram> */}
                </PivotItem>
                <PivotItem headerText="Twitter"><Label>Inside Twitter</Label></PivotItem>
                <PivotItem headerText="Yammer"><Label>Inside Yammer</Label></PivotItem>
                <PivotItem headerText="LinkedIn"><Label>Inside LinkedIn</Label></PivotItem>
              </Pivot>
              </div>
          </div>
        </div>
      </div>
    );
  }
}