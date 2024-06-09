import React, { useState } from 'react';
import csvtojson from 'csvtojson';
import './neuro.css';  // Импорт файла стилей
import jsPDF from 'jspdf';

const NeuroComponent = () => {
    const [fileData, setFileData] = useState(null);
    const [anomalies, setAnomalies] = useState(null);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        
        reader.onload = async (event) => {
            try {
                const csvData = event.target.result;
                const jsonData = await csvtojson().fromString(csvData);
                setFileData(jsonData);
            } catch (error) {
                console.error('Error reading the file:', error);
            }
        };

        reader.readAsText(file);
    };

    const handleCheckAnomalies = async () => {
        if (!fileData) {
            alert("Пожалуйста, загрузите файл");
            return;
        }
        
        try {
            const response = await fetch('http://localhost:5000/detect_anomalies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(fileData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            setAnomalies(result);
            console.log(result);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    const generatePDF = () => {
        if (!anomalies) {
            alert("Аномалии не обнаружены");
            return;
        }
    
        const doc = new jsPDF();
        doc.text('Обнаруженные Аномалии:', 10, 10);
        let yOffset = 20;
    
        anomalies.forEach((anomaly, index) => {
            const text = JSON.stringify(anomaly, null, 2);
            const lines = doc.splitTextToSize(text, 180);
            lines.forEach(line => {
                doc.text(line, 10, yOffset);
                yOffset += 7; 
                if (yOffset >= 270) { 
                    doc.addPage(); 
                    yOffset = 20; 
                }
            });
            doc.line(10, yOffset, 200, yOffset); 
            yOffset += 5; 
            if (yOffset >= 270) { 
                doc.addPage(); 
                yOffset = 20;
            }
        });
    
        doc.save('anomalies_report.pdf');
    };
    
    
    

    return (
        <div className="container">
            <h1>Обнаружение аномалий</h1>
            <input type="file" accept=".csv" onChange={handleFileUpload} />
            <button onClick={handleCheckAnomalies}>Проверить аномалии</button>
            {anomalies && (
                <div className="anomalies">
                    <h2>Обнаруженные Аномалии:</h2>
                    {anomalies.map((anomaly, index) => (
                        <div key={index} className="anomaly-item">
                            <pre>{JSON.stringify(anomaly, null, 2)}</pre>
                        </div>
                    ))}
                </div>
            )}
            {anomalies && (
                <button onClick={generatePDF}>Создать отчет в формате PDF</button>
            )}
        </div>
    );
};

export default NeuroComponent;
