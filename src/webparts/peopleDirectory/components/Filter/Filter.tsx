import * as React from 'react';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import styles from './Filter.module.scss';
import { escape } from '@microsoft/sp-lodash-subset';
import { IFilterProps } from './IFilterProps';


export default class PeopleSearch extends React.Component<IFilterProps, {}> {
    public render(): React.ReactElement<IFilterProps> {
      return (
        <div className={ styles.filter }>
          <div className={ styles.container }>
            <div className={ styles.row }>
              <div className={ styles.column }>
               <span className={ styles.title }> People Search </span>
                <p className={ styles.subTitle }> Name </p> 
                <p className={ styles.subTitle }> Title </p>
                <p className={ styles.subTitle }> Department </p>
                <p className={ styles.subTitle }> Skill </p>
                <p className={ styles.subTitle }> Ask Me About </p>
                {/* <p class={ styles.description }>{escape(this.properties.description)}</p> */}
              </div>
            </div>
          </div>
        </div>
      );
    }
  }