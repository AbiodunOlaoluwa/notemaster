import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import "./EditPage.css";

const DEBOUNCE_DELAY = 5000; // 5 seconds

const EditPage = () => {
    const { state } = useLocation();
    const textId = state.sessionId;
    const navigate = useNavigate();
    const userId = state?.userId;
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [startTime, setStartTime] = useState(Date.now());
    const [breakTime, setBreakTime] = useState(0);
    const [inactiveTime, setInactiveTime] = useState(0);
    const [isTabActive, setIsTabActive] = useState(true);
    const lastActiveTime = useRef(Date.now());
    const typingTimeout = useRef(null);

    useEffect(() => {
        const fetchText = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/text/${textId}`);
                setLoading(false);
                const data = response.data;
                setContent(data.content);
                // setBreakTime(isNaN(parseFloat(data.break_time)) ? 0 : parseFloat(data.break_time) * 60000);
                // setWritingDuration(isNaN(parseFloat(data.writing_time)) ? 0 : parseFloat(data.writing_time) * 60000);
                // setInactiveTime(isNaN(parseFloat(data.inactive_time)) ? 0 : parseFloat(data.inactive_time) * 60000);
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

    const handleKeyDown = (event) => {
        if ((event.ctrlKey || event.metaKey) && event.key === "s") {
            event.preventDefault();
            console.log("Save...");
            handleSave();
        }
    };

    const handleSave = async () => {
        const totalTime = (Date.now() - startTime) / 60000; // Convert to minutes
        const totalBreakTime = breakTime / 60000; // Convert to minutes
        const writingTime = (totalTime - totalBreakTime);
        const totalInactiveTime = inactiveTime / 60000; // Convert to minutes

        try {
            await axios.post(`http://localhost:3001/api/update-text/${textId}`, {
                userId,
                content,
                writingTime: writingTime,
                breakTime: totalBreakTime,
                inactiveTime: totalInactiveTime,
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

    if (loading) {
        return <div>Loading...</div>;
    }

    const handleExit = () => {
        handleSave();
        navigate('/textsPage', {replace: true});
    }

    return (
        <div className="editPageContainer">
            <ReactQuill value={content} onChange={handleContentChange} className="textEditor" />
            <div className="buttonsContainer">
                <button onClick={handleSave} className="saveButton">Save</button>
                <button onClick={handleDelete} className="exitButton">Delete</button>
                <button onClick={handleExit} className="exitButton">Close</button>
            </div>
        </div>
    );
};

export default EditPage;
