import { IUserAll } from "../All/IUserAll";

/**
 * Properties for the people list component
 */
export interface IListViewProps {
  /**
   * Array of people matching the selected tab or the current search query
   */
  people: IUserAll[];

}