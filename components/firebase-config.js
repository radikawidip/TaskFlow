// TODO: Ganti placeholder di bawah ini dengan Firebase Config dari Firebase Console Anda
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBSN2t7aUBhIGnKFeon4Q4YFcKp-_iCmYc",
  authDomain: "task-flow-e7854.firebaseapp.com",
  databaseURL: "https://task-flow-e7854-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "task-flow-e7854",
  storageBucket: "task-flow-e7854.firebasestorage.app",
  messagingSenderId: "470421738597",
  appId: "1:470421738597:web:b4025d5119e34150e5628c",
  measurementId: "G-RMHDW3CKHJ"
};

// Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);

// Inisialisasi Firestore
const db = firebase.firestore();
