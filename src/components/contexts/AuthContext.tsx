import { createContext, ReactNode, useState, useEffect } from 'react';
import { parseCookies } from 'nookies';
import Router from 'next/router';
import { User } from '../../models/user.model';

interface IAuthContext {
  isAutheticated: boolean;
  user: User | null;
  validating: boolean,
  setValidating: (validating: boolean) => void
  setUser: (user: User | null) => void
}

interface IAuthProvider {
  children: ReactNode;
}

export const AuthContext = createContext({} as IAuthContext);

export const AuthProvider = ({ children }: IAuthProvider) => {
  const [user, setUser] = useState<User | null>(null);
  const [validating, setValidating] = useState<boolean>(false)

  const isAutheticated = !!user;

  useEffect( () => {
    const validateUser = async () => {
      const { 'nouhau.user': user } = parseCookies();
      const { 'nouhau.token': token } = parseCookies();

      if (user) {
        await fetch(
          `${process.env.API_GATEWAY_URL}/user/${user}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        )
          .then(async response => {
            const user = await response.json()
            setUser(user)

            user.role === 'admin' && Router.push('/admin')
            user.role === 'evaluator' && Router.push('/alunos');
          })
      }
    }

    validateUser()
  }, []);
  
  return (
    <AuthContext.Provider value={{ user, setUser, isAutheticated, validating, setValidating }}>
      {children}
    </AuthContext.Provider>
  );
};
