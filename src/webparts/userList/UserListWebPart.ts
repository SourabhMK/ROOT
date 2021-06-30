import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  IPropertyPaneDropdownProps,
  PropertyPaneDropdown,
  PropertyPaneCheckbox,
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'UserListWebPartStrings';
import UserList from './components/UserList';
import { IUserListProps } from './components/IUserListProps';

export interface IUserListWebPartProps {
  description: string;
  title: string;
  nameFormatIndex: number;
  isContactNumberDisplay:boolean;
  isDateOfBirthDisplay:boolean;
  isDateOfJoiningDisplay:boolean;
  isWorkAnniversaryDisplay:boolean;
  isFollowingDisplay:boolean,
  isFollowerDisplay:boolean,
}

export default class UserListWebPart extends BaseClientSideWebPart<IUserListWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IUserListProps> = React.createElement(
      UserList,
      {
       //description: this.properties.description,
        webUrl: this.context.pageContext.web.absoluteUrl,
        spHttpClient: this.context.spHttpClient,
        title: this.properties.title,
        description:this.properties.description,
        nameFormatIndex:this.properties.nameFormatIndex,
        isContactNumberDisplay:this.properties.isContactNumberDisplay,
        isDateOfBirthDisplay:this.properties.isDateOfBirthDisplay,
        isDateOfJoiningDisplay:this.properties.isDateOfJoiningDisplay,
        isWorkAnniversaryDisplay:this.properties.isWorkAnniversaryDisplay,
        isFollowingDisplay:this.properties.isFollowingDisplay,
        isFollowerDisplay:this.properties.isFollowerDisplay,
        onTitleUpdate: (newTitle: string) => {
          // after updating the web part title in the component
          // persist it in web part properties
          this.properties.title = newTitle;
        }
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
                PropertyPaneDropdown
                ('ListName',{ label:"Select your list",options:[
                  {
                    key: "-Select your list-",
                    text:"-Select your list-",
                  },
                  {
                    key:"US",
                    text:"First-Name then Last-Name",
                  },
                  {
                    key:"UK",
                    text:"Last-Name then First-Name",
                  },
                  {
                    key:"OTH",
                    text:"Only First-Name",
                  },
                ],
                selectedKey :"-Select your list-" 
              }),
              PropertyPaneCheckbox("ContactNumber",{
                text: "Display Contact Number",
              }),
              PropertyPaneCheckbox("DateOfJoining",{
                text: "Display Date of joining",
              }),
              PropertyPaneCheckbox("BirthDay",{
                text: "Display Birth Day",
              }),
              PropertyPaneCheckbox("WorkAnniversary",{
                text: "Display  Work Anniversary",
              }),
              ]
            }
          ]
        }
      ]
    };
  }
}
