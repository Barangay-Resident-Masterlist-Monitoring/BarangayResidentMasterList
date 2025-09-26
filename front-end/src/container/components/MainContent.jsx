import { Outlet } from "react-router-dom";
import MainContentCSS from "../css/MainContent.module.css";

const mainContent = () => {
  return (
    <main className={MainContentCSS}>
      <Outlet />
    </main>
  );
};

export default mainContent;
