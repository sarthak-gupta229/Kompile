import React from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import "./HeatmapComponent.css";

function HeatmapComponent({ values, startDate, endDate }) {
  return (
    <div className="w-full h-full p-2 hover:cursor-pointer">
      <CalendarHeatmap
        startDate={startDate}
        endDate={endDate}
        values={values}
        classForValue={(value) => {
          if (!value || value.count === 0) return "color-empty";
          if (value.count < 2) return "color-scale-1";
          if (value.count < 5) return "color-scale-2";
          if (value.count < 10) return "color-scale-3";
          return "color-scale-4";
        }}
        titleForValue={(value) => {
          if (!value || !value.date) return "No submissions";
          return `${value.count} submissions on ${value.date}`;
        }}
        showWeekdayLabels={true}
      />
    </div>
  );
}

export default HeatmapComponent;
