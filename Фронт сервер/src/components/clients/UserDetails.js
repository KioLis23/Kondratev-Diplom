import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import './userDetails.css'; 

const UserDetails = ({ match }) => {
    const [user, setUser] = useState(null);
    const { username } = match.params; 

    useEffect(() => {
        if (username !== undefined) {
            fetch(`http://127.0.0.1:8080/api/clients/`)
                .then(response => response.json())
                .then(result => {
                    const foundUser = result.find(user => user.username === username);
                    if (foundUser) {
                        setUser(foundUser);
                    } else {
                        console.error('User not found');
                    }
                })
                .catch(error => console.error('Error fetching user data:', error));
        }
    }, [username]);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="user-details-container">
            <h2 className="user-details-title">Информация о клиенте</h2>
            <div className="user-details-info">
                <p>Полное имя: {user.fullname}</p>
                <p>Email: {user.email}</p>
                <p>Адрес: {user.address}</p>
            </div>
        </div>
    );
};

export default withRouter(UserDetails);
