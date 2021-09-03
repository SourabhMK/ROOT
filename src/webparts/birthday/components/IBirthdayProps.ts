
import { SPHttpClient, HttpClient } from "@microsoft/sp-http";

export interface IBirthdayProps {
  description: string;
  siteurl: string;
  spHttpClient: SPHttpClient;
  myHttpClient: HttpClient;
  loggedInUserEmail:string;
  dropdown: string;
  simpleText: string;
  imageUrl: string;
  SiteCollection: string;
}