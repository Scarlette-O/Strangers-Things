import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreatePost = ({ token }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [location, setLocation] = useState('')
    const [willDeliver, setWillDeliver] = useState(false)
    const navigate = useNavigate()

    const handleCreatePost = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch("https://strangers-things.herokuapp.com/api/2303-FTB-ET-WEB-PT/posts", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    post: {
                        title,
                        description,
                        price,
                        location,
                        willDeliver
                    }
                })
            })
            const data = await response.json()
            console.log(data)
            if (data.success) {
                navigate('/profile')
            }
            return data
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className='create-post'>
            <h1 className='create-post-form'>CreatePost</h1>
            <form onSubmit={handleCreatePost}>
                <label className='create-post-title'>
                    Title:
                    <input type='text' value={title} onChange={(event) => setTitle(event.target.value)} className='create-title-input' />
                </label>
                <label className='create-post-description'>
                    Description:
                    <input type='text' value={description} onChange={(event) => setDescription(event.target.value)} className='create-description-input' />
                </label>
                <label className='create-post-price'>
                    Price:
                    <input type='text' value={price} onChange={(event) => setPrice(event.target.value)} className='create-price-input' />
                </label>
                <label className='create-post-location'>
                    Location:
                    <input type='text' value={location} onChange={(event) => setLocation(event.target.value)} className='create-location-input' />
                </label>
                <label className='create-post-delivery'>
                    Will Deliver?
                    <input type='checkbox' checked={willDeliver} onChange={(event) => setWillDeliver(event.target.checked)} className='create-delivery-input' />
                </label>
                <button className='create-post-button' type="submit">Create Post</button>
            </form>
        </div>
    );
};




export default CreatePost;