
import React, { useState, useEffect } from 'react';
import Loading from '../Loading/loading';
const Feedback = () => {
    const [clients, setClients] = useState([]);

    useEffect(() => {
        fetch("http://127.0.0.1:8080/api/data")
            .then((response) => response.json())
            .then((data) => {
                setClients(data);
            })
            .catch((error) => {
                console.error('Error fetching Sales:', error);
            });
    }, []);

    return (
        <div>
            <h2>Какая связь? Тут только загрузка</h2>
            {clients.length > 0 ? (
                <ul>
                    {clients.map((client, index) => (
                        <li key={index}>
                            {client.name} - {client.email}
                        </li>
                    ))}
                </ul>
            ) : (
                <Loading />
            )} 
        </div>
    );
};

export default Feedback;
