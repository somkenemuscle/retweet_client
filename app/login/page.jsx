'use client'
import './login.css'
import Footer from '@/components/footers/footer'
import axios from "axios";
import { useState } from 'react'
import { useRouter } from 'next/navigation';
import { useTweetContext } from "../context/TweetContext";
import { useUserContext } from '../context/userLog';


function logIn() {
    // for changing routes
    const router = useRouter();
    //global state to check if user is logged in or not
    const { setIsLoggedIn } = useUserContext();
    // State for global state flash message
    const { setTweetMessage } = useTweetContext();
    //state for tweets
    const [user, setUser] = useState({
        username: '',
        password: ''
    });


    //form bootsrap validation state
    const [validated, setValidated] = useState(false);
    //handling input change and updating user state
    function handleChange(e) {
        const { value, name } = e.target;
        setUser((prevUser) => {
            return {
                ...prevUser,
                [name]: value
            }
        })
    }

    //login user and check if he/she exists function
    async function loginUser(user) {
        try {
            const response = await axios.post("https://twitter-clone-tfdd-lq92ihbdl-ojukwu-somkenes-projects.vercel.app/api/tweets/login", {
                username: user.username,
                password: user.password
            });
            // Destructuring message and token from response.data
            const { message, token } = response.data;
            if (response.status === 200) {
                //set isloggedin global state to true so logout will show on navbar
                setIsLoggedIn(true);
                // Handle successful login
                setTweetMessage(message);
                // Store the token securely in localStorage
                localStorage.setItem('token', token);
                // Redirect to tweets page after successful login
                router.push('/tweets');
            } else {
                // Handle error cases (invalid credentials, etc.)
                setTweetMessage(message);
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
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
            // attempt to send login details back to the backend
            await loginUser(user);
        } catch (error) {
            console.error('Error loggin in:', error);
            // Handle error (e.g., show an error message to the user)
        }
    }

    return (
        <div>
            <div className='new-tweet-container'>
                <form className={validated ? 'was-validated' : ''} noValidate onSubmit={handlesubmit}>
                    <div className="row">
                        <div className="col-lg-6 col-md-12">
                            <input onChange={handleChange} type="text" value={user.username} className="tweet-input form-control" placeholder="Username" required name='username' />
                            <div className="invalid-feedback">
                                Please provide a username
                            </div>
                        </div>

                        <div className="col-lg-6 col-md-12">
                            <input onChange={handleChange} type="password" value={user.password} className="tweet-input form-control" placeholder="Password" required name='password' />
                            <div className="invalid-feedback">
                                Please provide a password
                            </div>
                        </div>
                    </div>
                    <button className='btn btn-sm btn-dark'>Login</button>
                </form>
                <Footer />
            </div>
        </div>
    )
}

export default logIn