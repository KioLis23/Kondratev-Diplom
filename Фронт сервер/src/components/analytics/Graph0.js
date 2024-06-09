import React, { useLayoutEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const Graph0 = ({ data }) => {

  useLayoutEffect(() => {
    let root = am5.Root.new("chartdiv0");
    let finalData = [];
    let filteredData = data;

    filteredData.forEach((item, index) => {
      const date = new Date(item.date);
      const month = date.toLocaleString("default", { month: "long" });
      if (index === 0) 
          {
              finalData.push
              ({
                product_name: item.product_name,
                date: month,
                sales: parseInt(item.sales_sum),
                out_value: parseInt(item.out_value),
                in_value: parseInt(item.in_value),
                value: parseInt(item.value),
                result: parseInt(item.value) - parseInt(item.out_value) + parseInt(item.in_value)
              });
            return;
          }
    
      const lastDataMonth = finalData[finalData.length - 1].date;
    
      if (month !== lastDataMonth) 
      {
        finalData.push({
          product_name: item.product_name,
          date: month,
          sales: parseInt(item.sales_sum),
          out_value: parseInt(item.out_value),
          in_value: parseInt(item.in_value),
          value: parseInt(item.value),
          result: parseInt(item.value) - parseInt(item.out_value) + parseInt(item.in_value)
        });
      } else {
        finalData[finalData.length - 1].sales += parseInt(item.sales_sum);
        finalData[finalData.length - 1].out_value += parseInt(item.out_value);
        finalData[finalData.length - 1].in_value += parseInt(item.in_value);
        finalData[finalData.length - 1].value += parseInt(item.value);
        finalData[finalData.length - 1].result +=  parseInt(item.value) - parseInt(item.out_value) + parseInt(item.in_value);
      }
    });
    

    root.data = finalData;
    root.setThemes([am5themes_Animated.new(root)]);

var chart = root.container.children.push(
  am5xy.XYChart.new(root, {
    panX: false,
    panY: false,
    wheelX: "panX",
    wheelY: "zoomX",
    layout: root.verticalLayout
  })
);

chart.set(
  "scrollbarX",
  am5.Scrollbar.new(root, {
    orientation: "horizontal"
  })
);
var xRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: 30 });
xRenderer.labels.template.setAll({
  rotation: -90,
  centerY: am5.p50,
  centerX: am5.p100,
  paddingRight: 15
});
var xAxis = chart.xAxes.push(
  am5xy.CategoryAxis.new(root, {
    categoryField: "date",
    renderer: xRenderer,
    tooltip: am5.Tooltip.new(root, {})
  })
);

xAxis.data.setAll(finalData);

var yAxis = chart.yAxes.push(
  am5xy.ValueAxis.new(root, {
    min: 0,
    extraMax: 0.1,
    renderer: am5xy.AxisRendererY.new(root, {})
  })
);
var valueAxis = chart.yAxes.push(
  am5xy.ValueAxis.new(root, {
    min: 0,
    extraMax: 0.1,
    renderer: am5xy.AxisRendererY.new(root, { opposite: true }) 
  })
);

var series1 = chart.series.push(
  am5xy.ColumnSeries.new(root, {
    name: "Остаток",
    xAxis: xAxis,
    yAxis: yAxis,
    valueYField: "result",
    categoryXField: "date",
    tooltip:am5.Tooltip.new(root, {
      pointerOrientation:"horizontal",
      labelText:"{name} in {categoryX}: {valueY} {info}"
      
    })
  })
);

series1.columns.template.setAll({
  tooltipY: am5.percent(10),
  templateField: "columnSettings"
});

series1.data.setAll(finalData);

var series2 = chart.series.push(
  am5xy.StepLineSeries.new(root, {
    name: "Отгрузки",
    xAxis: xAxis,
    yAxis: valueAxis,
    valueYField: "out_value",
    categoryXField: "date",
    tooltip:am5.Tooltip.new(root, {
      pointerOrientation:"horizontal",
      labelText:"{name} in {categoryX}: {valueY} {info}"
    }),
    stroke: am5.color(0xfe9666)
  })
);

var series3 = chart.series.push(
  am5xy.StepLineSeries.new(root, {
    name: "Приход",
    xAxis: xAxis,
    yAxis: valueAxis,
    valueYField: "in_value",
    categoryXField: "date",
    tooltip:am5.Tooltip.new(root, {
      pointerOrientation:"horizontal",
      labelText:"{name} in {categoryX}: {valueY} {info}"
    }),
    stroke: am5.color(0xa66999)
  })
);




series2.strokes.template.setAll({
  strokeWidth: 3,
  templateField: "strokeSettings"
});
series3.strokes.template.setAll({
  strokeWidth: 3,
  templateField: "strokeSettings"
});


series2.data.setAll(finalData);
series3.data.setAll(finalData);


series2.bullets.push(function () {
  return am5.Bullet.new(root, {
    sprite: am5.Circle.new(root, {
      strokeWidth: 3,
      stroke: series2.get("stroke"),
      radius: 5,
      fill: ("#fe9666"),
    })
  });
});
series3.bullets.push(function () {
  return am5.Bullet.new(root, {
    sprite: am5.Circle.new(root, {
      strokeWidth: 3,
      stroke: series3.get("stroke"),
      radius: 5,
      fill: ("#a66999")
    })
  });
});

chart.set("cursor", am5xy.XYCursor.new(root, {}));


var legend = chart.children.push(
  am5.Legend.new(root, {
    centerX: am5.p50,
    x: am5.p50
  })
);
legend.data.setAll(chart.series.values);


chart.appear(1000, 100);
series1.appear();

    chart.current = root;
    return () => {
          root.dispose();
    };
    
  }, [data]);

  return [<div id="chartdiv0" style={{width: "28%", height: "40%", top: "22%", right: "50%", position: "absolute", backgroundColor: "#EEEEEE"}} />,
<p style={{width: "20%", height: "1%", top: "22.5%", right: "55.5%",fontSize: "100%" , position: "absolute"}}>Движение товарных запасов за период </p>,
<p style={{width: "10%", height: "30%", top: "55%",right: "68%",fontSize: "100%" , position: "absolute", transform: "rotate(270deg)", transformOrigin: "top left"}}>Остаток </p>,
<p style={{width: "10%", height: "30%", top: "52%",right: "41.5%",fontSize: "100%" , position: "absolute", transform: "rotate(270deg)", transformOrigin: "top left"}}>Приход и отгрузки </p>];
  }

export default Graph0;