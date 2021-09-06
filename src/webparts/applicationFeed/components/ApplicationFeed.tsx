import * as React from 'react';
import styles from './ApplicationFeed.module.scss';
import { IApplicationFeedProps } from './IApplicationFeedProps';
import { IApplicationFeedState } from './IApplicationFeedState';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { Icon } from '@fluentui/react/lib/Icon';

const MyApplicationFeedIcon = () => <Icon iconName="OfficeChat" className = {styles.applicationFeedIcon} />;

let AppFeed: any = [];

export default class ApplicationFeed extends React.Component<IApplicationFeedProps,IApplicationFeedState, {}> {

  constructor(props: IApplicationFeedProps, state:IApplicationFeedState) {
    super(props); 
    this.state = {
      applicationFeedData: [{
        Id:"",
        Title:"",
        URL:"",
        Order:"",    
      }]
      //selectedImage: "",
      //message: "",
      
      //errorMessage : ""
    };          
  }

  componentDidMount()
  {
    this._getApplicationFeedData();
    // this._getApplicationFeedData().then((AppFeed: any): void=>{
    //   for (let i = 0; i < AppFeed.value.length; i++) { 
    //     this.state.applicationFeedData.push({
    //       Id:AppFeed.value[i].Id,
    //       Title:AppFeed.value[i].Title,
    //       URL:AppFeed.value[i].URL,
    //       Order:AppFeed.value[i].Order0
    //     });     
    //     }
    //     this.setState({
    //       applicationFeedData: this.state.applicationFeedData
    //     },()=>console.log("applicationFeedData =>" + this.state.applicationFeedData)
    //     )
    // })


  } 

  _getApplicationFeedData = async () =>
  {    
    const headers: HeadersInit = new Headers();
    headers.append("accept", "application/json;odata.metadata=none");

        await this.props.spHttpClient
        .get(`${this.props.siteurl}/_api/web/lists/getbytitle('ApplicationList')/items?$select=ID,Title,URL,Order0&$orderby=Order0 asc`, 
          SPHttpClient.configurations.v1, {
          headers: headers
        })
        .then((result: SPHttpClientResponse) => {          
          return result.json();
        })
        .then((jsonresult) => {
          AppFeed = [];         
          for(let i=0; i<jsonresult.value.length; ++i)
          {
            AppFeed.push({
              //this.state.applicationFeedData.push({
              Id:jsonresult.value[i].Id,
              Title:jsonresult.value[i].Title,
              URL:jsonresult.value[i].URL,
              Order:jsonresult.value[i].Order0
            });
          }
          console.log("applicationFeed Data Array=>" + AppFeed);
          this.setState({
            applicationFeedData: AppFeed
          },()=>console.log("applicationFeedData =>" + this.state.applicationFeedData)
          )
        })      
  }  


  public render(): React.ReactElement<IApplicationFeedProps> {
    return (
      <div className={ styles.applicationFeed }>
        <div className={ styles.container }>
            <div className={styles.description}>                        
              <h1 style={{margin:'0'}}><MyApplicationFeedIcon/> Application Feed </h1>
            </div>
            {/* <div className={styles.myTable}>
              <h1> Static Data </h1>
              <table> 
              <tr><td><a href="https://www.google.com" title="Google" target='_blank'>Google</a></td></tr>
              <tr><td><a href="https://www.facebook.com" title="Facebook" target='_blank'>Facebook</a></td></tr>  
              <tr><td><a href="https://login.paylocity.com" title="Payroll" target='_blank'>Payroll</a></td></tr>
              <tr><td><a href="https://www.eyemedvisioncare.com/member" title="Vision Insurance" target='_blank'>Vision Insurance</a></td></tr>
              </table>
            </div>                  */}
            <div className={styles.myTable}>          
              <table>                 
              {this.state.applicationFeedData.map( (AppFeedItem, index)=> {
              return(
              <tr><td key={AppFeedItem.Id}><a href={AppFeedItem.URL} title={AppFeedItem.Title} target='_blank'>{AppFeedItem.Title}</a></td></tr> 
              )
              })}             
              </table>
            </div>
            {/* <div className={ styles.row }>
            <div className={ styles.column }>
              <span className={ styles.title }>Welcome to SharePoint!</span>
              <p className={ styles.subTitle }>Customize SharePoint experiences using Web Parts.</p>
              <p className={ styles.description }>{escape(this.props.description)}</p>
              <a href="https://aka.ms/spfx" className={ styles.button }>
                <span className={ styles.label }>Learn more</span>
              </a>
            </div>
          </div> */}
        </div>
      </div>
    );
  }
}
