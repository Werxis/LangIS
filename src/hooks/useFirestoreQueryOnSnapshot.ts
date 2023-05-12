import { useState, useEffect } from 'react';
import { onSnapshot, Query } from 'firebase/firestore';

const useFirestoreQueryOnSnapshot = <T>(query: Query<T>) => {
  const [data, setData] = useState<(T & { uid: string })[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(query, (snapshot) => {
      setIsLoading(true);
      const d = snapshot.docs.map((doc) => ({ ...doc.data(), uid: doc.id }));
      setData(d);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, isLoading };
};

export default useFirestoreQueryOnSnapshot;
