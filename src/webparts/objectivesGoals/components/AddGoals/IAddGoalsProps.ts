import { SPHttpClient } from "@microsoft/sp-http";

export interface IAddGoalsProps {
  description: string;
  context:any;
  siteurl: string;
  spHttpClient: SPHttpClient;
}

export interface IAddGoalsState {
     
}