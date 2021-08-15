import { IAnniversary } from "./IAnniversary";
import { SPHttpClient } from "@microsoft/sp-http";

export interface ISendAnniversaryEmailCalloutProps {
  person: IAnniversary;
  siteurl: string;
  spHttpClient: SPHttpClient;
}