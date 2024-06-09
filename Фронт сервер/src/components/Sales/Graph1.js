import React, { useLayoutEffect} from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5radar from "@amcharts/amcharts5/radar";
const Graph1 = ({data}) => {

  useLayoutEffect(() => {
    let root = am5.Root.new("chartdiv61");
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



var chart = root.container.children.push(am5radar.RadarChart.new(root, {
  panX: true,
  panY: true,
  wheelX: "none",
  wheelY: "none",
  innerRadius:am5.percent(40)
}));


chart.zoomOutButton.set("forceHidden", true);



var xRenderer = am5radar.AxisRendererCircular.new(root, {
  minGridDistance: 30
});

xRenderer.grid.template.set("visible", false);

var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
  maxDeviation: 0.3,
  categoryField: "date",
  renderer: xRenderer
}));

var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
  maxDeviation: 0.3,
  min: 0,
  renderer: am5radar.AxisRendererRadial.new(root, {})
}));



var series = chart.series.push(am5radar.RadarColumnSeries.new(root, {
  name: "Series 1",
  xAxis: xAxis,
  yAxis: yAxis,
  valueYField: "amount",
  categoryXField: "date"
}));


series.columns.template.setAll({
  cornerRadius: 5,
  tooltipText:"{categoryX}: {valueY}"
});


series.columns.template.adapters.add("fill", function (fill, target) {
  return chart.get("colors").getIndex(series.columns.indexOf(target ));
});

series.columns.template.adapters.add("stroke", function (stroke, target) {
  return chart.get("colors").getIndex(series.columns.indexOf(target ));
});



xAxis.data.setAll(finalData);
series.data.setAll(finalData);


setInterval(function () {
  updateData();
}, 5000)

function updateData() {
  am5.array.each(series.dataItems, function (dataItem) {
    var value = dataItem.get("valueY") + Math.round(Math.random() * 400 - 200);
    if (value < 0) {
      value = 10;
    }

    dataItem.set("valueY", value);
    dataItem.animate({
      key: "valueYWorking",
      to: value,
      duration: 600,
      easing: am5.ease.out(am5.ease.cubic)
    });
  })

  sortCategoryAxis();
}


function getSeriesItem(category) {
  for (var i = 0; i < series.dataItems.length; i++) {
    var dataItem = series.dataItems[i];
    if (dataItem.get("categoryX") == category) {
      return dataItem;
    }
  }
}


function sortCategoryAxis() {


  series.dataItems.sort(function (x, y) {
    return y.get("valueY") - x.get("valueY");
  })


  am5.array.each(xAxis.dataItems, function (dataItem) {
    var seriesDataItem = getSeriesItem(dataItem.get("category"));

    if (seriesDataItem) {
      var index = series.dataItems.indexOf(seriesDataItem);
      var deltaPosition = (index - dataItem.get("index", 0)) / series.dataItems.length;
      dataItem.set("index", index);
      dataItem.set("deltaPosition", -deltaPosition);
      dataItem.animate({
        key: "deltaPosition",
        to: 0,
        duration: 1000,
        easing: am5.ease.out(am5.ease.cubic)
      })
    }
  });

  xAxis.dataItems.sort(function (x, y) {
    return x.get("index") - y.get("index");
  });
}



series.appear(1000);
chart.appear(1000, 100);



    chart.current = root;
    return () => {
          root.dispose();
    };
  }, [data]);

  return [<div id="chartdiv61" style={{width: "200%", height: "50%", top: "20%",right: "-36%", position: "absolute"}} />,
  <p style={{width: "50%", height: "10%", top: "18%",right: "39%", position: "absolute"}}>Диаграмма зависимости области и продажи </p>];
};

export default Graph1;