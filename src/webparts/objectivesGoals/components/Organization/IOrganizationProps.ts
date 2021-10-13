import { SPHttpClient } from "@microsoft/sp-http";
import { IDropdownOption } from "office-ui-fabric-react";

export interface IOrganizationProps {
  description: string;
  context:any;
  siteurl: string;
  spHttpClient: SPHttpClient;
  //isAddGoalsDisplay : boolean;
}

export interface IOrganizationState {
    
    organizationData:[{
        Id: any;
        Title: any;
        Goal: any;
        Interval: any;
        //Color:any;
        }];
  monthlyTargetData:[{
      Id: any;
      Title: any;
      Goal: any;
      Interval: any;
      //Color:any;
      }];
  quarterlyObjectivesData:[{
        Id: any;
        Title: any;
        Goal: any;
        Interval: any;
        //Color:any;
        }];
  yearlyGoalsData:[{
          Id: any;
          Title: any;
          Goal: any;
          Interval: any;
          //Color:any;
          }];
  
  expandableOptionsData:IDropdownOption[];
  count:number,
  bulletPointColor:string,
}