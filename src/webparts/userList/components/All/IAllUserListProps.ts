import { SPHttpClient } from "@microsoft/sp-http";

export interface IAllUserListProps {
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
}