export interface DoctorSchedule {
  oid?:string,
  doctorId: string,
  dayOfWeekId:string
  startTime: string,
  endTime: string,
  slotDurationMinutes:number
}

export interface DoctorScheduleBulk{

  doctorId: string,
  doctorSchedules: {
    startTime: string,
    endTime: string,
    slotDurationMinutes: number,
    dayOfWeekId: string
  }[]
}


export interface APIDoctorScheduleItem {
  doctorId: string;
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
}

export type APIDoctorScheduleBulk = APIDoctorScheduleItem[];
export interface APIDoctorSchedule {
  oid:string,
  doctorId:string,
  dayOfWeekNameEn: string,
  dayOfWeekNameAr: string,
  startTime: string,
  endTime: string,
  slotDurationMinutes: number,
  isActive: true
}

