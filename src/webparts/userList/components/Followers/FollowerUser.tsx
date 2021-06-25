import * as React from 'react';
import styles from '../All/AllUserList.module.scss';
import { IFollowerUserListProps } from './IFollowerUserListProps';
import { escape } from '@microsoft/sp-lodash-subset';

export default class FollowerUser extends React.Component<IFollowerUserListProps, {}> {
  public render(): React.ReactElement<IFollowerUserListProps> {
    return (
      <div className={ styles.allUser }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
              {/* <h1 style={{ color: "black" }}>This is Followers User List</h1> */}

              <article className={styles.SetLeftMatter}>
                <h2 style={{ color: "black" }} className={styles.SetTitleColor}>Dipal Bhavsar</h2>
                <p style={{ color: "black" }}>dipalb@championsg.com</p>
              </article>
              <article className={styles.SetRightMatter}>
              <a href="https://champion1.sharepoint.com/_layouts/15/me.aspx?p=dipalb@championsg.com&amp;v=profile" target="_blank"><img alt="dipalb@championsg.com" src="https://champion1.sharepoint.com/_layouts/15/userphoto.aspx?size=S&amp;username=dipalb@championsg.com" className={styles['img-circle']} data-themekey="#"/></a>
              </article>

              <article className={styles.SetLeftMatter}>
                <h2 style={{ color: "black" }} className={styles.SetTitleColor}>Vrushali Agrawal</h2>
                <p style={{ color: "black" }}>vrushalia@championsg.com</p>
              </article>
              <article className={styles.SetRightMatter}>
        
              <a href="https://champion1.sharepoint.com/_layouts/15/me.aspx?p=vrushalia@championsg.com&amp;v=profile" target="_blank"><img alt="vrushalia@championsg.com" src="https://champion1.sharepoint.com/_layouts/15/userphoto.aspx?size=S&amp;username=vrushalia@championsg.com" className={styles['img-circle']} data-themekey="#"/></a>
              </article>



            </div>
          </div>
        </div>
      </div>
    );
  }
}
