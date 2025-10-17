
import Footer from '../components/Footer';
import Header from '../components/Header';
import MainContent from '../components/MainContent';
import SideBar from '../components/Sidebar';

const main = () => {
 
  return (
    <div>
      <Header userType='resident'/>
      <SideBar />
      <MainContent />
      <Footer/>
    </div>
  );
};

export default main;
