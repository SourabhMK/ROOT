import * as React from 'react';
import styles from '../AssignedToView/AssignedToView.module.scss';
import { Checkbox } from '@fluentui/react/lib/Checkbox';
import { IPersonaProps } from '@fluentui/react/lib/Persona';
import { IBasePickerSuggestionsProps, IPeoplePickerProps, NormalPeoplePicker, ValidationState } from '@fluentui/react/lib/Pickers';
//import { people, mru } from '@fluentui/example-data';
import DepartmentalRequest from '../DepartmentalRequest/DepartmentalRequest'
import { IAssignState } from '../AssignedToView/IAssignState';
import { IAssignProps, IAllAssignProps } from '../AssignedToView/IAssignProps';
import { SPHttpClient, ISPHttpClientOptions, SPHttpClientResponse } from '@microsoft/sp-http';
import {IDepartmentList, IDispacherList} from '../DepartmentalRequest/IDepartmentList'
import { DefaultButton, PrimaryButton, CompoundButton } from '@fluentui/react/lib/Button';
import 'office-ui-fabric-react/dist/css/fabric.css';
import { IconButton } from '@fluentui/react/lib/Button';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
initializeIcons();
import { Icon } from '@fluentui/react/lib/Icon';
import { Dropdown, IDropdown, IDropdownOption, optionProperties, TextField } from 'office-ui-fabric-react';
import { Item } from '@pnp/sp/items';
import { result } from 'lodash';
import NoDataDispatcherView from '../NoDataDispatcherView/NoDataDispatcherView';
import { Stack, IStackProps, IStackStyles } from '@fluentui/react/lib/Stack';

import {
  PropertyPaneTextField,
  PropertyPaneCheckbox,
  PropertyPaneLabel,
  PropertyPaneLink,
  PropertyPaneSlider,
  PropertyPaneToggle,
  PropertyPaneDropdown
} from '@microsoft/sp-property-pane';

import {
  DetailsList,
  DetailsListLayoutMode,
  IColumn,
  IDetailsFooterProps,
  DetailsRow,
  SelectionMode,
  DetailsRowCheck,
  IDetailsRowBaseProps,
  IDetailsRowCheckStyles,
} from '@fluentui/react/lib/DetailsList';

export interface IMyIssueList {
  created:string,
  description:string,
  category:string,
  department:string,
  assignedTo:string,
  comment:string,
  status:string,
  attachments:string
}

var work;


// debugger;
export default class AllAssignedToView extends React.Component<IAllAssignProps,IAssignState> {


  constructor(props) {
    super(props);
  }

  

  homeButtonClick(){
    this.setState({
      homeButton:1,
    });
    console.log("homeButton= " + this.state.homeButton);
  }
 
  public render(): React.ReactElement<IAllAssignProps> {
    return (
      <div className={ styles.assignedToView }>
            <div className="ms-Grid-row">
              <div className="ms-Grid-col ms-lg12 ms-sm12">
              <div style={{overflowX:'auto'}}>
              <table className={styles.tableSet} >
                  <thead>
                    <tr>
                      <th>Ticket Number</th>
                      <th>Raised By</th>
                      <th>Issue Date</th>
                      <th>Description</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>ReAssigned To</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                     this.props.allDetailsProp.map((res,index)=>{
                     var issuedDate = new Date(res.issueDate).toLocaleDateString();
                        return(
                          <tr>
                            <td>{res.ticketNumber}</td>
                            <td>{res.raisedBy}</td>
                            <td>{issuedDate}</td>
                            <td>{res.description}</td>
                            <td>{res.category}</td>
                            <td>{res.status}</td>
                            <td>{res.reAssignedTo.Title}</td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                  </table>
                 </div> 

              </div>
            </div> 
     </div>
    );
  }
}





  



