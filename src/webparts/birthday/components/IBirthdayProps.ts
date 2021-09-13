
import { SPHttpClient, HttpClient } from "@microsoft/sp-http";
import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IBirthdayProps {
  description: string;
  webPartContext: WebPartContext
  siteurl: string;
  spHttpClient: SPHttpClient;
  myHttpClient: HttpClient;
  loggedInUserEmail:string;
  dropdown: string;
}