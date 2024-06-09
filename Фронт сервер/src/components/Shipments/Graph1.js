import React, { useLayoutEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
const Graph1 = ({data}) => {

  useLayoutEffect(() => {
    let root = am5.Root.new("chartdiv1");
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
          amount:parseInt(item.amount)
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
          amount:parseInt(item.amount)
        });
      } else {
        finalData[finalData.length - 1].sales += parseInt(item.sales_sum);
        finalData[finalData.length - 1].value += parseInt(item.value);
      }
    });
    

    root.data = finalData;
root.setThemes([
  am5themes_Animated.new(root)
]);

let chart = root.container.children.push(am5xy.XYChart.new(root, {
  panX: true,
  panY: true,
  wheelX: "panX",
  wheelY: "zoomX",
  pinchZoomX: true,
  paddingLeft:0,
  paddingRight:1
}));

let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
cursor.lineY.set("visible", false);

let xRenderer = am5xy.AxisRendererX.new(root, { 
  minGridDistance: 30, 
  minorGridEnabled: true
});

xRenderer.labels.template.setAll({
  rotation: -90,
  centerY: am5.p50,
  centerX: am5.p100,
  paddingRight: 15
});

xRenderer.grid.template.setAll({
  location: 1
})

let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
  maxDeviation: 0.3,
  categoryField: "out_value",
  renderer: xRenderer,
  tooltip: am5.Tooltip.new(root, {})
}));

let yRenderer = am5xy.AxisRendererY.new(root, {
  strokeOpacity: 0.1
})

let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
  maxDeviation: 0.3,
  renderer: yRenderer
}));

let series = chart.series.push(am5xy.ColumnSeries.new(root, {
  name: "Series 1",
  xAxis: xAxis,
  yAxis: yAxis,
  valueYField: "value",
  sequencedInterpolation: true,
  categoryXField: "out_value",
  tooltip: am5.Tooltip.new(root, {
    labelText: "{valueY}"
  })
}));

series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5, strokeOpacity: 0 });
series.columns.template.adapters.add("fill", function (fill, target) {
  return chart.get("colors").getIndex(series.columns.indexOf(target));
});

series.columns.template.adapters.add("stroke", function (stroke, target) {
  return chart.get("colors").getIndex(series.columns.indexOf(target));
});


xAxis.data.setAll(finalData);
series.data.setAll(finalData);


series.appear(1000);
chart.appear(1000, 100);

chart.current = root;
return () => {
      root.dispose();
};
}, [data]);

return [<div id="chartdiv1" style={{width: "50%", height: "60%", top: "40%",right: "2%", position: "absolute"}} />,];
};

export default Graph1;