
import Footer from '../components/Footer';
import Header from '../components/Header';
import MainContent from '../components/MainContent';
import SideBar from '../components/Sidebar';

const Main = () => {
 
  return (
    <div>
      <Header />
      <SideBar />
      <MainContent />
      <Footer style={{position: 'relative', bottom: '0', margin: '0', padding: '0' }}/>
    </div>
  );
};

export default Main;
