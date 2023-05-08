import { type NextPage } from 'next';
import TopBar from '../TopBar';

const MainNavigation: NextPage = () => {
  
  return (
    <header>
      <TopBar toggleSidebar={null} />
    </header>
  );
}

export default MainNavigation;
