import * as React from 'react';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import styles from './Filter.module.scss';
import { escape } from '@microsoft/sp-lodash-subset';
import { IFilterState, IFilterProps } from './IFilterProps';
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

export default class Filter extends React.Component<IFilterProps, IFilterState> {
  
    constructor(props:IFilterProps) { 
      super(props);

      this.state = {
        name: "",
        title: "",
        department: "",
        skill: "",
        askMeAbout: ""
      };
    }

    public render(): React.ReactElement<IFilterProps> {
      const PerformSearchClick =()=>{
        debugger;
        let para:IFilterState = {
          name: this.state.name,
          title: this.state.title,
          department: this.state.department,
          skill: this.state.skill,
          askMeAbout: this.state.askMeAbout
        };
        this.props.performSearch(para);
      };

      return (
        <div className={ styles.filter }>
               <span className={ styles.title }> People Search </span>
               <div className="ms-Grid" >
               <div className="ms-Grid-row"  >
                { this.props.isNameSearchDisplay && 
                  <div className="ms-Grid-col ms-u-sm2">
                  <Stack horizontal tokens={stackTokens} styles={stackStyles}>
                  <Stack {...columnProps}>
                    <TextField label="Name" id="filterName" onBlur={e=>{this.setState({name:e.target.value});}}/>
                  </Stack>
                  </Stack>
                  </div>
                }
                { this.props.isTitleSearchDisplay &&
                <div className="ms-Grid-col ms-u-sm2" >
                  <Stack horizontal tokens={stackTokens} styles={stackStyles}>
                    <Stack {...columnProps}>
                      <TextField label="Title" onBlur={e=>{this.setState({title:e.target.value});}}/>
                    </Stack>
                  </Stack>
                </div>
                }
                 { this.props.isDepartmentSearchDisplay && 
                <div className="ms-Grid-col ms-u-sm2">
                  <Stack horizontal tokens={stackTokens} styles={stackStyles}>
                    <Stack {...columnProps}>
                      <TextField label="Department" onBlur = {e=>{this.setState({department:e.target.value});}}/>
                    </Stack>
                  </Stack>
                </div>
                 }  
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
                  <DefaultButton style={{top:"29px"}}  onClick={PerformSearchClick} className={styles.button}> Search </DefaultButton>
              </div>
            </div>
          </div>
          </div>
      );
    }
  }
