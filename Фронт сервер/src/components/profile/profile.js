

import React from 'react';
import './profile.css';

class Profile extends React.Component {
    render() {
        const { fullname, email, address, school, college, university, handleLogout1 } = this.props; 
        return (
            <div className="profile-container">
                <h2 className="profile-heading">Профиль пользователя: {fullname}</h2>
                <div className="profile-info">
                    <p>Email: {email}</p>
                    <p>Адрес: {address}</p>
                </div>
                {school && (
                    <div className="education-block">
                        <h3 className="education-heading">Школа</h3>
                        <div className="profile-info">
                            <p>{school.name}</p>
                            <p>Год начала: {school.start_year}</p>
                            <p>Год окончания: {school.end_year}</p>
                        </div>
                    </div>
                )}
                {college && (
                    <div className="education-block">
                        <h3 className="education-heading">Колледж</h3>
                        <div className="profile-info">
                            <p>{college.name}</p>
                            <p>Год начала: {college.start_year}</p>
                            <p>Год окончания: {college.end_year}</p>
                        </div>
                    </div>
                )}
                {university && (
                    <div className="education-block">
                        <h3 className="education-heading">Университет</h3>
                        <div className="profile-info">
                            <p>{university.name}</p>
                            <p>Год начала: {university.start_year}</p>
                            <p>Год окончания: {university.end_year}</p>
                        </div>
                    </div>
                )}
                <button className="button-logout" onClick={handleLogout1}>Выйти</button> 
            </div>
        );
    }
}

export default Profile;
