
import { SPHttpClient } from "@microsoft/sp-http";

export interface IBirthdayProps {
  description: string;
  siteurl: string;
  spHttpClient: SPHttpClient;
  loggedInUserEmail:string;
  dropdown: string;
  simpleText: string;
  imageUrl: string;
  SiteCollection: string;
}