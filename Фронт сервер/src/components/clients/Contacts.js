import React from 'react';
import { Link } from 'react-router-dom';

class Contacts extends React.Component {
    render() {
        const { contacts } = this.props;
        return (
            <div className="contacts-container">
                <h2 className="contacts-heading">Список клиентов</h2>
                <div className="contacts-list">
                    {contacts.map((contact, index) => (
                        <div key={index} className="contact-item">
                            <p>Имя: {contact.fullname}</p>
                            <p>Email: {contact.email}</p>
                            {/* <p>Username: {contact.username}</p> */}
                            <Link to={`/Профиль/${contact.username}`}>Просмотр данных   <i class='bx bxs-user-check'></i></Link>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default Contacts;
