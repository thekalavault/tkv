import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';

export interface DbUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: {
    name: string;
    isAdmin: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  dbUser: DbUser | null;
  loading: boolean;
  setDbUser: React.Dispatch<React.SetStateAction<DbUser | null>>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  dbUser: null,
  loading: true,
  setDbUser: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [dbUser, setDbUser] = useState<DbUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const token = await currentUser.getIdToken();
          localStorage.setItem('kalavault_token', token);
          const response = await fetch('http://localhost:3000/api/v1/users/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            setDbUser(data);
          }
        } catch (err) {
          console.error("Failed to fetch DB user", err);
        }
      } else {
        localStorage.removeItem('kalavault_token');
        setDbUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, dbUser, setDbUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
