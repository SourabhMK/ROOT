import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'ApplicationFeedWebPartStrings';
import ApplicationFeed from './components/ApplicationFeed';
import { IApplicationFeedProps } from './components/IApplicationFeedProps';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

export interface IApplicationFeedWebPartProps {
  description: string;
  context:any;
  siteurl: string;
  spHttpClient: SPHttpClient;
}

debugger;
export default class ApplicationFeedWebPart extends BaseClientSideWebPart<IApplicationFeedWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IApplicationFeedProps> = React.createElement(
      ApplicationFeed,
      {
        description: this.properties.description,
        context:this.properties.context,
        siteurl: this.context.pageContext.web.absoluteUrl,
        spHttpClient: this.context.spHttpClient,
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
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
