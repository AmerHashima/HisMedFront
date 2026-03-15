export interface DoctorSchedule {
  oid?:string,
  doctorId: string,
  dayOfWeekId:string
  startTime: string,
  endTime: string,
  startDate:string,
  endDate:string,
  slotDurationMinutes:number
  statusId: string,
  branchId: string,
  specialtyId: string,
  isActive: boolean,
  isPriority: boolean,
}

export interface DoctorScheduleBulk{
  doctorId:string,
  statusId: string,
  branchId: string,
  specialtyId: string,
  isActive: boolean,
  isPriority: boolean,
  startDate: string,
  endDate: string,
  doctorSchedulesList:
    {
      dayOfWeekId: string,
      startTime: string,
      endTime: string,
      slotDurationMinutes: number
    }[]
}


export interface APIDoctorScheduleItem {
  doctorId: string;
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;

  dayOfWeekNameEn: string,
  dayOfWeekNameAr: string,
  startDate: string,
  endDate: string,
  isActive: boolean,
  status: string,
  branch: string,
  specialty: string,
  isPriority: boolean
}

export type APIDoctorScheduleBulk = APIDoctorScheduleItem[];
export interface APIDoctorSchedule {
  oid:string,
  doctorId:string,
  dayOfWeekNameEn: string,
  dayOfWeekNameAr: string,
  status: string,
  branch: string,
  specialty: string,
  isPriority: boolean
  startTime: string,
  endTime: string,
  slotDurationMinutes: number,
  isActive: boolean
  startDate: string,
  endDate: string,
}



