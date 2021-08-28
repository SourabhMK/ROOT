import * as React from 'react';
import { ISendAnniversaryEmailCalloutProps } from './ISendAnniversaryEmailCalloutProps';
import styles from '../Birthday.module.scss';
import { DefaultButton, PrimaryButton } from "@fluentui/react/lib/Button";
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { sp } from '@pnp/sp';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/files";
import "@pnp/sp/folders";
import Carousel from 'react-elastic-carousel';
import { TextField } from '@fluentui/react/lib/TextField';


interface ISendAnniversaryEmailCalloutState {    
  selectedImage: string;
  message: string;
  images: string[];
  errorMessage: string;  
} 

let Images: string[] = [];
debugger;
export class SendAnniversaryEmailCallout extends React.Component<ISendAnniversaryEmailCalloutProps, ISendAnniversaryEmailCalloutState> {
  constructor(props: ISendAnniversaryEmailCalloutProps, state: ISendAnniversaryEmailCalloutState) {
    super(props);
    this.state = {
      selectedImage: "",
      message: "",
      images: [],
      errorMessage: ""
    };
    this.getAnniversaryDetails();      
  } 

  getAnniversaryDetails = async () =>
  {
    const headers: HeadersInit = new Headers();
    headers.append("accept", "application/json;odata.metadata=none");

        await this.props.spHttpClient
        .get(`${this.props.siteurl}/_api/web/lists/getbytitle('BirthdayAnniversaryImages')/items?$select=ID,Title,FileLeafRef,ImageWidth,ImageHeight,AuthorId&$filter=Category eq 'Anniversary'`, SPHttpClient.configurations.v1, {
          headers: headers
        })
        .then((result: SPHttpClientResponse) => {          
          return result.json();
        })
        .then((jsonresult) => {
          Images = [];          
          for(let i=0; i<jsonresult.value.length; ++i)
          {
            Images.push(jsonresult.value[i].FileLeafRef);
          }
          this.setState({
            images: Images
          })
        })      
  }

  handleClick = async(image) => {

    await this.setState({
      selectedImage:image,
      errorMessage: ""
    })
  }
  
  handleChange = async(Anniversarymessage :string) => {
    await this.setState({
      message: Anniversarymessage,
      errorMessage: ""
    })   
  }

  public render(): React.ReactElement<ISendAnniversaryEmailCalloutProps> {

    return (
      <div className={(styles.calloutCard,styles.emailMainContent)}>
        <h3 className={styles.SendEmailh3}>
          Send Message to {this.props.person.FirstName}
        </h3>        
          <div className={styles.mt10}>
            <TextField label="Personal Message" className={styles.emailTextarea}multiline rows={3} onChange={e => this.handleChange(e.currentTarget.value)}/>
          </div>             
        <div className={styles.mt10}>
          <label>Select Template:</label>
          <div className={styles.mt10}>
            <Carousel
                pagination={false}
                itemsToShow={1}
                  itemsToScroll={1}
                isRTL={false}
                focusOnSelect={true}>
                  {this.state.images.map((img, index) => {
                    return <img src={`${this.props.siteurl}/BirthdayAnniversaryImages/${img}`} onClick={e=>this.handleClick(img)} className={this.state.selectedImage == img ? styles.selected:''} height="100px" width="100%" margin-top="15px"/>
                  })}                                                
            </Carousel>
            <div style={{color:'#d9534f'}}>{this.state.errorMessage}</div>
          </div>
        </div>
        
        <div className={styles.SetSaveBtn}>                                                             
          {/* <div><DefaultButton style={{border:'1px solid #ddd',backgroundColor:'#d9534f',color:'#fff'}} onClick={this.CancelClicked}>Cancel</DefaultButton></div> */}   
                                                    
          <div><DefaultButton style={{border:'1px solid #ddd',backgroundColor:'rgb(239, 135, 0)',color:'#fff', width:'100%'}} onClick={()=>this.SaveDataClicked(this.state.message,this.state.selectedImage)}>Send</DefaultButton></div>
                        
        </div>             
      </div>
    );    
  }

  SaveDataClicked = async(message, image) =>
  {
    let userEmail = this.props.loggedInUserEmail;
    if(message == "" || message == null)
    {
      this.setState({
        errorMessage: "Please Add message"
      })
      this.render();
    }
    else if(image == "" || image == null)
    {
      this.setState({
        errorMessage: "Please select image"
      })
      this.render();
    }
    else
    {
      const requestlistItem: string = JSON.stringify({
      Title: "Work Anniversary Message",
      EmailSubject: "Happy Work Anniversary",
      EmailBody: message,
      EmailFrom: userEmail,
      EmailTo: this.props.person.Email,
      ActivityEmail: {'Description': image, 'Url': this.props.siteurl + "/BirthdayAnniversaryImages/" + image}   
      });

      console.log(requestlistItem);
      this.props.spHttpClient.post(`${this.props.siteurl}/_api/web/lists/getbytitle('EmailSender')/items`, SPHttpClient.configurations.v1,  
      {  
        headers: {  
        'Accept': 'application/json;odata=nometadata',  
        'Content-type': 'application/json;odata=nometadata',  
        'odata-version': ''  
        },  
        body: requestlistItem  
      }) 
      .then((response: SPHttpClientResponse): Promise<void> => {  
          return response.json();  
      })  
      .then((item: any): void => {  
          console.log('Item has been created.');
      }, (error: any): void => {  
          console.log('Error while creating the item: ' + error);
      });   
    }
  }
  
}
