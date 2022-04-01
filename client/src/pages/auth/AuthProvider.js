import React, { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ( { children } ) => {

    const [ useAuth, setAuth ] = useState({});

    return (
        <AuthContext.Provider value={{ useAuth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;