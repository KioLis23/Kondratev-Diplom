import React, { Component, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import './style/App.css';
import NavBar from './components/navbar/navbar';
import Loading from './components/Loading/loading';
import Home from './components/home/home';
import SideMenu from './SideMenu/SideMenu';
import Login from './login/login';
import Profile from './components/profile/profile';
import Blog from './components/blog/blog';
import UserDetails from './components/clients/UserDetails';
// import UserList from './components/blog/UserList';
// import UserBlogPage from './components/blog/UserBlogPage';
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isMenuVisible: true,
            isAuthenticated: false,
            loggedInUser: null,
        };
    }

    toggleMenu = () => {
        this.setState(prevState => ({
            isMenuVisible: !prevState.isMenuVisible
        }));
    }

    handleLogin = (fullname) => {
        this.setState({ isAuthenticated: true, loggedInUser: fullname}); 
    }

    onProfileLogin = (fullname, email, address,education,school,college,university,username) => {
        this.setState(prevState => ({
            isAuthenticated: true,
            fullname: fullname,
            email: email,
            address: address,
            education: education,
            school:school,
            college:college,
            university:university,
            username: username
        }));
    }


    handleLogout1=() => {
        this.setState({ isAuthenticated: false,loggedInUser: null, fullname: null, email: null, address: null,education: null,school: null,college: null,university: null }); 
    }
    handleLogout = () => {
        this.setState({ isAuthenticated: false, loggedInUser: null }); 
    }

    currentUser1 = () => {
        this.setState({ fullname: null }); 
    }

    render() {
        const { isMenuVisible, isAuthenticated, loggedInUser,fullname,email,address,education,school,college,university,username} = this.state;

        return (
            <Router>
                <div className='App'>
                    <NavBar />
                    <div className={`side-menu ${isMenuVisible ? 'side-menu-visible' : ''}`}>
                        <SideMenu onToggleMenu={this.toggleMenu} />
                    </div>
                    <div className="side-menu-toggle" onClick={this.toggleMenu}>
                        {isMenuVisible ? <i class='bx bx-menu'></i> : <i class='bx bx-menu'></i>}
                    </div>
                    <Suspense fallback={() => <Loading />}>
                        <Route
                            path='/'
                            exact
                            render={() => <Home loggedInUser={loggedInUser} />}
                        />
                        <Route
                            path='/Авторизация'
                            exact
                            render={() => <Login onLogin={this.handleLogin} onProfileLogin={this.onProfileLogin} />}
                        />
                        {isAuthenticated ? (
                            <>
                            <Route
                                path='/Профиль'
                                exact
                                render={() => <Profile fullname={fullname} email={email} address={address} education={education} school={school} college={college} university={university} handleLogout1={this.handleLogout1}/>}
                            />
                            <Route
                                path='/Клиенты'
                                exact
                                component={lazy(() => import('./components/clients/clients'))}
                            />
                            <Route
                                path='/Действия'
                                exact
                                component={lazy(() => import('./components/actions/actions'))}
                            />
                            <Route
                                path='/Аналитика'
                                exact
                                component={lazy(() => import('./components/analytics/analytics'))}
                            />
                            <Route
                                path='/Отчетность'
                                exact
                                component={lazy(() => import('./components/otchet/otchet'))}
                            />
                            <Route
                                path='/Склады'
                                exact
                                component={lazy(() => import('./components/Warehouse/Warehouse'))}
                            />
                            <Route
                                path='/Продажи'
                                exact
                                component={lazy(() => import('./components/Sales/Sales'))}
                            />
                            <Route
                                path='/Отгрузки'
                                exact
                                component={lazy(() => import('./components/Shipments/Shipments'))}
                            />
                            <Route
                                path='/Обратная Связь'
                                exact
                                component={lazy(() => import('./components/Feedback/Feedback'))}
                            />
                            <Route
                                path='/Нейро'
                                exact
                                component={lazy(() => import('./components/neuro/neuro'))}
                            />
                            <Route
                                path='/Блог'
                                exact
                                render={() => <Blog fullname={fullname} username={username} />}
                            />
                            <Route
                                path='/Профиль/:username'
                                exact
                                render={(props) => <UserDetails username={props.match.params.username} />}
                            />
                            {/* <Route path="/Блог/:username" component={UserBlogPage} /> */}
                        </>
                    ) : (
                            <Redirect to={{ pathname: '/Авторизация', state: { from: this.props.location } }} />
                        )}
                    </Suspense>
                </div>
            </Router>
        );
    }
}

export default App;
