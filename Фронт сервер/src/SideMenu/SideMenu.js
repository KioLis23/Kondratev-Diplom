import React, { Component } from 'react';
import './SideMenu.css';
import { withRouter } from 'react-router-dom';

class SideMenu extends Component {
    handleClick = (event, path) => {
        event.preventDefault();
        this.props.history.push(path); 
    }

    render() {
        return (
            <div className={`side-menu ${this.props.isMenuVisible ? 'side-menu-visible' : ''}`}>
                <ul>
                    <li><a href='/' onClick={(e) => this.handleClick(e, '/')}><i class='bx bxs-home-heart' ></i>Главная</a></li>
                    <li><a href='/Клиенты' onClick={(e) => this.handleClick(e, '/Клиенты')}><i class='bx bx-male-female' ></i>  Клиенты</a></li>
                    <li><a href='/Действия' onClick={(e) => this.handleClick(e, '/Действия')}><i class='bx bxs-factory' ></i>  Действия</a></li>
                    <li><a href='/Аналитика' onClick={(e) => this.handleClick(e, '/Аналитика')}><i class='bx bxs-analyse' ></i>  Аналитика</a></li>
                    <li><a href='/Отчетность' onClick={(e) => this.handleClick(e, '/Отчетность')}><i class='bx bxs-contact' ></i>  Отчетность</a></li>
                    <li><a href='/Склады' onClick={(e) => this.handleClick(e, '/Склады')}><i class='bx bx-building-house' ></i>  Склады</a></li>
                    <li><a href='/Продажи' onClick={(e) => this.handleClick(e, '/Продажи')}><i class='bx bxs-wallet-alt' ></i>  Продажи</a></li>
                    <li><a href='/Отгрузки' onClick={(e) => this.handleClick(e, '/Отгрузки')}><i class='bx bxs-check-square' ></i>  Отгрузки</a></li>
                    <li><a href='/Обратная Связь' onClick={(e) => this.handleClick(e, '/Обратная Связь')}><i class='bx bx-wifi-off' ></i>  Обратная Связь</a></li>
                    <li><a href='/Профиль' onClick={(e) => this.handleClick(e, '/Профиль')}><i class='bx bxs-user-pin' ></i>  Профиль</a></li>
                    <li><a href='/Блог>' onClick={(e) => this.handleClick(e, '/Блог')}> Блог</a></li>
                    <li><a href='/Нейро>' onClick={(e) => this.handleClick(e, '/Нейро')}> Нейро</a></li>
                </ul>
            </div>
        );
    }
}

export default withRouter(SideMenu);
