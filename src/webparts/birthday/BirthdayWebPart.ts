import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version, Environment, EnvironmentType } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneButton,
  PropertyPaneButtonType
} from '@microsoft/sp-property-pane';
import styles from '../birthday/components/Birthday.module.scss';
import { BaseClientSideWebPart, WebPartContext } from '@microsoft/sp-webpart-base';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { IDropdownOption } from 'office-ui-fabric-react/lib/components/Dropdown';
import { update, get } from '@microsoft/sp-lodash-subset'; 
import { PropertyPaneDropdown } from '../../controls/PropertyPaneDropdown/components/PropertyPaneDropdown';
import * as strings from 'BirthdayWebPartStrings';
import Birthday from './components/Birthday';
import { IBirthdayProps } from './components/IBirthdayProps';
import { PropertyFieldFilePicker, IFilePickerResult } from "@pnp/spfx-property-controls/lib/PropertyFieldFilePicker";

export interface IBirthdayWebPartProps {
  description: string;
  webPartContext: WebPartContext;  
  dropdown: string;
  filePickerResult: IFilePickerResult;
}

debugger;
export default class BirthdayWebPart extends BaseClientSideWebPart<IBirthdayWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IBirthdayProps> = React.createElement(
      Birthday,
      {
        description: this.properties.description,
        webPartContext: this.context,       
        dropdown: this.properties.dropdown,              
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
    const linkSource = `data:application/csv;base64,${"TmFtZSxGaXJzdE5hbWUsTGFzdE5hbWUsRW1haWwsQmlydGhEYXRlLEhpcmVEYXRlLERlcGFydG1lbnQ="}`;
    const downloadLink = document.createElement('a');

    // Append to html link element page
    document.body.appendChild(downloadLink);

    downloadLink.href = linkSource;
    downloadLink.target = '_self';
    downloadLink.download = "UserBirthAnniversaryDetails.csv";

    // Start download
    downloadLink.click();

    // Clean up and remove the link
    setTimeout(function(){ downloadLink.parentNode.removeChild(downloadLink); }, 500);
  }

  protected UploadCSV()
  {
    if(this.properties.filePickerResult.fileName !== "")
    {
      let file = this.properties.filePickerResult;
      let selectedFile =  file.downloadFileContent()
      .then((res: any): Promise<any> => {     
        return res;
      })
      .then((res: any): void => {
        if(res)
        {
          const reader = new FileReader();        
          reader.onload = async (e) => {           
            const text = reader.result;
            const dataArray = this.csvToArray(text);
            
            this.exportDataToList(dataArray);
          }
          reader.readAsText(res);               
        }
      }, 
      (error: any): void => {
        console.log("Error occured.");
      })
      .catch((error: any): void => {
        console.log("Error: " + error);      
      }); 
    }      
  }

  private csvToArray(str, delimiter = ",")
  {
    const headers = str.slice(0, str.indexOf("\r\n")).split(delimiter);
    const rows = str.slice(str.indexOf("\n") + 1).split("\r\n");
    
    const arr = rows.map((row) => {
      if(row.length !== 0){
        const values = row.split(delimiter);    
        const el = headers.reduce(function (object, header, index) {          
          object[header] = values[index];
          return object;                
        }, {});
        return el;
      }        
    });
    //return an array
    return arr;
  }

  private exportDataToList(UserList: any)
  {
    for(let i:number = 0; i<UserList.length; ++i)
    {
      if(UserList[i] !== undefined)
      {
        let birthDate = new Date(UserList[i].BirthDate);
        let birthDateFinal = new Date(birthDate.getTime() - (birthDate.getTimezoneOffset() * 60000));
        let hireDate = new Date(UserList[i].HireDate);
        let hireDateFinal = new Date(hireDate.getTime() - (hireDate.getTimezoneOffset() * 60000));
        const requestlistItem: string = JSON.stringify({
          'name': UserList[i].Name,
          'firstName': UserList[i].FirstName,
          'lastName': UserList[i].LastName,
          'email': UserList[i].Email,
          'birthDate': birthDateFinal, 
          'hireDate': hireDateFinal,                           
          'department': UserList[i].Department          
          });
          this.addListItems(requestlistItem);
      }  
    }
  }

  private addListItems(JsonData: string)
  {
    this.context.spHttpClient.post(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('UserDetails')/items`, SPHttpClient.configurations.v1,  
    {  
      headers: {  
      'Accept': 'application/json;odata=nometadata',  
      'Content-type': 'application/json;odata=nometadata',  
      'odata-version': ''  
      },  
      body: JsonData  
    }) 
    .then((response: SPHttpClientResponse): Promise<void> => {  
        return response.json();  
    })  
    .then((item: any): void => {  
        console.log('Item has been created.');
    }, (error: any): void => {  
        console.log('Error while creating the item: ' + error);
    }); 

  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
  
    let uploadControl: any = []; 
    let CSVControl: any = []; 
      
    if (this.properties.dropdown === "Internal") 
    {  
      CSVControl = PropertyPaneButton('Csv File', {
        text: "Download csv template",
        buttonType: PropertyPaneButtonType.Primary,
        onClick: this.downloadCsv.bind(this)
      });

      uploadControl = PropertyFieldFilePicker('filePicker', {
        context: this.context,
        filePickerResult: this.properties.filePickerResult,
        onPropertyChange: this.UploadCSV.bind(this),
        properties: this.properties,
        onSave: (e: IFilePickerResult) => { this.properties.filePickerResult = e; },
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
                uploadControl                                
              ]
            }
          ]
        }
      ]
    };    
  }
}