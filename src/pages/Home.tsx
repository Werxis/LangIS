import { useAuthUser } from '../hooks';
import HomeSignedIn from './Home/HomeSignedIn';
import HomeSignedOut from './Home/HomeSignedOut';

const Home = () => {
  const user = useAuthUser();
  const HomeComponent = user ? HomeSignedIn : HomeSignedOut;

  return <HomeComponent />;
};

export default Home;
