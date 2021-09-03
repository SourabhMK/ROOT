import * as React from 'react';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import styles from './Rooms.module.scss';
import { IRoomsProps } from './IRoomsProps';
import { IRoomsState } from './IRoomsState';
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
import Carousel from 'react-elastic-carousel';
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

var optionsRoomsLocation: IDropdownOption[] = [
  // { key: 'RoomsLocation1', text: 'Location ', itemType: DropdownMenuItemType.Header },
  // { key: 'RoomsLocation2', text: 'Pune' },
  // { key: 'RoomsLocation3', text: 'Mumbai' },
  // { key: 'RoomsLocation4', text: 'PCMC' } 
];

var optionsRoomsArea: IDropdownOption[] = [
  // { key: 'RRoomsArea1', text: 'Area ', itemType: DropdownMenuItemType.Header },
  // { key: 'RoomsArea2', text: 'Phase 1 ' },
  // { key: 'RoomsArea3', text: 'Phase 2' },
  // { key: 'RoomsArea4', text: 'Phase 3' } 
];

var optionsRoomsBuildingFloor: IDropdownOption[] = [
  // { key: 'RoomsBuildingFloor1', text: 'Building Floor ', itemType: DropdownMenuItemType.Header },
  // { key: 'RoomsBuildingFloor2', text: 'Floor 1' },
  // { key: 'RoomsBuildingFloor3', text: 'Floor 2' },
  // { key: 'RoomsBuildingFloor4', text: 'Floor 3' } 
];

var optionsRoomsSize: IDropdownOption[] = [
  // { key: 'RoomsSize1', text: 'Rooms Size ', itemType: DropdownMenuItemType.Header },
  // { key: 'RoomsSize2', text: 'Small' },
  // { key: 'RoomsSize3', text: 'Medium' },
  // { key: 'RoomsSize4', text: 'Large' } 
];

//Primary Button
//const stackTokens: IStackTokens = { childrenGap: 40 };

// interface IRoomsState {     
//   roomsFilter: string[];
//   errorMessage: string;
// } 

let RoomsFilter: IDropdownOption[] = [];
// let RoomsLocationData:IDropdownOption[] = [];
// let RoomsAreaData: IDropdownOption[] = [];
// let RoomsBuildingFloorData: IDropdownOption[] = [];
// let RoomsSizeData:IDropdownOption[] = [];
let RoomsPictureData:any;

let Images: string[] = [];

debugger;
export default class rooms extends React.Component<IRoomsProps, IRoomsState> {
  
    constructor(props:IRoomsProps, state:IRoomsState) { 
      super(props);       
      this.state = {       
        roomsFilter: [],
        roomsLocationData:[],
        roomsAreaData: [],
        roomsBuildingFloorData: [],
        roomsSizeData:[],
        roomsPictureData:[],
        roomLocationId:0,
        roomAreaId:0,
        roomBuildingFloorId:0,
        roomSizeId:0,
        roomsAreaDropdownDisplay:false,
        roomsBuildingFloorDropdownDisplay:false,
        roomsSizeDropdownDisplay:false,
        //Image Display purpose
        selectedImage: "",
        images:[],
        errorMessage : ""
      };
    }

    public componentDidMount(): void {       
      this._getRoomsFilter();
      this._getRoomLocation(this.state.roomLocationId);
      this._getRoomArea(this.state.roomLocationId, this.state.roomAreaId);
      this._getRoomBuildingFloor(this.state.roomAreaId, this.state.roomBuildingFloorId);
      this._getRoomSize(this.state.roomBuildingFloorId, this.state.roomSizeId);
      this._getRoomPicture(this.state.roomSizeId);
      this._getRoomsImages();
    }   

