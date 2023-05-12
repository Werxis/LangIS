import { FC } from 'react';
import HomeSignedIn from './HomeSignedIn';
import HomeSignedOut from './HomeSignedOut';

import { User } from 'firebase/auth';
import { useDocumentTitle } from '../../hooks';

interface HomeProps {
  user: User | null;
}

const Home: FC<HomeProps> = ({ user }) => {
  useDocumentTitle('LangIS - Home');
  if (user === null) {
    return <HomeSignedOut />;
  }

  return <HomeSignedIn />;
};

export default Home;
