import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import LoadingModal from "./LoadingModal";

const Profile = ({ currentUser, setCurrentUser, isLoading, setIsLoading, userPosts, setUserPosts, showModal, setShowModal }) => {
    const [userMessages, setUserMessages] = useState([])
    const [selectedPost, setSelectedPost] = useState(null)
    const [showMessageList, setShowMessageList] = useState(false)


    const token = localStorage.getItem('token')

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch("https://strangers-things.herokuapp.com/api/2303-FTB-ET-WEB-PT/users/me", {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })
                const data = await response.json();
                setCurrentUser(data.data.username)
                const activePosts = data.data.posts.filter(post => post.active === true)
                setUserPosts(activePosts)
                setUserMessages(data.data.messages)
                console.log(data);
                setIsLoading(false)
                return data
            } catch (err) {
                console.error(err);
            }
        }
        fetchUserData()
    }, [])

    const handlePostClick = (event, userPost) => {
        event.preventDefault()
        setSelectedPost(userPost)
    }

    const handleCloseClick = () => {
        setSelectedPost(null)
    }

    // const getReceivedMessages = () => {
    //     return userMessages.filter(message =>
    //         message.post.author.username === currentUser
    //     )
    // }

    const getSentMessages = () => {
        return userMessages.filter(message =>
            message.fromUser.username === currentUser
        )
    }

    const toggleMessageList = () => {
        setShowMessageList(!showMessageList)
    }

    const deletePost = async () => {
        try {
            const response = await fetch(`https://strangers-things.herokuapp.com/api/2303-FTB-ET-WEB-PT/posts/${selectedPost._id}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const result = await response.json();
            const updatedPosts = userPosts.filter(userPost =>
                userPost._id !== selectedPost._id)
            setUserPosts(updatedPosts)
            setSelectedPost(null)
            console.log(result);
            return result
        } catch (err) {
            console.error(err);
        }
    }

    const confirmDelete = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const handleDelete = () => {
        deletePost()
        setShowModal(false);
    };

    const messageLink = () => {
        const postUrl = `${message.post._id}`
    }

    if (isLoading) {
        return <LoadingModal />
    }


    else {
        return (
            <div className='user-profile'>
                <h1 className="profile-header">Profile</h1>
                <h2 className="current-user-username">{currentUser}</h2>
                <h3>POSTS</h3>
                {selectedPost && (
                    <div className="profile-post-view">
                        <h3 className="profile-post-title">{selectedPost.title}</h3>
                        <div className="profile-post-price">Price: {selectedPost.price}</div>
                        <div className="profile-post-location">Location: {selectedPost.location}</div>
                        <div className="profile-post-delivery">
                            {selectedPost.willDeliver ? (
                                <div>Delivery ? Yes.</div>
                            ) : (
                                <div>Delivery? No.</div>
                            )}
                        </div>
                        <div className="profile-post-description">Description: {selectedPost.description}</div>
                        <div className="profile-post-created">Post Created At: {selectedPost.createdAt}</div>
                        <div className="profile-post-updated">Post Updated At: {selectedPost.updatedAt}</div>
                        {selectedPost && (
                            <>
                                <h3 className="profile-messages">MESSAGES</h3>
                                <button onClick={toggleMessageList} className="profile-messages-button">{showMessageList ? 'Hide Messages' : 'Show Messages'}</button>
                            </>
                        )}
                        {showMessageList && (
                            selectedPost.messages.map(message => (
                                <div key={message['_id']} value={message} className='message'>
                                    <div className='message-author'>{message.fromUser.username}</div>
                                    <div className='message-content'>{message.content}</div>
                                </div>
                            ))
                        )
                        }
                        <button type='button' className='profile-post-delete' onClick={confirmDelete}>DELETE</button>
                        {
                            showModal && (
                                <div className="profile-modal-background">
                                    <div className="profile-modal-container">
                                        <h3>Are you sure you want to delete this post?</h3>
                                        <button onClick={handleDelete} className="profile-modal-confirm">Yes</button>
                                        <button onClick={closeModal} className="profile-modal-cancel">No</button>
                                    </div>
                                </div>
                            )
                        }
                        <Link to='/profile' className='profile-post-close' onClick={handleCloseClick}><button>Close</button></Link>
                    </div>
                )}

                {!selectedPost &&
                    userPosts.map(userPost =>
                        <div className='profile-posts' key={userPost['_id']} value={userPost}>
                            <Link to={`/profile/${userPost._id}`} className="profile-post-open" onClick={(event) => handlePostClick(event, userPost)}><h4>{userPost.title}</h4></Link>
                            <div className="profile-posts-price">Price: {userPost.price}</div>
                            <div className="profile-posts-location">Location: {userPost.location}</div>
                            <div className="profile-posts-delivery">
                                {userPost.willDeliver ? (
                                    <div>Delivery ? Yes.</div>
                                ) : (
                                    <div>Delivery? No.</div>
                                )}
                            </div>
                            <div className="profile-posts-description">Description: {userPost.description}</div>
                            <div className="profile-posts-created">Post Created At: {userPost.createdAt}</div>
                            <div className="profile-posts-updated">Post Updated At: {userPost.updatedAt}</div>
                        </div>
                    )}
                {!selectedPost && (
                    <ul className="message-list">
                        <div className="profile-sent-messages">MESSAGES FROM ME:</div>
                        {getSentMessages().map(message =>
                            <div key={message._id} value={message} className="sent-messages-container">
                                <h4 className="messages-from-user">TO: {message.post.author.username}</h4>
                                <a href={`${messageLink}`}> <div className="user-messages-title">POST: {message.post.title} </div></a>
                                <div className="user-messages-content">{message.content}</div>
                            </div>
                        )}
                    </ul>
                )}
            </div>
        )
    }

}


export default Profile;