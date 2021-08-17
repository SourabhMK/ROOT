import * as React from 'react';
import styles from '../Birthday.module.scss';
import { IBirthdayUserListProps, IBirthdayUserListState } from './IBirthdayUserListProps';
import { escape, fromPairs } from '@microsoft/sp-lodash-subset';
import { initializeIcons } from "@fluentui/font-icons-mdl2";
import { Icon } from '@fluentui/react/lib/Icon';
import { MSGraphClient } from '@microsoft/sp-http';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
//import useMsGraphProvider, { IMSGraphInterface } from './msGraphProvider';
import { Callout, DirectionalHint } from 'office-ui-fabric-react/lib/Callout';
import { SendEmailCallout } from "./SendEmailCallout";
import { Placeholder } from "@pnp/spfx-controls-react/lib/Placeholder";
import {
  Persona,
  PersonaSize
} from 'office-ui-fabric-react/lib/Persona';

initializeIcons();
const MyMailIcon = () => <Icon iconName="Mail" />;
const MyGiftIcon = () => <Icon iconName="GiftBox" />;

//debugger;
  export default class BirthdayUser extends React.Component<IBirthdayUserListProps, IBirthdayUserListState> {

  constructor(props: IBirthdayUserListProps, state: IBirthdayUserListState) {  
    super(props);    
    this.state = {
      showCallOut: false,
      calloutElement: null,
      person: null
    };

    this._onCalloutDismiss = this._onCalloutDismiss.bind(this);
  }

  public render(): React.ReactElement<IBirthdayUserListProps> {
    return (
        <div>
          {!this.props.people &&
          <Placeholder 
            iconName = ''
            iconText = 'No Birthdays in this month.'
            description = ''/>
        }
        {this.props.people &&
        
        <div>
        
        {this.props.people.map((p, i) => {
            let finalbirthdate;
            if(p.birthdate === "")
            {
              finalbirthdate = p.birthdate;
            }
            else
            {
              let birthdate = new Date(p.birthdate);
              finalbirthdate = new Intl.DateTimeFormat('en-US', {day: '2-digit',month: 'long'}).format(birthdate); 
            }   
            
            return(  
              
                <div className = {styles.persona_card}> 
                  <Persona primaryText={`${p.name}`} secondaryText={finalbirthdate} tertiaryText={p.email} imageUrl={p.photoUrl} imageAlt={p.name} size={PersonaSize.size72} />
                  
                  {/* <div onClick={() => this.sendMessageToTeams(p.email)} className={styles.persona}>
                    <i className = "ms-Icon ms-Icon--TeamsLogo" aria-hidden="true"></i>
                  </div> */}
                  <div id={`callout${i}`} onClick={this._onSendEmailClicked(i, p)} className={styles.persona}>
                    {/* <i className ="ms-Icon ms-Icon--Mail" aria-hidden="true"></i> */}
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
                    <SendEmailCallout person={this.state.person} siteurl={this.props.siteurl} spHttpClient = {this.props.spHttpClient}></SendEmailCallout>
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
  
 /*  sendMessageToTeams = async (ToUserId: string) => 
  {
      const [ msGraphProvider, setMSGraphProvider] = React.useState<IMSGraphInterface>();

      const fetchMsGraphProvider = async () => {
        setMSGraphProvider(await useMsGraphProvider(this.context.msGraphClientFactory));
      };

      React.useEffect(() => {
        fetchMsGraphProvider();
      }, []);

      alert("In teams message "+ToUserId);
      let currentUserId = await msGraphProvider.getCurrentUserId();
      let userIdToSendMessage = ToUserId;
      let chatOfUser = await msGraphProvider.createUsersChat(userIdToSendMessage, currentUserId);
      let result = await msGraphProvider.sendMessage(chatOfUser, "Happy Birthday");      
  } */


  private _onCalloutDismiss = (event) => {
    this.setState({
      showCallOut: false,
    });
  }

}