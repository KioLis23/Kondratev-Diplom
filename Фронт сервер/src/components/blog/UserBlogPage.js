import React, { useState, useEffect } from 'react';
import UserBlog from './UserBlog';

const UserBlogPage = ({ match }) => {
    const [username, setUsername] = useState("");
    useEffect(() => {
        setUsername(match.params.username);
    }, [match.params.username]);

    return (
        <div>
            <h1>Блог пользователя {username}</h1>
            <UserBlog username={username} />
        </div>
    );
};

export default UserBlogPage;
