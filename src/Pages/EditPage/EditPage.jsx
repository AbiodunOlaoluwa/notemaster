import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./EditPage.css";

axios.defaults.withCredentials = true;

const DEBOUNCE_DELAY = 5000; // 5 seconds
const AUTOSAVEINTERVAL = 1000;
const RECOMMENDATION_INTERVAL = 1000;

const EditPage = () => {
    const { state } = useLocation();
    const textId = state?.sessionId;
    const navigate = useNavigate();
    const userId = state?.userId;
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [startTime, setStartTime] = useState(Date.now());
    const [breakTime, setBreakTime] = useState(0);
    const [inactiveTime, setInactiveTime] = useState(0);
    const [interruptions, setInterruptions] = useState(0);
    const [isTabActive, setIsTabActive] = useState(true);
    const [pomodoroStart, setPomodoroStart] = useState(Date.now());
    const [stretchTimeStart, setStretchTime] = useState(Date.now());
    const [restEyesTimeStart, setEyesRestTime] = useState(Date.now());
    const [pomodoroCount, setPomodoroCount] = useState(0);
    const [fullscreen, setFullscreen] = useState(false);
    const lastActiveTime = useRef(Date.now());
    const typingTimeout = useRef(null);
    let savedBreakTime = useRef(0);
    let savedWritingTime = useRef(0);
    let savedInactiveTime = useRef(0);
    const shownRecommendations = useRef(new Set());

    useEffect(() => {
        const fetchText = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/text/${textId}`);
                setLoading(false);
                const data = response.data;
                setContent(data.content);
            } catch (error) {
                console.error("Error fetching text:", error);
                setLoading(false);
                navigate("/textsPage", { replace: true });
            }
        };

        fetchText();

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [textId, userId, navigate]);

    useEffect(() => {
        let comparisonContent = "";
        const saveInterval = setInterval(() => {
            if (comparisonContent !== content) {
                comparisonContent = content;
                handleSave();
            }
        }, AUTOSAVEINTERVAL);

        const recommendationInterval = setInterval(() => {
            showRecommendations();
        }, RECOMMENDATION_INTERVAL);

        return () => {
            clearInterval(saveInterval);
            clearInterval(recommendationInterval);
        }
    }, [content]);

    const handleVisibilityChange = () => {
        if (document.hidden) {
            setIsTabActive(false);
            lastActiveTime.current = Date.now();
        } else {
            setIsTabActive(true);
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

    const handleKeyDown = (event) => {
        if ((event.ctrlKey || event.metaKey) && event.key === "s") {
            event.preventDefault();
            handleSave();
        }

        else if (event.key === "Escape") {
            setFullscreen(false);
        }
    };

    const handleSave = async () => {
        const totalTime = (Date.now() - startTime) / 60000; // Convert to minutes
        const totalBreakTime = breakTime / 60000; // Convert to minutes
        const writingTime = (totalTime - totalBreakTime);
        const totalInactiveTime = inactiveTime / 60000; // Convert to minutes
        savedWritingTime.current += writingTime;
        savedBreakTime += totalBreakTime;
        savedInactiveTime += totalInactiveTime;

        try {
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/update-text/${textId}`, {
                userId,
                content,
                writingTime: writingTime,
                breakTime: totalBreakTime,
                inactiveTime: totalInactiveTime,
                interruptions,
            });
            setBreakTime(0);
            setInactiveTime(0);
        } catch (error) {
            console.error("Error saving content:", error);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/delete-text/${textId}`);
            navigate('/textsPage');
        } catch (error) {
            console.error("Error deleting text:", error);
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

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!(userId && textId)) {
        return <div>Loading...</div>;
    }

    const handleExit = () => {
        handleSave();
        navigate('/recommendations', { replace: true });
    }

    const handleFullscreenToggle = () => {
        setFullscreen(!fullscreen);
        if (!fullscreen) {
            toast.info("Press the Esc key to leave Fullscreen.", {
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
    }

    return (
        <div className="editPageContainer">
            <ReactQuill value={content} onChange={handleContentChange} className={`textEditor ${fullscreen ? "fullscreen" : ""}`} onBlur={() => setInterruptions(interruptions + 1)} onKeyDown={handleKeyDown} />
            <div className="buttonsContainer">
                <button onClick={handleSave} className="saveButton">Save</button>
                <button onClick={handleDelete} className="exitButton">Delete</button>
                <button onClick={handleExit} className="exitButton">Close</button>
                <button onClick={handleFullscreenToggle} className="saveButton">{fullscreen ? "Exit Fullscreen" : "Go Fullscreen"}</button>
            </div>
            <ToastContainer />
        </div>
    );
};

export default EditPage;
