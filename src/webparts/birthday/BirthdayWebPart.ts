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
import { initializeIcons } from "@fluentui/font-icons-mdl2";
import { Icon } from '@fluentui/react/lib/Icon';

initializeIcons();

export interface IBirthdayWebPartProps {
  description: string;
  siteurl: string;
  dropdown: string; 
}

export interface ISPLists {
  value: ISPList[];
}

 /* export interface ISPList {
  Title: string;
  EmailId: string;
  BirthDate : Date;
} */
 
 export interface ISPList {
  FirstName: string;
  LastName: string;
  WorkEmail : string;
} 


export default class BirthdayWebPart extends BaseClientSideWebPart<IBirthdayWebPartProps> {

  
  
  public render(): void {
    const element: React.ReactElement<IBirthdayProps> = React.createElement(
      Birthday,
      {
        description: this.properties.description,
        siteurl: this.context.pageContext.web.absoluteUrl,
        dropdown: this.properties.dropdown        
      } 
    );
   
    // this.domElement.innerHTML = `
    //   <div class="${ styles.birthday }">
    //     <div class="${ styles.container }">          
    //       <div class="${ styles.description }">                        
    //       <h1><i class="ms-Icon ms-Icon--Cake" aria-hidden="true">&nbsp;&nbsp;</i>Birthday/Anniversary</h1>
    //       </div> 
    //       <div class="${ styles.SetDisplay }">                                                             
    //         <div><PrimaryButton onClick=${this._alertClicked}><h3>Birthday</h3></PrimaryButton></div>   
                                                      
    //         <div><PrimaryButton onClick=${this._alertClicked}><h3>Anniversary</h3></PrimaryButton></div>              
    //   </div>        
               
    //       <br></br>

    //       <div id="spListContainer" />
    //     </div>
    //   </div>`;
    ReactDom.render(element, this.domElement);

     // this._renderListAsync();

  }

  private _alertClicked(): void {
    alert('Clicked');
  }

  debugger;
  private _getListData(): Promise<ISPLists> {
    debugger;   
    /* return this.context.spHttpClient.get(this.context.pageContext.web.absoluteUrl + `/_api/web/lists/getbytitle('EmployeeMaster')/items`, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      }); */ 
      const headers: HeadersInit = new Headers();
      headers.append("accept", "application/json;odata.metadata=none");
      return this.context.spHttpClient.get(this.context.pageContext.web.absoluteUrl + `/_api/search/query?querytext='*'&amp;refinementfilters=FirstName ne 'null' &selectproperties='FirstName,LastName,WorkEmail'&sortlist='LastName:ascending'&sourceid='b09a7990-05ea-4af9-81ef-edfab16c4e31'&rowlimit=500`, SPHttpClient.configurations.v1, {
        headers: headers
      })
      .then((response: SPHttpClientResponse) => {
        return response.json();
      }); 
  }

  private _renderList(items: ISPList[]): void {
    let html: string = '';    
    let teststr: string = this.context.pageContext.web.absoluteUrl.substring(0,this.context.pageContext.web.absoluteUrl.search("/sites"));
    /* items.forEach((item: ISPList) => {      
      html += `      
        <div className={styles.row}>${item.Title}</div>  
        <div className={styles.row}><a href="">${item.EmailId}</a></div>
            
        <div className={styles.row}>User Photo: <img src = "${teststr}/_layouts/15/userphoto.aspx?size=S&username=${item.EmailId}"></div>
        <br></br>`;        
    }); */

    items.forEach((item: ISPList) => {      
      html += `      
        <div className={styles.row}>${item.FirstName}</div>  
        <div className={styles.row}><a href="">${item.WorkEmail}</a></div>
              
        <div className={styles.row}>User Photo: <img src = "${teststr}/_layouts/15/userphoto.aspx?size=S&username=${item.WorkEmail}"></div>
        <br></br>`;        
    });
  
    const listContainer: Element = this.domElement.querySelector('#spListContainer');
    listContainer.innerHTML = html;
  }

  private _renderListAsync(): void {   
    if (Environment.type == EnvironmentType.SharePoint ||
             Environment.type == EnvironmentType.ClassicSharePoint) 
    {
      this._getListData()
        .then((response) => {
          this._renderList(response.value);
        });
    }
  }

  private loadOptions(): Promise<IDropdownOption[]> {
    return new Promise<IDropdownOption[]>((resolve: (options: IDropdownOption[]) => void, reject: (error: any) => void) => {
      setTimeout(() => {
        resolve([{
          key: '1',
          text: 'Internal list from SharePoint'
          },
          {
            key: '2',
            text: 'External list from SharePoint'
          },
          {
            key: '3',
            text: 'From Azure active directory'
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

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
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
                /* PropertyPaneDropdown('dropdowm', {
                  label:'Select the source from where data to be fetched for users.',
                  options: [
                    { key: '1', text: 'Internal list form SharePoint' },
                    { key: '2', text: 'External list form SharePoint' },
                    { key: '3', text: 'From Azure active directory' }
                  ]                                
                }) */
                new PropertyPaneDropdown('dropdown', {
                  label: 'Select the source from where data to be fetched for users.',
                  loadOptions: this.loadOptions.bind(this),
                  onPropertyChange: this.onDropdownChange.bind(this),
                  selectedKey: this.properties.dropdown
                })
              ]
            }
          ]
        }
      ]
    };
  }
}

