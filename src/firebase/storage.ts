import {
  getStorage,
  getDownloadURL,
  ref,
  uploadBytes,
  list,
  //listAll,
  StorageReference,
  UploadResult,
  ListResult,
} from 'firebase/storage';
import { User } from 'firebase/auth';
import { app } from './app';

const storage = getStorage(app);

// - - -

export const uploadProfilePicture = async (user: User, file: File) => {
  const imageRef: StorageReference = ref(
    storage,
    `images/profile_pictures/${user.uid}__${file.name}`
  );

  const uploaded: UploadResult = await uploadBytes(imageRef, file);
  const uploadedRef: StorageReference = uploaded.ref;
  const url = await getDownloadURL(uploadedRef);
  return url;
};

export const getAllProfilePictures = async () => {
  const profPicturesDirRef: StorageReference = ref(storage, 'images/');
  // listAll() does recursively, list does not..
  const listResult: ListResult = await list(profPicturesDirRef);

  const promiseUrls = listResult.items.map(async (item: StorageReference) => {
    const url = await getDownloadURL(item);
    return url;
  });

  const urls = await Promise.all(promiseUrls);
  return urls;
};

export const getProfilePicture = async (user: User, fileName: string) => {
  const imageRef = ref(
    storage,
    `images/profile_pictures/${user.uid}__${fileName}`
  );

  const url = await getDownloadURL(imageRef);
  return url;
};
