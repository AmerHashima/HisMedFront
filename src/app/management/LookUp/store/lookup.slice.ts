import { LookupMasterState } from "../models/lookup";


export const initialLookUPState: LookupMasterState = {
  success: false,
  items: [],
  selectedItem: null,
  details:[],
  selectedDetail:null,
  loading: false,
  error: null,
  page: 1,
  pageSize: 10,
  total: 0,
  search: '',
  sortBy: 'oid',
  sortDirection: 'asc',
};
