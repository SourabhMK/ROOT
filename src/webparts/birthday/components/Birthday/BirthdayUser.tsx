import * as React from 'react';
import styles from '../Birthday.module.scss';
import { IBirthdayUserListProps, IBirthdayUserListState } from './IBirthdayUserListProps';
import { initializeIcons } from "@fluentui/font-icons-mdl2";
import { Icon } from '@fluentui/react/lib/Icon';
import { DefaultButton, PrimaryButton } from "@fluentui/react/lib/Button";
import { TextField } from '@fluentui/react/lib/TextField';
import useMsGraphProvider, { IMSGraphInterface } from "../../../../services/msGraphProvider";
import { Callout, DirectionalHint } from 'office-ui-fabric-react/lib/Callout';
import { SendEmailCallout } from "./SendEmailCallout";
import { Placeholder } from "@pnp/spfx-controls-react/lib/Placeholder";
import { Dialog, DialogFooter, DialogType } from '@fluentui/react/lib/Dialog';
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
      calloutElement: null,
      person: null,
      email: null,
      hideDialog: true,
      currentMessage: ""
    };

    this._onCalloutDismiss = this._onCalloutDismiss.bind(this);
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
                  <div onClick={this._onSendTeamsMsgClicked(i, p.email)} className={styles.persona}>
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

                  { !this.state.hideDialog && 
                    <Dialog
                    hidden={this.state.hideDialog}
                    onDismiss={this._closeDialog}
                    dialogContentProps={{
                      type: DialogType.largeHeader,
                      title: ""                      
                    }}
                    modalProps={{
                      isBlocking: false,
                      styles: { main: { minWidth: 600 } }
                    }}
                    >                    
                      <TextField required onChange={evt => this.updateInputValue(evt)} value={this.state.currentMessage} label="Send Message in Teams" multiline resizable={true} />
                      <DialogFooter>
                        <PrimaryButton onClick={() => this._sendMessage(this.state.email)} text="Send" />
                        <DefaultButton onClick={this._closeDialog} text="Cancel" />
                      </DialogFooter>
                    </Dialog>
                  }                
                </div>
            );                                                      
          })}
          </div>
          }
        </div>
    );
  }

  _closeDialog = async () => {
    await this.setState({ 
      hideDialog: true,
      currentMessage: "" 
    });
  }

  _sendMessage = async (ToEmailId) => {
    const [ msGraphProvider, setMSGraphProvider] = React.useState<IMSGraphInterface>();
    
    React.useEffect(() => {
      fetchMsGraphProvider();
    }, []);

    const fetchMsGraphProvider = async () => {
      setMSGraphProvider(await useMsGraphProvider(this.context.msGraphClientFactory));
    };   

    let currentUserId = await msGraphProvider.getCurrentUserId();
    let userIdToSendMessage = await msGraphProvider.getUserId(ToEmailId);
    let chatOfUser = await msGraphProvider.createUsersChat(currentUserId, userIdToSendMessage);
    await msGraphProvider.sendMessage(chatOfUser, this.state.currentMessage)
    .then(
      (result: any[]): void => {
        console.log(result);
        this.setState({ 
          hideDialog: true,
          currentMessage: "" 
        });
      })
      .catch(error => {
        console.log(error);
      });    
  }

  private updateInputValue(evt) {
    this.setState({
      currentMessage: evt.target.value
    });
  }

  private _onSendEmailClicked = (index, person) => event => {
    this.setState({
      showCallOut: !this.state.showCallOut,
      calloutElement: index,
      person: person
    });
  }

  private _onSendTeamsMsgClicked = (index, email) => event => {
    this.setState({
      calloutElement: index,
      email: email,
      hideDialog: false
    });
  }

  private _onCalloutDismiss = (event) => {
    this.setState({
      showCallOut: false,
    });
  }

  /* private sendEmail(ToEmailId: string) {
    alert('Sent Email.' + ToEmailId);

     /* if (ToEmailId) 
    {
      //Create Body for Email  
      let emailPostBody: any = {  
        "message": {  
          "subject": "Birthday Wishes",  
          "body": {  
            "contentType": "HTML",  
            "content": "Many many happy returns of the day.<b>Happy Birthday</b>"  
          },  
          "toRecipients": [  
            {  
              "emailAddress": {  
                "address": ToEmailId 
              }  
            }  
          ],
        }  
      };
      
      //Send Email uisng MS Graph
      this.context.msGraphClientFactory  
      .getClient()  
      .then((client: MSGraphClient): void => {  
        client  
          .api('/me/sendMail')  
          .post(emailPostBody, (error) => {
          //.post(emailPostBody, (error, response: any, rawResponse?: any) => {  
            //Set Error Message Bar for any error  
            if (error) {  
              this.setState({  
                statusMessage: { isShowMessage: true, message: error.message, messageType: 1 }  
              });  
            }  
             //Set Success Message Bar after Sending Email  
            else {  
              this.setState({  
                statusMessage: { isShowMessage: true, message: "Email Sent successfully.", messageType: 4 }  
              });  
            }  
          });  
        });  
      }  
    
  }  */
}