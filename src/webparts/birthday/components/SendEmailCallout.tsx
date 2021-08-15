import * as React from 'react';
import { ISendEmailCalloutProps } from './ISendEmailCalloutProps';
import styles from './Birthday.module.scss';
import { DefaultButton, PrimaryButton } from "@fluentui/react/lib/Button";
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { sp } from '@pnp/sp';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/files";
import "@pnp/sp/folders";
import Carousel from 'react-elastic-carousel';
//import AwesomeSlider from 'react-awesome-slider';
//import withAutoplay from 'react-awesome-slider/dist/autoplay';
import { TextField } from '@fluentui/react/lib/TextField'
import { Image } from '@microsoft/microsoft-graph-types';

//const AutoplaySlider = withAutoplay(AwesomeSlider);
/* export interface Iurl {  
  File: urlproperties;  
}

export interface urlproperties {  
  ServerRelativeUrl: string;  
   
}*/

interface ISendEmailCalloutState {    
  selectedImage: Image;
  message: string;  
} 

debugger;
export class SendEmailCallout extends React.Component<ISendEmailCalloutProps, ISendEmailCalloutState> { 

  constructor(props: ISendEmailCalloutProps, state:ISendEmailCalloutState) {
    super(props); 
    this.state = {
      selectedImage: null,
      message: ""
    };       
  }  

  componentDidMount(){      
    /* this._getBirthdayImages()
      .then((response: Iurl[]) => {
        console.log(response);  
        console.log(response[0].File.ServerRelativeUrl);  
        this.setState({ ImageFile: response });
      }); */    
  }
 
  private _getBirthdayImages()
  {
    /* const headers: HeadersInit = new Headers();
    headers.append("accept", "application/json;odata.metadata=none");
    
    this.props.spHttpClient
        .get(`${this.props.siteurl}/_api/web/lists/getByTitle('BirthdayPictureLibrary')/items?$select=FileRef`,SPHttpClient.configurations.v1, {
          headers: headers
        })
        .then((result: SPHttpClientResponse) => {
          return result.json();
        })
        .then((jsonresult) => {
          
        }) */
        /* return sp.web.lists.getByTitle("TestVrushali")  
        .items.expand("Folder", "File").get(); */
  }  

  handleClick = async(image) => {

    await this.setState({
      selectedImage:image
    })
    //alert("image: " + this.state.selectedImage);
  }
  
  handleChange = async(birthmessage :string) => {
    await this.setState({
      message: birthmessage
    })  
    //alert("message: " + this.state.message);  
  }

  public render(): React.ReactElement<ISendEmailCalloutProps> {   
    
    let image1: string = require('.../../../sharepoint/assets/happy-birthday.jpg'); 
    let image2: string = require('.../../../sharepoint/assets/ballon.jpg'); 
    let image3: string = require('.../../../sharepoint/assets/Birthday2.jpg');
    let image4: string = require('.../../../sharepoint/assets/Birthday4.jpg');
    let image5: string = require('.../../../sharepoint/assets/Birthday5.jpg');
    
    const imageList = [image1, image2, image3, image4, image5];
    return (
      <div className={(styles.calloutCard,styles.emailMainContent)}>
        <h3 className={styles.SendEmailh3}>
          Send Message to {this.props.person.firstName}
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
                {imageList.map((x, index) => {
                  return <img src={x} onClick={e=>this.handleClick(x)} className={this.state.selectedImage == x ? 'selected':''} height="100px" width="100%" margin-top="15px"/>
                })}
                {/* <img src={image1} height="100px" width="100%" margin-top="15px"></img> 
                <img src={image2} height="100px" width="100%" margin-top="15px"></img>
                
                <img src={image3} height="100px" width="100%" margin-top="15px"></img> */}                 
            </Carousel>
          </div>
        </div>
        
        <div className={styles.SetDisplay}>                                                             
          <div><DefaultButton style={{border:'1px solid #ddd',backgroundColor:'#d9534f',color:'#fff'}} onClick={this.CancelClicked}>Cancel</DefaultButton></div>   
                                                    
          <div><DefaultButton style={{border:'1px solid #ddd',backgroundColor:'#337ab7',color:'#fff'}} onClick={()=>this.SaveDataClicked(this.state.message,this.state.selectedImage)}>Save</DefaultButton></div>
                        
        </div>             
      </div>
    );
  }

  private CancelClicked ()
  {
   
  }
  
  SaveDataClicked = async(message, image) =>
  {
    //let list = sp.web.lists.getByTitle("EmailSender");
    /* let json = {
      "fileName": "ballon.jpg",
      "serverUrl": "https://champion1.sharepoint.com",
      "serverRelativeUrl": "/sites/SPMall/Style%20Library/Images/ballon.jpg"
    };
    let jsonstr = JSON.stringify(json); 
 */
    alert("inside save.");   
    alert("image: " + image);
    alert("message: "+ message);

    const assets = sp.web.lists.ensureSiteAssetsLibrary();
    alert("site asset library: " + assets);

    const fileItem = (await assets).rootFolder.files.add(image, true);

    const img = {
      "serverUrl": "https://champion1.sharepoint.com",
      "serverRelativeUrl":(await fileItem).data.ServerRelativeUrl
    };
    
    await sp.web.lists.getByTitle("EmailSender").items.add({
      Title: "Hello",
      ActivityEmail: JSON.stringify(img)
    });
    
  }   
}
