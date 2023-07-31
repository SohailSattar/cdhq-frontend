
import { APIBase } from '../types';

export interface APIEmployeeAttendanceCategory extends APIBase {}


export interface APIAttendanceLogItem{
    employeeNo: number;
    rank: string;
    personName: string;
    dayName: string;
    dayNameEnglish: string;
    formatedDate: string;
    timeIn : string;
    timeOut: string;
    workMode: string;
    workGroup: string;
    workGroupEnglish: string;
    leaveType: string;
    leaveTypeEnglish: string;
    leaveNotes: string;
    departmentName: string;
    contract: string;
    contractDescription: string;
    iconColor: string;
}