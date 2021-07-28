import * as React from 'react';
import styles from './Birthday.module.scss';
import { IAnniversaryUserListProps } from './IAnniversaryUserListProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { initializeIcons } from "@fluentui/font-icons-mdl2";
import { Icon } from '@fluentui/react/lib/Icon';

initializeIcons();


export default class AnniversaryUser extends React.Component<IAnniversaryUserListProps, {}> {
  public render(): React.ReactElement<IAnniversaryUserListProps> {
    return (              
        
        <div>
            {this.props.people.map((p, i) => {
                return(
                    <div className = {styles.row}>                      
                    <div className = {styles.column}>{p.firstName}</div> 
                    <div className = {styles.column}>{p.email} <i className ="ms-Icon ms-Icon--Mail" aria-hidden="true" onClick={() => this.sendEmail(p.email)}></i></div>
                    <div className = {styles.column}><img src = {p.photoUrl} /></div>
                    <div className = {styles.column}>{p.hiredate}</div>
                      {new Intl.DateTimeFormat("en-GB", {
                        year: "numeric",
                        month: "long",
                        day: "2-digit"
                        }).format(p.hiredate)}                    
                    </div>
                );                                                               
            })}
        </div>         
    );
  }
  
  private sendEmail(ToEmailId: string): void {
    alert('Sent Email.' + ToEmailId);

    if (ToEmailId) 
    {
        
    }
    
  }

}
