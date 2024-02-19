"use client"
import React, { useState, useEffect } from "react";
import axios from 'axios';
import TweetContainer from "@/components/tweet/tweetContainer";
import '../styles/tweetcontainer.css';
import { useTweetContext } from "../context/TweetContext";
import NewTweet from "@/components/new/newTweet";
import { useUserContext } from '../context/userLog';
import { UseCurrentUserId } from "../context/currentUserId";

export default function Tweets() {
  //global state to check if user is logged in or not
  const { isLoggedIn, setIsLoggedIn } = useUserContext();
  //handling tweet state
  const [tweets, setTweets] = useState([]);
  const { tweetMessage, setTweetMessage } = useTweetContext();
  const { setCurrentUserId } = UseCurrentUserId();

  let token = null;
  useEffect(() => {
    try {
      const tokens = localStorage.getItem('token');
      if (tokens) {
        token = tokens
      }
    } catch (error) {
      console.log('no token ', error)
    }
  }, []);


  // Fetch current user ID if logged in
  useEffect(() => {
    async function getCurrentUser() {
      try {
        // Check if the token exists in localStorage
        if (token) {
          const headers = createAuthHeaders(token);
          //get currentuser id and save to state
          const response = await axios.get(`https://twitter-clone-tfdd-lq92ihbdl-ojukwu-somkenes-projects.vercel.app/api/user`, {
            headers: headers,
          });
          setCurrentUserId(response.data._id);
        } else {
          setCurrentUserId(null);
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    }
    getCurrentUser();
  }, [token]);

  //get token and see if a user is loggged in 
  useEffect(() => {
    // Check if the token exists in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);


  //fetching data-tweets from json api
  useEffect(() => {
    axios.get("https://twitter-clone-tfdd-lq92ihbdl-ojukwu-somkenes-projects.vercel.app/api/tweets")
      .then((res) => {
        setTweets(res.data)
        //setTweets(res.data);
      })
      .catch((error) => {
        console.error("Error fetching tweets:", error);
      });
  }, []);


  //add tweet to database function
  async function addTweet(tweet) {
    try {
      const token = localStorage.getItem('token');
      // Set the Authorization header with the JWT token
      const headers = createAuthHeaders(token);
      // Create FormData and append text and image (if present)
      const formData = new FormData();
      formData.append('text', tweet.text);
      formData.append('image', tweet.image ? tweet.image : null);
      await axios.post("https://twitter-clone-tfdd-lq92ihbdl-ojukwu-somkenes-projects.vercel.app/api/tweets/", formData, { headers }); // Pass headers as a third argument to axios.post()
      // Fetch updated tweets after successful addition
      const updatedTweetsResponse = await axios.get("https://twitter-clone-tfdd-lq92ihbdl-ojukwu-somkenes-projects.vercel.app/api/tweets");
      setTweets(updatedTweetsResponse.data); // Update local state with the updated tweets
      // Set flash message on successful tweet addition
      setTweetMessage('Your post was made');
    } catch (error) {
      console.log(error)
    }
  }

  //set tweet context to false so it dissappears
  const closeAlert = () => {
    setTweetMessage(false);
  };

  //handle like functionality
  const handleLike = async (tweetId, userId) => {
    try {
      const token = localStorage.getItem('token');
      const headers = createAuthHeaders(token);
      const response = await axios.post(`https://twitter-clone-tfdd-lq92ihbdl-ojukwu-somkenes-projects.vercel.app/like/${tweetId}/${userId}`, {}, { headers });
      const updatedTweet = response.data.tweet;
      setTweets(prevTweets => prevTweets.map(tweet => {
        if (tweet._id === updatedTweet._id) {
          return updatedTweet;
        }
        return tweet;
      }));
    } catch (error) {
      console.error('Error liking/unliking tweet:', error);
    }
  };
  //for token headers
  function createAuthHeaders(token) {
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    };
  }

  return (
    <div className="main-tweet-container">
      <div className="tweet-container">
        {/* let user know what has been added => flash message  */}
        {!!tweetMessage && (
          <div className="msg custom-alert alert alert-dark alert-dismissible fade show" role="alert">
            <strong>{tweetMessage}</strong>
            <button type="button" className="close" onClick={closeAlert}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        )}

        {/* render create tweet form if user is logged in or not */}
        {isLoggedIn ? (
          <div>
            <NewTweet addTweet={addTweet} />
          </div>
        ) : null}

        {/* mapping through tweets and rendering them */}
        {tweets.map((newtweet, i) => (
          <TweetContainer
            id={newtweet._id}
            key={i}
            name={newtweet.author.name}
            username={newtweet.author.username}
            text={newtweet.text}
            url={newtweet.image.url}
            author_id={newtweet.author._id}
            time={newtweet.createdAt}
            profile_img={newtweet.author.profile_img.url}
            likes={newtweet.likes}
            handleLike={handleLike}
          />
        ))}
      </div>
    </div>

  );
}
