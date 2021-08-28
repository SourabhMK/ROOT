import { Guid } from '@microsoft/sp-core-library';
import { override } from '@microsoft/decorators';

// import * as React from 'react';
// import * as ReactDom from 'react-dom';
// import { Version } from '@microsoft/sp-core-library';


import {
  BaseListViewCommandSet,
  Command,
  IListViewCommandSetListViewUpdatedParameters,
  IListViewCommandSetExecuteEventParameters
} from '@microsoft/sp-listview-extensibility';
import { Dialog } from '@microsoft/sp-dialog';

import * as strings from 'AssignIssueEcbCommandSetStrings';
// import PeoplePicker from '../../webparts/departmentalRequest/components/TestFolder/PeoplePicker';
// import PeoplePickerTestExample from '../../webparts/departmentalRequest/components/TestFolder/PeoplePickerTestExample';

export interface IAssignIssueEcbCommandSetProperties {
  targetUrl: string;
}

export default class AssignIssueEcbCommandSet extends BaseListViewCommandSet<IAssignIssueEcbCommandSetProperties> {

  @override
  public onInit(): Promise<void> {
    return Promise.resolve();
  }

  // public render(): void {
  //   const element: React.ReactElement<IAssignIssueEcbCommandSetProperties> = React.createElement(
  //     PeoplePickerTestExample,
  //     {
  //      // description: this.properties.description,
  //       webUrl: this.context.pageContext.web.absoluteUrl,
  //       spHttpClient: this.context.spHttpClient,
  //       //groupType:this.properties.groupType,
  //       loggedInUserName:this.context.pageContext.user.displayName,
  //       loggedInUserEmail:this.context.pageContext.user.email,
  //       currentUserId:this.context.pageContext.legacyPageContext["userId"],
  //       targetUrl:this.properties.targetUrl
  //     }
  //   );

  //   //ReactDom.render(element, this.domElement);
  // }

  @override
  public onListViewUpdated(event: IListViewCommandSetListViewUpdatedParameters): void {
    const compareOneCommand: Command = this.tryGetCommand('ShowDetails');
    if (compareOneCommand) {
      // This command should be hidden unless exactly one row is selected.
      compareOneCommand.visible = event.selectedRows.length === 1;
    }
  }

  @override
  public onExecute(event: IListViewCommandSetExecuteEventParameters): void {
    switch (event.itemId) {
      case 'ShowDetails':

        const itemId: number = event.selectedRows[0].getValueByName("ID");
        const listId: Guid = this.context.pageContext.list.id;
        Dialog.alert(`Clicked on it`);
        //PeoplePickerTestExample
          //this.render();

       // window.location.replace(`https://gns11.sharepoint.com/sites/SiriusTeams/Lists/EmployeeRequest/AllItems.aspx?ID=${itemId}&List=${listId}`);

        break;
      default:
        throw new Error('Unknown command');
    }
  }
}