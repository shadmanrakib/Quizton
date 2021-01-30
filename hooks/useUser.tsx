import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../config/firebase';

// Use UserContext so user can be accessed from children
const UserContext = createContext(null);

// Hook to access UserContext value
export const useUser = () => {
    return useContext(UserContext);
}

// Provider used in _app.js surrounding <Component> so all components have access to user value
export const UserProvider: React.FC = ({ children }) => {
    const [ user, setUser ] = useState(null);

    // Set value of UserContext to user when user is changed
    useEffect(() => {
        auth.onAuthStateChanged(user => {
            setUser(user);
        });
    }, [])
    
    return (
        <UserContext.Provider value={ user }>
            { children }
        </UserContext.Provider>
    )
}