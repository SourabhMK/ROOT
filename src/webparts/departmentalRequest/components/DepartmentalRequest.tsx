import * as React from 'react';
import styles from './DepartmentalRequest.module.scss';
import { IDepartmentalRequestProps } from './IDepartmentalRequestProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import {IDepartmentalRequestState} from './IDepartmentalRequestState';
import { TextField } from '@fluentui/react/lib/TextField';
import { Stack, IStackProps, IStackStyles } from '@fluentui/react/lib/Stack';
import {  IStackTokens } from '@fluentui/react';
import { Dropdown, DropdownMenuItemType, IDropdownStyles, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import {
  PropertyPaneTextField,
  PropertyPaneCheckbox,
  PropertyPaneLabel,
  PropertyPaneLink,
  PropertyPaneSlider,
  PropertyPaneToggle,
  PropertyPaneDropdown
} from '@microsoft/sp-property-pane';

const stackTokens = { childrenGap: 50  };
const stackStyles: Partial<IStackStyles> = { root: { width: 650 } };
const columnProps: Partial<IStackProps> = {
  tokens: { childrenGap: 10 },
  styles: { root: { width: 125, textAlign: "Center"  } },
};

//Dropdown options
const dropdownStyles: Partial<IDropdownStyles> = {
  dropdown: { width: 150 },
};

const departmentOptions: IDropdownOption[] = [
  { key: 0, text: 'Depts', itemType: DropdownMenuItemType.Header },
  { key: 1, text: 'HR' },
  { key: 2, text: 'IT' },
];

const departmentCategoryOptions: IDropdownOption[] = [
  { key: 0, text: 'Categories', itemType: DropdownMenuItemType.Header },
  { key: 1, text: 'Printer' },
  { key: 2, text: 'Insurance' },
  { key: 3, text: 'Job Description' },
];


export default class DepartmentalRequest extends React.Component<IDepartmentalRequestProps, IDepartmentalRequestState> {

  constructor(props){
    super(props);
    this.state = {
      count : 0,
      // Users:[],
      // Followers:[],
      // Following:[],
      bgColorRaiseRequest:"#ef8700",
      bgColorFollowers:"white",
      bgColorFollowing:"white",
      colorRaiseRequest:"white",
      colorFollowers:"black",
      colorFollowing:"black",
      loading:false,
      errorMessage:null,
    }
  }

  raiseRequestClick=()=>{
    this.setState({
      count: 1,
    bgColorRaiseRequest:"#ef8700",
    bgColorFollowers:"white",
    bgColorFollowing:"white",
    colorRaiseRequest:"white",
    colorFollowers:"black",
    colorFollowing:"black",
    })
  }
  
  public render(): React.ReactElement<IDepartmentalRequestProps> {
    return (
      <div className={ styles.departmentalRequest }>
          <h1>Welcome to Departmental Request facility</h1>
          <div className={styles.SetDisplay}>
            <div><DefaultButton style={{backgroundColor:this.state.bgColorRaiseRequest, color:this.state.colorRaiseRequest,border:'1px solid #ddd'}} onClick={this.raiseRequestClick}>Raise a Request</DefaultButton></div>
            {/* <div><DefaultButton>Issue</DefaultButton></div>
            <div><DefaultButton>Archived</DefaultButton></div> */}
          </div>

          {
            (this.state.count === 1) && 
            <div>
                {/* <span className={ styles.title }> Select Department </span> */}
                <div className="ms-Grid" >
                  <div className="ms-Grid-row"  >
                    <Stack tokens={stackTokens}>
                        <Dropdown
                          placeholder="Select an option"
                          label="Select Department"
                          options={departmentOptions}
                          //styles={dropdownStyles}
                          styles={{ dropdown: { width: 125 } }}
                        />
                    </Stack>
                    <Stack tokens={stackTokens}>
                    <Dropdown
                          placeholder="Select an option"
                          label="Select Category"
                          options={departmentCategoryOptions}
                          //styles={dropdownStyles}
                          styles={{ dropdown: { width: 125 } }}
                        />
                    </Stack>
                    {/* <Stack horizontal tokens={stackTokens} styles={stackStyles}>
                     <Stack {...columnProps}>
                      <TextField label="Standard" multiline rows={3} />
                     <TextField label="Disabled" multiline rows={3} disabled defaultValue={dummyText} />
                     <TextField label="Non-resizable" multiline resizable={false} />
                    </Stack> */}
                    <TextField label="Type your issue" multiline rows={3} />
                    <DefaultButton style={{backgroundColor:this.state.bgColorRaiseRequest, color:this.state.colorRaiseRequest,border:'1px solid #ddd', top:'8px', bottom:'8px'}}>Submit</DefaultButton>

                  </div>
                </div>
            </div>
          }
      </div>
    );
  }
}
