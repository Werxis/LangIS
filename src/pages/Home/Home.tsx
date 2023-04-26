import { FC } from 'react';
import HomeSignedIn from './HomeSignedIn';
import HomeSignedOut from './HomeSignedOut';

import { User } from 'firebase/auth';

interface HomeProps {
  user: User | null;
}

const Home: FC<HomeProps> = ({ user }) => {
  if (user === null) {
    return <HomeSignedOut />;
  }

  return <HomeSignedIn />;
};

export default Home;
