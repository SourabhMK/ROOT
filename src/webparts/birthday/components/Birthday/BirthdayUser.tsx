import * as React from 'react';
import styles from '../Birthday.module.scss';
import { IBirthdayUserListProps, IBirthdayUserListState } from './IBirthdayUserListProps';
import { initializeIcons } from "@fluentui/font-icons-mdl2";
import { Icon } from '@fluentui/react/lib/Icon';
import { PrimaryButton } from "@fluentui/react/lib/Button";
import { TextField } from '@fluentui/react/lib/TextField';
import { Callout, DirectionalHint } from 'office-ui-fabric-react/lib/Callout';
import { SendEmailCallout } from "./SendEmailCallout";
import { Placeholder } from "@pnp/spfx-controls-react/lib/Placeholder";
import useMsGraphProvider, { IMSGraphInterface } from "../../../../services/msGraphProvider";
import {
  Persona,
  PersonaSize
} from 'office-ui-fabric-react/lib/Persona';

initializeIcons();
const MyMailIcon = () => <Icon iconName="Mail" />;
const MyTeamsIcon = () => <Icon iconName="TeamsLogo" />;

debugger;

  export default class BirthdayUser extends React.Component<IBirthdayUserListProps, IBirthdayUserListState> {

  constructor(props: IBirthdayUserListProps, state: IBirthdayUserListState) {  
    super(props);    
    this.state = {
      showCallOut: false,
      showCallOutTeams: false,      
      calloutElement: null,
      person: null,
      currentMessage: "",
      errorMessage: "",
      msGraphProvider: {
        getCurrentUserId(): Promise<any>{return},
        getUserId(userEmail: string): Promise<any>{return},
        createUsersChat(requesterId: string, birthdayPersonId: string): Promise<any>{return},
        sendMessage(chatId: string, chatMessage: string): Promise<any>{return}
    },
    };
    this._onCalloutDismiss = this._onCalloutDismiss.bind(this);
    this._onCalloutTeamsDismiss = this._onCalloutTeamsDismiss.bind(this);
    this.fetchMsGraphProvider = this.fetchMsGraphProvider.bind(this);
  }

  componentDidMount()
  {
    this.fetchMsGraphProvider();
  } 

  private updateInputValue(evt) {
    this.setState({
      currentMessage: evt.target.value,
      errorMessage: ""
    });
  }

  fetchMsGraphProvider = async () => {
    this.setState({
      msGraphProvider: (await useMsGraphProvider(this.props.webPartContext.msGraphClientFactory))
    });
  }
  
  _sendMessage = async(ToEmailId) =>
  { 
    if(this.state.currentMessage === "" || this.state.currentMessage === null){
      this.setState({
        errorMessage: "Please write message"
      });
    }
    let currentUserId = await this.state.msGraphProvider.getCurrentUserId(); 
    let userIdToSendMessage = await this.state.msGraphProvider.getUserId(ToEmailId);
    let chatOfUser = await this.state.msGraphProvider.createUsersChat(currentUserId, userIdToSendMessage);
    await this.state.msGraphProvider.sendMessage(chatOfUser, this.state.currentMessage)
    .then(
      (result: any[]): void => {
        console.log(result);
        this.setState({ 
          currentMessage: "",
          showCallOutTeams: false
        });
      })
      .catch(error => {
        console.log(error);
      });    
  } 

  private _onSendEmailClicked = (index, person) => event => {
    this.setState({
      showCallOut: !this.state.showCallOut,
      calloutElement: index,
      person: person
    });
  }

  private _onSendTeamsMsgClicked = (index, person) => event => {    
    this.setState({
      showCallOutTeams: !this.state.showCallOutTeams,
      calloutElement: index,
      person: person
    });
  }

  private _onCalloutDismiss = (event) => {
    this.setState({
      showCallOut: false,
    });
  }

  private _onCalloutTeamsDismiss = (event) => {
    this.setState({
      showCallOutTeams: false,
    });
  }

  public render(): React.ReactElement<IBirthdayUserListProps> {
    return (
        <div>
          {!this.props.people &&
          <div>
            <Placeholder 
              iconName = ''
              iconText = 'No Birthdays in this month.'
              description = ''/>
          </div>
        }
        {this.props.people &&
        
        <div>
        
        {this.props.people.map((p, i) => {
            let finalbirthdate;
            if(p.birthDate === "" || p.birthDate === undefined)
            {
              finalbirthdate = p.birthDate;
            }
            else
            {
              let birthdate = new Date(p.birthDate);
              finalbirthdate = new Intl.DateTimeFormat('en-US', {day: '2-digit',month: 'long'}).format(birthdate); 
            }   
            
            return(  
              
                <div className = {styles.persona_card}> 
                  <Persona primaryText={`${p.name}`} secondaryText={finalbirthdate} tertiaryText={p.email} imageUrl={p.photoUrl} imageAlt={p.name} size={PersonaSize.size72} />                  
                  
                  <div id={`callout${i}`} onClick={this._onSendEmailClicked(i, p)} className={styles.persona}>
                    <MyMailIcon />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </div>&nbsp; 
                  <div id={`callout${i}`} onClick={this._onSendTeamsMsgClicked(i, p)} className={styles.persona}>
                    <MyTeamsIcon />
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
                    <SendEmailCallout person={this.state.person} siteurl={this.props.siteurl} spHttpClient = {this.props.spHttpClient} loggedInUserEmail = {this.props.loggedInUserEmail}></SendEmailCallout>
                  </Callout> 
                  )} 
                  
                  { this.state.showCallOutTeams && this.state.calloutElement === i && (
                  <Callout
                    className={this.state.showCallOutTeams ? styles.calloutShow: styles.callout}
                    gapSpace={16}
                    target={`#callout${i}`}
                    isBeakVisible={true}
                    beakWidth={18}
                    setInitialFocus={true}
                    onDismiss={this._onCalloutTeamsDismiss}
                    directionalHint={DirectionalHint.rightCenter}
                    doNotLayer={false}
                  >
                    <div className={(styles.calloutCard,styles.emailMainContent)}>
                      <h3 className={styles.SendEmailh3}>
                          Send Message to {this.state.person.firstName} in Teams
                      </h3>        
                      <div className={styles.mt10}>
                          <TextField required onChange={evt => this.updateInputValue(evt)} value={this.state.currentMessage} label="Personal Message" multiline resizable={true} />
                      </div>
                      <div style={{color:'#d9534f'}}>{this.state.errorMessage}</div>
                      <div className={styles.SetSaveBtn}>
                          <PrimaryButton style={{border:'1px solid #ddd',backgroundColor:'rgb(239, 135, 0)',color:'#fff', width:'100%'}} onClick={() => this._sendMessage(this.state.person.email)} text="Send" />         
                      </div>             
                    </div>
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
}