import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SidePage from "./SidePage";
import Map from "./Map";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Map />} />
        <Route path="/sub" element={<SidePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
