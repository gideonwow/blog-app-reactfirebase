import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  query, 
  orderBy, 
  where, 
  increment,
  serverTimestamp,
  setDoc,
  writeBatch
} from 'firebase/firestore';
import app from './firebase';

const db = getFirestore(app);

const DEFAULT_HEADER_IMAGE = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80';

// Posts
export const createPost = async (postData, userId, userDisplayName) => {
  try {
    const post = {
      title: postData.title,
      content: postData.content,
      headerImage: postData.headerImageUrl || DEFAULT_HEADER_IMAGE,
      author: {
        id: userId,
        name: userDisplayName
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      views: 0
    };
    
    const docRef = await addDoc(collection(db, 'posts'), post);
    return { id: docRef.id, ...post };
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export const updatePost = async (postId, postData) => {
  try {
    await updateDoc(doc(db, 'posts', postId), {
      title: postData.title,
      content: postData.content,
      headerImage: postData.headerImageUrl || DEFAULT_HEADER_IMAGE,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

export const deletePost = async (postId) => {
  try {
    await deleteDoc(doc(db, 'posts', postId));
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

export const getPost = async (postId) => {
  try {
    const docSnap = await getDoc(doc(db, 'posts', postId));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting post:', error);
    throw error;
  }
};

export const getAllPosts = async () => {
  try {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error loading posts:', error);
    // Return empty array instead of throwing to prevent white screen
    return [];
  }
};

export const getUserPosts = async (userId) => {
  try {
    const q = query(
      collection(db, 'posts'), 
      where('author.id', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    const posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    

    return posts.sort((a, b) => {
      const aTime = a.createdAt?.toDate?.() || new Date(a.createdAt || 0);
      const bTime = b.createdAt?.toDate?.() || new Date(b.createdAt || 0);
      return bTime.getTime() - aTime.getTime(); //descending order
    });
  } catch (error) {
    console.error('Error loading user posts:', error);
    // Return empty array instead of throwing to prevent white screen
    return [];
  }
};

export const incrementPostViews = async (postId) => {
  try {
    await updateDoc(doc(db, 'posts', postId), {
      views: increment(1)
    });
  } catch (error) {
    console.error('Error updating views:', error);
    // Don't throw error for view updates
  }
};

// Update all posts by user when display name changes
export const updateUserPostsDisplayName = async (userId, newDisplayName) => {
  try {
    const batch = writeBatch(db);
    
 
    const q = query(
      collection(db, 'posts'), 
      where('author.id', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    
    // Update each post's author name
    querySnapshot.docs.forEach((docSnapshot) => {
      const postRef = doc(db, 'posts', docSnapshot.id);
      batch.update(postRef, {
        'author.name': newDisplayName,
        updatedAt: serverTimestamp()
      });
    });
    
    
    await batch.commit();
    
    console.log(`Updated ${querySnapshot.docs.length} posts with new display name`);
  } catch (error) {
    console.error('Error updating user posts display name:', error);
    throw error;
  }
};

// User Profile
export const getUserProfile = async (userId) => {
  try {
    const docSnap = await getDoc(doc(db, 'users', userId));
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return { aboutMe: '' };
  } catch (error) {
    console.error('Error loading user profile:', error);
    return { aboutMe: '' };
  }
};

export const updateUserProfile = async (userId, profileData, userDisplayName, userPhotoURL) => {
  try {
    await setDoc(doc(db, 'users', userId), {
      aboutMe: profileData.aboutMe,
      displayName: userDisplayName,
      photoURL: userPhotoURL,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};