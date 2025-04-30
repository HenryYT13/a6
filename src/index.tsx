import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { MainMenuPhone } from "./screens/MainMenuPhone/MainMenuPhone";
import { SubmitForm } from "./screens/SubmitForm/SubmitForm";
import { Schedule } from "./screens/Schedule/Schedule";
import { AdminLogin } from "./screens/AdminPage/AdminLogin";
import { AdminDashboard } from "./screens/AdminPage/AdminDashboard";
import { AdminSubmissions } from "./screens/AdminPage/AdminSubmissions";
import { AdminWeeks } from "./screens/AdminPage/AdminWeeks";
import { AdminTimetable } from "./screens/AdminPage/AdminTimetable";
import { AdminHomeTimes } from "./screens/AdminPage/AdminHomeTimes";
import "./lib/i18n";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="light">
      <Router>
        <Routes>
          <Route path="/" element={<MainMenuPhone />} />
          <Route path="/submit" element={<SubmitForm />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/submissions" element={<AdminSubmissions />} />
          <Route path="/admin/weeks" element={<AdminWeeks />} />
          <Route path="/admin/timetable" element={<AdminTimetable />} />
          <Route path="/admin/home-times" element={<AdminHomeTimes />} />
        </Routes>
      </Router>
    </ThemeProvider>
  </StrictMode>
);