import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Footer from "@/components/footers/footer";
import  '../styles/home.css';

// import the icons you need
import {
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

export default function about() {
  return (
    <div>
      <section className="title">
        <div className="container text-center">
          <div className="row">
            <div className="col">
              <h1 className="title-header">About Us</h1>
              <h5 className="title-text">Welcome to the next generation site for better and more improved modelling of ulta sufficient royaltie and designs, Lorem, ipsum dolor sit amet consectetur adipisicing
                elit. Hic facere eligendi error veritatis harum necessitatibus quod fugit commodi nostrum! Vero aliquam illum est rerum veritatis natus expedita corrupti vel explicabo.
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Libero dolorem rem autem aut officia quod deleniti tempora minima! Nesciunt nam placeat adipisci! Quis harum repudiandae in, illum atque enim ab.
              </h5>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container text-center">
          <div className="row">
            <div className="col-xl-6 col-md-6">
              <p><FontAwesomeIcon icon={faCheckCircle} style={{ fontSize: 60, color: "#0275d8" }} /></p>
              <h3 className='features-header'>Easy to use.</h3>
              <p className='features-p'>So easy to use, even your dog could do it.</p>
            </div>
            <div className="col-xl-6 col-md-6">
              <p className='features-p'>All tweets are published Anonymously on site Lorem ipsum dolor sit amet consectetur adipisicing elit.
               Labore alias ratione est similique reiciendis! Saepe distinctio facere aperiam qui minus eligendi a sint laudantium eum, laborum nam illum recusandae possimus.. Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus
                nam temporibus ipsam quam quas dolorum vero aliquid deserunt laudantium labore, debitis quaerat accusantium consequuntur saepe id perspiciatis ipsa adipisci repellat!</p>
            </div>
            <div className="col-xl-6 col-md-6">
              <p className='features-p'>All tweets are published Anonymously on site Lorem ipsum dolor sit amet consectetur adipisicing elit.
               Labore alias ratione est similique reiciendis! Saepe distinctio facere aperiam qui minus eligendi a sint laudantium eum, laborum nam illum recusandae possimus.. Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus
                nam temporibus ipsam quam quas dolorum vero aliquid deserunt laudantium labore, debitis quaerat accusantium consequuntur saepe id perspiciatis ipsa adipisci repellat!</p>
            </div>
            <div className="col-xl-6 col-md-6">
              <p><FontAwesomeIcon icon={faCheckCircle} style={{ fontSize: 60, color: "wheat" }} /></p>
              <h3 className='features-header'>Easy to use.</h3>
              <p className='features-p'>So easy to use, even your dog could do it.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>

  )
}

