import React, { useState, useEffect, useRef, useContext } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import "./CreateText.css";

const DEBOUNCE_DELAY = 5000; // 5 seconds

const CreateText = () => {
  const { user } = useContext(UserContext);
  const [content, setContent] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [breakTime, setBreakTime] = useState(0);
  const [inactiveTime, setInactiveTime] = useState(0);
  const [isTabActive, setIsTabActive] = useState(true);
  const [sessionId, setSessionId] = useState(null);
  const navigate = useNavigate();
  const autoSaveInterval = useRef(null);
  const lastActiveTime = useRef(Date.now());
  const typingTimeout = useRef(null);

  useEffect(() => {
    setStartTime(Date.now());

    autoSaveInterval.current = setInterval(() => {
      saveContent();
    }, 10000);

    // Event listeners for tab visibility
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(autoSaveInterval.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [user.id]);

  const handleVisibilityChange = () => {
    if (document.hidden) {
      setIsTabActive(false);
      lastActiveTime.current = Date.now();
    } else {
      setIsTabActive(true);
      const inactiveDuration = Date.now() - lastActiveTime.current;
      setInactiveTime(prev => prev + inactiveDuration);
    }
  };

  const handleContentChange = (value) => {
    setContent(value);
    handleTyping();
  };

  const handleTyping = () => {
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    typingTimeout.current = setTimeout(() => {
      const now = Date.now();
      const breakDuration = now - lastActiveTime.current;
      if (breakDuration > DEBOUNCE_DELAY) {
        setBreakTime(prev => prev + breakDuration);
      }
      lastActiveTime.current = now;
    }, DEBOUNCE_DELAY);
  };

  const saveContent = async () => {
    if (!user) return;
    const totalTime = (Date.now() - startTime) / 60000; // Convert to minutes
    const totalBreakTime = breakTime / 60000; // Convert to minutes
    const writingTime = totalTime - totalBreakTime;
    const totalInactiveTime = inactiveTime / 60000; // Convert to minutes
    if (!sessionId && content) {
      try {
        const response = await axios.post('http://localhost:3001/api/save-session', {
          userId: user.id,
          content,
          writingTime,
          breakTime: totalBreakTime,
          inactiveTime: totalInactiveTime,
        });
        setSessionId(response.data.sessionId);
      } catch (error) {
        console.error('Error saving content:', error);
      }
    }
    else if (sessionId && content) {
      try {
        await axios.post('http://localhost:3001/api/edit-session', {
          sessionId,
          userId: user.id,
          content,
          writingTime,
          breakTime: totalBreakTime,
          inactiveTime: totalInactiveTime,
        })
      } catch (error) {
        console.error('Error saving content:', error);
      }
    }
  };

  const endSession = () => {
    saveContent();
    navigate('/dashboard');
  }

const handleBeforeUnload = (e) => {
  e.preventDefault();
  endSession();
  e.returnValue = ''; // For modern browsers
};

const handleKeyDown = (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "s") {
    event.preventDefault();
    console.log("Save...")
    saveContent();
  }
};

useEffect(() => {
  window.addEventListener('beforeunload', handleBeforeUnload);
  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
}, [startTime, breakTime, inactiveTime]);

return (
  <div className="createTextContainer">
    <ReactQuill
      value={content}
      onChange={handleContentChange}
      theme="snow"
      placeholder="Start writing your text..."
      className="textEditor"
    />
    <div className="buttonsContainer">
      <button onClick={saveContent} className="saveButton">Save</button>
      <button onClick={endSession} className="exitButton">Exit</button>
    </div>
  </div>
);
};

export default CreateText;
