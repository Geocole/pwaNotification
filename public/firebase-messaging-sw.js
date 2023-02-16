 importScripts('https://www.gstatic.com/firebasejs/9.0.2/firebase-app-compat.js');
 importScripts('https://www.gstatic.com/firebasejs/9.0.2/firebase-messaging-compat.js');

firebase.initializeApp({
  // your config here
    apiKey: "AIzaSyDSeXq3-N6Qgb22zwNo_elBKNu7zel3VPI",
    authDomain: "notificationtool-a8ac0.firebaseapp.com",
    projectId: "notificationtool-a8ac0",
    storageBucket: "notificationtool-a8ac0.appspot.com",
    messagingSenderId: "385216853520",
    appId: "1:385216853520:web:0fcb72a2aceb81b1ecfc95",
    measurementId: "G-2VNL1TPD76"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
    click_action: payload.notification.click_action,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

