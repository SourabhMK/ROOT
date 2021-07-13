export interface IFilterProps {
      description: string;  
      isNameSearchDisplay : boolean;
      isTitleSearchDisplay : boolean;
      isDepartmentSearchDisplay : boolean;
      isSkillSearchDisplay : boolean;
      isAskMeAboutSearchDisplay : boolean;
      // filterAttributes: IFilterState;
      performSearch(para:IFilterState): void;
      /**
   * Absolute URL of the current site
   */
  //webUrl: string;
  /**
   * Instance of the SPHttpClient. Used to retrieve information about
   * people.
   */
 // spHttpClient: SPHttpClient;
}

export interface IFilterState {
  name:string;
  title:string;
  department:string;
  skill:string;
  askMeAbout:string;
}