import React, { useState } from 'react';
import Navbar from '../../../Components/NavBar';
import Sidebar from './Sidebar';

const AnnouncementsFoodHead = () => {
  const [announcement, setAnnouncement] = useState('');
  const [position, setPosition] = useState('');
  const [personName, setPersonName] = useState('');
  const [audienceType, setAudienceType] = useState('individual');
  const [darkMode, setDarkMode] = useState(false);

  const announcements = [
    { id: 1, title: "New Menu Update", date: "2024-02-10", details: "Please come to my office immediately.", sentTo: "Admin - Mr.Kasun" },
    { id: 2, title: "Holiday Schedule", date: "2024-02-14", details: "The cafeteria will be closed on public holidays.", sentTo: "Reviewer" },
    { id: 3, title: "Hygiene Reminder", date: "2024-01-28", details: "Please prepare a detailed report for the food department audit system.", sentTo: "Auditor" }
  ];

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleAnnouncementChange = (event) => {
    setAnnouncement(event.target.value);
  };

  const handlePositionChange = (event) => {
    setPosition(event.target.value);
  };

  const handlePersonNameChange = (event) => {
    setPersonName(event.target.value);
  };

  const handleAudienceTypeChange = (event) => {
    setAudienceType(event.target.value);
    setPosition('');
    setPersonName('');
  };

  const handleSubmitAnnouncement = () => {
    if (!announcement.trim()) {
      alert("Please enter a valid announcement.");
      return;
    }
    if (audienceType === 'position' && !position) {
      alert("Please select a position.");
      return;
    }
    if (audienceType === 'individual' && (!position || !personName)) {
      alert("Please fill all the required fields.");
      return;
    }

    let message = `Announcement: ${announcement}`;
    if (audienceType === 'position') {
      message += ` for the ${position} position.`;
    } else {
      message += ` for ${personName} in the ${position} position.`;
    }
    alert(message);
    setAnnouncement('');
    setPersonName('');
    setPosition('');
  };

  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-200 text-black'}`}>
      <Navbar toggleSidebar={() => setIsSidebarVisible(!isSidebarVisible)} />
      <div className="flex flex-grow">
      {!isSidebarVisible && <Sidebar />}
        <main className={`flex-grow p-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} rounded-xl shadow-lg transition-all duration-300 ease-in-out`}>
          <div className="flex justify-between items-center mb-6">
            <label className={`text-2xl font-bold py-2 px-4 rounded-lg inline-block ${darkMode ? 'bg-teal-600 text-white' : 'bg-slate-400 text-black'} shadow-lg`}>
              Announcement
            </label>
            <button
              onClick={handleToggleDarkMode}
              className="px-4 py-2 text-xl font-semibold rounded-lg transition-all bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-600 text-white hover:scale-105 transform duration-200 ease-in-out"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
          </div>

          <div className="mb-6">
            <label className="font-semibold">Select Audience Type: </label>
            <select value={audienceType} onChange={handleAudienceTypeChange} className="ml-4 p-2 border rounded-lg text-black font-semibold bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md transition-all duration-200">
              <option value="individual">Individual</option>
              <option value="position">Position</option>
            </select>
          </div>

          {audienceType === 'position' && (
            <div className="mb-6">
              <label className="font-semibold">Select Position: </label>
              <select value={position} onChange={handlePositionChange} className="ml-4 p-2 border rounded-lg text-black font-semibold bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md transition-all duration-200">
                <option value="">Select a position</option>
                <option value="Project Creator">Project Creator</option>
                <option value="Planner">Planner</option>
                <option value="Contractor">Contractor</option>
                <option value="Auditor">Auditor</option>
                <option value="Certifier">Certifier</option>
                <option value="Reviewer">Reviewer</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          )}

          {audienceType === 'individual' && (
            <>
              <div className="mb-6">
                <label className="font-semibold">Select Position: </label>
                <select
                  value={position}
                  onChange={handlePositionChange}
                  className="ml-4 p-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-md text-black"
                >
                  <option value="">Select a position</option>
                  <option value="Project Creator">Project Creator</option>
                  <option value="Planner">Planner</option>
                  <option value="Contractor">Contractor</option>
                  <option value="Auditor">Auditor</option>
                  <option value="Certifier">Certifier</option>
                  <option value="Reviewer">Reviewer</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="font-semibold">Enter Person's Name: </label>
                <input
                  type="text"
                  value={personName}
                  onChange={handlePersonNameChange}
                  className="ml-4 p-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-md text-black"
                  placeholder="Enter name"
                />
              </div>
            </>
          )}

          <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <textarea
              value={announcement}
              onChange={handleAnnouncementChange}
              rows="4"
              className="w-full p-4 border rounded-lg resize-none text-black font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
              placeholder="Write your announcement here..."
            />
            <button
              onClick={handleSubmitAnnouncement}
              className="mt-4 py-2 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:bg-blue-700 shadow-lg transition-all duration-200"
            >
              Submit Announcement
            </button>
          </div>

          <label className={`text-xl font-semibold py-2 px-4 rounded-lg inline-block mb-8 ${darkMode ? 'bg-teal-600 text-white' : 'bg-slate-400 text-black'}`}>
            Announcements History
          </label>

          <div className="overflow-x-auto">
            <table className={`w-full border-collapse border ${darkMode ? 'border-gray-600' : 'border-gray-300'} text-black`}>
              <thead>
                <tr className={`${darkMode ? 'bg-teal-200 text-black' : 'bg-blue-500 text-white'}`}>
                  <th className={`border px-4 py-2 ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>Title</th>
                  <th className={`border px-4 py-2 ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>Date</th>
                  <th className={`border px-4 py-2 ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>Details</th>
                  <th className={`border px-4 py-2 ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>Sent To</th>
                </tr>
              </thead>
              <tbody>
                {announcements.map((item, index) => (
                  <tr key={item.id} className={darkMode ? (index % 2 === 0 ? "bg-gray-700 text-white" : "bg-gray-800 text-white") : (index % 2 === 0 ? "bg-gray-100" : "bg-white")}>
                    <td className={`border px-4 py-2 ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>{item.title}</td>
                    <td className={`border px-4 py-2 ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>{item.date}</td>
                    <td className={`border px-4 py-2 ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>{item.details}</td>
                    <td className={`border px-4 py-2 ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>{item.sentTo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </main>
      </div>
    </div>
  );
};

export default AnnouncementsFoodHead;
