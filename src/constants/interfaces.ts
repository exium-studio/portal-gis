import { ButtonProps } from "@/components/ui/button";
import {
  BoxProps,
  SimpleGridProps,
  StackProps,
  TableCellProps,
  TableColumnHeaderProps,
  TableRowProps,
} from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";
import {
  FilterGeoJSON,
  LatLong,
  Type__DateRange,
  Type__DateRangePresets,
  Type__DisclosureSizes,
  Type__TableOptions,
  Type__TimeRange,
} from "./types";

// Legends
export interface LegendItem {
  value: string;
  color: string;
}

export interface LayerLegends {
  layer: Interface__ActiveLayer;
  workspace: Interface__ActiveWorkspace;
  legends: LegendItem[];
}

// Dashboard
export interface Interface__FilterOptionValue {
  value: string;
  active: boolean;
}
export interface Interface__FilterOptionGroup {
  property: keyof FilterGeoJSON; // "KABUPATEN" | "TIPEHAK" | "GUNATANAHK"
  values: Interface__FilterOptionValue[]; // unik, urut A–Z
}

// CUD
export interface Interface__CUD {
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

// Storage
export interface Interface__StorageFile extends Interface__CUD {
  id: number;
  file_name: string;
  file_path: string;
  file_url: string;
  file_mime_type: string;
  file_size: number;
}

// Maps related
export interface Type_SelectedPolygon {
  activeWorkspace: Interface__ActiveWorkspace;
  activeLayer: Interface__ActiveLayer;
  polygon: GeoJSON.Feature<GeoJSON.Polygon>;
  fillColor: string;
  clickedLngLat: LatLong;
}
export interface Interface__WorkspaceCategory extends Interface__CUD {
  id: number;
  label: string;
}
export interface Interface__Workspace extends Interface__CUD {
  id: number;
  title: string;
  description: string;
  layers?: Interface__Layer[];
  workspace_category: Interface__Gens;
  thumbnail?: Interface__StorageFile[];
  bbox: number[];
  bbox_center: number[];
}
export interface Interface__Layer extends Interface__CUD {
  id: number;
  workspace_id: number;
  color_property_key?: string;
  parent_layer_id?: number | null;
  with_explanation: boolean;
  name: string;
  description: string;
  table_name: string;
  layer_type: string;
  data?: Interface__LayerData;
  bbox: number[];
  bbox_center: number[];
}
export interface Interface__LayerData extends Interface__CUD {
  id: number;
  layer_id: number;
  geojson: GeoJSON.FeatureCollection;
  bbox?: number[];
  bbox_center?: number[];
}
export interface Interface__GeoJSONData extends GeoJSON.FeatureCollection {
  documents: Interface__StorageFile[];
}
export interface Interface__ActiveWorkspacesByWorkspaceCategory {
  workspace_category: Interface__WorkspaceCategory;
  workspaces: Interface__ActiveWorkspace[];
  visible: boolean;
}
export interface Interface__ActiveWorkspace extends Interface__Workspace {
  visible: boolean;
  layers: Interface__ActiveLayer[];
}
export interface Interface__ActiveLayer extends Interface__Layer {
  visible: boolean;
}

// Gens
export interface Interface__Gens extends Interface__CUD {
  id: number;
  label: string;
}

// Routes
export interface Interface__Route {
  path: string;
  activePath: string;
  element: any;
}
export interface Interface__PrivateRoute extends Interface__Route {
  label?: any;
  titleKey: string;
  backPath?: string;
  allowedPermissions?: number[];
}

// Select
export interface Interface__SelectOption {
  id: any;
  label: any;
  label2?: any;
  original_data?: any;
  disabled?: boolean;
}
export interface Interface__Select extends ButtonProps {
  id?: string;
  name?: string;
  title?: string;
  onConfirm?: (inputValue: Interface__SelectOption[] | undefined) => void;
  inputValue?: Interface__SelectOption[] | undefined;
  initialOptions?: Interface__SelectOption[] | undefined | null;
  placeholder?: string;
  invalid?: boolean;
  nonNullable?: boolean;
  multiple?: boolean;
  disclosureSize?: Type__DisclosureSizes;
  fetch?: (
    setOptions: Dispatch<
      SetStateAction<Interface__SelectOption[] | null | undefined>
    >
  ) => void;
}

// Date Picker
export interface Interface__SelectedDateList {
  selectedDates: Date[];
  selectedRenderValue: string;
}
export interface Interface__DatePicker extends ButtonProps {
  id?: string;
  name?: string;
  title?: string;
  onConfirm?: (inputValue: string[] | undefined) => void;
  inputValue?: string[] | undefined;
  placeholder?: string;
  nonNullable?: boolean;
  invalid?: boolean;
  disclosureSize?: Type__DisclosureSizes;
  multiple?: boolean;
}

// Date Range Picker
export interface Interface__DateRangePicker extends ButtonProps {
  id?: string;
  name?: string;
  title?: string;
  onConfirm?: (inputValue: Type__DateRange) => void;
  inputValue?: Type__DateRange;
  placeholder?: string;
  nonNullable?: boolean;
  invalid?: boolean;
  disclosureSize?: Type__DisclosureSizes;
  preset?: Type__DateRangePresets[];
  maxRange?: number;
}

// Time Picker
export interface Interface__TimePicker extends ButtonProps {
  id?: string;
  name?: string;
  title?: string;
  onConfirm?: (inputValue: string | undefined) => void;
  inputValue?: string | undefined;
  withSeconds?: boolean;
  placeholder?: string;
  nonNullable?: boolean;
  invalid?: boolean;
  disclosureSize?: Type__DisclosureSizes;
}

// Time Range Picker
export interface Interface__TimeRangePicker extends ButtonProps {
  id?: string;
  name?: string;
  title?: string;
  onConfirm?: (inputValue: Type__TimeRange | undefined) => void;
  inputValue?: Type__TimeRange | undefined;
  withSeconds?: boolean;
  placeholder?: string;
  nonNullable?: boolean;
  invalid?: boolean;
  disclosureSize?: Type__DisclosureSizes;
}

// Table Component
export interface Interface__FormattedTableHeader {
  th: string;
  columnKey?: string; // unused yet
  sortable?: boolean;
  tableColumnHeaderProps?: TableColumnHeaderProps;
  wrapperProps?: StackProps;
}
export interface Interface__FormattedTableBody {
  id: number;
  columnsFormat: {
    td: any;
    value: any;
    columnKey?: string; // unused yet
    dataType?: string; // "string" | "number" | "date" | "time" |
    original_data?: any;
    tableCellProps?: TableCellProps;
    wrapperProps?: StackProps;
  }[];
}
export interface Interface__TableComponent extends StackProps {
  ths: Interface__FormattedTableHeader[];
  tds: Interface__FormattedTableBody[];
  originalData: any;
  rowClick?: (rowData: any) => void;
  columnsConfig?: number[];
  batchOptions?: any[];
  rowOptions?: any[];
  initialSortOrder?: "asc" | "desc";
  initialSortColumnIndex?: number;
  trBodyProps?: TableRowProps;
  footerContent?: any;
  initialLimit?: number;
  initialPage?: number;
  pagination?: any;
  pageControl?: number;
  setPageControl?: Dispatch<number>;
  limitOptions?: number[];
  limitControl?: number;
  setLimitControl?: Dispatch<number>;
  footerContainerProps?: SimpleGridProps;
}
export interface Interface__RowOptions {
  rowData: any;
  rowOptions: Type__TableOptions;
  tableRef: any;
}
export interface Interface__BatchOptions {
  selectedRows: number[];
  batchOptions: Type__TableOptions;
  selectAllRows: boolean;
  handleSelectAllRows: (isChecked: boolean) => void;
  tableRef: any;
}
export interface Interface__TableFooterNote {
  footerContent?: any;
}
export interface Interface__LimitControl extends StackProps {
  initialLimit: number;
  limitControl?: number;
  setLimitControl?: Dispatch<number>;
  limitOptions?: number[];
}
export interface Interface__PageControl extends StackProps {
  initialPage?: number;
  pagination?: any;
  pageControl?: number;
  setPageControl?: Dispatch<number>;
}

// Divider
export interface Interface__Divider extends BoxProps {
  dir?: "vertical" | "horizontal";
}
