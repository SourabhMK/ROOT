/* List of interface for All Users info */
import { IFollowers } from "../Followers/IFollowers";
import {IUserAll} from "./IUserAll";

export interface IALLUserListState {
    Users : IUserAll[],
    Followers : IFollowers[],
    Following : IFollowers[],
    count:number,
    bgColorAll:string,
    bgColorFollowers:string,
    bgColorFollowing:string,
    colorAll:string,
    colorFollowers:string,
    colorFollowing:string,

    /**
     * Contains the error message that occurred while loading the data.
     * If no error message occurred, null.
     */
     errorMessage: string;

}