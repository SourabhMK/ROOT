import { SPHttpClient } from "@microsoft/sp-http";

export interface IApplicationFeedProps {
  description: string;
  context:any;
  siteurl: string;
  spHttpClient: SPHttpClient;
}
