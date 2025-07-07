import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, updateProfile } from 'firebase/auth';
import app from './firebase';

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Configure the provider
provider.setCustomParameters({
  prompt: 'select_account'
});

export const signInWithGoogle = async () => {
  try {
    console.log('Attempting to sign in with Google...');
    console.log('Current domain:', window.location.hostname);
    
    const result = await signInWithPopup(auth, provider);
    console.log('Sign in successful:', result.user);
    
    return result;
  } catch (error) {
    console.error('Detailed sign in error:', {
      code: error.code,
      message: error.message,
      email: error.email,
      credential: error.credential
    });
    
    // error messages
    let userMessage = 'Failed to sign in. ';
    
    switch (error.code) {
      case 'auth/popup-blocked':
        userMessage += 'Please allow popups for this site.';
        break;
      case 'auth/popup-closed-by-user':
        userMessage += 'Sign in was cancelled.';
        break;
      case 'auth/unauthorized-domain':
        userMessage += 'This domain is not authorized. Please contact support.';
        break;
      case 'auth/operation-not-allowed':
        userMessage += 'Google sign in is not enabled.';
        break;
      case 'auth/invalid-api-key':
        userMessage += 'Invalid API key configuration.';
        break;
      default:
        userMessage += `Error: ${error.message}`;
    }
    
    throw new Error(userMessage);
  }
};

export const handleSignOut = async () => {
  try {
    console.log('Signing out...');
    await signOut(auth);
    console.log('Sign out successful');
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
    
    console.log('Updating display name to:', newDisplayName);
    
    await updateProfile(auth.currentUser, {
      displayName: newDisplayName
    });
    
    console.log('Display name updated successfully');
    
    // Return the updated user object
    return auth.currentUser;
  } catch (error) {
    console.error('Error updating display name:', error);
    throw error;
  }
};

export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    console.log('Auth state changed:', user ? 'User logged in' : 'User logged out');
    callback(user);
  });
};

export { auth };