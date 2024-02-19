'use client'
import './newTweet.css'
import { useState } from 'react';
import { useRef } from 'react';

function newTweet(props) {
  //useref to reset file input
  const fileInputRef = useRef(null);

  //state for tweets
  const [tweets, setTweets] = useState({
    text: '',
    image: null
  });

  //form bootsrap validation state
  const [validated, setValidated] = useState(false);

  //handling input change and updating tweet state
  function handleChange(e) {
    const { value, name, files } = e.target;
    setTweets((prevTweets) => ({
      ...prevTweets,
      [name]: name === 'image' ? files[0] : value,
    }));
  }

  //handling submit when form is filled with (Bootstrap form validation)
  async function handlesubmit(e) {
    e.preventDefault(); // Prevent default form submission

    const form = e.currentTarget;
    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return; // Exit early if the form is not valid
    }

    if (!tweets.text && !tweets.image) {
      setValidated(true);
      return; // Exit if neither text nor image is provided
    }
    try {
      // Attempt to add tweet to the database
      await props.addTweet(tweets);
      setValidated(false); // Reset validated state
      setTweets({ text: '', image: null }); // Reset the input fields after adding the tweet
      // Reset the file input value
      fileInputRef.current.value = '';
    } catch (error) {
      console.error('Error adding tweet:', error);
    }
  }

  return (
    <div>
      <div className='new-tweet-container'>
        <form className={validated ? 'was-validated' : ''} noValidate onSubmit={handlesubmit} encType="multipart/form-data">
          <textarea
            onChange={handleChange}
            value={tweets.text}
            // Make text required only if image is not provided
            className="tweet-input form-control"
            rows="3"
            placeholder='Say something'
            name='text'
            required={!tweets.image}
          ></textarea>
          <div className="invalid-feedback">
            {tweets.image ? 'Say something' : 'Please provide either text or an image'}
          </div>
          <div>
            <input className='form-control' type="file" ref={fileInputRef} name="image" onChange={handleChange} required={!tweets.text} />
          </div>
          <div className="invalid-feedback">
            {tweets.text ? 'Please provide either text or an image' : 'Please provide either text or an image'}
          </div>
          <button className='btn btn-sm btn-dark'>Post tweet</button>
        </form>
      </div>
    </div>
  )
}

export default newTweet