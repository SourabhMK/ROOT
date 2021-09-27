import * as React from 'react';
import { Resizable } from 'on-el-resize/lib/components';
import { IFacebookProps } from './IFacebookProps'; 
import styles from './Facebook.module.scss';
import { initializeIcons } from "@fluentui/font-icons-mdl2";
import { Icon } from '@fluentui/react/lib/Icon';

initializeIcons();
const MyBirthdayIcon = () => <Icon iconName="BirthdayCake" />;

export default class Facebook extends React.Component<IFacebookProps, {}> {

  public render() {
    return (
      <div>
        <div className={styles.description}>                        
          <h1 style={{margin:'0'}}><MyBirthdayIcon/>Birthday/Anniversary</h1>
        </div>          
        <br></br>
        <Resizable
          className={styles.facebookContainer}
          render={({ width }) => {
            return (
              <iframe
                src={this.buildIFrameUrl(width)}
                width={width}
                height={this.props.height || 500}
                style={{
                  border: 'none',
                  overflow: 'hidden',
                  width: '100%'
                }}
                scrolling='no'
                allowTransparency={true}
              />            
            );
          }}
        />
      </div>
    );
  }

  private buildIFrameUrl(width: number): string {
    return `https://www.facebook.com/plugins/page.php?` +
      `href=${encodeURIComponent(`https://www.facebook.com/${this.props.company || 'Microsoft'}`)}&` +
      `width=${width}&` +
      `height=${this.props.height || 500}&` +
      `small_header=${typeof this.props.smallHeader !== 'undefined' ? this.props.smallHeader : false}&` +
      `hide_cover=${typeof this.props.hideCover !== 'undefined' ? this.props.hideCover : false}&` +
      `show_facepile=${typeof this.props.showFacepile !== 'undefined' ? this.props.showFacepile : false}&` +
      `adapt_container_width=true&` +
      `tabs=timeline`;
  }

}