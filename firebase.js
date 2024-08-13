import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB1boLMVvnMLcJNsZ-c8HRVzS_rif5Kxyg",
  authDomain: "inventory-management-app-ca094.firebaseapp.com",
  projectId: "inventory-management-app-ca094",
  storageBucket: "inventory-management-app-ca094.appspot.com",
  messagingSenderId: "617098783292",
  appId: "1:617098783292:web:fecd34cefe5bffc800f139",
  measurementId: "G-8TGSHM6PZ2",
};
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { firestore };
