import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import the icons you need
import {
  faBank,
  faHand,
  faSimCard,
  faAddressBook
} from "@fortawesome/free-solid-svg-icons";

export default function footer() {
  return (
    <div>
      <footer className="footer">
        <p>
          <FontAwesomeIcon className="footer-icon" icon={faBank} style={{ fontSize: 20, color: "yellow" }} />
          <FontAwesomeIcon className="footer-icon" icon={faHand} style={{ fontSize: 20, color: "#0275d8" }} />
          <FontAwesomeIcon className="footer-icon" icon={faSimCard} style={{ fontSize: 20, color: "lightgreen" }} />
          <FontAwesomeIcon className="footer-icon" icon={faAddressBook} style={{ fontSize: 20, color: "white" }} />
        </p>
        <p className="footer-text">© Copyright 2023, Retweet</p>
        <span className="footer-author">Ojukwu Somkene . I</span>
      </footer>
    </div>
  )
}

