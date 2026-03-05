export interface Menu {
  headTitle?: string;
  title?: string;
  path?: string;
  icon?: string;
  dirchange?: boolean;
  type?: string;
  badgeClass?: string;
  badgeValue?: string;
  active?: boolean;
  children?: Menu[];
  Menusub?: boolean;
  open?: boolean;
  items?: any;
  selected?: boolean;
}
