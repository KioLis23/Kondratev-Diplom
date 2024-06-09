import React, { useState, useMemo } from "react";
import { useTable, useSortBy } from "react-table";

const Graph5 = ({ data }) => {
  const columns = useMemo(
    () => [
      {
        Header: "Склад",
        accessor: "warehouse_name",
        canSort: true,
      },
      {
        Header: "Приход",
        accessor: "in_value",
        canSort: true,
      },
      {
        Header: "Отгрузка",
        accessor: "out_value",
        canSort: true,
      },
      {
        Header: "Текущий остаток",
        accessor: "currentBalance",
        canSort: true,
      },
    ],
    []
  );

  const [sortedData, setSortedData] = useState([]);
  const [sortColumn] = useState(""); 
  const [sortDirection] = useState("asc");

  useMemo(() => {
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
          currentBalance:
            parseInt(item.value) + parseInt(item.in_value) - parseInt(item.out_value),
        });
        return;
      }

      let found = false;
      let pos = 0;
      finalData.forEach((item2, index2) => {
        if (item2.warehouse_name === item.warehouse_name) {
          found = true;
          pos = index2;
          return;
        }
      });

      if (!found) {
        finalData.push({
          warehouse_name: item.warehouse_name,
          out_value: parseInt(item.out_value),
          in_value: parseInt(item.in_value),
          value: parseInt(item.value),
          currentBalance:
            parseInt(item.value) + parseInt(item.in_value) - parseInt(item.out_value),
        });
      } else {
        finalData[pos].out_value += parseInt(item.out_value);
        finalData[pos].in_value += parseInt(item.in_value);
        finalData[pos].value += parseInt(item.value);
        finalData[pos].currentBalance +=
          parseInt(item.value) + parseInt(item.in_value) - parseInt(item.out_value);
      }
    });

    setSortedData(finalData);
  }, [data]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data: sortedData,
      initialState: {
        sortBy: [{ id: sortColumn, desc: sortDirection === "desc" }],
      },
    },
    useSortBy
  );

  // const handleSort = (column) => {
  //   if (column.canSort) {
  //     const newSortDirection = sortDirection === "desc" ? "asc" : "desc";
  //     setSortColumn(column.id);
  //     setSortDirection(newSortDirection);
  //   }
  // };

  return (
    <table
    {...getTableProps()}
    className="custom-table"
    style={{
      position: "absolute",
      top: "70%",
      left: "2%",
      width: "30%",
      height: "10%",
      zIndex: 3,
      }}
    >
        <thead>
         {headerGroups.map(headerGroup => (
           <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                 {column.render('Header')}
                  <span>
                    {column.isSorted
                       ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                        : ''}
                 </span>
               </th>
             ))}
          </tr>
              ))}
          </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
                {row.cells.map((cell, index) => {
                    const column = headerGroups[0].headers[index];
                    const columnName = column.Header;

                    let cellContent = cell.render('Cell');

                    if (columnName === 'Текущий остаток') {
                        const value = cell.value;
                        const percentage = (value / 4000) * 100; 
                        const gradientColor = `linear-gradient(to right, #AFEEEE ${percentage}%, transparent ${percentage}%)`;

                        cellContent = (
                            <div style={{ background: gradientColor }}>
                                {cellContent}
                            </div>
                        );
                    }

                    return (
                        <td {...cell.getCellProps()}>{cellContent}</td>
                    );
                })}

            </tr>
        );
        })}
      </tbody>
      <tfoot>
      <tr className = "total-row" >
          <td>Всего</td>
          <td>
            {sortedData.reduce((total, row) => total + row.in_value, 0)}
          </td>
          <td>
            {sortedData.reduce((total, row) => total + row.out_value, 0)}
          </td>
          <td>
            {sortedData.reduce(
              (total, row) => total + row.currentBalance,
              0
            )}
          </td>
        </tr>
      </tfoot>
    </table>
  );
};

export default Graph5;
