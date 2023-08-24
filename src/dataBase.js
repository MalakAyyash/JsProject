const firebaseConfig = {
    apiKey: "AIzaSyDdfE21LS1sTmwbO1hY50B2ICDy4Zc2J5U",
    authDomain: "java-crud-second.firebaseapp.com",
    databaseURL: "https://java-crud-second-default-rtdb.firebaseio.com",
    projectId: "java-crud-second",
    storageBucket: "java-crud-second.appspot.com",
    messagingSenderId: "600378685457",
    appId: "1:600378685457:web:322dd6bc5740ce307ed9b0"
};
// initialize firebase
firebase.initializeApp(firebaseConfig);
// reference the database
export default firebase;