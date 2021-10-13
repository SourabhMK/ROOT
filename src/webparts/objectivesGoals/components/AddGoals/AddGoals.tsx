import * as React from 'react';
import styles from './AddGoals.module.scss';
import { IAddGoalsProps, IAddGoalsState } from './IAddGoalsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Icon } from '@fluentui/react/lib/Icon';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { DefaultButton, PrimaryButton } from "@fluentui/react/lib/Button";
import { Stack, IStackProps, IStackStyles } from '@fluentui/react/lib/Stack';
import {  IStackTokens } from '@fluentui/react';
import { TextField } from '@fluentui/react/lib/TextField';
import { Dropdown, DropdownMenuItemType, IDropdownStyles, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import Iframe from 'react-iframe';

const stackTokens = { childrenGap: 50  };
const stackStyles: Partial<IStackStyles> = { root: { width: 650 } };
const columnProps: Partial<IStackProps> = {
  tokens: { childrenGap: 10 },
  styles: { root: { width: 125, textAlign: "Center"  } },
};

//Dropdown options
// const dropdownStyles: Partial<IDropdownStyles> = {
//   dropdown: { width: 150 },
// };

const IntervalOptions: IDropdownOption[] = [
  { key: 'Interval', text: 'Interval', itemType: DropdownMenuItemType.Header },
  { key: 'Interval', text: 'Monthly Target' },
  { key: 'Interval', text: 'Quarterly Objectives' },
  { key: 'Interval', text: 'Yearly Goals' } 
];

const ColorOptions : IDropdownOption[] = [
  { key: 'Color', text: 'Color', itemType: DropdownMenuItemType.Header },
  { key: 'Color1', text: 'Red'},
  { key: 'Color2', text: 'Yellow' },
  { key: 'Color3', text: 'Green' }
];

//const stackTokens: IStackTokens = { childrenGap: 20 };



export default class AddGoals extends React.Component<IAddGoalsProps, {}> {

  componentDidMount()
  {
    this._SaveButtonClicked();
    this._CancelButtonClicked();
  } 

_SaveButtonClicked = () =>{
  //alert( "Save Button Clicked");
}

_CancelButtonClicked = () =>{
  //alert( "Cancel Button Clicked");
}

public render(): React.ReactElement<IAddGoalsProps> {
        return (
          <div className={ styles.addGoals }>
            <div className={ styles.container }>
            {/* <div className={ styles.row }>
            <div className={ styles.column }> */}
              <span className={ styles.title }>Add Goals data entry in the List of "ObjectivesAndGoals"</span>
              <Iframe url="https://gns11.sharepoint.com/sites/SiriusTeams/Lists/ObjectivesAndGoals/AllItems.aspx"
                          width="100%"
                          height="800px"/>
              {/* <Stack horizontal tokens={stackTokens} styles={stackStyles}>
                  <Stack {...columnProps}>
                    <TextField label="Title" id="TitleName" />
                  </Stack>
              </Stack>
              <Stack horizontal tokens={stackTokens} styles={stackStyles}>
                  <Stack {...columnProps}>
                    <TextField label="Goal" id="GoalsInfo" />
                  </Stack>
              </Stack>
              <Stack tokens={stackTokens}>
                      <Dropdown
                        placeholder="Select Color"
                        label="Color"
                        options={ColorOptions}
                        //styles={dropdownStyles}
                        styles={{ dropdown: { width: 125 } }}
                      />
              </Stack>
              <Stack tokens={stackTokens}>
                      <Dropdown
                        placeholder="Select an Interval"
                        label="Interval"
                        options={IntervalOptions}
                        //styles={dropdownStyles}
                        styles={{ dropdown: { width: 125 } }}
                      />
              </Stack>
              <DefaultButton onClick={this._SaveButtonClicked} ><h3>Save</h3></DefaultButton>
              <DefaultButton onClick={this._CancelButtonClicked}><h3>Cancel</h3></DefaultButton> */}
              
              {/*<p className={ styles.subTitle }>stomize SharePoint experiences using Web Parts.</p>
              <p className={ styles.description }>{escape(this.props.description)}</p>
              <a href="https://aka.ms/spfx" className={ styles.button }>
                <span className={ styles.label }>Learn more</span>
              </a>
             </div>
          </div>  */}
        </div>
      </div>
   );
  }
}