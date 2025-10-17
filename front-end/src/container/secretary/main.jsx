import Footer from '../components/Footer';
import Header from '../components/Header';
import MainContent from '../components/MainContent';
import SideBar from '../components/Sidebar';

const main = () => {

  return (
    <div>
      <Header userType='secretary'/>
      <SideBar />
      <MainContent />
      <Footer style={{position: 'relative', bottom: '0', }} />
    </div>
  );
};

export default main;
