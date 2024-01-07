import React from "react";
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

import { TCategoryAggregation } from "@/types/app";
import {
  dataFormatter,
  parseInstallSize,
  tickFormatter,
} from "@/helpers/general";

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
  return (
    <ResponsiveContainer width="100%" height={450}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
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
          dataKey="reviews"
          fill="currentColor"
          className="fill-primary"
          radius={[4, 4, 0, 0]}
          activeBar={<Rectangle fill="gold" stroke="purple" />}
          background={{ fill: "#eee" }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CategoryAggregationChart;
