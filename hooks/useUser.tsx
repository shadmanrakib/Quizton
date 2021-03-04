import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../config/firebaseClient";
import nookies from "nookies";

// Use UserContext so user can be accessed from children
const UserContext = createContext(null);

// Hook to access UserContext value
export const useUser = () => {
  return useContext(UserContext);
};

// Provider used in _app.js surrounding <Component> so all components have access to user value
export const UserProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState(null);

  // Set value of UserContext to user when user is changed
  useEffect(() => {
    return auth.onIdTokenChanged(async (user) => {
      if (!user) {
        setUser(null);
        nookies.set(undefined, "token", "", { path: "/" });
      } else {
        const token = await user.getIdToken();
        setUser(user);
        nookies.set(undefined, "token", token, { path: "/" });
      }
    });
  }, []);

  // force refresh the token every 10 minutes
  useEffect(() => {
    const handle = setInterval(async () => {
      const user = auth.currentUser;
      if (user) await user.getIdToken(true);
    }, 10 * 60 * 1000);

    // clean up setInterval
    return () => clearInterval(handle);
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
