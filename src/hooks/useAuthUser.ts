import { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { LangIsUserWithId, getUser } from '../firebase/firestore';

import { onAuthChange } from '../firebase/auth';

/**
 * Hook providing information abour currently logged user.
 * Try to use only a few times as each usage of hook is fetching and listening to the users
 * @returns user: User | null
 */
const useAuthUser = () => {
  const [user, setUser] = useState<User | null>();
  const [userLangIs, setUserLangIs] = useState<LangIsUserWithId | null>(null);

  // 1.) Fetch and listen for changes of Firebase Auth User
  useEffect(() => {
    onAuthChange((usr) => setUser(usr));
  }, []);

  // 2.) Fetch and listen for user changes in order to fetch the Firestore
  useEffect(() => {
    if (user === undefined) {
      return;
    }
    if (user === null) {
      setUserLangIs(null);
      return;
    }
    const retrieveFireStoreUser = async () => {
      const usrIS = await getUser(user.uid);
      if (usrIS === undefined) {
        // Fetched non-existing user in FireStore DB
        return;
      }
      setUserLangIs(usrIS);
    };

    retrieveFireStoreUser();
  }, [user]);

  return { user, userLangIs };
};

export default useAuthUser;
