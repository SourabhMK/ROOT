import * as React from 'react';
import styles from './ObjectivesGoals.module.scss';
import { IObjectivesGoalsProps, IObjectivesGoalsState } from './IObjectivesGoalsProps';
//import { escape } from '@microsoft/sp-lodash-subset';
import { Icon } from '@fluentui/react/lib/Icon';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { DefaultButton, PrimaryButton } from "@fluentui/react/lib/Button";
import AddGoals from '../components/AddGoals/AddGoals';
import Organization from '../components/Organization/Organization';
import Department from '../components/Department/Deparment';
import Personal from '../components/Personal/Personal';
import {
  PropertyPaneTextField,
  PropertyPaneCheckbox,
  PropertyPaneLabel,
  PropertyPaneLink,
  PropertyPaneSlider,
  PropertyPaneToggle,
  PropertyPaneDropdown
} from '@microsoft/sp-property-pane';
import { Dropdown, DropdownMenuItemType, IDropdownStyles, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { Stack, IStackProps, IStackStyles } from '@fluentui/react/lib/Stack';

const stackTokens = { childrenGap: 50  };

const MyObjectivesGoalsIcon = () => <Icon iconName="GroupObject" className = {styles.objectivesGoals} />;
let ExpandableOptionsData: any = [];
let GoalsData: any = [];
let MonthlyTargetData: any = [];
let QuarterlyObjectivesData: any = [];
let YearlyGoalsData: any = [];

const expandableOptions: IDropdownOption[] = [
  // { key: 'ExpandableOptions', text: 'Selet an Option ', itemType: DropdownMenuItemType.Header },
  // { key: 'ExpandableOptions', text: 'Organization' },
  // { key: 'ExpandableOptions', text: 'Department' },
  // { key: 'ExpandableOptions', text: 'Personal' } 
];

export default class ObjectivesGoals extends React.Component<IObjectivesGoalsProps, IObjectivesGoalsState, {}> {

  constructor(props: IObjectivesGoalsProps, state:IObjectivesGoalsState) {
    super(props); 
    this.state = {
      goalsData: [{
        Id:"",
        Title:"",
        Goal:"",
        Interval:"", 
        Color:"",   
      }],
      monthlyTargetData: [{
        Id:"",
        Title:"",
        Goal:"",
        Interval:"", 
        Color:"",   
      }],
      quarterlyObjectivesData: [{
        Id:"",
        Title:"",
        Goal:"",
        Interval:"", 
        Color:"",   
      }],
      yearlyGoalsData: [{
        Id:"",
        Title:"",
        Goal:"",
        Interval:"", 
        Color:"",   
      }],

      expandableOptionsData:[],
      expandableOptions:"",
      count:0,
      bulletPointColor:"Red",
      AddGoalsForm:false,
    };          
  }

  componentDidMount()
  { 
    this._getExpandableOptionsData();
    this.ExpandableOptionClicked(expandableOptions);
    this._getGoalsData();
    this._monthlyTargetData();
    this._quarterlyObjectivesData();
    this._yearlyGoalsData();
  } 
  
  _getExpandableOptionsData = async () =>
  {    
    const headers: HeadersInit = new Headers();
    headers.append("accept", "application/json;odata.metadata=none");

        await this.props.spHttpClient
        .get(`${this.props.siteurl}/_api/web/lists/getbytitle('GoalExpandableOptions')/items?$select=ID,Title`, 
          SPHttpClient.configurations.v1, {
          headers: headers
        })
        .then((result: SPHttpClientResponse) => {          
          return result.json();
        })
        .then((jsonresult) => {
          ExpandableOptionsData = [];         
          for(let i=0; i<jsonresult.value.length; ++i)
          {
            expandableOptions.push({
              //this.state.ExpandableOptionsData.push({
              key:jsonresult.value[i].Id,
              text:jsonresult.value[i].Title,              
            });
          }
          console.log("ExpandableOptionsData Array=>" + ExpandableOptionsData);
          this.setState({
            expandableOptionsData: expandableOptions,
          },()=>console.log("ExpandableOptions Data =>" + this.state.expandableOptionsData)
          )
        })      
  }

  _getGoalsData = async () =>
  {    
    const headers: HeadersInit = new Headers();
    headers.append("accept", "application/json;odata.metadata=none");

        await this.props.spHttpClient
        .get(`${this.props.siteurl}/_api/web/lists/getbytitle('Goal')/items?$select=ID,Title,Goal,Interval,Color`, 
          SPHttpClient.configurations.v1, {
          headers: headers
        })
        .then((result: SPHttpClientResponse) => {          
          return result.json();
        })
        .then((jsonresult) => {
          GoalsData = [];         
          for(let i=0; i<jsonresult.value.length; ++i)
          {
            GoalsData.push({
              //this.state.goalsData.push({
              Id:jsonresult.value[i].Id,
              Title:jsonresult.value[i].Title,
              Goal:jsonresult.value[i].Goal,
              Interval:jsonresult.value[i].Interval,
              Color:jsonresult.value[i].Color
            });
          }
          console.log("Goals Data Array=>" + GoalsData);
          this.setState({
            goalsData: GoalsData
          },()=>console.log("Goals Data =>" + this.state.goalsData)
          )
        })      
  }  
  
  ExpandableOptionClicked = (expandableOptions) =>{
    //alert( "Expandable Option Clicked");
    this.setState({
      expandableOptions: expandableOptions.text,
      AddGoalsForm: false,        
    })
    
  }
  
  AddGoalsClicked = () =>{
    alert( "AddGoals Clicked");
    this.setState({
      AddGoalsForm: true,        
    })
    //this._monthlyTargetData();
  }

  MonthlyTargetClicked = () =>{
    //alert( "Monthly Target Clicked");
    this.setState({
      count: 1,        
    })
    this._monthlyTargetData();
  }

  QuarterlyObjectivesClicked = () =>{
    //alert( "Quarterly Objectives Clicked")
    this.setState({
      count: 2,  
    })
  }

  YearlyGoalsClicked = () =>{
    //alert( "Yearly Goals Clicked")
    this.setState({
      count: 3,   
    })
  }
  
  _monthlyTargetData = async () =>
  {    
    const headers: HeadersInit = new Headers();
    headers.append("accept", "application/json;odata.metadata=none");

        await this.props.spHttpClient
        .get(`${this.props.siteurl}/_api/web/lists/getbytitle('Goal')/items?$select=ID,Title,Goal,Interval,Color&$filter=Interval eq 'Monthly Target'`, 
          SPHttpClient.configurations.v1, {
          headers: headers
        })
        .then((result: SPHttpClientResponse) => {          
          return result.json();
        })
        .then((jsonresult) => {
          MonthlyTargetData = [];         
          for(let i=0; i<jsonresult.value.length; ++i)
          {
            MonthlyTargetData.push({
              //this.state.monthlyTargetData.push({
              Id:jsonresult.value[i].Id,
              Title:jsonresult.value[i].Title,
              Goal:jsonresult.value[i].Goal,
              Interval:jsonresult.value[i].Interval,
              Color:jsonresult.value[i].Color
            });
          }
          console.log("Monthly Target Data Array=>" + MonthlyTargetData);
          this.setState({
            monthlyTargetData: MonthlyTargetData,
            bulletPointColor:MonthlyTargetData.Color,
          },()=>console.log("Monthly Target Data =>" + this.state.monthlyTargetData)
          )
        })      
  }  

  _quarterlyObjectivesData = async () =>
  {    
    const headers: HeadersInit = new Headers();
    headers.append("accept", "application/json;odata.metadata=none");

        await this.props.spHttpClient
        .get(`${this.props.siteurl}/_api/web/lists/getbytitle('Goal')/items?$select=ID,Title,Goal,Interval,Color&$filter=Interval eq 'Quarterly Objectives'`, 
          SPHttpClient.configurations.v1, {
          headers: headers
        })
        .then((result: SPHttpClientResponse) => {          
          return result.json();
        })
        .then((jsonresult) => {QuarterlyObjectivesData
           = [];         
          for(let i=0; i<jsonresult.value.length; ++i)
          {
            QuarterlyObjectivesData.push({
              //this.state.quarterly Objectives.push({
              Id:jsonresult.value[i].Id,
              Title:jsonresult.value[i].Title,
              Goal:jsonresult.value[i].Goal,
              Interval:jsonresult.value[i].Interval,
              Color:jsonresult.value[i].Color
            });
          }
          console.log("Quarterly Objectives Data Array=>" + QuarterlyObjectivesData);
          this.setState({
            quarterlyObjectivesData: QuarterlyObjectivesData,
            bulletPointColor:QuarterlyObjectivesData.Color,
          },()=>console.log("Quarterly Objectives Data =>" + this.state.quarterlyObjectivesData)
          )
        })      
  }  
   
  _yearlyGoalsData = async () =>
  {    
    const headers: HeadersInit = new Headers();
    headers.append("accept", "application/json;odata.metadata=none");

        await this.props.spHttpClient
        .get(`${this.props.siteurl}/_api/web/lists/getbytitle('Goal')/items?$select=ID,Title,Goal,Interval,Color&$filter=Interval eq 'Yearly Goals'`, 
          SPHttpClient.configurations.v1, {
          headers: headers
        })
        .then((result: SPHttpClientResponse) => {          
          return result.json();
        })
        .then((jsonresult) => {QuarterlyObjectivesData
           = [];         
          for(let i=0; i<jsonresult.value.length; ++i)
          {
            YearlyGoalsData.push({
              //this.state.yearlyGoalsData.push({
              Id:jsonresult.value[i].Id,
              Title:jsonresult.value[i].Title,
              Goal:jsonresult.value[i].Goal,
              Interval:jsonresult.value[i].Interval,
              Color:jsonresult.value[i].Color
            });
          }
          console.log("Yearly Goals Data Array=>" + YearlyGoalsData);
          this.setState({
            yearlyGoalsData: YearlyGoalsData,
            bulletPointColor: YearlyGoalsData.Color,
          },()=>console.log("Yearly Goals Data =>" + this.state.yearlyGoalsData)
          )
        })      
  }  



  public render(): React.ReactElement<IObjectivesGoalsProps> {
    return (
      <div className={ styles.objectivesGoals }>
        <div className={ styles.container }>
            <div className={styles.description}>                        
              <h1 style={{margin:'0'}}><MyObjectivesGoalsIcon/> Objectives and Goals </h1>
            </div>                        
            <div className="ms-Grid" >
              <div className="ms-Grid-row" >
                  <div className="ms-Grid-col ms-u-sm4">
                   { this.props.isAddGoalsDisplay &&
                     <DefaultButton onClick={this.AddGoalsClicked}><h3>Add the Goals</h3></DefaultButton>
                   }
                  </div>
              </div>                                                                                                                                                      
               <div className="ms-Grid-row"  >
                 <div className="ms-Grid-col ms-u-sm4">
                    <Stack tokens={stackTokens}>
                      <Dropdown
                        placeholder="Select Expandable Options"
                        label="Expandable Options"                       
                        options={this.state.expandableOptionsData}
                        onChange={(e,expandableOptions)=>this.ExpandableOptionClicked(expandableOptions)}
                        //options={expandableOptions}                       
                        //styles={dropdownStyles}
                        styles={{ dropdown: { width: 200 } }}                      
                      />
                    </Stack>
                  </div>                  
                </div>
              </div>
            
            {/* { this.props.isAddGoalsDisplay &&
                <div><DefaultButton ><h3>Add the Goals</h3></DefaultButton>
                <AddGoals description={this.props.description}
                  context={this.props.context}
                  siteurl={this.props.siteurl}
                  spHttpClient={this.props.spHttpClient}>
                  
                  </AddGoals>
                </div>
             } */}
            {/* <br></br> */}
            {/* <div className={styles.SetDisplay}>   
            <div><DefaultButton className={styles.GoalsTabBtn}  onClick={this.MonthlyTargetClicked}><h3>Monthly Target</h3></DefaultButton></div>                                                         
            <div><DefaultButton className={styles.GoalsTabBtn}  onClick={this.QuarterlyObjectivesClicked}><h3>Quarterly Objectives</h3></DefaultButton></div>
            <div><DefaultButton className={styles.GoalsTabBtn}  onClick={this.YearlyGoalsClicked}><h3>Yearly Goals</h3></DefaultButton></div>                                                          
            </div> */}
            {  
              ((this.state.count === 1) ?  
                  <div className={styles.myTable}>             
                  <ul>                  
                    {this.state.monthlyTargetData.map( (MonthlyTarget, index)=> {
                    return(
                    <li key={MonthlyTarget.Id} style={{color:MonthlyTarget.Color}}>{MonthlyTarget.Color} {MonthlyTarget.Goal}
                    </li>            
                    )
                    })}             
                    </ul>
                  </div>                            
              : 
               (this.state.count === 2) ?                       
                    <div className={styles.myTable}>                                 
                    <ul>                  
                      {this.state.quarterlyObjectivesData.map( (QuarterlyObjectives, index)=> {
                      return(
                      <li key={QuarterlyObjectives.Id} style={{color:QuarterlyObjectives.Color}}>{QuarterlyObjectives.Color} {QuarterlyObjectives.Goal}
                      </li>            
                      )
                      })}             
                      </ul>
                    </div> 
              :  
               (this.state.count === 3) ?                     
                    <div className={styles.myTable}>                                
                    <ul>                  
                      {this.state.yearlyGoalsData.map( (YearlyGoals, index)=> {
                      return(
                      <li key={YearlyGoals.Id} style={{color:YearlyGoals.Color}}>{YearlyGoals.Color} {YearlyGoals.Goal}
                      </li>            
                      )
                      })}             
                      </ul>
                    </div>  
              : "" )
            }   
             <br></br>
            
            {/* <div className={styles.myTable}>  
                <h3> Goal List Data </h3>                          
                  <ul style={{color:this.state.bulletPointColor}} >                
                  {this.state.goalsData.map( (GoalsItem, index)=> {
                  return(
                  <li key={GoalsItem.Id}>{GoalsItem.Color} {GoalsItem.Goal}
                  </li>                  
                  )
                  })} 
                  </ul>                             
            </div>
            <div className={styles.myTable}>  
                <h3> Goal List Data </h3>        
                  <table>                                   
                  {this.state.goalsData.map( (GoalsItem, index)=> {
                  return(                  
                   <tr><td key={GoalsItem.Id}>{GoalsItem.Color}</td>
                      <td>{GoalsItem.Goal}</td>                  
                  </tr> 
                  )
                  })}                            
                  </table> 
            </div> */}

          {/* <div className={ styles.row }>
            <div className={ styles.column }>
              <span className={ styles.title }>Welcome to SharePoint!</span>
              <p className={ styles.subTitle }>Customize SharePoint experiences using Web Parts.</p>
              <p className={ styles.description }>{escape(this.props.description)}</p>
              <a href="https://aka.ms/spfx" className={ styles.button }>
                <span className={ styles.label }>Learn more</span>
              </a>
            </div>
          </div> */}

              {  
              ((this.state.expandableOptions === "Organization") ? 
              <Organization description={this.props.description}
                  context={this.props.context}
                  siteurl={this.props.siteurl}
                  spHttpClient={this.props.spHttpClient}></Organization>
              :
                (this.state.expandableOptions === "Department") ? 
                //<h1>Department clicked</h1>
                <Department description={this.props.description}
                context={this.props.context}
                siteurl={this.props.siteurl}
                spHttpClient={this.props.spHttpClient}></Department>
                :
                  (this.state.expandableOptions === "Personal") ?
                  <Personal description={this.props.description}
                  context={this.props.context}
                  siteurl={this.props.siteurl}
                  spHttpClient={this.props.spHttpClient}></Personal>               
                  
                  :"" )}   

                {this.state.AddGoalsForm == true && 
                <AddGoals description={this.props.description}
                  context={this.props.context}
                  siteurl={this.props.siteurl}
                  spHttpClient={this.props.spHttpClient}></AddGoals>
                } 
        </div>
      </div>
    );
  }
}
