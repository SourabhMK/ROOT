import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneSlider
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart, WebPartContext } from '@microsoft/sp-webpart-base';
import * as strings from 'DepartmentalNewsWebPartStrings';
import DepartmentalNews from './components/DepartmentalNews';
import { IDepartmentalNewsProps } from './components/IDepartmentalNewsProps';

export interface IDepartmentalNewsWebPartProps {
  description: string;
  NoOfNews: Number;
  webPartContext: WebPartContext;
}

export default class DepartmentalNewsWebPart extends BaseClientSideWebPart<IDepartmentalNewsWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IDepartmentalNewsProps> = React.createElement(
      DepartmentalNews,
      {
        description: this.properties.description,
        NoOfNews: this.properties.NoOfNews,
        webPartContext: this.context
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
            description: 'Display departmental news'
          },
          groups: [
            {
              groupName: "",
              groupFields: [
                PropertyPaneSlider('NumberOfNews', {
                  label: 'No of Departmental News',
                  min: 0,
                  max: 10,
                  value: 0,
                  showValue: true,
                  step: 1
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
