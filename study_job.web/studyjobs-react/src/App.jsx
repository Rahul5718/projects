import { Routes, Route, Link } from "react-router-dom";
import JobsPage from "./pages/JobsPage";
import SavedJobsPage from "./pages/SavedJobsPage";
import PostJobPage  from "./pages/PostJobPage";
import "./App.css";
import { useEffect } from "react";
import { messaging, getToken, onMessage } from "./firebase";

// inside your App component



function App() {
  useEffect(() => {
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      getToken(messaging, { vapidKey: "BDaAKQW1wi4-L_m1v_Ero83Y6He5D_VEikv8KKlu4x-tStNsNlrRQxHOFatTQdJgnX6r0UKVSoy_CfNwfGEDDTE" }).then((token) => {
        console.log("Device token:", token);
        // Later: send this token to your backend, save it to the database,
        // linked to this user, so your server knows who to notify
      });
    }
  });

  getToken(messaging, { vapidKey: "BDaAKQW1wi4-L_m1v_Ero83Y6He5D_VEikv8KKlu4x-tStNsNlrRQxHOFatTQdJgnX6r0UKVSoy_CfNwfGEDDTE" }).then((token) => {
  console.log("Device token:", token);

  fetch(`${import.meta.env.VITE_API_URL}/api/register-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
});

  onMessage(messaging, (payload) => {
    alert(`${payload.notification.title}: ${payload.notification.body}`); // foreground notification
  });
}, []);

  return (
    <div>
      <nav className="nav-bar">
        <Link to="/">Jobs</Link>
        <Link to="/saved">Saved</Link>
        <Link to="/post">Post a Job</Link>
      </nav>

      <Routes>
        <Route path="/" element={<JobsPage />} />
        <Route path="/saved" element={<SavedJobsPage />} />
        <Route path="/post" element={<PostJobPage/>}/>
      </Routes>
    </div>
  );
}

export default App;