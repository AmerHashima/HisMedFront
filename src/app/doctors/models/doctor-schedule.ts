export interface DoctorSchedule {
  oid?: string,
  doctorId: string,
  statusId: string,
  branchId: string,
  specialtyId: string,
  isActive: boolean,
  isPriority: boolean,
  dayOfWeekId: string
  startTime: string,
  endTime: string,
  startDate: string,
  endDate: string,
  slotDurationMinutes: number
}

export interface editMasterDoctorSchedule {
  oid:string,
  doctorId: string,
  startDate: string,
  endDate: string,
  statusId: string,
  branchId: string,
  specialtyId: string,
  isActive: boolean,
  isPriority: boolean
}



// export interface APIDoctorScheduleItem {
//   doctorId: string;
//   startTime: string;
//   endTime: string;
//   slotDurationMinutes: number;
//   dayOfWeekNameEn: string,
//   dayOfWeekNameAr: string,
//   startDate: string,
//   endDate: string,
//   isActive: boolean,
//   status: string,
//   branch: string,
//   specialty: string,
//   isPriority: boolean
// }

export interface DoctorScheduleBulk {
  doctorId: string,
  statusId: string,
  branchId: string,
  specialtyId: string,
  isActive: boolean,
  isPriority: boolean,
  startDate: string,
  endDate: string,
  doctorScheduleDetailList:
  {
    dayOfWeekId: string,
    startTime: string,
    endTime: string,
    slotDurationMinutes: number
  }[]
}

export interface APIDoctorScheduleBulk {
  oid: string,
  doctorId: string,
  status: string,
  branch: string,
  specialty: string,
  isActive: boolean,
  isPriority: boolean,
  startDate: string,
  endDate: string,
  details: APIDoctorScheduleItem[],

}


export interface APIDoctorScheduleItem {
  oid: string,
  dayOfWeekId: string,
  dayOfWeekNameEn: string,
  dayOfWeekNameAr: string,
  startTime: string,
  endTime: string,
  slotDurationMinutes: number
}

export interface DoctorScheduleDetail {
  oid?: string,
  masterId: string,
  dayOfWeekId: string,
  startTime: string,
  endTime: string,
  slotDurationMinutes: number
}

export interface ApiDoctorScheduleDetail {
  oid: string,
  dayOfWeekId: string,
  dayOfWeekNameEn: string,
  dayOfWeekNameAr: string,
  startTime: string,
  endTime: string,
  slotDurationMinutes: number
}

export interface postDetailsDoctorSchedule {
  masterId: string,
  dayOfWeekId: string,
  startTime: string,
  endTime: string,
  slotDurationMinutes: number
}

export interface APIPostDetailsDoctorSchedule {
  oid: string,
  dayOfWeekId: string,
  dayOfWeekNameEn: string,
  dayOfWeekNameAr: string,
  startTime: string,
  endTime: string,
  slotDurationMinutes: number
}





export interface singleScheduleDetails{
  oid: string,
  doctorId: string,
  status: string,
  branch: string,
  specialty: string,
  isActive: true,
  isPriority: true,
  startDate: string,
  endDate: string,
  details: [
    {
      oid: string,
      dayOfWeekId: string,
      dayOfWeekNameEn: string,
      dayOfWeekNameAr: string,
      startTime: string,
      endTime: string,
      slotDurationMinutes: number
    }
  ]
}
// export type APIDoctorScheduleBulk = APIDoctorScheduleItem[];
// export interface APIDoctorSchedule {
// oid: string,
// doctorId: string,
// dayOfWeekNameEn: string,
// dayOfWeekNameAr: string,
// status: string,
// branch: string,
// specialty: string,
// isPriority: boolean
// startTime: string,
// endTime: string,
// slotDurationMinutes: number,
// isActive: boolean
// startDate: string,
// endDate: string,
// }


export interface APIDoctorSchedule {
  oid: string,
  doctorId: string,
  doctorName: string,
  statusId: string,
  status: string,
  branchId: string,
  branchName: string,
  specialtyId: string,
  specialtyName: string,
  isActive: boolean,
  isPriority: boolean,
  // dayOfWeekNameEn: string,
  // dayOfWeekNameAr: string,
}

export type GroupedSchedule = APIDoctorScheduleBulk & {
  detail: APIDoctorScheduleItem;
};
