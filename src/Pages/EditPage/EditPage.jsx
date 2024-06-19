import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./EditPage.css";

const DEBOUNCE_DELAY = 5000; // 5 seconds
const AUTOSAVEINTERVAL = 1000;
const RECOMMENDATION_INTERVAL = 300000;

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
    const lastActiveTime = useRef(Date.now());
    const typingTimeout = useRef(null);
    let savedBreakTime = useRef(0);
    let savedWritingTime = useRef(0);
    let savedInactiveTime = useRef(0);

    useEffect(() => {
        const fetchText = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/text/${textId}`);
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
                setInterruptions(prev => prev + 1);
            }
            lastActiveTime.current = now;
        }, DEBOUNCE_DELAY);
    };

    const handleKeyDown = (event) => {
        if ((event.ctrlKey || event.metaKey) && event.key === "s") {
            event.preventDefault();
            handleSave();
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
            await axios.post(`http://localhost:3001/api/update-text/${textId}`, {
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
            await axios.delete(`http://localhost:3001/api/delete-text/${textId}`);
            navigate('/textsPage');
        } catch (error) {
            console.error("Error deleting text:", error);
        }
    };

    const showRecommendations = () => {
        const writingTime = savedWritingTime.current;

        if (writingTime > 2 && interruptions > 1) {
            toast.warn("You've been working for a while with frequent interruptions. Consider taking a break to refresh!");
        } else if (writingTime > 3) {
            toast.info("You've been working for over an hour. Time for a break and stay hydrated!");
        } else if (writingTime > 5) {
            toast.warn("You've been working for over 90 minutes. It's important to take a longer break now.");
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    const handleExit = () => {
        handleSave();
        navigate('/textsPage', { replace: true });
    }

    return (
        <div className="editPageContainer">
            <ToastContainer />
            <ReactQuill value={content} onChange={handleContentChange} className="textEditor" onBlur={() => setInterruptions(interruptions + 1)} />
            <div className="buttonsContainer">
                <button onClick={handleSave} className="saveButton">Save</button>
                <button onClick={handleDelete} className="exitButton">Delete</button>
                <button onClick={handleExit} className="exitButton">Close</button>
            </div>
        </div>
    );
};

export default EditPage;
