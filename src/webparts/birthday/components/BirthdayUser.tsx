import * as React from 'react';
import styles from './Birthday.module.scss';
import { IBirthdayUserListProps, IBirthdayUserListState } from './IBirthdayUserListProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { initializeIcons } from "@fluentui/font-icons-mdl2";
import { Icon } from '@fluentui/react/lib/Icon';
import { MSGraphClient } from '@microsoft/sp-http';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';

initializeIcons();

  export default class BirthdayUser extends React.Component<IBirthdayUserListProps, IBirthdayUserListState> {

  constructor(props: IBirthdayUserListProps, state: IBirthdayUserListState) {  
    super(props);    
    this.state = ({        
      statusMessage: {  
        isShowMessage: false,  
        message: "",  
        messageType: 90000  
      }  
    });      
  }

  public render(): React.ReactElement<IBirthdayUserListProps> {
    return (
        <div>
        {this.props.people.map((p, i) => {
            return(                
                <div className = {styles.row}> 
                
                  <div className = {styles.column}><img src = {p.photoUrl} /></div>
                  
                  <div className = {styles.column}>{p.firstName}</div>
                  <div className = {styles.column}>{p.birthdate}</div>
                  <div className = {styles.column}>{p.email} <i className ="ms-Icon ms-Icon--Mail" aria-hidden="true" onClick={() => this.sendEmail(p.email)}></i></div>                  
                                      
                </div>
            );                                                      
          })}
        </div>
    );
  }

  private sendEmail(ToEmailId: string) {
    alert('Sent Email.' + ToEmailId);

     if (ToEmailId) 
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
          .post(emailPostBody, (error, response: any, rawResponse?: any) => {  
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
    
  }   
}