/* List of interface for All Users info */
//import { IFollowers } from "../Followers/IFollowers";
//import {IUserAll} from "./IUserAll";

import { Ref } from "react";

export interface IDispatcherViewState {
    count:number,
    bgColorRaiseRequest:string,
    bgColorFollowers:string,
    bgColorFollowing:string,
    colorRaiseRequest:string,
    colorFollowers:string,
    colorFollowing:string,
    loading:boolean,
    selectedDept:string,
    selectedDeptCategory:string,
    requestDescription:string,
    myIssueUnlock:number,
    nextCount:number,
    dataFilledCheck:number,
    /**
     * Contains the error message that occurred while loading the data.
     * If no error message occurred, null.
     */
     errorMessage: string;

}