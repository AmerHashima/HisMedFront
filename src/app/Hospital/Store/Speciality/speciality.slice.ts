
import { SpecialityState } from "../../models/speciality";

export const initialSecialityState: SpecialityState = {
  // specialities: [],
  // selectedSpeciality: null,
  items: [],
  selectedItem: null,
  success: false,
  loading: false,
  error: null,
  page: 1,
  pageSize: 10,
  total: 0,
  search: '',
  sortBy: 'oid',
  sortDirection: 'asc',
};
