import useElementSize from './hooks/useElementSize';

function App() {
  const [ref, size] = useElementSize();
  console.log('size: ', size);

  return (
    <div style={{ width: '100vw', height: '100vh' }} ref={ref}>
      <div>Hello World!</div>
    </div>
  );
}

export default App;
