"use client"
import { useState, useEffect } from "react";
import axios from 'axios';
import { useParams } from "next/navigation";
import TweetContainer from "@/components/tweet/tweetContainer";
import './post.css';
import { useRouter } from 'next/navigation';
import { UseCurrentUserId } from "@/app/context/currentUserId";
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
  const { CurrentUserId, setCurrentUserId } = UseCurrentUserId();
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true);
  const [loadingUser, setLoadingUser] = useState(true);



  //get token and see if a user is loggged in 
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) setToken(storedToken);
  }, []);


  // Fetch current user ID if logged in
  useEffect(() => {
    async function getCurrentUser() {
      try {
        const storedToken = localStorage.getItem('token');
        // Check if the token exists in localStorage
        if (storedToken) {
          const headers = createAuthHeaders(storedToken);
          //get currentuser id and save to state
          const response = await axios.get(`https://retweet-server.vercel.app/api/user`, {
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


  //fetching data-tweets from json api
  useEffect(() => {
    setTimeout(() => {
      if (userid) {
        axios.get(`https://retweet-server.vercel.app/api/tweets/${userid}/posts`)
          .then((res) => {
            setTweets(res.data);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching tweets:", error);
          });
      } else {
        setTweets(null);
      }
    }, 2000); // Simulating 2 seconds delay in fetching tweets
  }, [userid]); // Include userid as a dependency

  //get infromation about a particular user from the json api
  useEffect(() => {
    setTimeout(() => {
      if (userid) {
        axios.get(`https://retweet-server.vercel.app/api/user/${userid}`)
          .then((res) => {
            setUser(res.data);
            setLoadingUser(false);

          })
          .catch((error) => {
            console.error("Error fetching tweets:", error);
          });
      } else {
        setUser(null)
      }
    }, 2000); // Simulating 2 seconds delay in fetching tweets
  }, [userid]); // Include userid as a dependency

  //handle like functionality
  const handleLike = async (tweetId, userId) => {
    try {
      const headers = createAuthHeaders(token);
      const response = await axios.post(`https://retweet-server.vercel.app/api/like/${tweetId}/${userId}`, {}, { headers });
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

  //delete function , to delete a specific tweet with the id being provided
  async function deleteTweet(id, author_id, event) {
    try {
      event.preventDefault()
      // Set the Authorization header with the JWT token
      const headers = createAuthHeaders(token);
      //check for authorization for deleting a post
      if (CurrentUserId === author_id) {
        // Make the DELETE request with the provided headers
        await axios.delete(`https://retweet-server.vercel.app/api/tweets/${id}`, {
          headers: headers,
        });
        if (userid) {
          const updatedTweets = await axios.get(`https://retweet-server.vercel.app/api/tweets/${userid}/posts`)
          setTweets(updatedTweets.data)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

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


  if (loading && loadingUser) {
    return (
      <div style={{ marginTop: '60px' }}>
        <div className="text-center">
          <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!tweets.length) {
    return (
      <div>
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
        <p style={{marginTop: '6%' , textAlign: 'center'}}> No tweet has been made by this user</p>
        </div>
      </div>
    );
  }
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
      {
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
            deleteTweet={deleteTweet}
            handleLike={handleLike}
          />
        ))
      }

    </div>
  );
}
export default posts