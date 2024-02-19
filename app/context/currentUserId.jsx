// UserContext.js
import React, { createContext, useContext, useState } from 'react';

const CurrentUserIdContext = createContext();

export function UseCurrentUserId() {
    return useContext(CurrentUserIdContext);
}

export function CurrentUserIdProvider({ children }) {
    const [CurrentUserId, setCurrentUserId] = useState();

    return (
        <CurrentUserIdContext.Provider value={{ CurrentUserId, setCurrentUserId }}>
            {children}
        </CurrentUserIdContext.Provider>
    );
}
