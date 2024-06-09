import React, { useState, useEffect } from 'react';
// import Loading from '../Loading/loading';
import TransferForm from './TransferForm';
import './TransferForm.css';

const Actions = () => {
    const [data, setData] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [activeRequests, setActiveRequests] = useState([]);

    useEffect(() => {
        fetch("http://127.0.0.1:8080/api/data/")
            .then((response) => response.json())
            .then((result) => {
                setData(result);
                console.log(result);
            });
        const savedRequests = localStorage.getItem('activeRequests');
        if (savedRequests) {
            setActiveRequests(JSON.parse(savedRequests));
        }
    }, []);
    const handleOpenForm = () => {
        setIsFormOpen(true);
    };
    const handleCloseForm = () => {
        setIsFormOpen(false);
    };
    const handleSaveRequest = (formData) => {
        const updatedRequests = [...activeRequests, formData];
        setActiveRequests(updatedRequests);
        localStorage.setItem('activeRequests', JSON.stringify(updatedRequests));
    };
    return (
        <div className="actions-container">
            <div className="request-section">
                <h2>Действия</h2>
                <button className="create-request-button" onClick={handleOpenForm}>Создать заявку на перевод товара</button>
                {isFormOpen && (
                    <TransferForm onClose={handleCloseForm} onSave={handleSaveRequest} data={data} />
                )}
            </div>
            <div className="active-requests-section">
                <h2>Активные заявки</h2>
                {activeRequests.length > 0 ? (
                    <ul>
                        {activeRequests.map((request, index) => (
                            <li key={index}>
                                Наименование продукта: {request.product_name} - Склад отгрузки: {request.warehouse_name_from} -  Склад поступления: {request.warehouse_name_to} - Количество: {request.value} - Дата: {request.date}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Нет активных заявок</p>
                )}
            </div>
        </div>
    );
};

export default Actions;
