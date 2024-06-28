import React, { useState, useEffect, useRef, useContext } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserContext } from '../../context/UserContext';
import "./CreateText.css";


const DEBOUNCE_DELAY = 5000; // 5 seconds
const AUTOSAVE_INTERVAL = 1000; // 1 second
const RECOMMENDATION_INTERVAL = 60000; // 1 minute

const CreateText = () => {
  const { user } = useContext(UserContext);
  const [content, setContent] = useState('');
  const [startTime, setStartTime] = useState(Date.now());
  const [breakTime, setBreakTime] = useState(0);
  const [inactiveTime, setInactiveTime] = useState(0);
  const [interruptions, setInterruptions] = useState(0);
  const [sessionId, setSessionId] = useState(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [pomodoroStart, setPomodoroStart] = useState(Date.now());
  const [stretchTimeStart, setStretchTime] = useState(Date.now());
  const [restEyesTimeStart, setEyesRestTime] = useState(Date.now());
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const navigate = useNavigate();
  const lastActiveTime = useRef(Date.now());
  const typingTimeout = useRef(null);
  const savedBreakTime = useRef(0);
  const savedWritingTime = useRef(0);
  const savedInactiveTime = useRef(0);
  const shownRecommendations = useRef(new Set());

  axios.defaults.withCredentials = true;

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [user.id]);

  useEffect(() => {
    const saveInterval = setInterval(() => {
      saveContent();
    }, AUTOSAVE_INTERVAL);

    const recommendationInterval = setInterval(() => {
      showRecommendations();
    }, RECOMMENDATION_INTERVAL);

    return () => {
      clearInterval(saveInterval);
      clearInterval(recommendationInterval);
    };
  }, [content, breakTime]);

  const handleVisibilityChange = () => {
    if (document.hidden) {
      lastActiveTime.current = Date.now();
    } else {
      const inactiveDuration = Date.now() - lastActiveTime.current;
      setInterruptions(prev => prev + 1);
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
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/save-session`, {
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
    } else if (sessionId && content) {
      try {
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/edit-session`, {
          sessionId,
          userId: user.id,
          content,
          writingTime,
          breakTime: totalBreakTime,
          inactiveTime: totalInactiveTime,
        });
      } catch (error) {
        console.error('Error saving content:', error);
      }
    }
  };

  const endSession = () => {
    saveContent().then(() => {
      navigate('/recommendations');
    });
  };

  const handleKeyDown = (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "s") {
      event.preventDefault();
      saveContent();
    } else if (event.key === "Escape") {
      setFullscreen(false);
    }
  };

  const showRecommendations = () => {
    const now = Date.now();
    const writingTime = savedWritingTime.current;
    const elapsedTime = (now - pomodoroStart) / 60000; // Convert to minutes
    const stretchTimeElapsed = (now - stretchTimeStart) / 6000;
    const eyesRestTimeElapsed = (now - restEyesTimeStart) / 6000;

    let message = null;

    if (elapsedTime >= 25 && pomodoroCount < 4) {
      message = "Time for a 5-minute break (Pomodoro technique). Remember to Hydrate!";
      setPomodoroStart(now);
      setPomodoroCount(pomodoroCount + 1);
    } else if (pomodoroCount === 4) {
      message = "Time for a 15-30 minute break (Pomodoro technique). Remember to Hydrate!";
      setPomodoroStart(now);
      setPomodoroCount(0);
    } else if (writingTime > 20 && interruptions > 4) {
      message = "You've been working for a while with frequent interruptions. Consider taking a break to refresh!";
    } else if (eyesRestTimeElapsed > 45) {
      message = "Consider resting your eyes for a few minutes.";
      setEyesRestTime(now);
    } else if (writingTime > 90) {
      message = "Time for a quick walk to refresh yourself.";
    } else if (interruptions > 6) {
      message = "Try to reduce distractions to enhance your focus.";
    } else if (writingTime > 3.5) {
      message = "Consider a deep work session to boost productivity.";
    } else if (stretchTimeElapsed > 60) {
      message = "Time for a standing or stretch break.";
      setStretchTime(now);
    } else if ((writingTime > 5) && !fullscreen) {
      message = "Consider writing in full screen for better focus.";
    } else if (writingTime > 10) {
      message = "Try turning off notifications to stay focused.";
    }

    if (message && !shownRecommendations.current.has(message)) {
      toast.info(message, {
        position: "top-right",
        autoClose: 30000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
      shownRecommendations.current.add(message);
    }
  };

  const handleFullscreenToggle = () => {
    setFullscreen(!fullscreen);
    if (!fullscreen) {
      toast.info("Press the Esc key to leave Fullscreen. Press F11 to enter browser Full Screen mode.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
      toast.info("Press F11 to enter browser Full Screen mode.", {
        position: "top-right",
        autoClose: 7000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
    });
    }
  };

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [startTime, breakTime, inactiveTime]);

  const handleBeforeUnload = (e) => {
    e.preventDefault();
    endSession();
    e.returnValue = ''; // For modern browsers
  };

  return (
    <div className={`createTextContainer ${fullscreen ? "fullscreen" : ""}`}>
      <ReactQuill
        value={content}
        onChange={handleContentChange}
        theme="snow"
        placeholder="Start writing your text..."
        className={`textEditor ${fullscreen ? "fullscreen" : ""}`}
        onBlur={() => setInterruptions(interruptions + 1)}
        onKeyDown={handleKeyDown}
      />
      <div className="buttonsContainer">
        <button onClick={saveContent} className="saveButton">Save</button>
        <button onClick={endSession} className="exitButton">Exit</button>
        <button onClick={handleFullscreenToggle} className="saveButton">{fullscreen ? "Exit Fullscreen" : "Go Fullscreen"}</button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CreateText;
