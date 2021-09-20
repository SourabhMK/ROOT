import { IBirthday } from "../../../../Models/IBirthday";
import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface ISendEmailCalloutProps {
  person: IBirthday;  
  // siteurl: string;
  // spHttpClient: SPHttpClient;
  // loggedInUserEmail: string;
  webPartContext: WebPartContext;
}