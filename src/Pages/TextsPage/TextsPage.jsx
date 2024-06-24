import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import './TextsPage.css';
import { trefoil } from 'ldrs';

const TextsPage = () => {
  const { user } = useContext(UserContext);
  const [texts, setTexts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/dashboard", { replace: true });
    }
    else setLoading(false);
  }, [user])

  useEffect(() => {
    const fetchTexts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/user-texts/${user.id}`);
        setTexts(response.data);
      } catch (error) {
        console.error('Error fetching texts:', error);
      }
    };

    fetchTexts();
  }, [user.id]);

  const handleDelete = async (sessionId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/delete-text/${sessionId}`);
      setTexts(texts.filter(text => text.id !== sessionId));
    } catch (error) {
      console.error('Error deleting text:', error);
    }
  };

  if (loading) {
    return (
      <div className="loaderContainer">
        <l-trefoil
          size="40"
          stroke="4"
          stroke-length="0.15"
          bg-opacity="0.1"
          speed="1.4"
          color="white"
        ></l-trefoil>
      </div>
    )
  }

  return (
    <div className="textsPageContainer">
      {loading && <div className="loaderContainer">
        <l-trefoil
          size="40"
          stroke="4"
          stroke-length="0.15"
          bg-opacity="0.1"
          speed="1.4"
          color="white"
        ></l-trefoil>
      </div>}
      {user && texts.length > 0 ?
        <div className="textsMap">
          {texts.map(text => (
            <div className="textCard" key={text.id}>
              <div className="textCardContent" onClick={() => navigate("/editPage", { replace: true, state: { sessionId: text.id, userId: user.id } })}>
                <ReactQuill
                  className='textsPageReactQuill'
                  value={`${text.content.substring(0, 200)}...`}
                  readOnly={true}
                  modules={{ toolbar: false }}
                />
              </div>
              <div className="textCardActions">
                <button onClick={() => navigate("/editPage", { replace: true, state: { sessionId: text.id, userId: user.id } })}>Edit</button>
                <button onClick={() => handleDelete(text.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div> :
        <div className="defaultNoTexts">
          <div className="defaultTextsPageText">
            <p>When you create texts, they will be displayed here...</p>
          </div>
        </div>
      }
    </div>
  );
};

export default TextsPage;
