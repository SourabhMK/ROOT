import * as React from 'react';
import styles from '../Followers/followerUser.module.scss';
import { IFollowerUserListProps } from './IFollowerUserListProps';
import { escape } from '@microsoft/sp-lodash-subset';

import {
  Persona,
  PersonaSize
} from 'office-ui-fabric-react/lib/Persona';


export default class FollowerUser extends React.Component<IFollowerUserListProps, {}> {
  public render(): React.ReactElement<IFollowerUserListProps> {
    return (
      <div className={ styles.followerUser }>
        {this.props.people.map((p,i) => {
            // const phone: string = p.phone && p.mobile ? `${p.phone}/${p.mobile}`: p.phone ? p.phone: p.mobile;
            // const toggleClassName: string = this.state.toggleClass ? `ms-Icon--ChromeClose ${styles.isClose}` : "ms-Icon--ContactInfo";
            return (
              <div className={styles.persona_card}>
                <Persona primaryText={p.name} secondaryText={p.email} imageUrl={p.photoUrl} imageAlt={p.name} size={PersonaSize.size72} />
              </div>
            );
            })
          }
        </div>
    );
  }
}
