import React, { useState, useEffect } from 'react';
import Loading from '../Loading/loading';
import Graph6 from './Graph6'; 
import Graph1 from './Graph1';
import Graph3 from './Graph3';
import Graph4 from './Graph4';
import { parseISO, getYear } from 'date-fns';


const Warehouse = () => {
    const [data, setData] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedYear, setSelectedYear] = useState("2018");


  const handleCategoryChange1 = (e) => {
    setSelectedWarehouse(e.target.value)
  };
  const handleCategoryChange3 = (e) => {
    setSelectedType(e.target.value)
  };
  const handleCategoryChange4 = (e) => {
    setSelectedCompany(e.target.value)
  };
  const handleCategoryChange5 = (e) => {
    setSelectedYear(e.target.value)
  };

    useEffect(() => {
        fetch("http://127.0.0.1:8080/api/data/")
          .then((response) => response.json())
          .then((result) => {
            setData(result);
            console.log(result);
          });
      }, []);
      let filteredData = data;

      if (selectedWarehouse) {
        filteredData = filteredData.filter((item) => item.warehouse_name === selectedWarehouse);
      }
      if (selectedYear.length > 0) {
        filteredData = filteredData.filter((item) => {
          const itemDate1 = parseISO(item.date);
          const itemYear = getYear(itemDate1);
          return itemYear === parseInt(selectedYear);

        });
      }
      if (selectedType) {
        filteredData = filteredData.filter((item) => item.movement_type === selectedType);
      }
      if (selectedCompany) {
        filteredData = filteredData.filter((item) => item.company_name
        === selectedCompany);
      }


    return (<>
        <div>
            <h2>Список складов</h2>
            {filteredData.length > 0 ? (
                <div>
                    <Graph6 data={filteredData} />
                    <Graph1 data={filteredData} />
                    <Graph3 data={filteredData} />
                    <Graph4 data={filteredData} />
                    <select
            value={selectedWarehouse}
            onChange={handleCategoryChange1}
            style={{ width: "10%", fontSize: "125%",top: "10%",right: "15%", position: "absolute" }}
          >
            <option value="">Все склады</option>
            <option value="HHPHL">HHPHL</option>
            <option value="RBPVS">RBPVS</option>
        </select>
        
        <select
            value={selectedYear}
            onChange={handleCategoryChange5}
            style={{ width: "10%", fontSize: "125%",top: "10%",right: "5%", position: "absolute" }}
          >
            <option value="2018">2018</option>
            <option value="2019">2019</option>
            <option value="2020">2020</option>
            <option value="2021">2021</option>
        </select>

        <select
            value={selectedType}
            onChange={handleCategoryChange3}
            style={{ width: "10%", fontSize: "125%",top: "10%",right: "25%", position: "absolute" }}
          >
            <option value="">Перемещение</option>
            <option value="True">True</option>
            <option value="False">False</option>
        </select>

        <select
            value={selectedCompany}
            onChange={handleCategoryChange4}
            style={{width: "10%", fontSize: "125%",top: "10%",right: "35%", position: "absolute",  }}
          >
            <option value="">Все компании</option>
            <option value="PUZNW">PUZNW</option>
            <option value="GOTFH">GOTFH</option>
            
        </select>

                </div>
            ) : (
                <Loading />
            )}
        </div>
        </>);
};

export default Warehouse;
