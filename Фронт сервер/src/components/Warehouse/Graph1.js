import React, { useState, useEffect } from "react";

const createTable = (data, sortColumn, sortDirection, handleSort) => {
  const table = document.createElement("table");
  table.classList.add("custom-table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");
  const headerRow = document.createElement("tr");
  headerRow.classList.add("header-row");
  const createHeaderCell = (text, column) => 
  {
      const headerCell = document.createElement("th");
      headerCell.textContent = text;

        if (column === sortColumn) {
          const sortIcon = document.createElement("span");
          sortIcon.textContent = sortDirection === "asc" ? "▲" : "▼";
          headerCell.appendChild(sortIcon);
        }

      headerCell.addEventListener("click", () => handleSort(column));

        return headerCell;
  };

  const header1 = createHeaderCell("Склад", "warehouse_name");
  const header2 = createHeaderCell("Приход", "in_value");
  const header3 = createHeaderCell("Отгрузка", "out_value");
  const header4 = createHeaderCell("Текущий остаток", "value");

  headerRow.appendChild(header1);
  headerRow.appendChild(header2);
  headerRow.appendChild(header3);
  headerRow.appendChild(header4);
  thead.appendChild(headerRow);

  data.forEach((item) => {
    const row = document.createElement("tr");
    const cell1 = document.createElement("td");
    cell1.textContent = item.warehouse_name;
    const cell2 = document.createElement("td");
    cell2.textContent = item.in_value;
    const cell3 = document.createElement("td");
    cell3.textContent = item.out_value;
    const cell4 = document.createElement("td");
    const currentBalance = item.value + item.in_value - item.out_value;
    cell4.textContent = currentBalance;

    row.appendChild(cell1);
    row.appendChild(cell2);
    row.appendChild(cell3);
    row.appendChild(cell4);
    tbody.appendChild(row);
  });

  const totalRow = document.createElement("tr");
  const totalCell1 = document.createElement("td");
  totalCell1.textContent = "Всего";
  const totalCell2 = document.createElement("td");
  const totalInValue = data.reduce((sum, item) => sum + item.in_value, 0);
  totalCell2.textContent = totalInValue;
  const totalCell3 = document.createElement("td");
  const totalOutValue = data.reduce((sum, item) => sum + item.out_value, 0);
  totalCell3.textContent = totalOutValue;
  const totalCell4 = document.createElement("td");
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);
  totalCell4.textContent = totalValue;
  const totalCell5 = document.createElement("td");
  const totalCurrentBalance = totalValue + totalInValue - totalOutValue;
  totalCell5.textContent = totalCurrentBalance;

  totalRow.appendChild(totalCell1);
  totalRow.appendChild(totalCell2);
  totalRow.appendChild(totalCell3);
  totalRow.appendChild(totalCell5);

  tbody.appendChild(totalRow);

  table.appendChild(thead);
  table.appendChild(tbody);

  return table;
};

const Graph1 = ({ data }) => {
  const [sortedData, setSortedData] = useState([]);
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    const table = createTable(sortedData, sortColumn, sortDirection, handleSort);
    const container = document.getElementById("chartdiv2");
    container.innerHTML = "";
    container.appendChild(table);
  }, [sortedData, sortColumn, sortDirection]);

  useEffect(() => {
    if (data.length === 0) {
      return;
    }

    let filteredData = data;

    let finalData = [];
    filteredData.forEach((item, index) => {
      if (index === 0) {
        finalData.push({
          warehouse_name: item.warehouse_name,
          out_value: parseInt(item.out_value),
          in_value: parseInt(item.in_value),
          value: parseInt(item.value),
        });
        return;
      }

      let found = false;
      let pos = 0;
      finalData.forEach((item2, index2) => {
        if (item2.warehouse_name === item.warehouse_name) {
          found = true;
          pos = finalData.indexOf(item2);
          return;
        }
      });

      if (!found) {
        finalData.push({
          warehouse_name: item.warehouse_name,
          out_value: parseInt(item.out_value),
          in_value: parseInt(item.in_value),
          value: parseInt(item.value),
        });
      } else {
        finalData[pos].out_value += parseInt(item.out_value);
        finalData[pos].in_value += parseInt(item.in_value);
        finalData[pos].value += parseInt(item.value);
      }
    });

    let sortedFinalData = [...finalData];
    if (sortColumn && sortDirection === "asc") {
      sortedFinalData.sort((a, b) => a[sortColumn] - b[sortColumn]);
    } else if (sortColumn && sortDirection === "desc") {
      sortedFinalData.sort((a, b) => b[sortColumn] - a[sortColumn]);
    }

    setSortedData(sortedFinalData);
  }, [data, sortColumn, sortDirection]);

  const handleSort = (column) => {
    if (column === sortColumn) {
      const newSortDirection = sortDirection === "asc" ? "desc" : "asc";
      setSortDirection(newSortDirection);
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  return (
    <div
      id="chartdiv2"
      className="table-container"
      style={{
        width: "20%",
        top: "100%",
        right: "70%",
        position: "absolute",
        backgroundColor: "white",
        border: "1px solid black",
        zIndex: -1,
      }}
    />
  );
};

export default Graph1;
