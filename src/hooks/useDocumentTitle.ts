import { useEffect } from 'react';

const useDocumentTitle = (title: string): void => {
  useEffect(() => {
    window.document.title = title;
  }, [title]);
};

export default useDocumentTitle;
