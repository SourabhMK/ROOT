import { IBirthday } from "../../../../Models/IBirthday";
import { SPHttpClient } from "@microsoft/sp-http";

export interface ISendEmailCalloutProps {
  person: IBirthday;  
  siteurl: string;
  spHttpClient: SPHttpClient;
  //loggedInUserEmail: string;
}