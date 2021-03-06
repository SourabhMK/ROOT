import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'AssetReservationWebPartStrings';
import AssetReservation from './components/AssetReservation';
import { IAssetReservationProps } from './components/IAssetReservationProps';
import { SPHttpClient } from '@pnp/sp';


export interface IAssetReservationWebPartProps {
  description: string,
  context:any,
  siteurl: string,
  spHttpClient: SPHttpClient,
}

export default class AssetReservationWebPart extends BaseClientSideWebPart<IAssetReservationWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IAssetReservationProps> = React.createElement(
      AssetReservation,
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
