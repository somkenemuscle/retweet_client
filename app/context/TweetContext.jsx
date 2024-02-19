// TweetContext.js
import React, { createContext, useContext, useState } from 'react';

const TweetContext = createContext();

export function useTweetContext() {
  return useContext(TweetContext);
}

export function TweetProvider({ children }) {
  const [tweetMessage, setTweetMessage] = useState('');

  return (
    <TweetContext.Provider value={{ tweetMessage, setTweetMessage }}>
      {children}
    </TweetContext.Provider>
  );
}
