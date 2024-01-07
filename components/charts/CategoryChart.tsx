import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import _isEmpty from "lodash/isEmpty";
import _filter from "lodash/filter";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TCategoryAggregation } from "@/types/app";
import {
  dataFormatter,
  parseInstallSize,
  tickFormatter,
} from "@/helpers/general";

const cagtegoryAggregationData = [
  {
    label: "Category",
    value: "name",
  },
  {
    label: "Reviews",
    value: "reviews",
  },
  ,
  {
    label: "Installs",
    value: "installs",
  },
] as { label: string; value: string }[];

export function AxisSelect({
  data,
  onChange,
  axisLabel,
  selected,
}: {
  data: { value: string; label: string }[];
  onChange: (value: string) => void;
  axisLabel: string;
  selected: string;
}) {
  return (
    <Select onValueChange={onChange} value={selected}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={`Select ${axisLabel} key`} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{axisLabel}</SelectLabel>
          {data.map(({ value, label }) => {
            return (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active: boolean;
  payload: {
    [K: string]: any;
    payload: TCategoryAggregation;
  };
  label: string;
}) => {
  if (active && payload && payload.length) {
    const { payload: categoryData } = payload[0];
    const { mostInstalled } = categoryData || {};
    return (
      <div className="rounded-md p-4 bg-white bg-opacity-90 text-sm">
        <p>
          <span>Category</span> : <span className="font-medium">{label}</span>
        </p>
        <p>
          <span>Total Reviews</span> :{" "}
          <span className="font-medium">{dataFormatter(payload[0].value)}</span>
        </p>
        {!_isEmpty(mostInstalled) && (
          <>
            <p>
              <span>Top App</span> :{" "}
              <span className="font-medium">{mostInstalled.app}</span>
            </p>
            <p>
              <span>Top App Installs</span> :{" "}
              <span className="font-medium">
                {parseInstallSize(mostInstalled.installs)}
              </span>
            </p>
          </>
        )}
      </div>
    );
  }

  return null;
};

const CategoryAggregationChart = ({
  data,
}: {
  data: TCategoryAggregation[];
}) => {
  const [xAxis, setXAxis] = useState(cagtegoryAggregationData[0].value);
  const [yAxis, setYAxis] = useState(cagtegoryAggregationData[1].value);
  const handleXAxisChange = (value: string) => {
    setXAxis(value);
  };
  const handleYAxisChange = (value: string) => {
    setYAxis(value);
  };

  const xAxisData = useMemo(() => {
    return cagtegoryAggregationData.filter(({ value }) => value !== yAxis);
  }, [yAxis]);

  const yAxisData = useMemo(() => {
    return cagtegoryAggregationData.filter(({ value }) => value !== xAxis);
  }, [xAxis]);

  return (
    <>
      <div className="p-4 flex flex-col gap-4 sm:flex-row">
        <AxisSelect
          data={xAxisData}
          onChange={handleXAxisChange}
          axisLabel="x axis"
          selected={xAxis}
        />
        <AxisSelect
          data={yAxisData}
          onChange={handleYAxisChange}
          axisLabel="y axis"
          selected={yAxis}
        />
      </div>
      <ResponsiveContainer width="100%" height={450}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={xAxis}
            stroke="#888888"
            fontSize={10}
            angle={-45}
            textAnchor="end"
            height={100}
          />
          <YAxis tickFormatter={tickFormatter} stroke="#888888" fontSize={12} />
          {/* @ts-ignore */}
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar
            dataKey={yAxis}
            fill="currentColor"
            className="fill-primary"
            radius={[4, 4, 0, 0]}
            activeBar={<Rectangle fill="gold" stroke="purple" />}
            background={{ fill: "#eee" }}
          />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

export default CategoryAggregationChart;
