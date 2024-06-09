import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom'; 
import "./login.css";

const Signin = ({ onLogin, history, onProfileLogin, }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [accounts, setAccounts] = useState([]);

    const handleLogin = (event) => {
        event.preventDefault();
        const account = accounts.find(acc => acc.username === username && acc.password === password);
        if (account) {
            const { fullname, address, email,education,school,college,university,username } = account;
            
            onLogin(fullname);
            history.push('/');
        
            onProfileLogin(fullname, email, address,education,school,college,university,username);
        }
        
         else {
            setError("Invalid username or password");
        }
    }
    

    useEffect(() => {
        fetch("http://127.0.0.1:8080/api/login/")
            .then((response) => response.json())
            .then((data) => {
                setAccounts(data);
            })
            .catch((error) => {
                console.error('Error fetching actions data:', error);
            });
    }, []);

    return (
        <div className="login">
            <h4>Авторизация</h4>
            <form onSubmit={handleLogin}>
                <div className="text_area">
                    <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder="Username"
                        className="text_input"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="text_area">
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Password"
                        className="text_input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <input
                    type="submit"
                    value="LOGIN"
                    className="btn"
                />
            </form>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
}

export default withRouter(Signin);
