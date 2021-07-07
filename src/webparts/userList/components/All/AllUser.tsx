// import * as React from 'react';
// import styles from './AllUserList.module.scss';
// import { IAllUserListProps } from './IAllUserListProps';
// import { escape } from '@microsoft/sp-lodash-subset';
// import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
// import { IALLUserListState } from './IAllUserListState';
// import {IUserResults, ICell} from './IUserResults';
// import {IUserAll} from './IUserAll';
// import ListView from '../ListView/ListView'

// export default class AllUser extends React.Component<IAllUserListProps, IALLUserListState> {

// constructor(props){
//   super(props);

//   this.state = {
//     Users:[],
//     Followers:[],
//     Following:[],
//     bgColorAll:"white",
//     bgColorFollowers:"white",
//     bgColorFollowing:"white",
//     colorAll:"black",
//     colorFollowers:"white",
//     colorFollowing:"black",

//     count:0,
//     errorMessage:null,
//   };
// }

// componentDidMount(){
//  // this._loadPeopleInfo();
// }

//   private _loadPeopleInfo(){

//     const headers: HeadersInit = new Headers();
//     // suppress metadata to minimize the amount of data loaded from SharePoint
//     headers.append("accept", "application/json;odata.metadata=none");

//     this.props.spHttpClient
//       .get(`${this.props.webUrl}/_api/selectproperties='FirstName,LastName,PreferredName,WorkEmail,PictureURL,WorkPhone,MobilePhone,JobTitle,Department,Skills,PastProjects'&sortlist='LastName:ascending'&sourceid='b09a7990-05ea-4af9-81ef-edfab16c4e31'&rowlimit=500`, SPHttpClient.configurations.v1, {
//         headers: headers
//       })
//       .then((res: SPHttpClientResponse): Promise<IUserResults> => {
//         console.log(res.json());
//         return res.json();
//       })
//       .then((res: IUserResults): void => {
//         if (res.error) {
//         //   // There was an error loading information about people.
//         //   // Notify the user that loading data is finished and return the
//         //   // error message that occurred
//         //   //this.setState({
//         //    // loading: false,
//         //     //errorMessage: res.error.message
//         //   //});
//         //  // return;
//         }
      
        
        
//   // convert the SharePoint People Search results to an array of people
//   let people: IUserAll[] = res.PrimaryQueryResult.RelevantResults.Table.Rows.map(r => {
//     return {
//       name: this._getValueFromSearchResult('PreferredName', r.Cells),
//       firstName: this._getValueFromSearchResult('FirstName', r.Cells),
//       lastName: this._getValueFromSearchResult('LastName', r.Cells),
//       phone: this._getValueFromSearchResult('WorkPhone', r.Cells),
//       mobile: this._getValueFromSearchResult('MobilePhone', r.Cells),
//       email: this._getValueFromSearchResult('WorkEmail', r.Cells),
//       photoUrl: `${this.props.webUrl}${"/_layouts/15/userphoto.aspx?size=M&accountname=" + this._getValueFromSearchResult('WorkEmail', r.Cells)}`,
//       function: this._getValueFromSearchResult('JobTitle', r.Cells),
//       department: this._getValueFromSearchResult('Department', r.Cells),
//       skills: this._getValueFromSearchResult('Skills', r.Cells),
//       projects: this._getValueFromSearchResult('PastProjects', r.Cells)
//     };
//   });
//   this.setState({
//     Users : people,
//   })
//   }, (error: any): void => {
//     // An error has occurred while loading the data. Notify the user
//     // that loading data is finished and return the error message.
//    // this.setState({
//       //loading: false,
//     //  errorMessage: error
//   //  });
//   })
//   .catch((error: any): void => {
//     // An exception has occurred while loading the data. Notify the user
//     // that loading data is finished and return the exception.
//     //this.setState({
//       //loading: false,
//     //  errorMessage: error
//     });
//   //}); 
// }


//   /**
//    * Retrieves the value of the particular managed property for the current search result.
//    * If the property is not found, returns an empty string.
//    * @param key Name of the managed property to retrieve from the search result
//    * @param cells The array of cells for the current search result
//    */
//    private _getValueFromSearchResult(key: string, cells: ICell[]): string {
//     for (let i: number = 0; i < cells.length; i++) {
//       if (cells[i].Key === key) {
//         return cells[i].Value;
//       }
//     }

//     return '';
//   }


//   public render(): React.ReactElement<IAllUserListProps> {
//     return (
//       <div className={ styles.allUser }>
//         {/* <ListView people={this.state.Users}/> */}


//         {/* <div className={ styles.container }>
//           <div className={ styles.row }>
//             <div className={ styles.column }> */}
//               {/* <h1 style={{ color: "black" }}>This is All Users List</h1> */}
              
//               {/* <article className={styles.SetLeftMatter}>
//                 <h2 style={{ color: "black" }} className={styles.SetTitleColor}>Barry Kresfelder</h2>
//                 <p style={{ color: "black" }}>bkresfelder@championsg.com</p>
//               </article>
//               <article className={styles.SetRightMatter}>
//               <a href="https://champion1.sharepoint.com/_layouts/15/me.aspx?p=bkresfelder@championsg.com&amp;v=profile" target="_blank">
//                 <img alt="bkresfelder@championsg.com" src="https://champion1.sharepoint.com/_layouts/15/userphoto.aspx?size=S&amp;username=bkresfelder@championsg.com" className={styles['img-circle']} data-themekey="#"/>
//                 </a>
//               </article>

//               <article className={styles.SetLeftMatter}>
//                 <h2 style={{ color: "black" }} className={styles.SetTitleColor}>Beatrice Vener</h2>
//                 <p style={{ color: "black" }}>bvener@championsg.com</p>
//               </article>
//               <article className={styles.SetRightMatter}>
        
//               <a href="https://champion1.sharepoint.com/_layouts/15/me.aspx?p=bvener@championsg.com&amp;v=profile" target="_blank"><img alt="bvener@championsg.com" src="https://champion1.sharepoint.com/_layouts/15/userphoto.aspx?size=S&amp;username=bvener@championsg.com" className={styles['img-circle']} data-themekey="#"/>
//               </a>
              
//               </article>

//               <article className={styles.SetLeftMatter}>
//                 <h2 style={{ color: "black" }} className={styles.SetTitleColor}>Bill Ginn</h2>
//                 <p style={{ color: "black" }}>bginn@championsg.com</p>
//               </article>
//               <article className={styles.SetRightMatter}>
//               <a href="https://champion1.sharepoint.com/_layouts/15/me.aspx?p=bginn@championsg.com&amp;v=profile" target="_blank"><img alt="bginn@championsg.com" src="https://champion1.sharepoint.com/_layouts/15/userphoto.aspx?size=S&amp;username=bginn@championsg.com" className={styles['img-circle']} data-themekey="#"/></a>
//               </article> */}


//             {/* </div>
//           </div>
//         </div> */}
//       </div>
//     );
//   }
// }
