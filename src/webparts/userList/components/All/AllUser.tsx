import * as React from 'react';
import styles from './AllUserList.module.scss';
import { IAllUserListProps } from './IAllUserListProps';
import { escape } from '@microsoft/sp-lodash-subset';

export default class AllUser extends React.Component<IAllUserListProps, {}> {
  public render(): React.ReactElement<IAllUserListProps> {
    return (
      <div className={ styles.allUser }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
              {/* <h1 style={{ color: "black" }}>This is All Users List</h1> */}
              
              <article className={styles.SetLeftMatter}>
                <h2 style={{ color: "black" }} className={styles.SetTitleColor}>Barry Kresfelder</h2>
                <p style={{ color: "black" }}>bkresfelder@championsg.com</p>
              </article>
              <article className={styles.SetRightMatter}>
              <a href="https://champion1.sharepoint.com/_layouts/15/me.aspx?p=bkresfelder@championsg.com&amp;v=profile" target="_blank">
                <img alt="bkresfelder@championsg.com" src="https://champion1.sharepoint.com/_layouts/15/userphoto.aspx?size=S&amp;username=bkresfelder@championsg.com" className={styles['img-circle']} data-themekey="#"/>
                </a>
              </article>

              <article className={styles.SetLeftMatter}>
                <h2 style={{ color: "black" }} className={styles.SetTitleColor}>Beatrice Vener</h2>
                <p style={{ color: "black" }}>bvener@championsg.com</p>
              </article>
              <article className={styles.SetRightMatter}>
        
              <a href="https://champion1.sharepoint.com/_layouts/15/me.aspx?p=bvener@championsg.com&amp;v=profile" target="_blank"><img alt="bvener@championsg.com" src="https://champion1.sharepoint.com/_layouts/15/userphoto.aspx?size=S&amp;username=bvener@championsg.com" className={styles['img-circle']} data-themekey="#"/>
              </a>
              
              </article>

              <article className={styles.SetLeftMatter}>
                <h2 style={{ color: "black" }} className={styles.SetTitleColor}>Bill Ginn</h2>
                <p style={{ color: "black" }}>bginn@championsg.com</p>
              </article>
              <article className={styles.SetRightMatter}>
              <a href="https://champion1.sharepoint.com/_layouts/15/me.aspx?p=bginn@championsg.com&amp;v=profile" target="_blank"><img alt="bginn@championsg.com" src="https://champion1.sharepoint.com/_layouts/15/userphoto.aspx?size=S&amp;username=bginn@championsg.com" className={styles['img-circle']} data-themekey="#"/></a>
              </article>


            </div>
          </div>
        </div>
      </div>
    );
  }
}
