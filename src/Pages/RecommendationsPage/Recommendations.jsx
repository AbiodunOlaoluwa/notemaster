import { React, useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import axios from 'axios';
import { trefoil } from 'ldrs';
import "./Recommendations.css";

const Recommendations = () => {

    const { user } = useContext(UserContext);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    trefoil.register();

    useEffect(() => {
        if (user) {
            fetchRecommendations();
        }
    }, [user])

    const fetchRecommendations = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/recommendations/${user.id}`);
            const data = response.data.recommendations;

            if (data) {
                setRecommendations(data);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error Fetching Recommendation Data:", error)
            setLoading(false)
            setError(true);
            const fallbackData = ["Take less breaks", "Work Harder", "Write for longer", "Try to stay more consistently hydrated"];
            // setRecommendations(fallbackData);
        }
    }

    if (error) {
        return (
            <div className="mainRecommendationsContainer">
                <div className="errorContainer">
                    <h1 className="recommendationsPageErrorText">We encountered some problems fetching your recommendations.</h1>
                </div>
            </div>
        )
    }

if (loading) {
    return (
        <div className="mainRecommendationsContainer">
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
        </div>
    )
}

return (
    <div className="mainRecommendationsContainer">
        <h2 className="recommendationsTitleText">Your Recommendations</h2>
        {recommendations.length > 0 ? 
        <div className="recommendationsListContainer">
            {recommendations.map((recommendation, index) => (
                <div className="recommendationContainer" key={index}>
                    <p className="recommendation">{recommendation}</p>
                </div>
            ))}
        </div>
        : 
        <div className="noRecommendationsContainer">
            <h1>You have no recommendations yet... new user</h1>
        </div>
        }
    </div>
)
}

export default Recommendations