import * as React from 'react';
import styles from '../Organization/Organization.module.scss';
import { IOrganizationProps, IOrganizationState } from '../Organization/IOrganizationProps';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { DefaultButton, PrimaryButton } from "@fluentui/react/lib/Button";
//import AddGoals from '../components/AddGoals/AddGoals';
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


//let ExpandableOptionsData: any = [];
let OrganizationData: any = [];
let MonthlyTargetData: any = [];
let QuarterlyObjectivesData: any = [];
let YearlyGoalsData: any = [];

const expandableOptions: IDropdownOption[] = [
  // { key: 'ExpandableOptions', text: 'Selet an Option ', itemType: DropdownMenuItemType.Header },
  // { key: 'ExpandableOptions', text: 'Organization' },
  // { key: 'ExpandableOptions', text: 'Department' },
  // { key: 'ExpandableOptions', text: 'Personal' } 
];

export default class Organization extends React.Component<IOrganizationProps, IOrganizationState, {}> {

  constructor(props: IOrganizationProps, state:IOrganizationState) {
    super(props); 
    this.state = {
      organizationData: [{
        Id:"",
        Title:"",
        Goal:"",
        Interval:"", 
        //Color:"",   
      }],
      monthlyTargetData: [{
        Id:"",
        Title:"",
        Goal:"",
        Interval:"", 
        //Color:"",   
      }],
      quarterlyObjectivesData: [{
        Id:"",
        Title:"",
        Goal:"",
        Interval:"", 
        //Color:"",   
      }],
      yearlyGoalsData: [{
        Id:"",
        Title:"",
        Goal:"",
        Interval:"", 
        //Color:"",   
      }],

      expandableOptionsData:[],

      count:0,
      bulletPointColor:"Red",

    };          
  }

  componentDidMount()
  { 
    //this._getExpandableOptionsData();
    //this._getOrganizationData();
    this._monthlyTargetData();
    this._quarterlyObjectivesData();
    this._yearlyGoalsData();
  } 
  
  // _getExpandableOptionsData = async () =>
  // {    
  //   const headers: HeadersInit = new Headers();
  //   headers.append("accept", "application/json;odata.metadata=none");

  //       await this.props.spHttpClient
  //       .get(`${this.props.siteurl}/_api/web/lists/getbytitle('GoalExpandableOptions')/items?$select=ID,Title`, 
  //         SPHttpClient.configurations.v1, {
  //         headers: headers
  //       })
  //       .then((result: SPHttpClientResponse) => {          
  //         return result.json();
  //       })
  //       .then((jsonresult) => {
  //         ExpandableOptionsData = [];         
  //         for(let i=0; i<jsonresult.value.length; ++i)
  //         {
  //           expandableOptions.push({
  //             //this.state.ExpandableOptionsData.push({
  //             key:jsonresult.value[i].Id,
  //             text:jsonresult.value[i].Title,              
  //           });
  //         }
  //         console.log("ExpandableOptionsData Array=>" + ExpandableOptionsData);
  //         this.setState({
  //           expandableOptionsData: expandableOptions,
  //         },()=>console.log("ExpandableOptions Data =>" + this.state.expandableOptionsData)
  //         )
  //       })      
  // }

  _getOrganizationData = async () =>
  {    
    const headers: HeadersInit = new Headers();
    headers.append("accept", "application/json;odata.metadata=none");

        await this.props.spHttpClient
        .get(`${this.props.siteurl}/_api/web/lists/getbytitle('ObjectivesAndGoals')/items?$select=ID,Title,Goal,Interval,ExpandableOptions/Title&$expand=ExpandableOptions/Id,ExpandableOptions/Title&$filter=ExpandableOptions eq 'Organization'`, 
          SPHttpClient.configurations.v1, {
          headers: headers
        })
        .then((result: SPHttpClientResponse) => {          
          return result.json();
        })
        .then((jsonresult) => {
          OrganizationData = [];         
          for(let i=0; i<jsonresult.value.length; ++i)
          {
            OrganizationData.push({
              //this.state.goalsData.push({
              Id:jsonresult.value[i].Id,
              Title:jsonresult.value[i].Title,
              Goal:jsonresult.value[i].Goal,
              Interval:jsonresult.value[i].Interval,
              //Color:jsonresult.value[i].Color
            });
          }
          console.log("Organization Data=>" + OrganizationData);
          this.setState({
            organizationData: OrganizationData
          },()=>console.log("Organization Data =>" + this.state.organizationData)
          )
        })      
  }  

  MonthlyTargetClicked = () =>{
    //alert( "Monthly Target Clicked for Organization");
    this.setState({
      count: 1,        
    })
    this._monthlyTargetData();
  }

  QuarterlyObjectivesClicked = () =>{
    //alert( "Quarterly Objectives Clicked for Organization")
    this.setState({
      count: 2,  
    })
  }

  YearlyGoalsClicked = () =>{
    //alert( "Yearly Goals Clicked for Organization")
    this.setState({
      count: 3,   
    })
  }
  
