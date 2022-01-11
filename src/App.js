import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

import IndexInmueble  from './components/inmueble/IndexInmueble';
import FormInmueble  from './components/inmueble/FormInmueble';

function App() {
  return (
    <Router>
      <Routes> 
        <Route path="/" element={<IndexInmueble />} />
        <Route path="/inmueble/:id" element={<FormInmueble />} />
        <Route path="/inmueble/create" element={<FormInmueble />} />
        <Route path="*" element={<IndexInmueble />}/>
      </Routes>
  </Router>
  );
}

export default App;
