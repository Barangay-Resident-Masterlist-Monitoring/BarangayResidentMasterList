import { Outlet } from "react-router-dom";
import MainContentCSS from "../css/maincontent.module.css";

const MainContent = () => {
  return (
    <main className={MainContentCSS}>
      <Outlet />
    </main>
  );
};

export default MainContent;
