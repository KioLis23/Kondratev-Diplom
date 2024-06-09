import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import './blog.css';
import '../clients/UserDetails'
const Blog = ({ fullname, username }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        fetch("http://127.0.0.1:8080/api/messages/")
            .then((response) => response.json())
            .then((data) => {
                setMessages(data.reverse()); 
            })
            .catch((error) => {
                console.error('Error fetching messages data:', error);
            });
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (newMessage.trim() === "") {
            alert("Введите ваше сообщение");
            return;
        }
        fetch("http://127.0.0.1:8080/api/messages/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                author: fullname,
                message: newMessage,

            })
        })
        .then(response => response.json())
        .then(data => {
            fetch("http://127.0.0.1:8080/api/messages/")
                .then((response) => response.json())
                .then((data) => {
                    setMessages(data.reverse()); 
                    setNewMessage("");
                })
                .catch((error) => {
                    console.error('Error fetching messages data:', error);
                });
        })
        .catch(error => console.error('Error adding message:', error));
    };

    return (
        <div className="blog">
            <h2>Добро пожаловать в общий чат</h2>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Введите ваше сообщение..."
                    rows="4"
                    cols="50"
                />
                <br />
                <button type="submit">Отправить!</button>
            </form>
            <div className="messages">
                {messages.map((msg, index) => (
                    <div className="message">
    <p className="author"><Link to={`/Блог/${msg.author}`}>{msg.author}</Link>:</p>
    <div className="text">{msg.message}</div>
</div>

                ))}
            </div>
        </div>
    );
};

export default Blog;
