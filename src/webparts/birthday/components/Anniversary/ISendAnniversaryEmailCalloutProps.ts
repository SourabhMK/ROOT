import { WebPartContext } from "@microsoft/sp-webpart-base";
import { IAnniversary } from "../../../../Models/IAnniversary";

export interface ISendAnniversaryEmailCalloutProps {
  person: IAnniversary;  
  webPartContext: WebPartContext;
}