import { useState } from "react";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import { Routes, Route } from "react-router-dom";
import Builder from "./pages/Builder";
import Templates from "./pages/Templates";
import Learning from "./pages/Learning";
import MockCases from "./pages/MockCases";

function App() {
    const [darkMode, setDarkMode] = useState<boolean>(true);

    return (
        <div
            className={`w-full min-h-screen ${
                darkMode ? "dark bg-slate-900 text-gray-200" : "bg-gray-100 text-slate-900"
            }`}
        >
            <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/builder" element={<Builder />} />
                <Route path="/templates" element={<Templates />} />
                <Route path="/learning" element={<Learning />} />
                <Route path="/mockcases" element={<MockCases />} />
            </Routes>
        </div>
    );
}

export default App;
