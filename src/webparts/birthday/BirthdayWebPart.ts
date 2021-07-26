import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version, Environment, EnvironmentType } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField  
} from '@microsoft/sp-property-pane';

import styles from '../birthday/components/Birthday.module.scss';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { IDropdownOption } from 'office-ui-fabric-react/lib/components/Dropdown';
import { update, get } from '@microsoft/sp-lodash-subset'; 
import { PropertyPaneDropdown } from '../../controls/PropertyPaneDropdown/components/PropertyPaneDropdown'

import * as strings from 'BirthdayWebPartStrings';
import Birthday from './components/Birthday';
import { IBirthdayProps } from './components/IBirthdayProps';

import { DefaultButton, PrimaryButton } from "@fluentui/react/lib/Button";

export interface IBirthdayWebPartProps {
  description: string;
  siteurl: string;
  spHttpClient: SPHttpClient;
  dropdown: string; 
  SiteCollection: string;
}

export interface ISPLists {
  value: ISPList[];
}

 export interface ISPList {
  Title: string;
  EmailId: string;
  BirthDate : Date;
}

export default class BirthdayWebPart extends BaseClientSideWebPart<IBirthdayWebPartProps> {

  private sitecollectionsDropDown: PropertyPaneDropdown;  
  
  public render(): void {
    const element: React.ReactElement<IBirthdayProps> = React.createElement(
      Birthday,
      {
        description: this.properties.description,
        siteurl: this.context.pageContext.web.absoluteUrl,
        spHttpClient: this.context.spHttpClient,
        dropdown: this.properties.dropdown,
        SiteCollection: this.properties.SiteCollection        
      } 
    );

      ReactDom.render(element, this.domElement); 
      //this._renderListAsync();

  }  

  /* debugger;
  private _getListData(): Promise<ISPLists> {
    debugger;   
    return this.context.spHttpClient.get(this.context.pageContext.web.absoluteUrl + `/_api/web/lists/getbytitle('EmployeeMaster')/items`, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      });       
  } */

  /*private _renderList(items: ISPList[]): void {
     let html: string = '';    
    let teststr: string = this.context.pageContext.web.absoluteUrl.substring(0,this.context.pageContext.web.absoluteUrl.search("/sites"));
    items.forEach((item: ISPList) => {  
      let bdate: Date = item.BirthDate;    
      html += `      
        <div className={styles.row}>${item.Title}</div>  
        <div className={styles.row}><a href="">${item.EmailId}</a></div>
        <div className={styles.row}>Birth Date - <a href="">${bdate}</a></div>
            
        <div className={styles.row}>User Photo: <img src = "${teststr}/_layouts/15/userphoto.aspx?size=S&username=${item.EmailId}"></div>
        <br></br>`;        
    });    
  
    const listContainer: Element = this.domElement.querySelector('#spListContainer');
    listContainer.innerHTML = html; 
  }*/

  /* private _renderListAsync(): void {   
    if (Environment.type == EnvironmentType.SharePoint ||
             Environment.type == EnvironmentType.ClassicSharePoint) 
    {
      this._getListData()
        .then((response) => {
          this._renderList(response.value);
        });
    }
  } */

  /* private loadOptions(): Promise<IDropdownOption[]> {
    return new Promise<IDropdownOption[]>((resolve: (options: IDropdownOption[]) => void, reject: (error: any) => void) => {
      setTimeout(() => {
        resolve([{
          key: 'Azure',
          text: 'From Azure active directory'
          },
          {
            key: 'Internal',
            text: 'Internal list from SharePoint'
          },
          {
            key: 'External',
            text: 'External list from SharePoint'
          }
        ]);
      }, 2000);
    });
  }

  private onDropdownChange(propertyPath: string, newValue: any): void {  
    const oldValue: any = get(this.properties, propertyPath);  
    // store new value in web part properties  
    update(this.properties, propertyPath, (): any => { return newValue; });  
    // refresh web part  
    this.render();  
  }

  private loadItems(): Promise<IDropdownOption[]> {
    if (!this.properties.dropdown) {
      // resolve to empty options since no list has been selected
      //return Promise.resolve();
    }

    const wp: BirthdayWebPart = this;

    return new Promise<IDropdownOption[]>((resolve: (options: IDropdownOption[]) => void, reject: (error: any) => void) => {
      setTimeout(() => {
        const sitecollections = {
          Internal: [
            {
              key: 'spfx_presentation',
              text: 'SPFx for the masses'
            },
            {
              key: 'hello-world',
              text: 'hello-world'
            }
          ],
          External: [
            {
              key: 'isaiah_cv',
              text: 'Isaiah CV'
            },
            {
              key: 'isaiah_expenses',
              text: 'Isaiah Expenses'
            }
          ]
        };
        resolve(sitecollections[wp.properties.dropdown]);
      }, 2000);
    });
  }

  private onListItemChange(propertyPath: string, newValue: any): void {
    const oldValue: any = get(this.properties, propertyPath);
    // store new value in web part properties
    update(this.properties, propertyPath, (): any => { return newValue; });
    // refresh web part
    this.render();
  }


  private onListChange(propertyPath: string, newValue: any): void {
    const oldValue: any = get(this.properties, propertyPath);
    // store new value in web part properties
    update(this.properties, propertyPath, (): any => { return newValue; });
    // reset selected item
    this.properties.SiteCollection = undefined;
    // store new value in web part properties
    update(this.properties, 'item', (): any => { return this.properties.SiteCollection; });
    // refresh web part
    this.render();
    // reset selected values in item dropdown
    this.sitecollectionsDropDown.properties.selectedKey = this.properties.SiteCollection;
    // allow to load items
    this.sitecollectionsDropDown.properties.disabled = false;
    // load items and re-render items dropdown
    this.sitecollectionsDropDown.render();
  } */


  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {

    
    /* this.sitecollectionsDropDown = new PropertyPaneDropdown('SiteCollection', {
      label: strings.SiteCollectionFieldLabel,
      loadOptions: this.loadItems.bind(this),
      onPropertyChange: this.onListItemChange.bind(this),
      selectedKey: this.properties.SiteCollection,
      // should be disabled if no list has been selected
      disabled: !this.properties.dropdown
    }); */

    return {
      pages: [
        {
          header: {
            description: "Displays birthday and work anniversary"
          },
          groups: [
            {
              groupName: "",
              groupFields: [
                /* PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }), */                
                /* new PropertyPaneDropdown('dropdown', {
                  label: 'Select the source from where data to be fetched for users.',
                  loadOptions: this.loadOptions.bind(this),
                  onPropertyChange: this.onDropdownChange.bind(this),
                  selectedKey: this.properties.dropdown
                }),
                this.sitecollectionsDropDown */
              ]
            }
          ]
        }
      ]
    };
  }
}

