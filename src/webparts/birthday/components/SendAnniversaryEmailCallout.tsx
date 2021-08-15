import * as React from 'react';
import { ISendAnniversaryEmailCalloutProps } from './ISendAnniversaryEmailCalloutProps';
import styles from './Birthday.module.scss';
import { DefaultButton, PrimaryButton } from "@fluentui/react/lib/Button";
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import Carousel from 'react-elastic-carousel';
import { TextField } from '@fluentui/react/lib/TextField'
import { Image } from '@microsoft/microsoft-graph-types';

interface ISendAnniversaryEmailCalloutState {    
  selectedImage: Image;
  message: string;  
} 

export class SendAnniversaryEmailCallout extends React.Component<ISendAnniversaryEmailCalloutProps, ISendAnniversaryEmailCalloutState> {
  constructor(props: ISendAnniversaryEmailCalloutProps, state: ISendAnniversaryEmailCalloutState) {
    super(props);
    this.state = {
      selectedImage: null,
      message: ""
    };      
  }

  componentDidMount(){      
    //this.LoadAnniversaryTemplates();    
  } 

  handleClick = async(image) => {

    await this.setState({
      selectedImage:image
    })
  }
  
  handleChange = async(Anniversarymessage :string) => {
    await this.setState({
      message: Anniversarymessage
    })   
  }

  public render(): React.ReactElement<ISendAnniversaryEmailCalloutProps> {

    let image1: string = require('.../../../sharepoint/assets/Anniversary1.jpg'); 
    let image2: string = require('.../../../sharepoint/assets/Anniversary2.jpg'); 
    let image3: string = require('.../../../sharepoint/assets/Anniversary3.jpg');
    let image4: string = require('.../../../sharepoint/assets/Anniversary4.jpg');
    let image5: string = require('.../../../sharepoint/assets/Anniversary5.jpg');
    
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
    
  }
  
}