  _monthlyTargetData = async () =>
  {    
    const headers: HeadersInit = new Headers();
    headers.append("accept", "application/json;odata.metadata=none");

        await this.props.spHttpClient
        .get(`${this.props.siteurl}/_api/web/lists/getbytitle('ObjectivesAndGoals')/items?$select=ID,Title,Goal,Interval,ExpandableOptions/Id,ExpandableOptions/Title&$expand=ExpandableOptions/Id,ExpandableOptions/Title&$filter=((ExpandableOptionsId eq '1') and (Interval eq 'Monthly Target'))`, 
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
              //Color:jsonresult.value[i].Color
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
        .get(`${this.props.siteurl}/_api/web/lists/getbytitle('ObjectivesAndGoals')/items?$select=ID,Title,Goal,Interval,ExpandableOptions/Id,ExpandableOptions/Title&$expand=ExpandableOptions/Id,ExpandableOptions/Title&$filter=((ExpandableOptionsId eq '1') and (Interval eq 'Quarterly Objectives'))`, 
        //.get(`${this.props.siteurl}/_api/web/lists/getbytitle('ObjectivesAndGoals')/items?$select=ID,Title,Goal,Interval&$filter=Interval eq 'Quarterly Objectives'`, 
          SPHttpClient.configurations.v1, {
          headers: headers
        })
        .then((result: SPHttpClientResponse) => {          
          return result.json();
        })
        .then((jsonresult) => {         
          QuarterlyObjectivesData = [];         
          for(let i=0; i<jsonresult.value.length; ++i)
          {
            QuarterlyObjectivesData.push({
              //this.state.quarterly Objectives.push({
              Id:jsonresult.value[i].Id,
              Title:jsonresult.value[i].Title,
              Goal:jsonresult.value[i].Goal,
              Interval:jsonresult.value[i].Interval,
              //Color:jsonresult.value[i].Color
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
        .get(`${this.props.siteurl}/_api/web/lists/getbytitle('ObjectivesAndGoals')/items?$select=ID,Title,Goal,Interval,ExpandableOptions/Id,ExpandableOptions/Title&$expand=ExpandableOptions/Id,ExpandableOptions/Title&$filter=((ExpandableOptionsId eq '1') and (Interval eq 'Yearly Goals'))`, 
        //.get(`${this.props.siteurl}/_api/web/lists/getbytitle('ObjectivesAndGoals')/items?$select=ID,Title,Goal,Interval&$filter=Interval eq 'Yearly Goals'`, 
          SPHttpClient.configurations.v1, {
          headers: headers
        })
        .then((result: SPHttpClientResponse) => {          
          return result.json();
        })
        .then((jsonresult) => {
          YearlyGoalsData = [];         
          for(let i=0; i<jsonresult.value.length; ++i)
          {
            YearlyGoalsData.push({
              //this.state.yearlyGoalsData.push({
              Id:jsonresult.value[i].Id,
              Title:jsonresult.value[i].Title,
              Goal:jsonresult.value[i].Goal,
              Interval:jsonresult.value[i].Interval,
              //Color:jsonresult.value[i].Color
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


  public render(): React.ReactElement<IOrganizationProps> {
    return (
      <div className={ styles.organization }>
        <div className={ styles.container }>         
            <h2> Objectives and Goals for Organization </h2>
            <div className={styles.SetDisplay}>   
            <div><DefaultButton className={styles.GoalsTabBtn}  onClick={this.MonthlyTargetClicked}><h3>Monthly Target</h3></DefaultButton></div>                                                         
            <div><DefaultButton className={styles.GoalsTabBtn}  onClick={this.QuarterlyObjectivesClicked}><h3>Quarterly Objectives</h3></DefaultButton></div>
            <div><DefaultButton className={styles.GoalsTabBtn}  onClick={this.YearlyGoalsClicked}><h3>Yearly Goals</h3></DefaultButton></div>                                                          
            </div>
            {  
              ((this.state.count === 1) ?  
                  <div className={styles.myTable}>
                  <h3>Monthly Goal for Organization</h3>             
                  <ul>                  
                    {this.state.monthlyTargetData.map( (MonthlyTarget, index)=> {
                    return(
                    //<li key={MonthlyTarget.Id} style={{color:MonthlyTarget.Color}}>{MonthlyTarget.Color} {MonthlyTarget.Goal}
                    <li key={MonthlyTarget.Id}> {MonthlyTarget.Goal}
                    </li>            
                    )
                    })}             
                    </ul>
                  </div>                            
              : 
               (this.state.count === 2) ?                       
                    <div className={styles.myTable}> 
                    <h3>Quarterly Goal for Organization</h3>                                
                    <ul>                  
                      {this.state.quarterlyObjectivesData.map( (QuarterlyObjectives, index)=> {
                      return(
                      <li key={QuarterlyObjectives.Id} > {QuarterlyObjectives.Goal}
                      </li>            
                      )
                      })}             
                      </ul>
                    </div> 
              :  
               (this.state.count === 3) ?                     
                    <div className={styles.myTable}>
                    <h3>Yearly Goal for Organization</h3>                                
                    <ul>                  
                      {this.state.yearlyGoalsData.map( (YearlyGoals, index)=> {
                      return(
                      <li key={YearlyGoals.Id} >{YearlyGoals.Goal}
                      </li>            
                      )
                      })}             
                      </ul>
                    </div>  
              : "" )
            }   
             <br></br>            
        </div>
      </div>
    );
  }
}
