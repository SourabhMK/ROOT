import * as React from 'react';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import styles from './Filter.module.scss';
import { escape } from '@microsoft/sp-lodash-subset';
import { IFilterProps } from './IFilterProps';
import { TextField } from '@fluentui/react/lib/TextField';
import { Stack, IStackProps, IStackStyles } from '@fluentui/react/lib/Stack';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import {  IStackTokens } from '@fluentui/react';
//import { IStackTokens, Stack } from '@fluentui/react/lib/Stack';
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

const options: IDropdownOption[] = [
  { key: 'Skill', text: 'Skill', itemType: DropdownMenuItemType.Header },
  { key: '.NET', text: '.NET' },
  { key: 'AngularJS', text: 'AngularJS' },
  { key: 'Android', text: 'Android' },
  { key: 'Azure Networking', text: 'Azure Networking' }
];

const optionsAskMeAbout : IDropdownOption[] = [
  { key: 'Ask Me About', text: 'Ask Me About', itemType: DropdownMenuItemType.Header },
  { key: 'Active Directory', text: 'Active Directory'},
  { key: 'Customer Support', text: 'Customer Support' },
  { key: 'Executive', text: 'Executive' },
  { key: 'Networking', text: 'Networking' }
 
];

//const stackTokens: IStackTokens = { childrenGap: 20 };


//Primary Button
//const stackTokens: IStackTokens = { childrenGap: 40 };

export default class PeopleSearch extends React.Component<IFilterProps, {}> {
    public render(): React.ReactElement<IFilterProps> {
      return (
        <div className={ styles.filter }>
          <div className={ styles.container }>
            {/* <h2>People Search </h2> */}
            {/* <div className={ styles.row }>
              <div className={ styles.column }> */}
               <span className={ styles.title }> People Search </span>

               <div className="ms-Grid" >
               <div className="ms-Grid-row"  >
                { this.props.isNameSearchDisplay && 
                  <div className="ms-Grid-col ms-u-sm2">
                  <Stack horizontal tokens={stackTokens} styles={stackStyles}>
                  <Stack {...columnProps}>
                    <TextField label="Name" />                
                  </Stack>
                  </Stack>
                  </div>
                }
                { this.props.isTitleSearchDisplay &&
                <div className="ms-Grid-col ms-u-sm2" >
                  <Stack horizontal tokens={stackTokens} styles={stackStyles}>
                    <Stack {...columnProps}>
                      <TextField label="Title" />                
                    </Stack>
                  </Stack>
                </div>
                }                
                {/* { this.props.isDeaprtmentSearchDisplay && */}
                <div className="ms-Grid-col ms-u-sm2">
                  <Stack horizontal tokens={stackTokens} styles={stackStyles}>
                    <Stack {...columnProps}>
                      <TextField label="Department" />                
                    </Stack>
                  </Stack>
                </div>
                {/* }  */}
                { this.props.isSkillSearchDisplay &&
                <div className="ms-Grid-col ms-u-sm2">
                <Stack tokens={stackTokens}>
                      <Dropdown
                        placeholder="Select an option"
                        label="Skill"
                        options={options}
                        //styles={dropdownStyles}
                        styles={{ dropdown: { width: 125 } }}
                      />
                  </Stack>
                </div>
                }
                { this.props.isAskMeAboutSearchDisplay &&
                <div className="ms-Grid-col ms-u-sm2">
                    <Stack tokens={stackTokens}>             
                      <Dropdown
                        placeholder="Select an option"
                        label="Ask Me About"
                        options={optionsAskMeAbout}
                        //styles={dropdownStyles}
                        styles={{ dropdown: { width: 125 } }}
                      />
                    </Stack>
                </div>
                }
               <div className="ms-Grid-col ms-u-sm2">             
                  {/* <PrimaryButton text="Search"  /> */}
                  <DefaultButton  onClick={_alertClicked} className={styles.button}> Search </DefaultButton>                 
              </div>
            </div>
          </div>      
                
              {/* </div>
            </div> */}
          </div>
        </div>
      );
    }
  }

  function _alertClicked(): void {
    alert('Search Button Clicked');
  }