import * as firebase from 'firebase';

export const base = firebase.initializeApp({ 
    apiKey: "AIzaSyAIxNdGQz1Qz_ovAR_RJdJW2SxYdg-6DQk",
    authDomain: "colour-schemer.firebaseapp.com",
    databaseURL: "https://colour-schemer.firebaseio.com",
    storageBucket: "colour-schemer.appspot.com",
    messagingSenderId: "297068241631"
});

export const db = base.database();

export const auth = base.auth();

export const storageKey = 'keepItSecret';

export const isAuthenticated = () => {
    return !!auth.currentUser || !!localStorage.getItem(storageKey);
}