import * as React from 'react';
import styles from './UserList.module.scss';
import { IUserListProps } from './IUserListProps';
import { escape } from '@microsoft/sp-lodash-subset';
import AllUser from './All/AllUser';
import FollowerUser from './Followers/FollowerUser';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import {IUserResults, ICell} from './All/IUserResults';
import {IUserAll} from './All/IUserAll';
import {IALLUserListState} from './All/IAllUserListState';
import ListView from './ListView/ListView';
import {IFollowers} from '../components/Followers/IFollowers';
import {IFoll, IFollowerResults} from '../components/Followers/IFollowerResults';
import {PeopleDirectory} from '../../peopleDirectory/components/PeopleDirectory/PeopleDirectory';

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
    bgColorAll:"white",
    bgColorFollowers:"white",
    bgColorFollowing:"white",
    colorAll:"black",
    colorFollowers:"black",
    colorFollowing:"black",

    errorMessage:null,
  }
}

componentDidMount(){
  this._loadPeopleInfo();
}

private _loadPeopleInfo():void{
  debugger;
  const headers: HeadersInit = new Headers();
  // suppress metadata to minimize the amount of data loaded from SharePoint
  headers.append("accept", "application/json;odata.metadata=none");

  this.props.spHttpClient
    .get(`${this.props.webUrl}/_api/search/query?querytext='*'&selectproperties='FirstName,LastName,PreferredName,WorkEmail,PictureURL,WorkPhone,MobilePhone,JobTitle,Department,Skills,PastProjects'&sortlist='LastName:ascending'&sourceid='b09a7990-05ea-4af9-81ef-edfab16c4e31'&rowlimit=500`, SPHttpClient.configurations.v1, {
      headers: headers
    })
    .then((res: SPHttpClientResponse): Promise<IUserResults> => {
      //console.log("res value = " + res.json());
      // alert("res.Json() of UserList = " + res.json());
      return res.json();
    })
    .then((res: IUserResults): void => {
      if (res.error) {
      //   // There was an error loading information about people.
      //   // Notify the user that loading data is finished and return the
      //   // error message that occurred
         this.setState({
      //    // loading: false,
           errorMessage: res.error.message,
            },()=>alert("Error occured in UserList = " + this.state.errorMessage));
        return;
      }
    
      // alert("res PrimaryQueryResult value = " + res.PrimaryQueryResult.RelevantResults.Table.Rows.length);
      
// convert the SharePoint People Search results to an array of people
let people: IUserAll[] = res.PrimaryQueryResult.RelevantResults.Table.Rows.map(r => {
  return {
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
    projects: this._getValueFromSearchResult('PastProjects', r.Cells)

  };
});
  // debugger;
  if(people.length>0){
    // alert("I have arrived to people.length = " + people.length);
  this.setState({
    Users : people,
  })
  }
  else if(people.length === null){
    alert("I have arrived to ERONOUS people.length = " + people.length);

  }
}, (error: any): void => {
  // An error has occurred while loading the data. Notify the user
  // that loading data is finished and return the error message.
  this.setState({
    //loading: false,
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
}


private _loadFollowersInfo(){

  const headers: HeadersInit = new Headers();
  // suppress metadata to minimize the amount of data loaded from SharePoint
  headers.append("accept", "application/json;odata.metadata=none");
debugger;
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
      //    // loading: false,
           errorMessage: res.error.message,
            },()=>alert("Error occured in UserList = " + this.state.errorMessage));
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
    Followers : people,
  })
  }
  else if(people.length === null){
    alert("I have arrived to ERONOUS people.length = " + people.length);

  }
}, (error: any): void => {
  // An error has occurred while loading the data. Notify the user
  // that loading data is finished and return the error message.
  this.setState({
    //loading: false,
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

}


private _loadFollowingInfo(){

  const headers: HeadersInit = new Headers();
  // suppress metadata to minimize the amount of data loaded from SharePoint
  headers.append("accept", "application/json;odata.metadata=none");
debugger;

//var lognm = LOGINNAME.replace('i:0#.f', 'i:0%23.f');
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
      alert("response = " + res);
      if (res.error) {
      //   // There was an error loading information about people.
      //   // Notify the user that loading data is finished and return the
      //   // error message that occurred
         this.setState({
      //    // loading: false,
           errorMessage: res.error.message,
            },()=>alert("Error occured in UserList = " + this.state.errorMessage));
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
    alert("I have arrived to people.length = " + people.length);
  this.setState({
    Followers : people,
  },()=>alert("Users = " + this.state.Users))
  }
  else if(people.length === null){
    alert("I have arrived to ERONOUS people.length = " + people.length);

  }
}, (error: any): void => {
  // An error has occurred while loading the data. Notify the user
  // that loading data is finished and return the error message.
  this.setState({
    //loading: false,
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
    bgColorAll:"blue",
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
    bgColorFollowers:"blue",
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
    bgColorFollowing:"blue",
    colorAll:"black",
    colorFollowers:"black",
    colorFollowing:"white",
  })
}

UserSearchClick = () =>{
  this.setState({
    count: 4,
  })
}


  public render(): React.ReactElement<IUserListProps> {
    const {Users} = this.state
    return (
      <div className={ styles.userList }>
        {/* <div className={ styles.container }> */}
          <div className={styles.SetDisplay}>
           
              <div>              
                <DefaultButton style={{backgroundColor:this.state.bgColorAll, color:this.state.colorAll}} onClick={this.allUserClick}>All</DefaultButton>             
              </div>
              <div>              
                <DefaultButton style={{backgroundColor:this.state.bgColorFollowers, color:this.state.colorFollowers}} onClick={this.followersUserClick}>Followers</DefaultButton>              
              </div>
              <div>              
                <DefaultButton style={{backgroundColor:this.state.bgColorFollowing, color:this.state.colorFollowing}} onClick={this.followingUserClick}>Following</DefaultButton>              
              </div>
              {/* <div>
                <DefaultButton onClick={this.UserSearchClick}>User Search</DefaultButton>
              </div> */}
              {/* <div><h1 style={{ color: "black" }}>{this.state.count}</h1></div> */}
          </div>
          <div>
            {/* {
              (this.state.count === 0 ? <AllUser/> : (this.state.count === 1 ? <AllUser/> : <FollowerUser/>))
            } */}
              {  
               (this.state.count === 1 ? <ListView people={this.state.Users}/> : 
                (this.state.count === 2) ? <FollowerUser people={this.state.Followers}/> : <ListView people={this.state.Users}/>  )
              }
                      {/* <FollowerUser people={this.state.Followers}/> */}
          </div>
        {/* </div> */}
      </div>
    );
  }
}
