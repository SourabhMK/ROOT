import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration
  
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'ObjectivesGoalsWebPartStrings';
import ObjectivesGoals from './components/ObjectivesGoals';
import { IObjectivesGoalsProps } from './components/IObjectivesGoalsProps';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import {
  PropertyPaneTextField,
  PropertyPaneCheckbox,
  PropertyPaneLabel,
  PropertyPaneLink,
  PropertyPaneSlider,
  PropertyPaneToggle,
  PropertyPaneDropdown
} from '@microsoft/sp-property-pane';

export interface IObjectivesGoalsWebPartProps {
  description: string;
  context:any;
  siteurl: string;
  spHttpClient: SPHttpClient;
  isAddGoalsDisplay : boolean;
}

export default class ObjectivesGoalsWebPart extends BaseClientSideWebPart<IObjectivesGoalsWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IObjectivesGoalsProps> = React.createElement(
      ObjectivesGoals,
      {
        description: this.properties.description,
        context:this.properties.context,
        siteurl: this.context.pageContext.web.absoluteUrl,
        spHttpClient: this.context.spHttpClient,
        isAddGoalsDisplay:this.properties.isAddGoalsDisplay,
      }
    );

    ReactDom.render(element, this.domElement);
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
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneToggle("isAddGoalsDisplay",{
                  label: "Add Goals Button Display",
                }),
              ]
            }
          ]
        }
      ]
    };
  }
}
