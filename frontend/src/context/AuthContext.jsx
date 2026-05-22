import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Backend URL
const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://ai-powered-learning-interview-assistant-sh03.onrender.com';

// Axios global config
axios.defaults.baseURL = API_URL;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [bookmarks, setBookmarks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [roadmaps, setRoadmaps] = useState([]);

  // Apply Theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';

    setTheme(savedTheme);

    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Initialize Auth
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        axios.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${token}`;

        try {
          const { data } = await axios.get('/api/auth/profile');

          if (data.success) {
            setUser({
              _id: data._id,
              name: data.name,
              email: data.email,
              isAdmin: data.isAdmin,
              streak: data.streak,
              analytics: data.analytics,
              createdAt: data.createdAt,
            });

            setBookmarks(data.bookmarks || []);
            setNotes(data.notes || []);

            // Fetch roadmaps
            const roadmapRes = await axios.get('/api/roadmaps');

            if (roadmapRes.data.success) {
              setRoadmaps(roadmapRes.data.roadmaps);
            }
          }
        } catch (error) {
          console.error('Session expired or invalid token', error);
          logout();
        }
      }

      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Toggle Theme
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';

    setTheme(newTheme);

    localStorage.setItem('theme', newTheme);

    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      const { data } = await axios.post('/api/auth/login', {
        email,
        password,
      });

      if (data.success) {
        localStorage.setItem('token', data.token);

        axios.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${data.token}`;

        setUser({
          _id: data._id,
          name: data.name,
          email: data.email,
          isAdmin: data.isAdmin,
          streak: data.streak,
          analytics: data.analytics,
        });

        // Fetch profile
        const profileRes = await axios.get('/api/auth/profile');

        if (profileRes.data.success) {
          setBookmarks(profileRes.data.bookmarks || []);
          setNotes(profileRes.data.notes || []);
        }

        // Fetch roadmaps
        const roadmapRes = await axios.get('/api/roadmaps');

        if (roadmapRes.data.success) {
          setRoadmaps(roadmapRes.data.roadmaps);
        }

        return { success: true };
      }
    } catch (error) {
      console.error(error);

      return {
        success: false,
        message:
          error.response?.data?.message || 'Login failed',
      };
    }
  };

  // Register
  const register = async (name, email, password) => {
    try {
      const { data } = await axios.post('/api/auth/register', {
        name,
        email,
        password,
      });

      if (data.success) {
        localStorage.setItem('token', data.token);

        axios.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${data.token}`;

        setUser({
          _id: data._id,
          name: data.name,
          email: data.email,
          isAdmin: data.isAdmin,
          streak: data.streak,
          analytics: data.analytics,
        });

        setBookmarks([]);
        setNotes([]);
        setRoadmaps([]);

        return { success: true };
      }
    } catch (error) {
      console.error(error);

      return {
        success: false,
        message:
          error.response?.data?.message ||
          'Registration failed',
      };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');

    delete axios.defaults.headers.common['Authorization'];

    setUser(null);
    setBookmarks([]);
    setNotes([]);
    setRoadmaps([]);
  };

  // Update Profile
  const updateProfile = async (name, email, password) => {
    try {
      const payload = { name, email };

      if (password) payload.password = password;

      const { data } = await axios.put(
        '/api/auth/profile',
        payload
      );

      if (data.success) {
        setUser((prev) => ({
          ...prev,
          name: data.name,
          email: data.email,
        }));

        if (data.token) {
          localStorage.setItem('token', data.token);

          axios.defaults.headers.common[
            'Authorization'
          ] = `Bearer ${data.token}`;
        }

        return { success: true };
      }
    } catch (error) {
      console.error(error);

      return {
        success: false,
        message:
          error.response?.data?.message ||
          'Profile update failed',
      };
    }
  };

  // Bookmark Toggle
  const toggleBookmark = async (item) => {
    try {
      const isBookmarked = bookmarks.includes(item);

      let res;

      if (isBookmarked) {
        res = await axios.delete('/api/auth/bookmarks', {
          data: { item },
        });
      } else {
        res = await axios.post('/api/auth/bookmarks', {
          item,
        });
      }

      if (res.data.success) {
        setBookmarks(res.data.bookmarks);
      }
    } catch (error) {
      console.error('Bookmark update failed', error);
    }
  };

  // Save Notes
  const saveNote = async (questionTitle, content) => {
    try {
      const { data } = await axios.post(
        '/api/auth/notes',
        {
          questionTitle,
          content,
        }
      );

      if (data.success) {
        setNotes(data.notes);

        return { success: true };
      }
    } catch (error) {
      console.error('Saving note failed', error);

      return { success: false };
    }
  };

  // Toggle Roadmap Topic
  const toggleRoadmapTopic = async (title, topic) => {
    try {
      const { data } = await axios.post(
        '/api/roadmaps/toggle',
        {
          title,
          topic,
        }
      );

      if (data.success) {
        setRoadmaps((prev) => {
          const idx = prev.findIndex(
            (r) => r.title === title
          );

          if (idx > -1) {
            const copy = [...prev];

            copy[idx] = data.roadmap;

            return copy;
          }

          return [...prev, data.roadmap];
        });
      }
    } catch (error) {
      console.error(
        'Toggling roadmap topic failed',
        error
      );
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        theme,
        bookmarks,
        notes,
        roadmaps,
        toggleTheme,
        login,
        register,
        logout,
        updateProfile,
        toggleBookmark,
        saveNote,
        toggleRoadmapTopic,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};