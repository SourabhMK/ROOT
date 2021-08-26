export interface IDepartmentList {
    deptName:string;
    deptGroup:string;
    deptManager:number;
    dispatcherName:string
}

export interface  IDispacherList {
    dispatcherDeptName:string;
    supportDeptName:string;
    raisedBy:string;
    issueDate:string;
    description:string;
    category:string;
    department:string;
    status:string;
    reAssignedTo:string;
}