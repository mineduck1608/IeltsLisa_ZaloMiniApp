import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./scenes/dashboard";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";
import AdminLayout from "./components/AdminLayout";
import Informations from "./scenes/informations";
import Gifts from "./scenes/gifts";
import Classes from "./scenes/classes";
import Feedbacks from "./scenes/feedback";
import Vouchers from "./scenes/voucher";
import { ToastContainer } from "react-toastify";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
            <Routes>
            <Route path="/*" element={<AdminLayout isSidebar={isSidebar} setIsSidebar={setIsSidebar} />}>
            <Route path="" element={<Navigate to="dashboard" />} /> {/* Default to Dashboard */}
            <Route path="dashboard" element={<Dashboard />} />
              <Route path="users" element={<Contacts />} />
              <Route path="informations" element={<Informations />} />
              <Route path="gifts" element={<Gifts />} />
              <Route path="classes" element={<Classes />} />
              <Route path="feedbacks" element={<Feedbacks />} />
              <Route path="vouchers" element={<Vouchers />} />
              <Route path="form" element={<Form />} />
              <Route path="bar" element={<Bar />} />
              <Route path="pie" element={<Pie />} />
              <Route path="line" element={<Line />} />
              <Route path="faq" element={<FAQ />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="geography" element={<Geography />} />
              </Route>
            </Routes>
      </ThemeProvider>
      <ToastContainer position="top-right" autoClose={3000} />
    </ColorModeContext.Provider>
  );
}

export default App;
