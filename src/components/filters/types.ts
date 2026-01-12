// DSL Type Definitions
export type FilterOption = { value: string; label: string; subValue?: string };
export type Filter = {
  name: string; // Unique identifier for state management
  type:
    | "text"
    | "number"
    | "select"
    | "select-with-input"
    | "multi-select"
    | "combobox"
    | "multi-select-popup"
    | "date"
    | "checkbox"
    | "search"
    | "long-search"
    | "file"
    | "date-range"
    | "number-range"
    | "input-button"
    | "blank"
    | "custom"
    | "spacer"
    | "phone-number"
    | "select-search"
    | "days-of-week"
    | "hour-range"
    | "radio-group"
    | "double-select"
    | "select-and-input"
    | "textarea"; // Add custom type
  label?: string;
  width?: "short" | "middle" | "long";
  maxLength?: number;
  placeholder?: string; // Add placeholder property
  options?: FilterOption[]; // For 'select' type
  options1?: FilterOption[]; // For 'double-select' type
  options2?: FilterOption[]; // For 'double-select' type
  activator?: boolean; // Adds a checkbox to enable/disable the field
  colSpan?: number; // For 'grid' rows, the number of columns this filter should span
  
  // 예: defaultValue: "some-default-value"
  defaultValue?: any;

  // readonly: 필드를 읽기 전용으로 설정합니다.
  // 예: readonly: true
  readonly?: boolean;

  // disabled: 필드를 비활성화합니다.
  disabled?: boolean;

  // 팝업(캘린더 등)의 표시 위치를 지정합니다.
  // 기본값은 'bottom'입니다.
  popoverSide?: "top" | "bottom";

  // For 'input-button' type
  buttonText?: string;
  onButtonClick?: (value?: any, e?: React.MouseEvent<HTMLElement>) => void;

  // For 'custom' type
  className?: string;
  render?: () => React.ReactNode;

  // For align filter components
  // 기본값은 'right' 입니다
  labelAlign?: LabelAlign;
};

export type FilterGridRowConfig = {
  type: "grid";
  columns: number;
  filters: Filter[];
};

export type FilterRow = Filter[] | FilterGridRowConfig;
export type FilterLayout = FilterRow[];
export type LabelAlign = "right" | "left";