import { useState, useEffect } from 'react';
import { onSnapshot, CollectionReference } from 'firebase/firestore';

/**
 * Get all items from the table provided by CollectionReference and listen to real-time updates.
 * @param collectionRef is CollectionReference to the NoSQL table
 * @returns all items present in the supplied collection table + listen to changes
 */
const useFirestoreCollectionOnSnapshot = <T>(
  collectionRef: CollectionReference<T>
) => {
  type TWithId = T & { uid: string };
  const [data, setData] = useState<TWithId[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Call onSnapshot() to listen to changes
    const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
      setIsLoading(true);
      const d = snapshot.docs.map((doc) => ({ ...doc.data(), uid: doc.id }));
      setData(d);
      setIsLoading(false);
    });

    // Don't forget to unsubscribe from listening to changes
    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, isLoading };
};

export default useFirestoreCollectionOnSnapshot;
