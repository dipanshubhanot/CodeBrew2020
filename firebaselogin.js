
// <!-- TODO: Add SDKs for Firebase products that you want to use
//      https://firebase.google.com/docs/web/setup#available-libraries -->
// <script src="https://www.gstatic.com/firebasejs/7.21.1/firebase-analytics.js"></script>

// // Importing Core FireBase if importing JavaScript
// var import_core_firebase = document.createElement("script");
// import_core_firebase.type = ("text/javascript");
// import_core_firebase.src = "https://www.gstatic.com/firebasejs/7.21.1/firebase-analytics.js"
// document.head.append(import_core_firebase);
// Core FireBase if using html
// <!-- The core Firebase JS SDK is always required and must be listed first -->
// <script src="https://www.gstatic.com/firebasejs/7.21.1/firebase-app.js"></script>


  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  var firebaseConfig = {
    apiKey: "AIzaSyBHVA72kfKEln5gg4fENfg0EV8UvGtgP_M",
    authDomain: "codebrew2020.firebaseapp.com",
    databaseURL: "https://codebrew2020.firebaseio.com",
    projectId: "codebrew2020",
    storageBucket: "codebrew2020.appspot.com",
    messagingSenderId: "587209520782",
    appId: "1:587209520782:web:29e8bcaa080072ce75bbdf",
    measurementId: "G-4MQ7ZD83ZD"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();



// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());

// ui.start('#firebaseui-auth-container', {
//     signInOptions: [
//       firebase.auth.EmailAuthProvider.PROVIDER_ID
//     ],
//     // Other config options...
//   });

var uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: function(authResult, redirectUrl) {
        // User successfully signed in.
        // Return type determines whether we continue the redirect automatically
        // or whether we leave that to developer to handle.
        return true;
      },
      uiShown: function() {
        // The widget is rendered.
        // Hide the loader.
        document.getElementById('loader').style.display = 'none';
      }
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    signInSuccessUrl: '<url-to-redirect-to-on-success>',
    signInOptions: [
        {    
            provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
            requireDisplayName : true
        },
        {
            provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            customParameters: {
              // Forces account selection even when one account
              // is available.
              prompt: 'select_account'
            }
          }

    ],
    // // Terms of service url.
    // tosUrl: '<your-tos-url>',
    // // Privacy policy url.
    // privacyPolicyUrl: '<your-privacy-policy-url>'
  };
  

// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);

  