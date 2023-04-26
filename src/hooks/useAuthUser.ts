import { useEffect, useState } from 'react';
import { User } from 'firebase/auth';

import { onAuthChange } from '../firebase/auth';

/**
 * Hook providing information abour currently logged user.
 * @returns user: User | null
 */
const useAuthUser = () => {
  const [user, setUser] = useState<User | null>();

  useEffect(() => {
    onAuthChange((usr) => setUser(usr));
  }, []);

  return user;
};

export default useAuthUser;
