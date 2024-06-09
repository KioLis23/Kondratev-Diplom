import React, { useState, useMemo } from "react";
import { useTable, useSortBy } from "react-table";

const Graph6 = ({ data }) => {
  const columns = useMemo(
    () => [
      {
        Header: "Продукт",
        accessor: "product_name",
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
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
 //  const [collapsed, setCollapsed] = useState(true);
  useMemo(() => {
    if (data.length === 0) {
      return;
    }

    let filteredData = data;

    let finalData = [];
    filteredData.forEach((item) => {
      const currentBalance =
        parseInt(item.value) + parseInt(item.in_value) - parseInt(item.out_value);
      const rowData = finalData.find(
        (data) => data.product_name === item.product_name
      );
      if (rowData) {
        rowData.out_value += parseInt(item.out_value);
        rowData.in_value += parseInt(item.in_value);
        rowData.value += parseInt(item.value);
        rowData.currentBalance += currentBalance;
      } else {
        finalData.push({
          product_name: item.product_name,
          out_value: parseInt(item.out_value),
          in_value: parseInt(item.in_value),
          value: parseInt(item.value),
          currentBalance,
        });
      }
    });

    setSortedData(finalData);
  }, [data]);

  const tableInstance = useTable(
    {
      columns,
      data: sortedData,
      initialState: {
        sortBy: [{ id: sortColumn, desc: sortDirection === "desc" }],
      },
    },
    useSortBy
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;

  const sortedDataCopy = [...sortedData];
  const handleSort = (column) => {
    if (column.canSort) {
      const newSortDirection = sortDirection === "desc" ? "asc" : "desc";
      setSortColumn(column.id);
      setSortDirection(newSortDirection);

      if (column.id === "currentBalance") {
        sortedDataCopy.sort((a, b) => {
          const currentBalanceA = a.currentBalance;
          const currentBalanceB = b.currentBalance;
        
          if (currentBalanceA === currentBalanceB) {
            return 0;
          }
        
          if (currentBalanceA < 0 && currentBalanceB < 0) {
            return newSortDirection === "asc" ? currentBalanceA - currentBalanceB : currentBalanceB - currentBalanceA;
          }
        
          if (currentBalanceA >= 0 && currentBalanceB >= 0) {
            return newSortDirection === "asc" ? currentBalanceA - currentBalanceB : currentBalanceB - currentBalanceA;
          }
        
          if (currentBalanceA < 0 && currentBalanceB >= 0) {
            return newSortDirection === "asc" ? 1 : -1;
          }
        
          return newSortDirection === "asc" ? -1 : 1;
        });
        
              
      }

      setSortedData(sortedDataCopy);
    }
  };


  const [visibleRows] = useState(23);
  const renderedRows = rows.slice(0, visibleRows);
  return (
    
    <table
    {...getTableProps()}
    className="custom-table"
    style={{
      position: "absolute",
      top: "100%",
      width: "25%",
      left: "47.1%",
      height: "20%",
      zIndex: 1,
      }}
      
    > <div
    className="my-container"
    style={{
      position: "absolute",
      top: "0%",
      left: "0%",
      width: "100%",
      height: `${visibleRows * 4.5}%`, 
      backgroundColor: "#EEEEEE",
      zIndex: -3,
    }}
  />
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th
                {...column.getHeaderProps(
                  column.canSort ? column.getSortByToggleProps() : null
                )}
                onClick={() => handleSort(column)}
              >
                {column.render("Header")}
                {column.canSort && (
                  <span>
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        " 🔽"
                      ) : (
                        " 🔼"
                      )
                    ) : (
                      ""
                    )}
                  </span>
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {renderedRows.map((row) => {
          prepareRow(row);
          return (
            
            <tr {...row.getRowProps()}>
              {row.cells.map((cell, index) => {
                const column = headerGroups[0].headers[index];
                const columnName = column.Header;

                let cellContent = cell.render("Cell");

                if (columnName === "Текущий остаток") {
                  const value = cell.value;
                  const percentage = (value / 450) * 100;
                  const gradientColor = `linear-gradient(to right, #AFEEEE ${percentage}%, transparent ${percentage}%)`;
                
                  cellContent = (
                    <div style={{ background: gradientColor }}>
                      {cellContent}
                    </div>
                  );
                }
                return <td {...cell.getCellProps()}>{cellContent}</td>;
                
              })}
            </tr>
            
          );
        })}
      </tbody>
      <tfoot>
        <tr className = "total-row" >
          <td>Всего</td>
          <td>{sortedData.reduce((total, row) => total + row.in_value, 0)}</td>
          <td>{sortedData.reduce((total, row) => total + row.out_value, 0)}</td>
          <td>
            {sortedData.reduce(
              (total, row) => total + parseInt(row.currentBalance),
              0
            )}
          </td>
        </tr>
                  <tr>
              {/* <td colSpan={columns.length} style={{ textAlign: 'center' }}>
                <button onClick={toggleCollapse}>
                  {collapsed ? "Развернуть" : "Свернуть"}
                </button>
              </td> */}
              
            </tr>
      </tfoot>
    </table>
    
  );
};

export default Graph6;
