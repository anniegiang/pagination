import React, { useState, useEffect } from "react";
import axios from "axios";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [currPage, setCurrPage] = useState(1);
  const [numItems] = useState(10);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const res = await axios.get(
          "https://jsonplaceholder.typicode.com/posts"
        );
        setPosts(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    getPosts();
  }, [posts]);

  const startIdx = (currPage - 1) * numItems;
  const endIdx = currPage * numItems;
  const paginatedPosts = posts.slice(startIdx, endIdx);
  const totalPages = Math.floor(posts.length / numItems);

  const createPageNums = () => {
    const pageNums = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNums.push(i);
    }
    return pageNums;
  };

  return (
    <div>
      {paginatedPosts.map((post) => {
        return <h2 key={post.id}>{post.id}</h2>;
      })}
      {createPageNums().map((page) => (
        <button onClick={() => setCurrPage(page)} key={page}>
          {page}
        </button>
      ))}
    </div>
  );
};

export default Posts;
