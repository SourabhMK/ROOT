import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  IPropertyPaneDropdownProps,
  PropertyPaneDropdown,
  PropertyPaneCheckbox,
  PropertyPaneToggle,
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
                PropertyPaneDropdown('nameFormatIndex',{ label:"Select your list type",options:[
                  {
                    key:0,
                    text:"First-Name then Last-Name",
                  },
                  {
                    key:1,
                    text:"Last-Name then First-Name",
                  },
                  {
                    key:2,
                    text:"Only First-Name",
                  },
                ],
                selectedKey :0 
              }),
              PropertyPaneToggle("isContactNumberDisplay",{
                label: "Display Contact Number",
              }),
              PropertyPaneToggle("isFollowerDisplay",{
                label: "Display Followers",
              }),
              PropertyPaneToggle("isFollowingDisplay",{
                label: "Display Following",
              }),
              // PropertyPaneToggle("isDateOfBirthDisplay",{
              //   label: "Display Date of Birth",
              // }),
              // PropertyPaneToggle("isDateOfJoiningDisplay",{
              //   label: "Display Date of Joining",
              // }),
              // PropertyPaneToggle("isWorkAnniversaryDisplay",{
              //   label: "Display Work Anniversary",
              // }),
              ]
            }
          ]
        }
      ]
    };
  }
}
