import { useDocumentTitle } from '../hooks';

const NotFound = () => {
  useDocumentTitle('LangIS - Not Found');
  return <div>Not Found!</div>;
};

export default NotFound;
