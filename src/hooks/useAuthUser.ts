import { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { LangIsUserWithId, getUser } from '../firebase/firestore';

import { onAuthChange } from '../firebase/auth';

const MAX_RETRIES = 3; // Maximum number of retries
const RETRY_DELAY = 1000; // Delay between retries in milliseconds

/**
 * Hook providing information abour currently logged user.
 * Try to use only a few times as each usage of hook is fetching and listening to the users
 */
const useAuthUser = () => {
  const [user, setUser] = useState<User | null>();
  const [userLangIs, setUserLangIs] = useState<LangIsUserWithId | null>(null);

  const [isLangIsUserError, setIsLangIsUserError] = useState<boolean>(false); // when failed to retrieve userLangIs from Firestore
  const [retryCount, setRetryCount] = useState<number>(0);

  // 1.) Fetch and listen for changes of Firebase Auth User
  useEffect(() => {
    onAuthChange((usr) => setUser(usr));
  }, []);

  // 2.) Fetch and listen for user changes in order to fetch the Firestore LangIS user
  useEffect(() => {
    if (user === undefined) {
      return;
    }
    if (user === null) {
      // When user logout.. user was switched to null.. so also switch the userLangIs to null!
      setUserLangIs(null);
      return;
    }

    const retrieveFireStoreUser = async () => {
      const usrIS = await getUser(user.uid);

      // In total, there are 3 attempts to fetch the user from Firestore DB..
      // The reason is that the user was previously created when logged in with provider, however Firebase has some minor delays!
      if (usrIS === undefined && retryCount < MAX_RETRIES) {
        console.error(
          `Attempt ${
            retryCount + 1
          } for retrieving user info has failed! Trying again...`
        );
        setTimeout(() => {
          setRetryCount((prev) => prev + 1);
        }, RETRY_DELAY);
        return;
      }

      if (usrIS === undefined) {
        // Fetched non-existing user in FireStore DB
        console.error(
          `Failed to retrieve user info after ${MAX_RETRIES} attempts!`
        );
        setIsLangIsUserError(true);
        return;
      }
      // Success!
      setUserLangIs(usrIS);
    };

    retrieveFireStoreUser();
  }, [user, retryCount]);

  return { user, userLangIs, isLangIsUserError };
};

export default useAuthUser;
