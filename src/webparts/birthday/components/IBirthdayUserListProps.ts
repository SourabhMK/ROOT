import { IBirthday } from "./IBirthday";

export interface IBirthdayUserListProps {
    people: IBirthday[];
    msGraphClientFactory : any;
}

export interface IBirthdayUserListState {
    statusMessage:IMessage;
}

export interface IMessage {
    isShowMessage:boolean;  
    messageType:number;  
    message:string; 
}