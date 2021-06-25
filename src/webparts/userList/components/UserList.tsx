import * as React from 'react';
import styles from './UserList.module.scss';
import { IUserListProps } from './IUserListProps';
import { escape } from '@microsoft/sp-lodash-subset';
import AllUser from './All/AllUser';
import FollowerUser from './Followers/FollowerUser';

export default class UserList extends React.Component<IUserListProps, {count:number}> {

constructor(props){
  super(props);
  this.state = {
    count : 0,
  }
}

 allUserClick = () =>{
  this.setState({
    count: 1,
  })
}

followersUserClick = () =>{
  this.setState({
    count: 2,
  })
}

followingUserClick = () =>{
  this.setState({
    count: 3,
  })
}

  public render(): React.ReactElement<IUserListProps> {
    return (
      <div className={ styles.userList }>
        <div className={ styles.container }>
          <div className={styles.SetDisplay}>
           
              <div>              
                <button onClick={this.allUserClick}>All</button>             
              </div>
              <div>              
                <button onClick={this.followersUserClick}>Followers</button>              
              </div>
              <div>              
                <button onClick={this.followingUserClick}>Following</button>              
              </div>
              {/* <div><h1 style={{ color: "black" }}>{this.state.count}</h1></div> */}
          </div>
          <div>
            {
              (this.state.count === 0 ? <AllUser/> : (this.state.count === 1 ? <AllUser/> : <FollowerUser/>))
            }
                      
          </div>
        </div>
      </div>
    );
  }
}
