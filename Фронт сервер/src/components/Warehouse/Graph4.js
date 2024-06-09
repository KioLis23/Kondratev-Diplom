import React, { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const Graph4 = ({ data }) => {
  const chartRef = useRef(null);

  useLayoutEffect(() => {
    if (!data || data.length === 0) return;

    let root = am5.Root.new(chartRef.current);
    let finalData = [];

    data.forEach((item, index) => {
      const date = new Date(item.date);
      const month = date.toLocaleString("default", { month: "long" });

      if (index === 0) {
        finalData.push({
          product_name: item.product_name,
          date: month,
          sales: parseInt(item.sales_sum),
          out_value: parseInt(item.out_value),
          in_value: parseInt(item.in_value),
          value: parseInt(item.value),
          warehouse_name: item.warehouse_name,
          company_name: item.company_name,
        });
        return;
      }

      const lastDataMonth = finalData[finalData.length - 1].date;

      if (month !== lastDataMonth) {
        finalData.push({
          product_name: item.product_name,
          date: month,
          sales: parseInt(item.sales_sum),
          out_value: parseInt(item.out_value),
          in_value: parseInt(item.in_value),
          value: parseInt(item.value),
          warehouse_name: item.warehouse_name,
          company_name: item.company_name,
        });
      } else {
        finalData[finalData.length - 1].sales += parseInt(item.sales_sum);
        finalData[finalData.length - 1].value += parseInt(item.value);
      }
    });

    root.data = finalData;

    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        startAngle: 180,
        endAngle: 360,
        layout: root.verticalLayout,
        innerRadius: am5.percent(50),
      })
    );

    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        startAngle: 180,
        endAngle: 360,
        valueField: "value",
        categoryField: "product_name",
        alignLabels: false,
        tooltip: am5.Tooltip.new(root, {
            labelText: "Склад: {warehouse_name}, Компания: {company_name}, Количество: {value}"
            })
      })
    );

    series.states.create("hidden", {
      startAngle: 180,
      endAngle: 180,
    });

    series.slices.template.setAll({
      cornerRadius: 5,
    });

    series.ticks.template.setAll({
      forceHidden: true,
    });

    series.data.setAll(finalData);

    return () => {
      root.dispose();
    };
  }, [data]);

  return (
    <div>
      <div ref={chartRef} style={{ width: "50%", height: "300px", top: "30%", right: "-8%", position: "absolute" }} />

    </div>
  );
};

export default Graph4;
