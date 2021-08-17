import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'DepartmentalRequestWebPartStrings';
import DepartmentalRequest from './components/DepartmentalRequest/DepartmentalRequest';
import { IDepartmentalRequestProps } from './components/DepartmentalRequest/IDepartmentalRequestProps';

export interface IDepartmentalRequestWebPartProps {
  description: string;
  groupType:number;
}

export default class DepartmentalRequestWebPart extends BaseClientSideWebPart<IDepartmentalRequestWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IDepartmentalRequestProps> = React.createElement(
      DepartmentalRequest,
      {
        description: this.properties.description,
        webUrl: this.context.pageContext.web.absoluteUrl,
        spHttpClient: this.context.spHttpClient,
        groupType:this.properties.groupType,
        loggedInUserName:this.context.pageContext.user.displayName,
        loggedInUserEmail:this.context.pageContext.user.email,
        currentUserId:this.context.pageContext.legacyPageContext["userId"],
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
                PropertyPaneDropdown('groupType',{
                  label:"Select your group type",options:[
                    {
                      key:0,
                      text: "Microsoft Group",
                    },
                    {
                      key:1,
                      text:"SharePoint Group"
                    }
                  ],
                  selectedKey:0
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
