import { useEffect, useState, RefObject, useRef } from 'react';

interface Size {
  width: number;
  height: number;
}

const useElementSize = <T extends HTMLElement = HTMLDivElement>(): [
  RefObject<T>,
  Size
] => {
  const elRef = useRef<T>(null);
  const [elSize, setElSize] = useState<Size>({ width: 0, height: 0 });

  const handleSizeChange = () => {
    if (elRef.current === null) {
      return;
    }

    const w = elRef.current.offsetWidth;
    const h = elRef.current.offsetHeight;
    setElSize({ width: w, height: h });
  };

  useEffect(() => {
    window.addEventListener('resize', handleSizeChange);

    return () => window.removeEventListener('resize', handleSizeChange);
  }, []);

  useEffect(() => {
    handleSizeChange();
  }, [elRef, elRef.current?.offsetWidth, elRef.current?.offsetHeight]);

  return [elRef, elSize];
};

export default useElementSize;
