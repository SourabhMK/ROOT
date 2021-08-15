import { IBirthday } from "./IBirthday";
import { SPHttpClient } from "@microsoft/sp-http";

export interface ISendEmailCalloutProps {
  person: IBirthday;
  siteurl: string;
  spHttpClient: SPHttpClient;
}