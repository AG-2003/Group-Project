import { useState, useEffect } from 'react';
import { auth } from '../firebase-config';

export const UseUserProfilePic = () => {
    // Allow userProfile.photoURL to be string or null
    const [userProfile, setUserProfile] = useState({ photoURL: '', displayName: '' });

    useEffect(() => {
        if (auth.currentUser && auth.currentUser.photoURL) {
            setUserProfile({
                photoURL: auth.currentUser.photoURL, // This can be string or null
                displayName: auth.currentUser.displayName || '',
            });
        }

        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user && user.photoURL) {
                setUserProfile({
                    photoURL: user.photoURL, // This can be string or null
                    displayName: user.displayName || ''
                });
            }
        });

        return unsubscribe;
    }, []);

    return userProfile;
};
