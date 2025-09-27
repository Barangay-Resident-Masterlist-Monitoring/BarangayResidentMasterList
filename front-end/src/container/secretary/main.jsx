import React, { useState } from 'react';
import Header from '../components/Header';
import MainContent from '../components/MainContent';
import SideBar from '../components/SideBar';

const main = () => {

  return (
    <div>
      <Header />
      <SideBar />
      <MainContent />
    </div>
  );
};

export default main;