  _getRoomsFilter = async () =>
  {    
    const headers: HeadersInit = new Headers();
    headers.append("accept", "application/json;odata.metadata=none");

        await this.props.spHttpClient
        .get(`${this.props.siteurl}/_api/web/lists/getbytitle('RoomsFilter')/items?$select=ID,Title`, 
          SPHttpClient.configurations.v1, {
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
          },()=>console.log("roomsFilter Data =>" + this.state.roomsFilter)
          )
        })      
    }  

  _getRoomLocation = async (roomLocationId) =>
  {   
    console.log(  "roomLocationId in GetRoomLocation Function ==>" + roomLocationId.key );
    const headers: HeadersInit = new Headers();
    headers.append("accept", "application/json;odata.metadata=none");

        await this.props.spHttpClient
        .get(`${this.props.siteurl}/_api/web/lists/getbytitle('RoomLocation')/items?$select=ID,Title,Description,IsActive`, SPHttpClient.configurations.v1, {
          headers: headers
        })
        .then((result: SPHttpClientResponse) => {          
          return result.json();
        })
        .then((jsonresult) => {
          // RoomsLocationData = [];         
          // for(let i=0; i<jsonresult.value.length; ++i)
          // {
          //   RoomsLocationData.push(jsonresult.value[i].Title);
          // }
          optionsRoomsLocation =  jsonresult.value.map((r,index) => {
            return {
              key:r.Id,
              text:r.Title,
            };
          });

          this.setState({
            roomsLocationData: optionsRoomsLocation,
            roomLocationId:roomLocationId.key,
          },()=>console.log("roomsLocationData =>" + this.state.roomsLocationData +"roomLocationId =>" + this.state.roomLocationId)
          )
        })  
        this._getRoomArea(this.state.roomLocationId, this.state.roomAreaId);    
  } 

  _getRoomArea = async (roomLocationId,roomAreaId) =>
  {    
    console.log("roomLocationId in GetRoomArea Function ==>" + this.state.roomLocationId)
    const headers: HeadersInit = new Headers();
    headers.append("accept", "application/json;odata.metadata=none");

        await this.props.spHttpClient
        .get(`${this.props.siteurl}/_api/web/lists/getbytitle('RoomArea')/items?$select=ID,Title,Description,IsActive,RoomLocationId/Id&$expand=RoomLocationId/Id,RoomLocationId/Title&$filter=RoomLocationId/Id eq '${this.state.roomLocationId}'`,
        //.get(`${this.props.siteurl}/_api/web/lists/getbytitle('RoomArea')/items?$select=ID,Title,Description,IsActive`, 
          SPHttpClient.configurations.v1, {
          headers: headers
        })
        .then((result: SPHttpClientResponse) => {          
          return result.json();
        })
        .then((jsonresult) => {
          //RoomsAreaData = [];          
          // for(let i=0; i<jsonresult.value.length; ++i)
          // {
          //   optionsRoomsArea.push(jsonresult.value[i].Title);
          // }
          optionsRoomsArea = jsonresult.value.map((r,index) => {
            return {
              key:r.Id,
              text:r.Title,
            };
          });

          const TestoptionsRoomsArea = [];
          for(var i=0;i<jsonresult.value.length;++i){
            if(jsonresult.value[i].roomLocationId === this.state.roomLocationId){
              TestoptionsRoomsArea.push(jsonresult.value[i].roomLocationId.Title)
            }
          }
          console.log("TestoptionsRoomsArea =>" + TestoptionsRoomsArea)

          this.setState({
            roomsAreaData: optionsRoomsArea
          },()=>console.log("roomsAreaData =>" + this.state.roomsAreaData)
          )
        })
        this._getRoomBuildingFloor(this.state.roomAreaId,this.state.roomBuildingFloorId);      
   } 

   _getRoomBuildingFloor = async (roomAreaId,roomBuildingFloorId) =>
  {    
    const headers: HeadersInit = new Headers();
    headers.append("accept", "application/json;odata.metadata=none");

        await this.props.spHttpClient
        .get(`${this.props.siteurl}/_api/web/lists/getbytitle('RoomBuildingFloor')/items?$select=ID,Title,Description,IsActive,RoomAreaId/Id&$expand=RoomAreaId/Id,RoomAreaId/Title&$filter=RoomAreaId/Id eq '${this.state.roomAreaId}'`,
        //.get(`${this.props.siteurl}/_api/web/lists/getbytitle('RoomBuildingFloor')/items?$select=ID,Title,Description,IsActive`, 
          SPHttpClient.configurations.v1, {
          headers: headers
          })
        .then((result: SPHttpClientResponse) => {          
          return result.json();
        })
        .then((jsonresult) => {
          // RoomsBuildingFloorData = [];         
          // for(let i=0; i<jsonresult.value.length; ++i)
          // {
          //   RoomsBuildingFloorData.push(jsonresult.value[i].Title);
          // }
          optionsRoomsBuildingFloor =  jsonresult.value.map((r,index) => {
            return {
              key:r.Id,
              text:r.Title,
            };
          });

          this.setState({
            roomsBuildingFloorData: optionsRoomsBuildingFloor
          },()=>console.log("roomsBuildingFloorData =>" + this.state.roomsBuildingFloorData)
          )
        })
        this._getRoomSize(this.state.roomBuildingFloorId,this.state.roomSizeId);     
    }

  _getRoomSize = async (roomBuildingFloorId,roomSizeId) =>
  {    
    const headers: HeadersInit = new Headers();
    headers.append("accept", "application/json;odata.metadata=none");

        await this.props.spHttpClient
        .get(`${this.props.siteurl}/_api/web/lists/getbytitle('RoomSize')/items?$select=ID,Title,Description,IsActive,RoomBuildingFloorId/Id&$expand=RoomBuildingFloorId/Id,RoomBuildingFloorId/Title&$filter=RoomBuildingFloorId eq '${this.state.roomBuildingFloorId}'`,
        //.get(`${this.props.siteurl}/_api/web/lists/getbytitle('RoomSize')/items?$select=ID,Title,Description,IsActive`, 
        SPHttpClient.configurations.v1, {
          headers: headers
        })
        .then((result: SPHttpClientResponse) => {          
          return result.json();
        })
        .then((jsonresult) => {
          // RoomsSizeData = [];         
          // for(let i=0; i<jsonresult.value.length; ++i)
          // {
          //   RoomsSizeData.push(jsonresult.value[i].Title);
          // }
          optionsRoomsSize =  jsonresult.value.map((r,index) => {
            return {
              key:r.Id,
              text:r.Title,
            };
          });

          this.setState({
            roomsSizeData: optionsRoomsSize
          },()=>console.log("roomsSizeData =>" + this.state.roomsSizeData)
          )
        }) 
        this._getRoomPicture(this.state.roomSizeId);     
  } 

  _getRoomPicture = async (roomSizeId) =>
  {    
    const headers: HeadersInit = new Headers();
    headers.append("accept", "application/json;odata.metadata=none");
   
        await this.props.spHttpClient
        //.get(`${this.props.siteurl}/_api/web/lists/getbytitle('RoomPicture')/items?$select=ID,Title,ImageWidth,ImageHeight,Description,IsActive,RoomSizeIdId&$filter=RoomSizeIdId eq '${this.state.roomBuildingFloorId}'`, 
        .get(`${this.props.siteurl}/_api/web/lists/getbytitle('RoomPicture')/items?$select=ID,Title,Description,IsActive`, 
        SPHttpClient.configurations.v1, 
        {
          headers: headers
        })
        .then((result: SPHttpClientResponse) => {          
          return result.json();
        })
        .then((jsonresult) => {
          RoomsPictureData = [];         
          for(let i=0; i<jsonresult.value.length; ++i)
          {
            RoomsPictureData.push(jsonresult.value[i].Title);
          }
          this.setState({
            roomsPictureData: RoomsPictureData
          },()=>console.log("roomsPictureData =>" + this.state.roomsPictureData)
          )
        })      
  }

  _getRoomsImages = async () =>
  {    
    const headers: HeadersInit = new Headers();
    headers.append("accept", "application/json;odata.metadata=none");

        await this.props.spHttpClient
        .get(`${this.props.siteurl}/_api/web/lists/getbytitle('Images')/items?$select=ID,Title,ImageWidth,ImageHeight&$filter=Category eq 'Room'`, 
          SPHttpClient.configurations.v1, {
          headers: headers
        })
        .then((result: SPHttpClientResponse) => {          
          return result.json();
        })
        .then((jsonresult) => {
          Images = [];         
          for(let i=0; i<jsonresult.value.length; ++i)
          {
            Images.push(jsonresult.value[i].Title);
          }
          this.setState({
            images: Images
          })
        })      
  }  

  handleClick = async(image) => {

     await this.setState({
      selectedImage:image,
      errorMessage: ""
     })
    alert("Selected Image: " + this.state.selectedImage);
  }

    public render(): React.ReactElement<IRoomsProps> {

      return (
        <div className={ styles.rooms }>
          <div className={ styles.container }>
            <div className={styles.description}>                        
              <h1 style={{margin:'0'}}><MyRoomIcon/>Rooms Reservation</h1>
            </div>                               
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
                 <div className="ms-Grid-col ms-u-sm2">
                    <Stack tokens={stackTokens}>
                      <Dropdown
                        placeholder="Select Location"
                        label="Location"                       
                        options={this.state.roomsLocationData}
                        onChange={(e,roomLocationId)=>this._getRoomLocation(roomLocationId)}
                        //options={optionsRoomsLocation}                       
                        //styles={dropdownStyles}
                        styles={{ dropdown: { width: 120 } }}                      
                      />
                    </Stack>
                  </div>
                  <div className="ms-Grid-col ms-u-sm2">
                    <Stack tokens={stackTokens}>
                      <Dropdown
                        placeholder="Select Area"
                        label="Area"
                        //options={optionsRoomsArea}
                        options={this.state.roomsAreaData}
                        onChange={(e,roomLocationId,roomAreaId)=>this._getRoomArea(roomLocationId,roomAreaId)}                       
                        //onClick=
                        //styles={dropdownStyles}
                        styles={{ dropdown: { width: 120 } }}                                            
                      />
                    </Stack>
                  </div>
                  <div className="ms-Grid-col ms-u-sm2">
                    <Stack tokens={stackTokens}>
                      <Dropdown
                        placeholder="Select BuildingFloor"
                        label="Building Floor"
                        options={this.state.roomsBuildingFloorData}
                        onChange={(e,roomAreaId,roomBuildingFloorId)=>this._getRoomBuildingFloor(roomAreaId,roomBuildingFloorId)}
                        //options={optionsRoomsBuildingFloor}                        
                        //styles={dropdownStyles}
                        styles={{ dropdown: { width: 120 } }}                        
                      />
                    </Stack>
                  </div>
                  <div className="ms-Grid-col ms-u-sm2">
                    <Stack tokens={stackTokens}>
                      <Dropdown
                        placeholder="Select RoomSize"
                        label="Rooms Size"
                        options={this.state.roomsSizeData} 
                        onChange={(e,roomBuildingFloorId,roomSizeId)=>this._getRoomSize(roomBuildingFloorId,roomSizeId)}
                        //options={optionsRoomsSize}                        
                        //styles={dropdownStyles}
                        styles={{ dropdown: { width: 120 } }}
                        //onChange={this._onChange_Rooms}
                      />
                    </Stack>
                  </div>
              </div> 
              <div className="ms-Grid-row"  >
                <div className="ms-Grid-col ms-u-sm12">
                  <div className={styles.mt10}>
                    <label className={styles.SetLabelWeight}>Select Rooms Images:</label>
                    <div className={styles.mt10}>
                      <Carousel
                          pagination={false}
                          itemsToShow={3}
                          itemsToScroll={1}
                          isRTL={false}
                          //onChange={(e,roomSizeId)=>this._getRoomPicture(roomSizeId)}
                          focusOnSelect={true}>
                            {this.state.roomsPictureData.map((img, index) => {
                              return <img src={`${this.props.siteurl}/RoomPicture/${img}`} onClick={e=>this.handleClick(img)} className={this.state.selectedImage == img ? styles.selected:''} height="100px" width="100%" margin-top="15px"/>
                            })}                     
                      </Carousel> 
                      <label className={styles.SetLabelWeight}>Select Rooms Images (Library : Images):</label>
                      <Carousel
                          pagination={false}
                          itemsToShow={3}
                          itemsToScroll={1}
                          isRTL={false}
                          focusOnSelect={true}>
                            {this.state.images.map((img, index) => {
                              return <img src={`${this.props.siteurl}/Images1/${img}`} onClick={e=>this.handleClick(img)} className={this.state.selectedImage == img ? styles.selected:''} height="100px" width="100%" margin-top="15px"/>
                            })}                     
                      </Carousel>                    
                    </div>
                  </div>
                </div>
              </div>                                
              <div className="ms-Grid-row"  >
                <div className="ms-Grid-col ms-u-sm12">
                   {/* <Iframe url="https://champion1.sharepoint.com/sites/SPMall/IPDevV2/Lists/RoomReservation/calendar.aspx"
                          width="100%"
                          height="800px"/> */}
                  {/* <RoomsImages siteurl={this.props.siteurl} spHttpClient = {this.props.spHttpClient}></RoomsImages> */}
                </div>
              </div>                                
             
          {/* ms-Grid closed */}
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


  
