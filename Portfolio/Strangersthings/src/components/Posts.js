import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingModal from './LoadingModal';

const Posts = ({ token, posts, setPosts, isLoading, setIsLoading, showModal, setShowModal, loggedIn }) => {
    const [selectedPost, setSelectedPost] = useState(null)
    const [content, setContent] = useState('');
    const [searchTerm, setSearchTerm] = useState('')
    const [showUserMessages, setShowUserMessages] = useState(false)

    useEffect(() => {
        async function fetchPosts() {
            const response = await fetch('https://strangers-things.herokuapp.com/api/2303-FTB-ET-WEB-PT/posts', {
                headers: {
                    'Content-Type': 'applicaiton/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            const data = await response.json()
            console.log(data)
            setPosts(data.data.posts)
            setIsLoading(false)
        }
        fetchPosts()
    }, [])


    function postMatches(post) {
        return post.title.toLowerCase().includes(searchTerm) || post.description.toLowerCase().includes(searchTerm) || post.price.toLowerCase().includes(searchTerm)
            || post.location.toLowerCase().includes(searchTerm)
            || post.author.username.toLowerCase().includes(searchTerm)
    }

    const filteredPosts = posts.filter((post => searchTerm.length > 0 ? postMatches(post, searchTerm) : true))
    const postsToDisplay = searchTerm.length > 0 ? filteredPosts : posts

    const handleClearButtonClick = () => {
        setSearchTerm('')
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
            console.log(result);
            const updatedPosts = posts.filter(post =>
                post._id !== selectedPost._id)
            setPosts(updatedPosts)
            setSelectedPost(null)
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


    const handlePostClick = (post) => {
        setSelectedPost(post)
    }

    const handleCloseClick = () => {
        setSelectedPost(null)
    }

    const togglePostMessageList = () => {
        setShowUserMessages(!showUserMessages)
    }

    const handleMessageChange = (event) => {
        setContent(event.target.value);
    }

    const postMessage = async (event) => {
        event.preventDefault()
        try {
            const response = await fetch(`https://strangers-things.herokuapp.com/api/2303-FTB-ET-WEB-PT/posts/${selectedPost._id}/messages`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    message: {
                        content
                    }
                })
            });
            const data = await response.json();
            console.log(data);
            if (data.success) {
                alert('Message Sent!')
            }
            setContent('')
            return data
        } catch (err) {
            console.error(err);
        }
    }

    if (isLoading) {
        return <LoadingModal />
    }
    else {
        return (
            <div className='posts-feed-container'>
                {selectedPost && (
                    <div className='post-details'>
                        <h3 className='post-title'>{selectedPost.title}</h3>
                        <div className='post-seller'>Seller: {selectedPost.author.username}</div>
                        <div className='post-price'>Price: {selectedPost.price}</div>
                        <div className='post-location'>Location: {selectedPost.location}</div>
                        {selectedPost.willDeliver ? (
                            <div className='post-delivery'>Delivery ? Yes.</div>
                        ) : (
                            <div className='post-delivery'>Delivery? No.</div>
                        )}
                        <div className='post-description'>Description: {selectedPost.description}</div>
                        <div className='post-created-at'>Post Created At: {selectedPost.createdAt}</div>
                        <div className='post-updated-at'>Post Updated At: {selectedPost.updatedAt}</div>
                        <div className='user-messages-container'>
                            {selectedPost && selectedPost.isAuthor && (
                                <>
                                    <h3 className="users-post-messages">MESSAGES</h3>
                                    <button onClick={togglePostMessageList} className="post-messages-button">{showUserMessages ? 'Hide Messages' : 'Show Messages'}</button>
                                </>
                            )}

                            {
                                selectedPost.isAuthor && showUserMessages ? (

                                    selectedPost.messages.map(message => (
                                        <div key={message['_id']} value={message} className='message'>
                                            <div className='message-author'>{message.fromUser.username}</div>
                                            <div className='message-content'>{message.content}</div>

                                        </div>

                                    )
                                    )
                                ) : (
                                    null
                                )
                            }
                        </div>
                        {
                            selectedPost.isAuthor ? (
                                <button type='button' onClick={confirmDelete} className='post-delete-button'>DELETE</button>
                            ) : (
                                null
                            )
                        }
                        {
                            showModal && (
                                <div className="modal-background">
                                    <div className="modal-container">
                                        <h3>Are you sure you want to delete this post?</h3>
                                        <button onClick={handleDelete} className="modal-confirm-button">Yes</button>
                                        <button onClick={closeModal} className="modal-cancel-button">No</button>
                                    </div>
                                </div>
                            )
                        }

                        {loggedIn && !selectedPost.isAuthor ? (
                            <div className="message-box-container">
                                <h4 className='message-box-title'>Send a message to the post author:</h4>
                                <form onSubmit={(event) => postMessage(event, selectedPost['_id'])}>
                                    <textarea
                                        value={content}
                                        onChange={handleMessageChange}
                                        placeholder="Enter your message"
                                        className='message-box'
                                    />
                                    <br />
                                    <button type="submit" className='message-box-button'>Send message</button>
                                </form>
                            </div>
                        ) : (
                            null
                        )
                        }
                        <Link to='*' onClick={handleCloseClick} className='message-box-close'><button>Close</button></Link>
                    </div>
                )}
                {!selectedPost &&
                    <div className='search-bar'>
                        <input type='text' placeholder='Search...' value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} className='search-bar-input' />
                        {searchTerm && (
                            <button className='clear-button' onClick={handleClearButtonClick}>&#x2716;</button>
                        )}
                    </div>}
                {!selectedPost &&
                    postsToDisplay.map((post) => (
                        <div key={post._id} value={post} className='post-feed-container'>
                            <Link
                                to={`/posts/${post._id}`}
                                onClick={() => handlePostClick(post)}
                                className='post-feed-titles'
                            >
                                {post.title}
                            </Link>
                            <div className='post-feed-seller'>Seller: {post.author.username}</div>
                            <div className='post-feed-price'>Price: {post.price}</div>
                            <div className='post-feed-location'>Location: {post.location}</div>
                            {post.willDeliver ? (
                                <div className='post-feed-delivery'>Delivery ? Yes.</div>
                            ) : (
                                <div className='post-feed-delivery'>Delivery? No.</div>
                            )}
                            <div className='post-feed-description'>Description: {post.description}</div>
                            <div className='post-feed-created'>Post Created At: {post.createdAt}</div>
                            <div className='post-feed-updated'>Post Updated At: {post.updatedAt}</div>
                        </div>
                    ))
                }
            </div >
        )
    }
}



export default Posts;