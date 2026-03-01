import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { User, AuthState, RegisterDTO, LoginDTO } from '../types';
import axiosInstance from '../services/axios';

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User };

interface AuthContextType extends AuthState {
  login: (data: LoginDTO) => Promise<void>;
  register: (data: RegisterDTO) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isLoading: true,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'LOGIN_SUCCESS':
      return { user: action.payload.user, token: action.payload.token, isLoading: false };
    case 'LOGOUT':
      return { user: null, token: null, isLoading: false };
    case 'UPDATE_USER':
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Restore session on app load — NEVER throws or shows errors to UI
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      dispatch({ type: 'SET_LOADING', payload: false });
      return;
    }

    axiosInstance
      .get<{ success: boolean; data: User }>('/auth/profile')
      .then((res) => {
        if (res.data?.data) {
          dispatch({ type: 'LOGIN_SUCCESS', payload: { user: res.data.data, token } });
        } else {
          localStorage.removeItem('token');
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      })
      .catch(() => {
        // Silently clear invalid/expired token — never propagate this error
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch({ type: 'SET_LOADING', payload: false });
      });
  }, []);

  const login = async (data: LoginDTO): Promise<void> => {
    const res = await axiosInstance.post<{ success: boolean; data: { user: User; token: string } }>('/auth/login', data);
    const payload = res.data?.data;
    if (payload) {
      localStorage.setItem('token', payload.token);
      dispatch({ type: 'LOGIN_SUCCESS', payload });
    }
  };

  const register = async (data: RegisterDTO): Promise<void> => {
    const res = await axiosInstance.post<{ success: boolean; data: { user: User; token: string } }>('/auth/register', data);
    const payload = res.data?.data;
    if (payload) {
      localStorage.setItem('token', payload.token);
      dispatch({ type: 'LOGIN_SUCCESS', payload });
    }
  };

  const logout = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (user: User): void => {
    dispatch({ type: 'UPDATE_USER', payload: user });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};