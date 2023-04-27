import { User } from 'firebase/auth';
import { LangISUser } from './firebase/firestore';

import emptyAccountImage from './assets/icons/image_empty_account.jpg';

/**
 * Primary photoURL is the photo which was explicitly uploaded by the user through profile page
 * Secondary photoURL is the photoURL provided by the Google or GitHub provider (their profile photo)
 * If primary and secondary URLs are both undefined or null, default emptyAccountImage icon is used!
 * @param user type of User from Firebase Auth service
 * @param userLangIs type of LangIsUser from Firebase Firestore service (our user with additional fields)
 * @returns string which represents the src of the photo url diplayed on the profile + avatar
 */
export const retrieveProfilePhotoUrl = (
  user: User,
  userLangIs: LangISUser | null
): string => {
  const userPhotoUrl = user.photoURL;
  const userLangIsPhotoUrl = userLangIs?.photoUrl;

  if (userLangIsPhotoUrl) {
    return userLangIsPhotoUrl;
  }

  if (userPhotoUrl) {
    return userPhotoUrl;
  }

  return emptyAccountImage;
};
