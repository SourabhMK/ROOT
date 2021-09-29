import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as strings from 'SocialFeedsWebPartStrings';
import SocialFeeds from './components/SocialFeeds';
import { ISocialFeedsProps } from './components/ISocialFeedsProps';

export default class SocialFeedsWebPart extends BaseClientSideWebPart<ISocialFeedsProps> {

  public render(): void {
    const element: React.ReactElement<ISocialFeedsProps> = React.createElement(
      SocialFeeds,
      {
        description: this.properties.description,
        company: this.properties.company,
        height: this.properties.height,
        smallHeader: this.properties.smallHeader,
        hideCover: this.properties.hideCover,
        showFacepile: this.properties.showFacepile,
        username: this.properties.username,
        showAlias: this.properties.showAlias
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

  protected onPropertyPaneFieldChanged(){
    this.context.propertyPane.refresh();
    this.render();
  }

  protected onAfterPropertyPaneChangesApplied(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
    this.render();
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {

    let company: any = [];
    let height: any = [];
    let smallHeader: any = [];
    let hideCover: any = [];
    let showFacepile: any = [];
    
    company = PropertyPaneTextField('company', {
      label: strings.CompanyFieldLabel
    });

    height = PropertyPaneTextField('height', {
      label: strings.HeightFieldLabel
    });

    smallHeader = PropertyPaneToggle('smallHeader', {
      label: strings.SmallHeaderFieldLabel
    });

    hideCover = PropertyPaneToggle('hideCover', {
      label: strings.HideCoverFieldLabel
    });

    showFacepile = PropertyPaneToggle('showFacepile', {
      label: strings.ShowFacepileFieldLabel
    });     

    return {
      pages: [
        {
          header: {
            description: "Dispaly all social feeds"
          },
          groups: [
            {
              groupName: "",
              groupFields: [
                company,
                height,
                smallHeader,
                hideCover,
                showFacepile,
                PropertyPaneTextField('username', {
                  label: "Username" ? "Username" : "thenikhilk"
                }),
                PropertyPaneToggle('showAlias', {
                  label: "Show user avatar?",
                  onText: "Yes",
                  offText: "No"
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
