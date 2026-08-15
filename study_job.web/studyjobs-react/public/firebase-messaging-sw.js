importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js");

firebase.initializeApp({

     apiKey: "AIzaSyBUKQvaqYf4YQB5m6tdij2rvgDq7XlAogw",
     authDomain: "studyjobs-5a76e.firebaseapp.com",
     projectId: "studyjobs-5a76e",
     storageBucket: "studyjobs-5a76e.firebasestorage.app",
     messagingSenderId: "767240834490",
     appId: "1:767240834490:web:186bcc5c8ce167d19b2183",
    
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/icon.png",
  });
});