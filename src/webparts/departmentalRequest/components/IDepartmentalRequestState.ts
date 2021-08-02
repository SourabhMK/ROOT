/* List of interface for All Users info */
//import { IFollowers } from "../Followers/IFollowers";
//import {IUserAll} from "./IUserAll";

export interface IDepartmentalRequestState {
    // Users : IUserAll[],
    // Followers : IFollowers[],
    // Following : IFollowers[],
    count:number,
    bgColorRaiseRequest:string,
    bgColorFollowers:string,
    bgColorFollowing:string,
    colorRaiseRequest:string,
    colorFollowers:string,
    colorFollowing:string,
    loading:boolean,
    /**
     * Contains the error message that occurred while loading the data.
     * If no error message occurred, null.
     */
     errorMessage: string;

}