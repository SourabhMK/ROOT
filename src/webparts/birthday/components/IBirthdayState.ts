
import {IBirthday} from "./IBirthday";

export interface IBirthdayState {
    Users : IBirthday[],    
    count:number,
    bgColorBirthday:string,
    bgColorAnniversary:string,
    
    colorBirthday:string,
    colorAnniversary:string,
    
    loading:boolean,
    /**
     * Contains the error message that occurred while loading the data.
     * If no error message occurred, null.
     */
     errorMessage: string;

}