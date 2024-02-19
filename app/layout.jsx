'use client'
import 'bootstrap/dist/css/bootstrap.css';
import "@fortawesome/fontawesome-svg-core/styles.css";
import './styles/globals.css';
import { TweetProvider } from './context/TweetContext';
import { UserProvider } from './context/userLog';
import { CurrentUserIdProvider } from './context/currentUserId';
import Navbar from '@/components/navbar/navbar';
import { useEffect } from 'react';
import { config } from "@fortawesome/fontawesome-svg-core";

config.autoAddCss = false;

export default function RootLayout({ children }) {
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.js');
  }, []);
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='true'></link>
        <link href="https://fonts.googleapis.com/css2?family=Questrial&display=swap" rel="stylesheet"></link>
        <title>Retweet</title>
      </head>
      <body className='body'>
        <UserProvider>
          <TweetProvider>
            <CurrentUserIdProvider>
              <Navbar />
              {children}
            </CurrentUserIdProvider>
          </TweetProvider>
        </UserProvider>
      </body>
    </html>
  )
}
