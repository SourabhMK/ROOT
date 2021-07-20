import * as React from 'react';
import styles from './UserList.module.scss';
import { IUserListProps } from './IUserListProps';
import { escape } from '@microsoft/sp-lodash-subset';
// import AllUser from './All/AllUser';
import FollowerUser from './Followers/FollowerUser';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import {IUserResults, ICell} from './All/IUserResults';
import {IUserAll} from './All/IUserAll';
import {IUserAllResults} from './All/IUserAllResults'
import {IALLUserListState} from './All/IAllUserListState';
import ListView from './ListView/ListView';
import {IFollowers} from '../components/Followers/IFollowers';
import {IFoll, IFollowerResults} from '../components/Followers/IFollowerResults';
import {PeopleDirectory} from '../../peopleDirectory/components/PeopleDirectory/PeopleDirectory';
import * as strings from 'UserListWebPartStrings';

import {
  Spinner,
  SpinnerSize
} from 'office-ui-fabric-react/lib/Spinner';

import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { ColorPickerGridCell } from '@fluentui/react';
import { Customizer } from 'office-ui-fabric-react';
//import { FluentCustomizations } from '@uifabric/fluent-theme';


export default class UserList extends React.Component<IUserListProps, IALLUserListState> {

constructor(props){
  super(props);
  this.state = {
    count : 0,
    Users:[],
    Followers:[],
    Following:[],
    bgColorAll:"#0078D4",
    bgColorFollowers:"white",
    bgColorFollowing:"white",
    colorAll:"white",
    colorFollowers:"black",
    colorFollowing:"black",
    loading:false,
    errorMessage:null,
  }
}

componentDidMount(){
  this._loadPeopleInfo();
  //this._loadFollowingInfo();
  //this.currentUser();
}

private _loadPeopleInfo():void{
  debugger;
  this.setState({
    loading:true,
    errorMessage:null,
  })
  const webUrlUser = 'https://champion1.sharepoint.com';
  const headers: HeadersInit = new Headers();
  // suppress metadata to minimize the amount of data loaded from SharePoint
  headers.append("accept", "application/json;odata.metadata=none");

  this.props.spHttpClient
    .get(`${this.props.webUrl}/_api/search/query?querytext='*'&amp;refinementfilters=FirstName ne 'null' &selectproperties='FirstName,LastName,PreferredName,WorkEmail,PictureURL,WorkPhone,MobilePhone,JobTitle,Department,Skills,PastProjects'&sortlist='LastName:ascending'&sourceid='b09a7990-05ea-4af9-81ef-edfab16c4e31'&rowlimit=500`, SPHttpClient.configurations.v1, {
      headers: headers
    })
    .then((res: SPHttpClientResponse): Promise<IUserAllResults> => {
      //console.log("res value = " + res.json());
      // alert("res.Json() of UserList = " + res.json());
      return res.json();
    })
    .then((res: IUserAllResults): void => {
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
    
      
// convert the SharePoint People Search results to an array of people
let people: IUserAll[] = res.PrimaryQueryResult.RelevantResults.Table.Rows.map(r => {
  return {

    // name:r.Name,
    // firstName:r.FirstName,
    // lastName:r.LastName,
    // phone:r.WorkPhone,
    // mobile:r.MobilePhone,
    // email:r.WorkEMail,
    // photoUrl: `${webUrlUser}${"/_layouts/15/userphoto.aspx?size=M&accountname=" + r.WorkEMail}`,
    // department: r.Department,
    name: this._getValueFromSearchResult('PreferredName', r.Cells),
    firstName: this._getValueFromSearchResult('FirstName', r.Cells),
    lastName: this._getValueFromSearchResult('LastName', r.Cells),
    phone: this._getValueFromSearchResult('WorkPhone', r.Cells),
    mobile: this._getValueFromSearchResult('MobilePhone', r.Cells),
    email: this._getValueFromSearchResult('WorkEmail', r.Cells),
    photoUrl: `${this.props.webUrl}${"/_layouts/15/userphoto.aspx?size=M&accountname=" + this._getValueFromSearchResult('WorkEmail', r.Cells)}`,
    function: this._getValueFromSearchResult('JobTitle', r.Cells),
    department: this._getValueFromSearchResult('Department', r.Cells),
    skills: this._getValueFromSearchResult('Skills', r.Cells),
    projects: this._getValueFromSearchResult('PastProjects', r.Cells),
    JobTitle: this._getValueFromSearchResult('JobTitle', r.Cells),
    

  };
});
  // debugger;
  if(people.length>0){
    // alert("I have arrived to people.length = " + people.length);
  this.setState({
    loading:false,
    Users : people,
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


private _loadFollowersInfo(){

  this.setState({
    loading:true,
    errorMessage:null,
  })

  const headers: HeadersInit = new Headers();
  // suppress metadata to minimize the amount of data loaded from SharePoint
  headers.append("accept", "application/json;odata.metadata=none");
//debugger;
  this.props.spHttpClient
    .get(`${this.props.webUrl}/_api/social.following/my/followers?selectproperties='Name,EmailAddress,ImageUri'&sortlist='Name:ascending'&sourceid='b09a7990-05ea-4af9-81ef-edfab16c4e31'&rowlimit=500`, SPHttpClient.configurations.v1, {
      headers: headers
    })
    .then((res: SPHttpClientResponse): Promise<IFollowerResults> => {
      //console.log("res value = " + res.json());
      // alert("res.Json() of UserList = " + res.json());
      return res.json();
    })
    .then((res: any): void => {
      // alert("response = " + res);
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

      // let people = res.Followers.element[0].d;

      let people: IFollowers[] = res.value.map(r => {
        return {         
          name:r.Name,
          email:r.EmailAddress,
          // photoUrl:r.ImageUri,
          photoUrl:`${this.props.webUrl}${"/_layouts/15/userphoto.aspx?size=M&accountname=" + r.EmailAddress}`,
          // name: this._getValueFromSearchResult2('Name', r.Name),
          // email: this._getValueFromSearchResult2('EmailAddress', r),
          //  photoUrl: `${this.props.webUrl}${"/_layouts/15/userphoto.aspx?size=M&accountname=" + this._getValueFromSearchResult2('ImageUri', r)}`,    
        };
      });
  // debugger;
  if(people.length>0){
    //alert("I have arrived to people.length = " + people.length);
  this.setState({
    loading:false,
    Followers : people,
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


private currentUserEmailId:string;
private _loadFollowingInfo()  {

  this.setState({
    loading:true,
    errorMessage:null,
  })

  const headers: HeadersInit = new Headers();
  // suppress metadata to minimize the amount of data loaded from SharePoint
  headers.append("accept", "application/json;odata.metadata=none");
debugger;

  var logName = this.props.webUrl + "/_api/web/currentUser?$select=Email"; 
//var lognm = LOGINNAME.replace('i:0#.f', 'i:0%23.f');
  this.props.spHttpClient
    .get(`${this.props.webUrl}/_api/web/currentUser?$select=Email`, SPHttpClient.configurations.v1, {
      headers: headers
    })
    .then((res: SPHttpClientResponse): Promise<IFollowerResults> => {
      return res.json();
    })
    .then((res: any): void => {
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
        this.currentUserEmailId = res.Email;
        //console.log("mail = " + this.currentUserEmailId);
////////////////////////////////////////////////////////////////////////////////

        const headers: HeadersInit = new Headers();
        // suppress metadata to minimize the amount of data loaded from SharePoint
        headers.append("accept", "application/json;odata.metadata=none");
      //debugger;
      
       // var logName = this.props.webUrl + "/_api/web/currentUser?$select=Email"; 
      //var lognm = LOGINNAME.replace('i:0#.f', 'i:0%23.f');
        this.props.spHttpClient
          .get(`${this.props.webUrl}/_api/sp.userprofiles.peoplemanager/getpeoplefollowedby(accountName=@v)?@v='i:0%23.f|membership|${this.currentUserEmailId}'`, SPHttpClient.configurations.v1, {
            headers: headers
          })
          .then((result: SPHttpClientResponse): Promise<IFollowerResults> => {
            //console.log("res value = " + res.json());
            // alert("res.Json() of UserList = " + res.json());
            return result.json();
          })
          .then((result: any): void => {
            //alert("response = " + res);
            if (result.error) {
            //   // There was an error loading information about people.
            //   // Notify the user that loading data is finished and return the
            //   // error message that occurred
               this.setState({
                 loading: false,
                 errorMessage: res.error.message,
                  });
              return;
            }
              //let Mail = res.Email;
            // let people = res.Followers.element[0].d;
      
            let people: IFollowers[] = result.value.map(r => {
              return {         
                name:r.DisplayName,
                email:r.Email,
                photoUrl:`${this.props.webUrl}${"/_layouts/15/userphoto.aspx?size=M&accountname=" + r.Email}`,
                // name: this._getValueFromSearchResult2('Name', r.Name),
                // email: this._getValueFromSearchResult2('EmailAddress', r),
                //  photoUrl: `${this.props.webUrl}${"/_layouts/15/userphoto.aspx?size=M&accountname=" + this._getValueFromSearchResult2('ImageUri', r)}`,    
              };
            });
        // debugger;
        if(people.length>0){
        this.setState({
          loading:false,
          Following : people,
        })
        }
        else if(people.length === null){
          alert("I have arrived to ERONOUS people.length = " + people.length);
      
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
          //loading: false,
          errorMessage: error
        });
      });

      ///////////////////////////////////////////////////////////////
})   
}

 /**
   * Retrieves the value of the particular managed property for the current search result.
   * If the property is not found, returns an empty string.
   * @param key Name of the managed property to retrieve from the search result
   * @param cells The array of cells for the current search result
   */
  private _getValueFromSearchResult(key: string, cells: ICell[]): string {
    //alert("I am in _getValueFromSearchResult")
    for (let i: number = 0; i < cells.length; i++) {
      if (cells[i].Key === key) {
        return cells[i].Value;
      }
    }

    return '';
  }


  private _getValueFromSearchResult2(key: string, foll: IFoll[]): string {
    //alert("I am in _getValueFromSearchResult")
    for (let i: number = 0; i < foll.length; i++) {
      if (foll[i].element === key) {
        return foll[i].element;
      }
     
    }

    return '';
  }

 allUserClick = () =>{
  this.setState({
    count: 1,
    bgColorAll:"#0078D4",
    bgColorFollowers:"white",
    bgColorFollowing:"white",
    colorAll:"white",
    colorFollowers:"black",
    colorFollowing:"black",
  })
  // this.xyz = `RedButton`
 // this._loadPeopleInfo();
}

followersUserClick = () =>{
  this.setState({
    count: 2,
    bgColorAll:"white",
    bgColorFollowers:"#0078D4",
    bgColorFollowing:"white",
    colorAll:"black",
    colorFollowers:"white",
    colorFollowing:"black",
  })
  this._loadFollowersInfo();
}

followingUserClick = () =>{
  this.setState({
    count: 3,
    bgColorAll:"white",
    bgColorFollowers:"white",
    bgColorFollowing:"#0078D4",
    colorAll:"black",
    colorFollowers:"black",
    colorFollowing:"white",
  })
  this._loadFollowingInfo();
}

UserSearchClick = () =>{
  this.setState({
    count: 4,
  })
}


  public render(): React.ReactElement<IUserListProps> {
    const {Users} = this.state;
    return (
      <div className={ styles.userList }>
        <div className={styles.SetDisplay}>
          <div style={{width:'120px'}}>                                                  
                <DefaultButton style={{backgroundColor:this.state.bgColorAll, color:this.state.colorAll}} className={styles.buttonStyleLeft} onClick={this.allUserClick}>All</DefaultButton>   
          </div>
          
          { this.props.isFollowerDisplay &&  
              <div style={{width:'120px'}}>              
                <DefaultButton style={{backgroundColor:this.state.bgColorFollowers, color:this.state.colorFollowers}} className={styles.buttonStyleMiddle} onClick={this.followersUserClick}>Followers</DefaultButton>             
              </div>
          } 
          {  this.props.isFollowingDisplay && 
              <div style={{width:'120px'}}>              
                <DefaultButton style={{backgroundColor:this.state.bgColorFollowing, color:this.state.colorFollowing}} className={styles.buttonStyleRight} onClick={this.followingUserClick}>Following</DefaultButton>  
              </div>
          }
        </div>
      <div>
          {
            this.state.loading &&
            <Spinner size={SpinnerSize.large} label={strings.LoadingSpinnerLabel}/>
          }
      </div>
              {  
               ((this.state.count === 1) ? <ListView people={this.state.Users} listSelect={this.props.nameFormatIndex} contactSelect={this.props.isContactNumberDisplay}/> : 
                (this.state.count === 2 && this.props.isFollowerDisplay) ? <FollowerUser people={this.state.Followers}/> : (this.state.count === 3 && this.props.isFollowingDisplay) ? <FollowerUser people={this.state.Following}/> : <ListView people={this.state.Users} listSelect={this.props.nameFormatIndex} contactSelect={this.props.isContactNumberDisplay}/>  )
              }
      </div>
    );
  }
}
