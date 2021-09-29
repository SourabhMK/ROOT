import { SPHttpClient } from "@microsoft/sp-http";
import { IDropdownOption } from "office-ui-fabric-react";

export interface IObjectivesGoalsProps {
  description: string;
  context:any;
  siteurl: string;
  spHttpClient: SPHttpClient;
  isAddGoalsDisplay : boolean;
}

export interface IObjectivesGoalsState {
    
  goalsData:[{
        Id: any;
        Title: any;
        Goal: any;
        Interval: any;
        Color:any;
        }];
  monthlyTargetData:[{
      Id: any;
      Title: any;
      Goal: any;
      Interval: any;
      Color:any;
      }];
  quarterlyObjectivesData:[{
        Id: any;
        Title: any;
        Goal: any;
        Interval: any;
        Color:any;
        }];
  yearlyGoalsData:[{
          Id: any;
          Title: any;
          Goal: any;
          Interval: any;
          Color:any;
          }];
  
  expandableOptionsData:IDropdownOption[];
  expandableOptions:string,
  count:number,
  bulletPointColor:string,
  AddGoalsForm:boolean,
}