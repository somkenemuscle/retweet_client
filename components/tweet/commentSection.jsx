import { useState, useEffect } from "react";
import axios from 'axios';
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
          const response = await axios.get(`https://twitter-clone-tfdd-lq92ihbdl-ojukwu-somkenes-projects.vercel.app/user`, {
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
          <span> <FontAwesomeIcon icon={faCircle} style={{ fontSize: 15, color: "grey" }} />  </span>
          <span onClick={() => { gotoPage() }} className="card-title">{props.name}</span> <FontAwesomeIcon icon={faCircleCheck} style={{ fontSize: 15, color: "#1DA1F2" }} /> <span className="subtitle">@{props.username}.  {formattedDate}</span>


          {/* Render delete button only if user is logged in and currentUserId matches authorId */}
          {isLoggedIn && currentUserId === props.author_id && (
            <span className="delete-btn dropdown">
              <span className="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
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
        <span onClick={() => { props.handleCommentLike(props.id, currentUserId) }} className="like-tweet engagement-count"><FontAwesomeIcon icon={faHeart} style={{ fontSize: 16, color: "orangered" }} /></span>
        <span className="like-count">{props.likes}</span>
      </div>
    </div>
  )
}
