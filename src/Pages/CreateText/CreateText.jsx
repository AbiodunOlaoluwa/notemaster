import React, { useState, useEffect, useRef, useContext } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import "./CreateText.css";

const CreateText = () => {
  const { user } = useContext(UserContext);
  const [content, setContent] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [breakTime, setBreakTime] = useState(0);
  const [isTabActive, setIsTabActive] = useState(true);
  const navigate = useNavigate();
  const autoSaveInterval = useRef(null);
  const lastActiveTime = useRef(Date.now());

  useEffect(() => {
    setStartTime(Date.now());

    // Auto-save every 30 seconds
    autoSaveInterval.current = setInterval(() => {
      autoSaveContent();
    }, 30000);

    // Event listeners for tab visibility
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(autoSaveInterval.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleVisibilityChange = () => {
    if (document.hidden) {
      setIsTabActive(false);
      lastActiveTime.current = Date.now();
    } else {
      setIsTabActive(true);
      const inactiveDuration = Date.now() - lastActiveTime.current;
      setBreakTime(prev => prev + inactiveDuration);
    }
  };

  const handleContentChange = (value) => {
    setContent(value);
  };

  const autoSaveContent = async () => {
    if (!user) return;
    try {
      await axios.post('http://localhost:3001/api/autosave-or-end', {
        userId: user.id,
        content,
        writingTime: (Date.now() - startTime) / 60000, // Convert to minutes
        breakTime: breakTime / 60000, // Convert to minutes
        endSession: false,
      });
    } catch (error) {
      console.error('Error auto-saving content:', error);
    }
  };

  const endSession = async () => {
    if (!startTime) return;
    const totalTime = (Date.now() - startTime) / 60000; // Convert to minutes
    const totalBreakTime = breakTime / 60000; // Convert to minutes
    const writingTime = totalTime - totalBreakTime;

    try {
      await axios.post('http://localhost:3001/api/autosave-or-end', {
        userId: user.id,
        content,
        writingTime,
        breakTime: totalBreakTime,
        endSession: true,
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error ending session:', error);
    }
  };

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [startTime, breakTime]);

  const handleBeforeUnload = (e) => {
    e.preventDefault();
    endSession();
    e.returnValue = ''; // For modern browsers
  };

  return (
    <div className="createTextContainer">
      <ReactQuill
        value={content}
        onChange={handleContentChange}
        theme="snow"
        placeholder="Start writing your text..."
        className="textEditor"
      />
      <button onClick={endSession} className="saveButton">Save and Exit</button>
    </div>
  );
};

export default CreateText;
