import React, { useLayoutEffect} from "react";
import * as am5 from "@amcharts/amcharts5";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5wc from "@amcharts/amcharts5/wc";

const Graph1 = ({ data }) => {
  useLayoutEffect(() => {
    let finalData = [];
    let filteredData = data;

    let amountSum = 0;
    let inValueSum = 0;
    let outValueSum = 0;
    let valueSum = 0;
    let salesSumSum = 0;

    filteredData.forEach((item) => {
      amountSum += parseInt(item.amount);
      inValueSum += parseInt(item.in_value);
      outValueSum += parseInt(item.out_value);
      valueSum += parseInt(item.value);
      salesSumSum += parseInt(item.sales_sum);
    });
    let categoryValue1 = amountSum;
    let categoryValue2 = inValueSum;
    let categoryValue3 = outValueSum;
    let categoryValue4 = valueSum;
    let categoryValue5 = salesSumSum;
    let categoryValue6 = categoryValue2 - categoryValue3 + categoryValue4;

    finalData.push({ category:"Остаток: "+ categoryValue6, value: 2.6 });
    finalData.push({ category: "Приход: "+ categoryValue2, value: 2.8 });
    finalData.push({ category: "Отгрузки: "+ categoryValue3, value: 3 });
    finalData.push({ category: "Количество товара: "+ categoryValue4, value: 2.4 });
    finalData.push({ category: "Продажи: "+ categoryValue5, value: 2.5 });


    let root = am5.Root.new("chartdiv1");

    root.setThemes([am5themes_Animated.new(root)]);

    let series = root.container.children.push(am5wc.WordCloud.new(root, {
      maxCount: 100,
      minWordLength: 2,
      minFontSize: am5.percent(6),
      maxFontSize: am5.percent(8),
      angles: [0],
      label: {
        text: (category) => {
          const dataItem = finalData.find((item) => item.category === category);
          if (dataItem) {
            return dataItem.value.toString(); 
          }
          return "";
        },
        fontSize: am5.percent(100),
        fill: am5.color(0, 0, 0), 
        tooltipText: "{category}: {value}", 
      },
    }));
    var colorSet = am5.ColorSet.new(root, {
      step: 1
    });
    
    series.labels.template.setAll({
      paddingTop: 5,
      paddingBottom: 5,
      paddingLeft: 5,
      paddingRight: 5,
      fontFamily: "Courier New"
    });
    
    series.labels.template.setup = function(label) {
      label.set("background", am5.RoundedRectangle.new(root, {
        fillOpacity: 1,
        fill: colorSet.next()
      }))
    }
    series.data.setAll(finalData);

    return () => {
      root.dispose();
    };
  }, [data]);

  return (
    <div
      id="chartdiv1"
      style={{
        width: "40%",
        height: "45%",
        top: "20%",
        right: "3%",
        position: "absolute"
      }}
    ></div>
  );
};

export default Graph1;
