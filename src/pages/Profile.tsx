import { FC } from 'react';
import { User } from 'firebase/auth';

interface ProfilePageProps {
  user: User;
}

const Profile: FC<ProfilePageProps> = ({ user }) => {
  console.log('Profile Page!');
  console.log('user: ', user);
  return <div>Profile Page!</div>;
};

export default Profile;
