"use client";

import { useMemo } from "react";
import _values from "lodash/values";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { TGenreAggregation } from "@/types/app";

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active: boolean;
  payload: {
    [K: string]: any;
  };
  label: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-md p-4 bg-white bg-opacity-90 text-sm">
        <p>
          <span>Genre</span> : <span className="font-medium">{label}</span>
        </p>
        <p>
          <span>Count</span> :{" "}
          <span className="font-medium">{payload[0].value}</span>
        </p>
      </div>
    );
  }

  return null;
};

const Overview = ({ data }: { data: TGenreAggregation }) => {
  const parsedData = useMemo(() => {
    return _values(data);
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height={450}>
      <LineChart data={parsedData}>
        <XAxis
          dataKey="genre"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          angle={-45}
          textAnchor="end"
          height={100}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        {/* @ts-ignore */}
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="count"
          stroke="#8884d8"
          fill="currentColor"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Overview;
