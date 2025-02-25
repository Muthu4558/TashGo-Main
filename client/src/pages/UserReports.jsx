import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft } from "react-icons/fa";
import Title from "../components/Title";
import { toast } from "sonner";
import * as XLSX from 'xlsx';

const UserReports = () => {
  const { userId } = useParams();
  const [reports, setReports] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/api/daily-reports/${userId}`);
        if (response.status === 200) {
          const sortedReports = response.data.sort((a, b) =>
            new Date(b.createdAt || b.dateTime) - new Date(a.createdAt || a.dateTime)
          );
          setReports(sortedReports);
        } else {
          setError("Failed to fetch reports.");
        }
      } catch (error) {
        console.error('Error fetching reports:', error.response?.data || error.message);
        setError('Error fetching reports.');
      }
    };

    fetchReports();
  }, [userId]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/api/user/${userId}`);
        
        if (response.status === 200) {
          setUserData(response.data);
        } else {
          setError("Failed to fetch user data.");
        }
      } catch (err) {
        // console.error("Error fetching user data:", err.response?.data || err.message);
        setError("An error occurred while fetching user data.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserData();
  }, [userId]);
    

  const handleRemarkSubmit = async (reportId, remark) => {
    try {
      await axios.put(`${import.meta.env.VITE_APP_BASE_URL}/api/daily-reports/${reportId}`, { remark });

      setReports((prevReports) =>
        prevReports.map((report) =>
          report._id === reportId ? { ...report, remark, newRemark: "" } : report
        )
      );

      toast.success("Remark submitted successfully!", {
        style: {
          backgroundColor: "#4caf50",
          color: "#fff",
          fontSize: "16px",
          padding: "10px",
        },
      });
    } catch (error) {
      console.error('Error updating remark:', error.response?.data || error.message);
      setError('Error updating remark.');

      toast.error("Error submitting remark. Please try again.", {
        style: {
          backgroundColor: "#f44336",
          color: "#fff",
          fontSize: "16px",
          padding: "10px",
        },
      });
    }
  };

  const handleDownload = () => {
    const data = reports.map((report, index) => ({
      'S.no': index + 1,
      Report: report.content,
      'Date & Time': new Date(report.createdAt || report.dateTime).toLocaleString(),
      Status: report.status || 'Todo',
      Remark: report.remark || 'No remark yet',
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reports');
    XLSX.writeFile(workbook, `${user?.name || 'User'}_Reports.xlsx`);
  };

  const user = userData || {};

  return (
    <div className="p-4">
      <div className="flex items-center gap-1 align-middle mb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-xl text-gray-600 p-2 rounded-full hover:bg-gray-200"
        >
          <FaArrowLeft />
        </button>
        <Title title={`${user?.name || 'User'}'s Reports`} />
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <div className="bg-white p-5">
        <div className="flex justify-end mb-4">
          <button
            onClick={handleDownload}
            className="bg-[#229ea6] text-white px-4 py-2 rounded hover:bg-[#197d7e]"
          >
            Download
          </button>
        </div>

        {reports.length > 0 ? (
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full table-auto border-collapse bg-white">
              <thead>
                <tr className="bg-[#f3f4f6] text-gray-700 font-extrabold">
                  <th className="border px-4 py-3 text-left font-medium">S.no</th>
                  <th className="border px-4 py-3 text-left font-medium">Report</th>
                  <th className="border px-4 py-3 text-left font-medium">Date & Time</th>
                  <th className="border px-4 py-3 text-left font-medium">Status</th>
                  <th className="border px-4 py-3 text-left font-medium">Remark</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report, index) => (
                  <tr key={report._id || index} className="hover:bg-gray-100 bg-white">
                    <td className="border px-4 py-3 text-gray-700">{index + 1}</td>
                    <td className="border px-4 py-3 text-gray-700 break-words">
                      {report.content}
                    </td>
                    <td className="border px-4 py-3 text-gray-700">
                      {new Date(report.createdAt || report.dateTime).toLocaleString()}
                    </td>
                    <td className="border px-4 py-3 text-gray-700">{report.status || 'Todo'}</td>
                    <td className="border px-4 py-3 text-gray-700">
                      {report.remark || 'No remark yet'}
                      <div className="mt-2">
                        <textarea
                          rows="2"
                          className="w-full p-2 border rounded bg-gray-100"
                          placeholder="Add a remark"
                          onChange={(e) =>
                            setReports((prevReports) =>
                              prevReports.map((r) =>
                                r._id === report._id ? { ...r, newRemark: e.target.value } : r
                              )
                            )
                          }
                          value={report.newRemark || ''}
                        ></textarea>
                        <button
                          className="mt-2 bg-[#229ea6] text-white px-3 py-1 rounded hover:bg-[#197d7e]"
                          onClick={() =>
                            handleRemarkSubmit(report._id, report.newRemark || '')
                          }
                        >
                          Submit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-sm mt-4">No reports found.</p>
        )}
      </div>
    </div>
  );
};

export default UserReports;
