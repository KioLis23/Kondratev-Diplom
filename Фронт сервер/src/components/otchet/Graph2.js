import React, { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";

const Graph2 = ({ data }) => {
  const chartRef = useRef(null);

  useLayoutEffect(() => {
    if (!data || data.length === 0) return;


    let root = am5.Root.new(chartRef.current);
    let finalData = [];

    let filteredData = data;

    filteredData.forEach((item, index) => {
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

    let chart = root.container.children.push(am5percent.PieChart.new(root, {
      layout: root.verticalLayout,
      innerRadius: am5.percent(70)
    }));

    let series = chart.series.push(am5percent.PieSeries.new(root, {
      valueField: "value",
      categoryField: "product_name",
      alignLabels: false,
      tooltip: am5.Tooltip.new(root, {
        labelText: "Склад: {warehouse_name}, Компания: {company_name}, Количество: {value}"
      })
    }));

    series.labels.template.setAll({
      textType: "circular",
      centerX: 0,
      centerY: 0
    });

    series.data.setAll(finalData);

    let legend = chart.children.push(am5.Legend.new(root, {
      centerX: am5.percent(50),
      x: am5.percent(50),
      marginTop: 15,
      marginBottom: 15,
    }));

    legend.data.setAll(series.dataItems);

    series.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [data]);

  return (
    <div>
      <div ref={chartRef} style={{top:"100%", width: "80%", height: "100%", right: "20px", position: "absolute",       zIndex: 0, }} />

    </div>
  );
};

export default Graph2;
