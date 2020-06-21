import Firebase from 'firebase';

const firebaseConfig = {
    apiKey: 'AIzaSyC7v1Cdls8BIR0ndTr7PU3IaayKMRtz17g',
    databaseURL: 'https://capstoneproject-24d5b.firebaseio.com/',
    projectId: 'capstoneproject-24d5b',
    appId: '1:57907873541:android:62e1615d4c4ab5c620596c'
};

export default Firebase.initializeApp(firebaseConfig);