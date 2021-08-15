import * as React from 'react';
import styles from './Birthday.module.scss';
import { IBirthdayProps } from './IBirthdayProps';
import { Version, Environment, EnvironmentType } from '@microsoft/sp-core-library';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { DefaultButton, PrimaryButton } from "@fluentui/react/lib/Button";
import { IBirthday} from '../../../Models/IBirthday';
import { IAnniversary } from '../../../Models/IAnniversary';
import { IBirthdayState } from './IBirthdayState';
import { IBirthdayResults, ICell } from '../../../Models/IBirthdayResults';
import BirthdayUser from './Birthday/BirthdayUser';
import AnniversaryUser  from './Anniversary/AnniversaryUser';
import { initializeIcons } from "@fluentui/font-icons-mdl2";
import { Icon } from '@fluentui/react/lib/Icon';

initializeIcons();
const MyBirthdayIcon = () => <Icon iconName="BirthdayCake" className = {styles.birthdayIcon} />;
debugger;
export default class Birthday extends React.Component<IBirthdayProps, IBirthdayState> {  

  constructor(props){
    super(props);
    this.state = {
      BUsers:[],    
      AUsers:[],
      count : 0,    
      bgColorBirthday:"rgb(239, 135, 0)",
      bgColorAnniversary: "white",   
      colorBirthday:"white",
      colorAnniversary:"black",    
      loading:false,
      errorMessage:null,
      StartDate:null,
      EndDate:null
    }
  }

  componentDidMount(){     
    this.LoadBirthdayDetails();    
  }

  private CountStartAndEndDates (): void {
    let newDate = new Date();
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1; 
    
    let year = newDate.getFullYear();      
    let days: number = this.CountDays(month, year);
    
    let startDate, endDate : string;
    if(month < 10)
    {
      startDate  = "2000-0" + month + "-01";
      endDate = "2000-0" + month + "-" + days;
    }
    else
    {
      startDate  = "2000-" + month + "-01";
      endDate  = "2000-" + month + "-" + days;
    }  

    this.setState({
       StartDate: startDate,
       EndDate: endDate,
     })
   
  }

  private CountDays(month:number, year:number): number {
    return new Date(year, month, 0).getDate();
  }
   
  LoadBirthdayDetails = async () => {

    await this.CountStartAndEndDates();
        
      this.setState({
        loading:true,
        errorMessage:null,       
      }) 

      const headers: HeadersInit = new Headers();
      // suppress metadata to minimize the amount of data loaded from SharePoint
      headers.append("accept", "application/json;odata.metadata=none");
    
      this.props.spHttpClient
        .get(`${this.props.siteurl}/_api/search/query?querytext='*'&sourceid='b09a7990-05ea-4af9-81ef-edfab16c4e31'&rowlimit=500&selectproperties='FirstName,LastName,PreferredName,WorkEmail,PictureURL,RefinableDate00'&refinementfilters='RefinableDate00:range(datetime(${this.state.StartDate}), datetime(${this.state.EndDate}))'`, SPHttpClient.configurations.v1, {
          headers: headers
        })
        .then((res: SPHttpClientResponse): Promise<IBirthdayResults> => {          
          return res.json();
        })
        .then((res: IBirthdayResults): void => {
          if (res.error) {
          //   // There was an error loading information about people.
          //   // Notify the user that loading data is finished and return the
          //   // error message that occurred
            this.setState({
              loading: false,
              errorMessage: res.error.message,
            });
            return;
          }
          if (res.PrimaryQueryResult.RelevantResults.TotalRows == 0) {
            // No results were found. Notify the user that loading data is finished
            this.setState({
              loading: false
            });
            return;
          }
      
          let userphotourl: string = this.props.siteurl.substring(0,this.props.siteurl.search("/sites"));   
        
          let people: IBirthday[] = res.PrimaryQueryResult.RelevantResults.Table.Rows.map(r => {    return {      

            name: this._getValueFromSearchResult('PreferredName', r.Cells),
            firstName: this._getValueFromSearchResult('FirstName', r.Cells),
            lastName: this._getValueFromSearchResult('LastName', r.Cells),     
            email: this._getValueFromSearchResult('WorkEmail', r.Cells),
            photoUrl: `${userphotourl}${"/_layouts/15/userphoto.aspx?size=S&accountname=" + this._getValueFromSearchResult('WorkEmail', r.Cells)}`,
            birthdate:  this._getValueFromSearchResult('RefinableDate00', r.Cells)
          };
      });
      
        if(people.length>0){
          people = this.SortBirthday(people);      
          this.setState({
            loading:false,
            BUsers : people,
          })
        }
      }, (error: any): void => {
      // An error has occurred while loading the data. Notify the user
      // that loading data is finished and return the error message.
      this.setState({
        loading: false,
        errorMessage: error
      });
    })
    .catch((error: any): void => {
    // An exception has occurred while loading the data. Notify the user
    // that loading data is finished and return the exception.
      this.setState({
        loading: false,
        errorMessage: error
      });
    });
  }
  
  private SortBirthday(BirthUsers: IBirthday[])
  {
    return BirthUsers.sort((a, b) => {
      if(a.birthdate > b.birthdate)
      {
        return 1;
      }
      if(a.birthdate < b.birthdate)
      {
        return -1;
      }
      return 0;
    });
  }

