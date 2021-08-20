import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version, Environment, EnvironmentType } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneButton,
  PropertyPaneButtonType,
  PropertyPaneDynamicField,
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
import { setPortalAttribute } from 'office-ui-fabric-react';
import { sp } from '@pnp/sp';
import pnp from 'sp-pnp-js';
import { PropertyFieldFilePicker, IPropertyFieldFilePickerProps, IFilePickerResult } from "@pnp/spfx-property-controls/lib/PropertyFieldFilePicker";

export interface IBirthdayWebPartProps {
  description: string;
  siteurl: string;
  spHttpClient: SPHttpClient;
  dropdown: string; 
  simpleText: string;
  imageUrl: string;
  SiteCollection: string;
  StartDate: string;
  EndDate: string;
  filePickerResult: IFilePickerResult;
}
debugger;
export default class BirthdayWebPart extends BaseClientSideWebPart<IBirthdayWebPartProps> {

  //private sitecollectionsDropDown: PropertyPaneDropdown;  
  
  public render(): void {
    const element: React.ReactElement<IBirthdayProps> = React.createElement(
      Birthday,
      {
        description: this.properties.description,
        siteurl: this.context.pageContext.web.absoluteUrl,
        spHttpClient: this.context.spHttpClient,
        loggedInUserEmail: this.context.pageContext.user.email,
        dropdown: this.properties.dropdown,
        simpleText: this.properties.simpleText,
        imageUrl: this.properties.imageUrl,
        SiteCollection: this.properties.SiteCollection        
      } 
    );
    ReactDom.render(element, this.domElement);
  }

  private onDropdownChange(propertyPath: string, newValue: any): void {  
    const oldValue: any = get(this.properties, propertyPath);  
    // store new value in web part properties  
    update(this.properties, propertyPath, (): any => { return newValue; });  
    // refresh web part 
    this.context.propertyPane.refresh(); 
    this.render();     
  }

  private loadOptions(): Promise<IDropdownOption[]> {
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
          },
          {
            key: 'API',
            text: 'APIs OR Webservice'
          }
        ]
        );
      }, 2000);
    });   
  }

  

  /*private loadItems(): Promise<IDropdownOption[]> {
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

  private downloadCsv()
  {  
    const link = document.createElement('a');
    
    link.href = "https://gns11.sharepoint.com/sites/SiriusTeams/Shared%20Documents/TestingList.csv";
    link.setAttribute(  
      'download',
      `TestingList.csv`,
    );
    // Append to html link element page
    document.body.appendChild(link);

    // Start download
    link.click();
    // Clean up and remove the link
    setTimeout(function(){ link.parentNode.removeChild(link); }, 500);    
  }

  protected onPropertyPaneFieldChanged()
  {
    /* const test = this.properties.filePickerResult;
    console.log(test);
    const fileResultContent = this.properties.filePickerResult.downloadFileContent();
    console.log("fileResultContent: " + fileResultContent);
    const reader = new FileReader();
    //reader.readAsDataURL(fileResultContent);
    reader.onload = async () => {
      
     }; */
    //reader.readAsText(files[0]);

  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {

    let textControl: any = [];  
    let uploadControl: any = []; 
    let CSVControl: any = []; 
    let test: any = [];
      
    if (this.properties.dropdown === "Internal") {  
      CSVControl = PropertyPaneButton('Csv File', {
        text: "Download csv template",
        buttonType: PropertyPaneButtonType.Primary,
        onClick: this.downloadCsv.bind(this)
      });

      uploadControl = PropertyFieldFilePicker('filePicker', {
        context: this.context,
        filePickerResult: this.properties.filePickerResult,
        onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
        properties: this.properties,
        onSave: (e: IFilePickerResult) => { this.properties.filePickerResult = e;  },
        onChanged: (e: IFilePickerResult) => { this.properties.filePickerResult = e; },        
        accepts:[".csv"],
        key: "filePickerId",
        buttonLabel: "Upload Csv file",
        label: "",
        hideRecentTab: true,
        hideStockImages: true,
        hideOneDriveTab: true,
        hideSiteFilesTab: true,
        hideLinkUploadTab: true,        
        storeLastActiveTab: false
      });

    }  
    else if (this.properties.dropdown === "External")
    {   
      textControl = PropertyPaneTextField('simpleText', {  
        label: "Text",  
        placeholder: "Enter Text"  
      });   
              
    }  

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
                new PropertyPaneDropdown('dropdown', {
                  label: 'Select the source from where data to be fetched for users.',
                  loadOptions: this.loadOptions.bind(this),
                  onPropertyChange: this.onDropdownChange.bind(this),
                  selectedKey: this.properties.dropdown,
                }),
                CSVControl,
                uploadControl,
                textControl                
              ]
            }
          ]
        }
      ]
    };    
  }
}

