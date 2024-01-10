import React from "react";
import Posts from "./Posts";


const Home = ({ token, posts, setPosts, isLoading, setIsLoading, showModal, setShowModal, loggedIn }) => {

    return (

        <div className='Home'>
            <Posts token={token} posts={posts} setPosts={setPosts} isLoading={isLoading} setIsLoading={setIsLoading} showModal={showModal} setShowModal={setShowModal}
                loggedIn={loggedIn} />
        </div>
    )
}

export default Home;