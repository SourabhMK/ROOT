import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart
} from '@microsoft/sp-webpart-base';
import {
  IPropertyPaneConfiguration
} from "@microsoft/sp-property-pane";
import {
  PropertyPaneTextField,
  PropertyPaneCheckbox,
  PropertyPaneLabel,
  PropertyPaneLink,
  PropertyPaneSlider,
  PropertyPaneToggle,
  PropertyPaneDropdown
} from '@microsoft/sp-property-pane';

import * as strings from 'PeopleDirectoryWebPartStrings';
import { PeopleDirectory, IPeopleDirectoryProps } from './components/PeopleDirectory/';

export interface IPeopleDirectoryWebPartProps {
  title: string;
  description: string;  
      isNameSearchDisplay : boolean;
      isTitleSearchDisplay : boolean;
      isDepartmentSearchDisplay : boolean;
      isSkillSearchDisplay : boolean;
      isAskMeAboutSearchDisplay : boolean;
}

export default class PeopleDirectoryWebPart extends BaseClientSideWebPart<IPeopleDirectoryWebPartProps> {
  public render(): void {
    const element: React.ReactElement<IPeopleDirectoryProps> = React.createElement(
      PeopleDirectory,
      {
        webUrl: this.context.pageContext.web.absoluteUrl,
        spHttpClient: this.context.spHttpClient,
        title: this.properties.title,
        displayMode: this.displayMode,
        locale: this.getLocaleId(),
        onTitleUpdate: (newTitle: string) => {
          // after updating the web part title in the component
          // persist it in web part properties
          this.properties.title = newTitle;
        },
        description: this.properties.description,  
      isNameSearchDisplay : this.properties.isNameSearchDisplay,
      isTitleSearchDisplay : this.properties.isTitleSearchDisplay,
      isDepartmentSearchDisplay : this.properties.isDepartmentSearchDisplay,
      isSkillSearchDisplay : this.properties.isSkillSearchDisplay,
      isAskMeAboutSearchDisplay : this.properties.isAskMeAboutSearchDisplay,
      
      }
    );
      
    ReactDom.render(element, this.domElement);
    
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
  protected getLocaleId() : string {
    return this.context.pageContext.cultureInfo.currentUICultureName;
  }
  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneDropdown
                ('SearchTextfield',{ label:"Select your Search Textfield",options:[
                  {
                    key: "-Select your Search Textfield-",
                    text:"-Select your Search Textfield-",
                  },
                  {
                    key:"FirstNameSearch",
                    text:"Using First Name",
                  },
                  {
                    key:"LastNameSearch",
                    text:"Using Last Name",
                  },
                  {
                    key:"BothFirstLastNameSearch",
                    text:"Using Both First and Last Name",
                  },                  
                ],
                selectedKey :"-Select your Search Textfield-" 
              }),                          
              PropertyPaneToggle("isNameSearchDisplay",{
                label: "Display Name Search Textfield",
              }),
              PropertyPaneToggle("isTitleSearchDisplay",{
                label: "Display Title Search Textfield",
              }),
              PropertyPaneToggle("isDepartmentSearchDisplay",{
                label: "Display Department Search Textfield",
              }),
              PropertyPaneToggle("isSkillSearchDisplay",{
                label: "Display Skill Search Textfield",
              }),
              PropertyPaneToggle("isAskMeAboutSearchDisplay",{
                label: "Display AskMeAbout Search Textfield",
              }),                          
             ]
            }
          ]
        }

      ]
    };
  }
}
