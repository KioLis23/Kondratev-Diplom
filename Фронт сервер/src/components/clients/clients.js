import React, { useState, useEffect } from 'react';
import Contacts from './Contacts'; 
import './clients.css';

function Clients() {
    const [clients, setClients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetch("http://127.0.0.1:8080/api/clients/")
          .then((response) => response.json())
          .then((result) => {
            setClients(result);
            console.log(result);
          });
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredClients = searchTerm.trim() === '' ? clients : clients.filter(client =>
        client.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    

    return (
        <div className="app-container">
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Введите букавы..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>
            <Contacts contacts={filteredClients} />
        </div>
    );
}

export default Clients;
