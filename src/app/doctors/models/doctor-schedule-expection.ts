export interface DoctorScheduleException{
  id?: string,
  doctorId:string,
  exceptionDate:string,
  startTime: string,
  endTime: string,
  dayOfWeekId: string,
  exceptionType: string,
  reason: string
}

export interface APIDoctorScheduleException {
  id: string,
  doctorId: string,
  exceptionDate: string,
  startTime: string,
  endTime: string,
  exceptionType: string,
  reason: string
}
