import { initializeApp} from "firebase/app"

import { getMessaging, getToken, onMessage} from "firebase/messaging"

import { getAnalytics } from "firebase/analytics"

const firebaseConfig = {
  apiKey: "AIzaSyBUKQvaqYf4YQB5m6tdij2rvgDq7XlAogw",
  authDomain: "studyjobs-5a76e.firebaseapp.com",
  projectId: "studyjobs-5a76e",
  storageBucket: "studyjobs-5a76e.firebasestorage.app",
  messagingSenderId: "767240834490",
  appId: "1:767240834490:web:186bcc5c8ce167d19b2183",
  measurementId: "G-VED6YWSBSF"
}

const app = initializeApp(firebaseConfig)
const messaging = getMessaging(app)

export { messaging, getToken, onMessage }