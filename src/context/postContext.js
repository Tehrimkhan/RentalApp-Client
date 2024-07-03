import React, { createContext, useState, useEffect } from "react";
import { API } from "../api/config";

//CONTEXT
const PostContext = createContext();

const PostProvider = ({ children }) => {
  //state
  const [posts, setPosts] = useState([]);

  //get posts
  const getAllPosts = async () => {
    //const token = API.defaults.headers.common["Authorization"];
    //console.log(token);
    try {
      const { data } = await API.get(
        "/post/get-approved-posts"
        //, {
        //headers: {
        //  Authorization: token,
        //},
        // }
      );
      setPosts(data?.posts);
    } catch (error) {
      console.log(error);
    }
  };

  // callback function to update posts and trigger actions
  const updatePosts = async () => {
    await getAllPosts(); // fetch posts again
    // you can add more actions here if needed
  };

  // initial posts
  useEffect(() => {
    getAllPosts();
  }, []);

  return (
    <PostContext.Provider value={[posts, setPosts, updatePosts]}>
      {children}
    </PostContext.Provider>
  );
};

export { PostContext, PostProvider };
