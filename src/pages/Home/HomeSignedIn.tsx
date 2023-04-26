import { logout } from '../../firebase/auth';

const HomeSignedIn = () => {
  console.log('Home Signed In!');
  return (
    <div>
      <div>Home Signed In!</div>
      <button onClick={() => logout()}>Log out!</button>
    </div>
  );
};

export default HomeSignedIn;
