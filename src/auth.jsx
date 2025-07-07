import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, updateProfile } from 'firebase/auth';
import app from './firebase';

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export const handleSignOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const updateUserDisplayName = async (newDisplayName) => {
  try {
    if (!auth.currentUser) {
      throw new Error('No authenticated user');
    }
    
    await updateProfile(auth.currentUser, {
      displayName: newDisplayName
    });
    
    // Return the updated user object
    return auth.currentUser;
  } catch (error) {
    console.error('Error updating display name:', error);
    throw error;
  }
};

export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export { auth };