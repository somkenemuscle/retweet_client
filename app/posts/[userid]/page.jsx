"use client"
import { useState, useEffect } from "react";
import axios from 'axios';
import { useParams } from "next/navigation";
import TweetContainer from "@/components/tweet/tweetContainer";
import './post.css';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLink,
  faCalendarDays,
  faLocationDot,
  faArrowLeft,
  faBaby,
  faCheckCircle
} from "@fortawesome/free-solid-svg-icons";

function posts() {
  //getting user id from url params
  const { userid } = useParams();
  //handling tweet state
  const [tweets, setTweets] = useState([]);
  //user state
  const [user, setUser] = useState();
  //handling routing 
  const router = useRouter();

  //fetching data-tweets from json api
  useEffect(() => {
    if (userid) {
      axios.get(`https://twitter-clone-tfdd-lq92ihbdl-ojukwu-somkenes-projects.vercel.app/api/tweets/${userid}/posts`)
        .then((res) => {
          setTweets(res.data);
        })
        .catch((error) => {
          console.error("Error fetching tweets:", error);
        });
    }
  }, [userid]); // Include userid as a dependen

  //get infromation about a particular user from the json api
  useEffect(() => {
    if (userid) {
      axios.get(`https://twitter-clone-tfdd-lq92ihbdl-ojukwu-somkenes-projects.vercel.app/api/user/${userid}`)
        .then((res) => {
          setUser(res.data);
        })
        .catch((error) => {
          console.error("Error fetching tweets:", error);
        });
    }
  }, [userid]); // Include userid as a dependency

  //handle like functionality
  const handleLike = async (tweetId, userId) => {
    try {
      //get token from local storage
      const token = localStorage.getItem('token');
      const headers = createAuthHeaders(token);
      const response = await axios.post(`https://twitter-clone-tfdd-lq92ihbdl-ojukwu-somkenes-projects.vercel.app/api/like/${tweetId}/${userId}`, {}, { headers });
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
      'Content-Type': 'application/json'
    };
  }
  //handle redirect back to tweets page 
  function handlePostRedirect() {
    router.push('/tweets')
  }

  // change the date format to yy/mm/dd
  const joinedDate = user ? (
    new Date(user.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    })
  ) : "";

  const dateofbirth = user ? (
    new Date(user.date_of_birth).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    })
  ) : "";

  return (
    <div className="postid-container">
      {user && (<>

        <div className="backbtn-container">
          <span onClick={handlePostRedirect} className="goback-logo"><FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: 15, color: "whitesmoke" }} />   </span>
          <span className="goback-text">{user.name} <FontAwesomeIcon icon={faCheckCircle} style={{ fontSize: 15, color: "#1DA1F2" }} /></span>
        </div>

        {/* profile container setup */}
        <div className="profile-container">
          <p>{user.name}</p>
          <p>@{user.username}</p>
          <p>{user.about}</p>
          <span><FontAwesomeIcon icon={faBaby} style={{ fontSize: 15, color: "grey" }} /> Born on {dateofbirth}</span>
          <div> Gender - {user.gender}</div>
          <span><FontAwesomeIcon icon={faLocationDot} style={{ fontSize: 15, color: "grey" }} /> {user.niche}</span>
          <a style={{ textDecoration: "none", color: 'lightblue' }} href={user.socials} target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faLink} style={{ fontSize: 15, color: "grey" }} />
            {' '}{user.socials.slice(0, 20)}{user.socials.length > 20 ? ' ...' : ''}
          </a>
          <div><FontAwesomeIcon icon={faCalendarDays} style={{ fontSize: 15, color: "grey" }} /> Joined {joinedDate}</div>
          <br />
        </div>
      </>
      )}

      {tweets && tweets.length > 0 ? (
        tweets.map((newtweet, i) => (
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
        ))
      ) : (
        <p>No tweets Made Yet.</p>
      )}
    </div>
  );
}
export default posts