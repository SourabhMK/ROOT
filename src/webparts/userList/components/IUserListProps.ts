import { SPHttpClient } from "@microsoft/sp-http";
import { DisplayMode } from "@microsoft/sp-core-library";

export interface IUserListProps {
  //description: string;
   /**
   * Absolute URL of the current site
   */
    webUrl: string;
    /**
     * Instance of the SPHttpClient. Used to retrieve information about
     * people.
     */
    spHttpClient: SPHttpClient;
    /**
     * Web part title to be displayed in the web part
     */
    title: string;

    description: string;
  
  nameFormatIndex: number;

  isContactNumberDisplay:boolean;

  isDateOfBirthDisplay:boolean;

  isDateOfJoiningDisplay:boolean;

  isWorkAnniversaryDisplay:boolean;

  isFollowingDisplay:boolean;

  isFollowerDisplay:boolean;

}