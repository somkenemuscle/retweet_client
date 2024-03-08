import { useState, useEffect } from "react";
import axios from 'axios';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircle,
  faCircleCheck,
  faHeart
} from "@fortawesome/free-solid-svg-icons";
import '../tweet/tweet-comment.css'

export default function commentSection(props) {
  //state for delete and current user info
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  //get current user id from state
  const [currentUserId, setCurrentUserId] = useState(null);
  //get token from local storage
  const token = localStorage.getItem('token');
  //handling routing
  const router = useRouter();

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
  function gotoPage() {
    router.push(`/posts/${props.author_id}`);
  }
  //change the date format to yy/mm/dd
  const options = { month: 'short', day: '2-digit', year: 'numeric' };
  const formattedDate = new Date(props.time).toLocaleDateString('en-US', options);

  return (
    <div className="tweet-card" >
      <div >
        <div>
          {props.profile_img ? ( // Check if props.url exists
            <Image
              className="profile-pic img-fluid tweet-img"
              src={props.profile_img}
              width={35}
              height={35}
              quality={100}
              alt="profile pic"
              priority={true}
            />
          ) : (<Image
            className="profile-pic img-fluid"
            src='https://res.cloudinary.com/dqldlpuwj/image/upload/v1709858517/cc_pqkkus.png'
            width={35}
            height={35}
            alt="no profile pic"
            priority={true}
          />)}
          <span className="name-line">
            <span onClick={() => { gotoPage() }} className="card-title">{props.name}</span> <FontAwesomeIcon icon={faCircleCheck} style={{ fontSize: 15, color: "#1DA1F2" }} /> <span className="subtitle">@{props.username}.  {formattedDate}</span>
          </span>

          {/* Render delete button only if user is logged in and currentUserId matches authorId */}
          {isLoggedIn && currentUserId === props.author_id && (
            <span className="delete-btn dropdown">
              <span className='delete-dropdown' data-bs-toggle="dropdown" aria-expanded="false">
                . . .
              </span>
              <ul className="dropdown-menu dropdown-menu-dark">
                <li><span onClick={() => props.deleteComment(props.id, props.author_id)} className="dropdown-item">Delete</span></li>
              </ul>
            </span>
          )}
        </div>

        <p className="card-text">{props.text}</p>
      </div>
      <div className="engagement-container ">
        <span onClick={() => { props.handleCommentLike(props.id, currentUserId) }} className="like-tweet engagement-count"><FontAwesomeIcon icon={faHeart} style={{ fontSize: 26, color: "orangered" }} /></span>
        <span className="comment-like like-count">{props.likes} Likes</span>
      </div>
    </div>
  )
}
