import Image from "next/image";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faComment,
  faCircleCheck,
  faHeart

} from "@fortawesome/free-solid-svg-icons";
import '../tweet/tweet-comment.css';
import { useState, useEffect } from "react";

export default function tweetContainer(props) {
  //state to keep track of showing all text
  const [showAll, setShowAll] = useState();
  const maxLength = 280; // Set your desired maximum word length
  //handling routing
  const router = useRouter();
  //state for delete and current user info
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  //state to store user id currently
  const [currentUserId, setCurrentUserId] = useState(null);
  //get token from local storage
  const token = localStorage.getItem('token');

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  // Check if user is logged in
  useEffect(() => {
    setIsLoggedIn(!!token); // Set isLoggedIn based on token existence (true or false)
  }, [token]);

  // Fetch current user ID if logged in
  useEffect(() => {
    async function getCurrentUser() {
      try {
        if (token) {
          const headers = createAuthHeaders(token);
          //get currentuser id and save to state
          const response = await axios.get(`https://retweet-server.vercel.app/api/user`, {
            headers: headers,
          });
          setCurrentUserId(response.data._id);
        } else {
          setCurrentUserId(null);
        }
      } catch (error) {
        console.log(error);
      }
    }
    getCurrentUser();
  }, [token]);





  //for token headers
  function createAuthHeaders(token) {
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  //handling redirect to a specific id ( id passed to the function from props.id)
  function handleRedirect(id) {
    router.push(`/tweets/${id}`);
  }

  //handling redirect to a specific id ( id passed to the function from props.id)
  function gotoPage(id) {
    router.push(`/posts/${id}`);
  }

  //change the date format to yy/mm/dd
  const options = { month: 'short', day: '2-digit', year: 'numeric' };
  const formattedDate = new Date(props.time).toLocaleDateString('en-US', options);

  return (
    <div className="tweet-card">
      <div >
        <div>
          <span>
            {/* <FontAwesomeIcon icon={faCircle} style={{ fontSize: 30, color: "yellow" }} />    */}
            {props.profile_img ? ( // Check if props.url exists
              <Image
                className="profile-pic img-fluid"
                src={props.profile_img}
                width={35}
                height={35}
                quality={100}
                alt="profile pic"
                priority={true}
              />
            ) : (
              <Image
                className="profile-pic img-fluid"
                src='https://res.cloudinary.com/dqldlpuwj/image/upload/v1709858517/cc_pqkkus.png'
                width={35}
                height={35}
                alt="no profile pic"
                priority={true}
              />
            )}

          </span>
          <span className="name-line">
            <span onClick={() => gotoPage(props.author_id)} className="card-title">{props.name}</span> <FontAwesomeIcon icon={faCircleCheck} style={{ fontSize: 15, color: "#1DA1F2" }} /> <span className="subtitle">@{props.username}. {formattedDate}</span>
          </span>

          {/* Render delete button only if user is logged in and currentUserId matches authorId */}
          {isLoggedIn && currentUserId === props.author_id && (
            <span className="delete-btn dropdown">
              <span className="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
              </span>
              <ul className="dropdown-menu dropdown-menu-dark">
                <li><a onClick={(event) => props.deleteTweet(props.id, props.author_id, event)} className="dropdown-item" href="/tweets">Delete</a></li>
              </ul>
            </span>
          )}
        </div>

        <pre onClick={() => handleRedirect(props.id)} className="card-text">
          {showAll ? props.text : `${props.text.slice(0, maxLength)}${props.text.length > maxLength ? '...' : ''}`}
        </pre>

        {props.text.length > maxLength && (
          <p className="show-text" onClick={toggleShowAll}>
            {showAll ? 'show less' : 'show more'}
          </p>
        )}

        {props.url ? ( // Check if props.url exists
          <Image
            onClick={() => handleRedirect(props.id)}
            className="img-fluid tweet-img"
            src={props.url}
            width={500}
            height={500}
            quality={100}
            alt="Tweet Image"
            priority={true}
          />
        ) : null}
      </div>
      <div className="engagement-container ">
        <span onClick={() => props.handleLike(props.id, currentUserId)} className="like-tweet engagement-count"><FontAwesomeIcon icon={faHeart} style={{ fontSize: 23, color: "orangered" }} /> </span>
        <span onClick={() => handleRedirect(props.id)} className="comment-tweet engagement-count"><FontAwesomeIcon icon={faComment} style={{ fontSize: 23 }} /> </span>
        <p className="like-count">{props.likes} likes</p>
      </div>


    </div>

  )
}
