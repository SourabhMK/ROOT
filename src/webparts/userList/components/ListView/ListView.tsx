import * as React from 'react';
import styles from './ListView.module.scss';
import { IListViewProps } from './IListViewProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { IALLUserListState } from './IAllUserListState';
import {IUserResults, ICell} from './IUserResults';
import {IUserAll} from './IUserAll';
import {IUserListProps} from '../IUserListProps'

import {
  Persona,
  PersonaSize
} from 'office-ui-fabric-react/lib/Persona';

export default class ListView extends React.Component<IListViewProps,{}> {

constructor(props){
  super(props);

  this.state = {
    Users:[],
  };
}


  public render(): React.ReactElement<IListViewProps> {
    return (
      <div className={ styles.listView }>
        {this.props.people.map((p,i) => {
            const phone: string = p.phone && p.mobile ? `${p.phone}/${p.mobile}`: p.phone ? p.phone: p.mobile;
            // const toggleClassName: string = this.state.toggleClass ? `ms-Icon--ChromeClose ${styles.isClose}` : "ms-Icon--ContactInfo";
            return (
              <div className={styles.persona_card}>
                { (this.props.listSelect === 0 && this.props.contactSelect &&
                <Persona primaryText={p.name} secondaryText={p.email} tertiaryText={phone} imageUrl={p.photoUrl} imageAlt={p.name} size={PersonaSize.size72} />) || (this.props.listSelect === 0 &&
                  <Persona primaryText={p.name} secondaryText={p.email} imageUrl={p.photoUrl} imageAlt={p.name} size={PersonaSize.size72} />)
                }

                { this.props.listSelect === 1 &&
                <Persona primaryText={`${p.lastName } ${p.firstName}`} secondaryText={p.email} tertiaryText={phone} imageUrl={p.photoUrl} imageAlt={p.name} size={PersonaSize.size72} />
                }

                { this.props.listSelect === 2 &&
                <Persona primaryText={p.firstName} secondaryText={p.email} tertiaryText={phone} imageUrl={p.photoUrl} imageAlt={p.name} size={PersonaSize.size72} />
                }
                

                
              </div>
            );
            })
          }
        </div>
    )
}
}
