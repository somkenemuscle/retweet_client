'use client'
import './newTweet.css'
import { useState } from 'react'

function newComment(props) {
    //state for comments
    const [comments, setComments] = useState({
        comment: ''
    });

    //form bootsrap validation state
    const [validated, setValidated] = useState(false);

    //handling input change and updating comment state
    function handleChange(e) {
        const { value, name } = e.target;
        setComments((prevComment) => {
            return {
                ...prevComment,
                [name]: value
            }
        })
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

        try {
            // Attempt to add comment to the database
            await props.addComment(comments);
            setValidated(false); // Reset validated state
            setComments({ comment: '' }); // Reset the input fields after adding the comment
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    }


    return (
        <div>
            <div className='new-tweet-container'>
                <form className={validated ? 'was-validated' : ''} noValidate onSubmit={handlesubmit}>
                    <textarea onChange={handleChange} value={comments.comment} required className="tweet-input form-control" rows="2" placeholder='Say something' name='comment'></textarea>
                    <div className="invalid-feedback">
                        say something
                    </div>
                    <button className='btn btn-sm btn-dark'>make comment</button>
                </form>
            </div>
        </div>
    )
}

export default newComment
