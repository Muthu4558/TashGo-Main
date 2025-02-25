import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "../components/Loader";
import Title from "../components/Title";
import Table from "../components/task/Table";
import { FaArrowLeft } from "react-icons/fa"; 

const UserDetails = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/user/${userId}`);
        const data = await response.json();

        if (response.ok) {
          setUserData(data);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("An error occurred while fetching user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const { user, tasks } = userData || {};

  return (
    <div className="w-full">
      <div className="flex items-center gap-5 mb-4">
        {/* Back button in the top left corner */}
        <button
          onClick={() => navigate(-1)} 
          className="text-xl text-gray-600 p-2 rounded-full hover:bg-gray-200"
        >
          <FaArrowLeft />
        </button>
        <Title title={`${user?.name}'s Tasks`} />
      </div>

      {tasks && tasks.length > 0 ? (
        <Table tasks={tasks} />
      ) : (
        <p>No tasks available for this user.</p>
      )}
    </div>
    
  );

};

export default UserDetails;