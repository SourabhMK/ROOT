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
      isDeaprtmentSearchDisplay : boolean;
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
      isDeaprtmentSearchDisplay : this.properties.isDeaprtmentSearchDisplay,
      isSkillSearchDisplay : this.properties.isNameSearchDisplay,
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

        
      ]
    };
  }
}
