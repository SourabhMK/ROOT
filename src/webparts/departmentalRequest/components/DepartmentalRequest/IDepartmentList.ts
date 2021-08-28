export interface IDepartmentList {
    deptName:string;
    deptGroup:string;
    deptManager:number;
    dispatcherName:string
}

export interface  IDispacherList {
    ticketNumber:string;
    dispatcherDeptName:string;
    supportDeptName:string;
    raisedBy:string;
    issueDate:string;
    description:string;
    category:string;
    department:string;
    status:string;
    reAssignedTo:string;
    dataId:number;
}