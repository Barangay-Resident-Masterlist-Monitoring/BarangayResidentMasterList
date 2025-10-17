import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

const MainContent = () => {
    const [sidebarToggled, setSidebarToggled] = useState(sessionStorage.getItem('onToggleSidebar') || 'false');

   useEffect(() => {
      const interval = setInterval(() => {
        const storedValue = sessionStorage.getItem('onToggleSidebar') || 'false';
        setSidebarToggled((prev) => {
          if (prev !== storedValue) {
            return storedValue;
          }
          return prev;
        });
      }, 200);
  
      return () => clearInterval(interval);
    }, []);

  return (
    <main
      style={{
        paddingLeft: 
          sidebarToggled 
          === 'true' ? '3.9rem' 
          : 
          '16.5rem' && 'position: fixed; justify-content:center',
        
       transition: 'padding-left 0.1s',
    }}>
      <Outlet />
    </main>
  );
};

export default MainContent;
