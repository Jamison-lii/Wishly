// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import BirthdayCard from "./pages/Home";
import LandingPage from "./pages/Home";
import Home from "./pages/Home";
import CreateCard from "./pages/CreateCard";
import BirthDayCard from "./pages/BirthDayCard";

function App() {
  return (
    <Router>
      <Routes>
       <Route path="/card/:cardId" element={<BirthDayCard />} /> 
        <Route path="/" element={<Home/>}/>
        <Route path='/create' element={<CreateCard/>}/> 
      </Routes>
    </Router>
  );
}

export default App;
