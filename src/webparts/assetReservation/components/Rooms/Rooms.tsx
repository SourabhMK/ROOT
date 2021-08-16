import * as React from 'react';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import styles from './Rooms.module.scss';
import { IRoomsProps } from './IRoomsProps';
import { IRoomsState } from './IRoomsState';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { Stack, IStackProps, IStackStyles } from '@fluentui/react/lib/Stack';
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
import { Icon } from '@fluentui/react/lib/Icon';
import { IconButton } from '@fluentui/react/lib/Button';
//import pnp, { Web } from 'sp-pnp-js';


const stackTokens = { childrenGap: 50  };

// Dropdown options
// const dropdownStyles: Partial<IDropdownStyles> = {
//   dropdown: { width: 150 },
// };

const optionsRoomsName: IDropdownOption[] = [
  { key: 'Room1', text: 'Conferance Room 1 ', itemType: DropdownMenuItemType.Header },
  { key: 'Room2', text: 'Conferance Room 2' },
  { key: 'Room3', text: 'Conferance Room 3' },
  { key: 'Room4', text: 'Conferance Room 4' },
  { key: 'Room5', text: 'Small Meeting Room' }
];


//Primary Button
//const stackTokens: IStackTokens = { childrenGap: 40 };

export default class rooms extends React.Component<IRoomsProps, IRoomsState> {
  
    constructor(props:IRoomsProps, state:IRoomsState) { 
      super(props);

    //  this.roomsOptionsName = [];    
    //  this.roomsOptionsName.push(        
    //     { key: 'Room1', text: 'Conferance Room 1 ', itemType: DropdownMenuItemType.Header },
    //     { key: 'Room2', text: 'Conferance Room 2' },
    //     { key: 'Room3', text: 'Conferance Room 3' },
    //     { key: 'Room4', text: 'Conferance Room 4' },
    //     { key: 'Room5', text: 'Small Meeting Room' }                  
    //   );
      this.state = {
        //items: this.roomsOptionsName,
        roomsOptionsName:[],
      };
    }

    public componentDidMount(): void {
      // this.GetDepartment().then((DeptName: any): void => {
      //   let DepartmentObject=DeptName.value;  
      //   this.state.DepartmentItems.push( {key:"0", text:"All"});         
      //     for (let i = 0; i < DepartmentObject.length; i++) {  
      //       this.state.DepartmentItems.push(     
      //         {  key: i.toString(),
      //           text:DepartmentObject[i].Title,
      //         });        
      //     }
      // }); 


      //this._getListroomsOptionsName(); 
    }

    // private _getListroomsOptionsName():void
    //   {    
    //     var titles:Array<any> = [];
    //     let web = new Web(this.props.context.pageContext.web.absoluteUrl);
    //       web.lists.getByTitle('rooms').items.get().then
    //       ((response)=>{
    //         let roomsOptionsName=response.map(item=>{
    //           titles.push(item.Title);
    //         });       
    //         this.setState({titles});
    //       }

    //       )
    //   }

    public render(): React.ReactElement<IRoomsProps> {

      return (
        <div className={ styles.rooms }>
               <div className={ styles.container }>
                <div className={ styles.row }> 
                    <div className={ styles.column }> 
                    <Icon iconName="AddHome" />
                    <span className={ styles.title }> Rooms Reservation </span>
                    </div>
                </div>
                </div> 
               <div className="ms-Grid" >
               <div className="ms-Grid-row"  >
                {/* { this.props.isRoomSearchDisplay &&  */}
                <div className="ms-Grid-col ms-u-sm10">
                    <Stack tokens={stackTokens}>
                      <Dropdown
                        placeholder="Reserve your Room"
                        //label="Rooms"
                        options={optionsRoomsName}
                        //styles={dropdownStyles}
                        styles={{ dropdown: { width: 600 } }}
                        //onChange={this._onChange_Rooms}
                      />
                    </Stack>
                </div> 
                <div className="ms-Grid-col ms-u-sm1">
                       {/* <img src=""> */}
                       <IconButton iconProps={{ iconName: 'ImageCrosshair' }} title="View Selected Room" ariaLabel="DisplayImage" />
                       {/* </img> */}
                </div>              
                {/* { this.props.isAddRoomButtonDisplay &&  */}
                <div className="ms-Grid-col ms-u-sm1">
                    <a href="https://champion1.sharepoint.com/sites/SPMall/IPDevV2/Lists/RoomReservation/calendar.aspx" target="_self"> 
                    <IconButton iconProps={{ iconName: 'AddEvent' }} title="Add Room Reservation" ariaLabel="AddRoom" />
                    </a>
                </div>  
                                   
                {/* }               */}
               {/* <div className="ms-Grid-col ms-u-sm2">
                  <DefaultButton style={{top:"29px"}}  onClick={SearchClick} className={styles.button}> Search </DefaultButton>
               </div> */}
            </div>
          </div>
          </div>
      );
    }
  }

  function _onChange_Rooms(): void {
    alert('Rooms dropdown options selected');  
  //  this.setState({
  //     items: this.roomsOptionsName          
  //   });
    
 }


  