  private SortAnniversary(AnniUsers: IAnniversary[])
  {
    return AnniUsers.sort((a, b) => {
      if(a.hiredate > b.hiredate)
      {
        return 1;
      }
      if(a.hiredate < b.hiredate)
      {
        return -1;
      }
      return 0;
    });
  }
   
  BirthdayClicked = () =>{
    this.setState({
      count: 1,
      bgColorBirthday:"rgb(239, 135, 0)",
      bgColorAnniversary:"white",
      colorBirthday:"white",
      colorAnniversary:"black",    
    })
    this.LoadBirthdayDetails();
  }

  AnniversaryClicked = () =>{
    this.setState({
      count: 2,
      bgColorBirthday:"white",
      bgColorAnniversary:"rgb(239, 135, 0)",
      colorBirthday:"black",
      colorAnniversary:"white",    
    })
    this.LoadAnniversaryDetails();
  }
  
  private _getValueFromSearchResult(key: string, cells: ICell[]): string {
    for (let i: number = 0; i < cells.length; i++) {
      if (cells[i].Key === key) {
        return cells[i].Value;
      }
    }
    return '';
  }   

  LoadAnniversaryDetails = async () => {
    await this.CountStartAndEndDates();
    this.setState({
      loading:true,
      errorMessage:null,
    })
  
    const headers: HeadersInit = new Headers();
    // suppress metadata to minimize the amount of data loaded from SharePoint
    headers.append("accept", "application/json;odata.metadata=none");
  
      this.props.spHttpClient
        .get(`${this.props.siteurl}/_api/search/query?querytext='*'&sourceid='b09a7990-05ea-4af9-81ef-edfab16c4e31'&rowlimit=500&selectproperties='FirstName,LastName,PreferredName,WorkEmail,PictureURL,RefinableDate01'`, SPHttpClient.configurations.v1, {
          headers: headers
        })
        .then((res: SPHttpClientResponse): Promise<IBirthdayResults> => {          
          return res.json();
        })
        .then((res: IBirthdayResults): void => {
          if (res.error) {
            this.setState({
              loading: false,
              errorMessage: res.error.message,
            });
            return;
          }
          if (res.PrimaryQueryResult.RelevantResults.TotalRows == 0) {
            // No results were found. Notify the user that loading data is finished
            this.setState({
              loading: false
            });
            return;
          }
    
          let userphotourl: string = this.props.siteurl.substring(0,this.props.siteurl.search("/sites"));   
        
          let people: IAnniversary[] = res.PrimaryQueryResult.RelevantResults.Table.Rows.map(r => {    return {      

            name: this._getValueFromSearchResult('PreferredName', r.Cells),
            firstName: this._getValueFromSearchResult('FirstName', r.Cells),
            lastName: this._getValueFromSearchResult('LastName', r.Cells),     
            email: this._getValueFromSearchResult('WorkEmail', r.Cells),
            photoUrl: `${userphotourl}${"/_layouts/15/userphoto.aspx?size=S&accountname=" + this._getValueFromSearchResult('WorkEmail', r.Cells)}`,            
            hiredate: this._getValueFromSearchResult('RefinableDate01', r.Cells)
          };
        });
    
        if(people.length>0){          
          people = this.SortAnniversary(people);
          this.setState({
            loading:false,
            AUsers : people,
          })
        }
      }, (error: any): void => {
      // An error has occurred while loading the data. Notify the user
      // that loading data is finished and return the error message.
      this.setState({
        loading: false,
        errorMessage: error
      });
    })
    .catch((error: any): void => {
    // An exception has occurred while loading the data. Notify the user
    // that loading data is finished and return the exception.
      this.setState({
        loading: false,
        errorMessage: error
      });
    });
  } 

  public render(): React.ReactElement<IBirthdayProps> {    
    return(
      <div className={styles.birthday} >
        <div className={ styles.container }>
          <div className={styles.description}>                        
            <h1 style={{margin:'0'}}><MyBirthdayIcon/>Birthday/Anniversary</h1>
          </div>          
          <br></br>
          <div className={styles.SetDisplay}>                                                             
            <div><DefaultButton className={styles.birthTabBtn} style={{backgroundColor:this.state.bgColorBirthday, color:this.state.colorBirthday}} onClick={this.BirthdayClicked}><h3>Birthday</h3></DefaultButton></div>   
                                                      
            <div><DefaultButton className={styles.birthTabBtn} style={{backgroundColor:this.state.bgColorAnniversary, color:this.state.colorAnniversary}} onClick={this.AnniversaryClicked}><h3>Anniversary</h3></DefaultButton></div>              
          </div>
          {/* <div className = { styles.persona_card}>This Month</div> */}
          {  
            ((this.state.count === 1) ? <BirthdayUser people={this.state.BUsers} spHttpClient={this.props.spHttpClient} siteurl={this.props.siteurl}/> : 
            (this.state.count === 2) ? <AnniversaryUser people={this.state.AUsers} spHttpClient={this.props.spHttpClient} siteurl={this.props.siteurl} /> :  <BirthdayUser people={this.state.BUsers} spHttpClient={this.props.spHttpClient} siteurl={this.props.siteurl}/> )
          }           
                      
        </div>        
      </div>
    )    
  }
}


