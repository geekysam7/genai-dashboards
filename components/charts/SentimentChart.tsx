import React from "react";
import { PieChart, Pie, ResponsiveContainer, Tooltip } from "recharts";
import _keys from "lodash/keys";
import _reduce from "lodash/reduce";

import { TSentimentData } from "@/types/app";

const CustomTooltip = ({
  active,
  payload,
}: {
  active: boolean;
  payload: any[];
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 bg-white bg-opacity-90 text-sm rounded-md">
        {payload[0].name} - {payload[0].value}
      </div>
    );
  }
  return null;
};

const SentimentChart = ({ data }: { data: TSentimentData["data"] }) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          dataKey="value"
          data={data}
          startAngle={360}
          endAngle={0}
          cx="50%"
          cy="50%"
          outerRadius={80}
          label
        />
        {/* @ts-ignore */}
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default SentimentChart;
