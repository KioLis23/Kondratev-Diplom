import React, { useState, useEffect } from 'react';
import '../../style/home.css';
import Moment from 'moment';

const Home = ({ loggedInUser }) => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const getGreeting = () => {
        const hour = currentTime.getHours();

        if (hour <= 18 && hour >= 12) {
            return "Дня";
        } else if (hour < 12 && hour >= 6) {
            return "Утра";
        } else {
            return "Вечера";
        }
    }

    const greeting = getGreeting();

    const redirectToLoginPage = () => {
        window.location.href = 'http://localhost:3000/Авторизация';
    };

    return (
        <div id="home">
            {loggedInUser ? (
                <>
                    <h1>Добрейшего {greeting}, {loggedInUser}!</h1>
                    <p className="time">{Moment(currentTime).format('HH:mm')}</p>
                    <div className="sk-folding-cube">
                        <div className="sk-cube1 sk-cube"></div>
                        <div className="sk-cube2 sk-cube"></div>
                        <div className="sk-cube4 sk-cube"></div>
                        <div className="sk-cube3 sk-cube"></div>
                    </div>
                </>
            ) : (
                <>
                    <h1>Добрейшего {greeting}, Авторизируйтесь!</h1>
                    <button className="button-logout" onClick={redirectToLoginPage}>Войти</button> 
                    <div className="sk-folding-cube">
                        <div className="sk-cube1 sk-cube"></div>
                        <div className="sk-cube2 sk-cube"></div>
                        <div className="sk-cube4 sk-cube"></div>
                        <div className="sk-cube3 sk-cube"></div>
                    </div>
                </>
            )}
        </div>
    );    
}

export default Home;
