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
import { RoomsImages }  from './RoomsImages';
import Iframe from 'react-iframe';

const stackTokens = { childrenGap: 50  };

// Dropdown options
// const dropdownStyles: Partial<IDropdownStyles> = {
//   dropdown: { width: 150 },
// };

const MyRoomIcon = () => <Icon iconName="AddHome" className = {styles.roomIcon} />;

const optionsRoomsName: IDropdownOption[] = [
  { key: 'RoomFilter1', text: 'Location ', itemType: DropdownMenuItemType.Header },
  { key: 'RoomFilter1', text: 'Area' },
  { key: 'RoomFilter1', text: 'Building Floor' },
  { key: 'RoomFilter1', text: 'Room Size' } 
];


//Primary Button
//const stackTokens: IStackTokens = { childrenGap: 40 };

// interface IRoomsState {     
//   roomsFilter: string[];
//   errorMessage: string;
// } 

let RoomsFilter: string[] = [];

debugger;
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
        //roomsOptionsName:[],
        roomsFilter: [],
        errorMessage : ""
      };
    }

    public componentDidMount(): void {
      // this.Getrooms().then((RoomName: any): void => {
      //   let RoomObject=RoomName.value;  
      //   this.state.RoomtItems.push( {key:"0", text:"All"});         
      //     for (let i = 0; i < RoomObject.length; i++) {  
      //       this.state.RoomItems.push(     
      //         {  key: i.toString(),
      //           text:RoomObject[i].Title,
      //         });        
      //     }
      // }); 


      //this._getListroomsOptionsName(); 
      this._getRoomsFilter();
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
    //         console.log("roomsOptionsName", roomsOptionsName);
    //       }
          
    //       )
    //   }

    _getRoomsFilter = async () =>
  {    
    const headers: HeadersInit = new Headers();
    headers.append("accept", "application/json;odata.metadata=none");

        await this.props.spHttpClient
        .get(`${this.props.siteurl}/_api/web/lists/getbytitle('RoomsFilter')/items?$select=ID,Title`, SPHttpClient.configurations.v1, {
          headers: headers
        })
        .then((result: SPHttpClientResponse) => {          
          return result.json();
        })
        .then((jsonresult) => {
          RoomsFilter = [];         
          for(let i=0; i<jsonresult.value.length; ++i)
          {
            RoomsFilter.push(jsonresult.value[i].Title);
          }
          this.setState({
            roomsFilter: RoomsFilter
          })
        })      
  }  

    public render(): React.ReactElement<IRoomsProps> {

      return (
        <div className={ styles.rooms }>
          <div className={ styles.container }>
            <div className={styles.description}>                        
              <h1 style={{margin:'0'}}><MyRoomIcon/>Rooms Reservation</h1>
            </div> 
                     {/* <div className={ styles.row }> 
                  <Icon iconName="AddHome" />
                    <span className={ styles.title }> Rooms Reservation </span> 
                      <div className={ styles.column }>                     
                      </div>
                    </div>*/}
            
            <div className="ms-Grid" >                              
                {/* <div className="ms-Grid-col ms-u-sm1">                     
                       <IconButton iconProps={{ iconName: 'ImageCrosshair' }} title="View Selected Room" ariaLabel="DisplayImage" />                      
                </div>               */}                                                                                           
             <div className="ms-Grid-row"  >
                <div className="ms-Grid-col ms-u-sm2">
                    <a href="https://champion1.sharepoint.com/sites/SPMall/IPDevV2/Lists/RoomReservation/calendar.aspx" target="_self"> 
                    <IconButton iconProps={{ iconName: 'AddEvent' }} title="Add Room Reservation" ariaLabel="AddRoom" />
                    </a>
                </div>
                <div className="ms-Grid-col ms-u-sm4">
                    <Stack tokens={stackTokens}>
                      <Dropdown
                        placeholder="Filter your Room Options"
                        //label="Rooms"
                        options={optionsRoomsName}
                        // {this.state.roomsFilter.map((room, index) => {
                        //    return { key: 'RoomFilter1', text: 'Area' }
                        //   })} 
                        //styles={dropdownStyles}
                        styles={{ dropdown: { width: 200 } }}
                        //onChange={this._onChange_Rooms}
                      />
                    </Stack>
                </div> 
                
                <div className="ms-Grid-col ms-u-sm6">
                <RoomsImages siteurl={this.props.siteurl} spHttpClient = {this.props.spHttpClient}></RoomsImages>
                </div>
                
             </div>
             </div>
             <div>
             <Iframe url="https://champion1.sharepoint.com/sites/SPMall/IPDevV2/Lists/RoomReservation/calendar.aspx"
                    width="100%"
                    height="800px"/>
              </div>
             {/* <div className="ms-Grid" >
              <div className="ms-Grid-row"  >
                <div className="ms-Grid-col ms-u-sm12">
                <Iframe url="https://champion1.sharepoint.com/sites/SPMall/IPDevV2/Lists/RoomReservation/calendar.aspx"
                    width="100%"
                    height="100%"/>                    
                </div>
               </div>
             </div> */}
          
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


  
