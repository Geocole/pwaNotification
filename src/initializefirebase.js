import firebase from 'firebase/compat/app';
import 'firebase/compat/messaging';

const firebaseConfig = {
    apiKey: "AIzaSyDSeXq3-N6Qgb22zwNo_elBKNu7zel3VPI",
    authDomain: "notificationtool-a8ac0.firebaseapp.com",
    projectId: "notificationtool-a8ac0",
    storageBucket: "notificationtool-a8ac0.appspot.com",
    messagingSenderId: "385216853520",
    appId: "1:385216853520:web:0fcb72a2aceb81b1ecfc95",
    measurementId: "G-2VNL1TPD76"
};


firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();
//console.log(1, firebase,12 , messaging);
export default messaging;