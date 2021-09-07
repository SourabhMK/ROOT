import * as React from 'react';
import styles from '../Birthday.module.scss';
import { IAnniversaryUserListProps, IAnniversaryUserListState } from './IAnniversaryUserListProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Callout, DirectionalHint } from 'office-ui-fabric-react/lib/Callout';
import { SendAnniversaryEmailCallout } from './SendAnniversaryEmailCallout';
import { Placeholder } from "@pnp/spfx-controls-react/lib/Placeholder";
import {
  Persona,
  PersonaSize
} from 'office-ui-fabric-react/lib/Persona';
import { initializeIcons } from "@fluentui/font-icons-mdl2";
import { Icon } from '@fluentui/react/lib/Icon';

initializeIcons();

const MyMailIcon = () => <Icon iconName="Mail" />;

export default class AnniversaryUser extends React.Component<IAnniversaryUserListProps, IAnniversaryUserListState> {

  constructor(props: IAnniversaryUserListProps, state: IAnniversaryUserListState) {  
    super(props);    
    this.state = {
      showCallOut: false,
      calloutElement: null,
      person: null
    };

    this._onCalloutDismiss = this._onCalloutDismiss.bind(this);
  }

  public render(): React.ReactElement<IAnniversaryUserListProps> {
    return (
      <div>
        {!this.props.people &&
        <div>
          <Placeholder 
            iconName = ''
            iconText = 'No Work Annversaries in this month.'
            description = ''/>
        </div>
      }
      {this.props.people &&
      <div>
      {this.props.people.map((p, i) => {

        let finalhiredate;
        if(p.hireDate === "" || p.hireDate === undefined)
        {
          finalhiredate = p.hireDate;
        }
        else
        {
          let hiredate = new Date(p.hireDate);
          finalhiredate = new Intl.DateTimeFormat('en-US', {day: '2-digit',month: 'long'}).format(hiredate); 
        } 
          return(                
              <div className = {styles.persona_card}> 
                <Persona primaryText={p.name} secondaryText={finalhiredate} tertiaryText={p.email} imageUrl={p.photoUrl} imageAlt={p.name} size={PersonaSize.size72} />                
               
                <div id={`callout${i}`} onClick={this._onSendEmailClicked(i, p)} className={styles.persona}>
                  <MyMailIcon />
                </div> 
                
                { this.state.showCallOut && this.state.calloutElement === i && (
                <Callout
                  className={this.state.showCallOut ? styles.calloutShow: styles.callout}
                  gapSpace={16}
                  target={`#callout${i}`}
                  isBeakVisible={true}
                  beakWidth={18}
                  setInitialFocus={true}
                  onDismiss={this._onCalloutDismiss}
                  directionalHint={DirectionalHint.rightCenter}
                  doNotLayer={false}
                >
                  <SendAnniversaryEmailCallout person={this.state.person} siteurl={this.props.siteurl} spHttpClient = {this.props.spHttpClient} loggedInUserEmail={this.props.loggedInUserEmail}></SendAnniversaryEmailCallout>
                </Callout>
                )}                 
                                    
              </div>
          );                                                      
        })}
        </div>
        }
      </div>
  );
  }
  
  private _onSendEmailClicked = (index, person) => event => {
    this.setState({
      showCallOut: !this.state.showCallOut,
      calloutElement: index,
      person: person
    });
  }

  private _onCalloutDismiss = (event) => {
    this.setState({
      showCallOut: false,
    });
  }
}
