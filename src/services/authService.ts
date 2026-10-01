import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInAnonymously, 
  signOut as fbSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp, 
  onSnapshot 
} from 'firebase/firestore';
import { auth, db } from './firebase';
import { UserProfile, UserRole } from '../types';

export const googleProvider = new GoogleAuthProvider();

export async function loginWithGoogle(defaultRole: UserRole = 'OWNER'): Promise<UserProfile> {
  const result = await signInWithPopup(auth, googleProvider);
  const fbUser = result.user;

  const userRef = doc(db, 'users', fbUser.uid);
  const userSnap = await getDoc(userRef);

  let profile: UserProfile;

  if (userSnap.exists()) {
    profile = userSnap.data() as UserProfile;
  } else {
    // Determine initial role: owner if warungbangkobra1@gmail.com
    const isOwnerEmail = fbUser.email?.toLowerCase().includes('warungbangkobra');
    const role: UserRole = isOwnerEmail ? 'OWNER' : defaultRole;

    profile = {
      uid: fbUser.uid,
      email: fbUser.email || '',
      displayName: fbUser.displayName || 'Pengguna WBK',
      phone: fbUser.phoneNumber || '',
      role: role,
      photoUrl: fbUser.photoURL || '',
      createdAt: serverTimestamp(),
    };

    await setDoc(userRef, profile, { merge: true });
  }

  return profile;
}

export async function loginAnonymouslyWithRole(role: UserRole, displayName: string, phone: string): Promise<UserProfile> {
  let fbUser = auth.currentUser;
  
  if (!fbUser) {
    try {
      const cred = await signInAnonymously(auth);
      fbUser = cred.user;
    } catch (authErr: any) {
      console.warn("Firebase Auth signInAnonymously restricted/disabled in project console:", authErr?.message);
      // Generate a stable local UID for simulated staff profile when Firebase Auth provider is restricted
      const localUid = `wbk_staff_${role.toLowerCase()}_${Date.now().toString(36)}`;
      const localProfile: UserProfile = {
        uid: localUid,
        email: `${role.toLowerCase()}_${phone || 'staff'}@warungbangkobra.com`,
        displayName: displayName || `Staff ${role}`,
        phone: phone || '',
        role: role,
        photoUrl: '',
      };
      
      // Attempt to save to firestore if permitted, otherwise return profile
      try {
        const userRef = doc(db, 'users', localUid);
        await setDoc(userRef, { ...localProfile, createdAt: serverTimestamp() }, { merge: true });
      } catch (dbErr) {
        console.warn("Firestore user record sync notice:", dbErr);
      }
      return localProfile;
    }
  }

  const userRef = doc(db, 'users', fbUser.uid);
  const profile: UserProfile = {
    uid: fbUser.uid,
    email: fbUser.email || `${role.toLowerCase()}_${fbUser.uid.substring(0, 5)}@warungbangkobra.com`,
    displayName: displayName || fbUser.displayName || `Staff ${role}`,
    phone: phone || fbUser.phoneNumber || '',
    role: role,
    photoUrl: fbUser.photoURL || '',
    createdAt: serverTimestamp(),
  };

  try {
    await setDoc(userRef, profile, { merge: true });
  } catch (dbErr) {
    console.warn("Firestore user sync notice:", dbErr);
  }
  return profile;
}

export async function updateUserRole(uid: string, newRole: UserRole): Promise<void> {
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, { role: newRole, updatedAt: serverTimestamp() }, { merge: true });
}

export async function logoutUser(): Promise<void> {
  await fbSignOut(auth);
}

export function subscribeToUserProfile(uid: string, callback: (profile: UserProfile | null) => void) {
  const userRef = doc(db, 'users', uid);
  return onSnapshot(userRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as UserProfile);
    } else {
      callback(null);
    }
  }, (err) => {
    console.warn("User profile subscription note:", err.message);
    callback(null);
  });
}
