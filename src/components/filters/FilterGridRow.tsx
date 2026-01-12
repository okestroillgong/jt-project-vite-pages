import React from "react";
import { FilterGridRowConfig, LabelAlign } from "./types";
import FilterWrapper from "./FilterWrapper";

type FilterGridRowProps = FilterGridRowConfig & {
  values: Record<string, any>;
  onChange: (name: string, value: any) => void;
  labelAlign?: LabelAlign;
};

const FilterGridRow: React.FC<FilterGridRowProps> = ({
  columns,
  filters,
  values,
  onChange,
  labelAlign = "right", // ✅ 기본 right
}) => {
  return (
    <div
      className="grid w-full gap-4"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {filters.map((filter, index) => (
        <div
          key={filter.name || index}
          style={{ gridColumn: `span ${filter.colSpan || 1}` }}
        >
          <FilterWrapper
            {...filter}
            labelAlign={filter.labelAlign ?? labelAlign}
            value={values[filter.name]}
            onChange={onChange}
          />
        </div>
      ))}
    </div>
  );
};

export default FilterGridRow;
