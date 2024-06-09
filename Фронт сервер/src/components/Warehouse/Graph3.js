import React, { useLayoutEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const Graph3 = ({data}) => {

  useLayoutEffect(() => {
    let root = am5.Root.new("chartdiv8");
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


var chart = root.container.children.push(am5xy.XYChart.new(root, {
  panX: true,
  panY: true,
  wheelY: "zoomXY",
  pinchZoomX:true,
  pinchZoomY:true
}));


var xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
  renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 50 }),
  tooltip: am5.Tooltip.new(root, {})
}));

var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
  renderer: am5xy.AxisRendererY.new(root, {}),
  tooltip: am5.Tooltip.new(root, {})
}));


var series1 = chart.series.push(am5xy.LineSeries.new(root, {
  calculateAggregates: true,
  xAxis: xAxis,
  yAxis: yAxis,
  valueYField: "sales",
  valueXField: "value",
  tooltip: am5.Tooltip.new(root, {
  labelText: "Склад: {warehouse_name}, Продажи: {sales}, Количество: {value}"
  })
}));

series1.strokes.template.set("strokeOpacity", 0);


series1.bullets.push(function() {
  var graphics = am5.Triangle.new(root, {
    fill: series1.get("fill"),
    width: 15,
    height: 13,
    rotation: 180
  });
  return am5.Bullet.new(root, {
    sprite: graphics
  });
});

chart.set("cursor", am5xy.XYCursor.new(root, {
  xAxis: xAxis,
  yAxis: yAxis,
  snapToSeries: [series1]
}));

chart.set("scrollbarX", am5.Scrollbar.new(root, {
  orientation: "horizontal"
}));

chart.set("scrollbarY", am5.Scrollbar.new(root, {
  orientation: "vertical"
}));

series1.data.setAll(finalData);


series1.appear(1000);


chart.appear(1000, 100);
    chart.current = root;
    return () => {
          root.dispose();
    };
  }, [data]);

  return [<div id="chartdiv8" style={{width: "50%", height: "60%", top: "20%",right: "40%",position: "absolute",      zIndex: 1,}} />,];
};

export default Graph3;