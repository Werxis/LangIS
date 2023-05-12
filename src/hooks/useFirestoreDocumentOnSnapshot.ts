import { useState, useEffect } from 'react';
import { onSnapshot, DocumentReference } from 'firebase/firestore';

const useFirestoreDocumentOnSnapshot = <T>(
  documentRef: DocumentReference<T>
) => {
  const [data, setData] = useState<T & { uid: string }>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(documentRef, (snapshot) => {
      setIsLoading(true);
      const d = { ...(snapshot.data() as T), uid: snapshot.id };
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

export default useFirestoreDocumentOnSnapshot;
