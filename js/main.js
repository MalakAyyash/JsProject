// =========================variables============================
let title = document.getElementById('title')
let password = document.getElementById('password')
let description = document.getElementById('desc')
let save = document.getElementById('save')
let main2 = document.getElementById('main2')
let main1 = document.getElementById('main1')
let main2Row = document.getElementById('main2Row')
let update = document.getElementById('update')
let updateTitle = document.getElementById('updateTitle')
let updateDescription = document.getElementById('updateDescription')
let sidebarLink2 = document.getElementById('sidebarLink2')
let sidebarLink1 = document.getElementById('sidebarLink1')
let invalidPassword = document.getElementById('invalid-password')
let invalidConfirmPassword = document.getElementById('invalidConfirmPassword')
let currentIndex=0
// ============================================================
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
// reference your database
var contactFormDB = firebase.database().ref("objectForm");
main2.style.display = 'none'

document.getElementById("objectForm").addEventListener("submit", submitForm);  
function submitForm(e) {
    e.preventDefault();
    saveMessages(title.value, description.value, password.value);
  }
  const saveMessages = (title, description ,password) => {
    invalidPassword.style.display = 'none'

    var regex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
    validate = regex.test(password)
    if (validate == true){
        var newContactForm = contactFormDB.push();
        newContactForm.set({
          title: title,
          description: description,
          password: password,
        })
        displayData()
        resetInput()
        sidebarLink2.style.border = '4px solid black';
        sidebarLink1.style.border = 'none';
        main2.style.display = 'block'
        main1.style.display = 'none'
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'data added successfully',
            showConfirmButton: false,
            timer: 1500
          })
    }
    else{
        invalidPassword.style.display = 'block'
    }
  };
// ===============================reset=========================
function resetInput(){
    title.value = ''
    description.value = ''
    password.value = ''
}
// =====================display data========================
function fetchFirebaseData() {
    return new Promise((resolve, reject) => {
        contactFormDB.on('value', function(AllRecords) {
            const dataArray = [];
            AllRecords.forEach(function(currentRecord) {
                const title = currentRecord.val().title;
                const password = currentRecord.val().password;
                const description = currentRecord.val().description;
                const key = currentRecord.key;
                dataArray.push({ key: key, title: title, password: password, description: description });
            });
            resolve(dataArray);
        }, reject);
    });
}
async function displayData() {
    console.log("Starting displayData function");
        const data = await fetchFirebaseData();
        console.log("Fetched data from Firebase:", data);
        let result = '';
        let pass = [];
        for (let i = 0; i < data.length; i++) {
            pass[i] = '*'.repeat(data[i].password.length);
            result += `
                <div class="col-4">
                    <div class="card border border-4 border-black mb-3">
                    <div class="close-b">
                        <button type="button" class="btn-close" aria-label="Close" onclick="deleteData(${i})"></button>
                    </div>
                        <h2 class="mb-4 d-flex justify-content-center">${data[i].title}</h2>
                        <h3 class="mb-4 d-flex justify-content-center">${pass[i]}</h3>
                        <p class="d-flex justify-content-center">${data[i].description}</p>
                        <button class="btn btn-primary w-100 rounded-0 update-btn" onclick="updateData(${i})">Update</button>
                        <button class="btn btn-secondary w-100 rounded-0 update-btn" onclick="restPass(${i})">Rest Password</button>
                    </div>
                </div>
            `;
        }
        main2Row.innerHTML = result;
        console.log("Data displayed.");
}
document.addEventListener("DOMContentLoaded", function() {
    displayData();
});
// ===========================update the data ==============
async function updateData(index){
    let currentIndex = index
    const data = await fetchFirebaseData();
    let currentData = data[currentIndex]
    console.log(data[currentIndex])
    Swal.fire({
        title: 'Update Title and Description',
        html: `
            <input id="updateTitle" class="swal2-input" placeholder="Update Title" value="${currentData.title}">
            <input id="updateDescription" class="swal2-input" placeholder="Update Description" value="${currentData.description}">
        `,
        showCancelButton: true,
        confirmButtonText: 'Update',
        showLoaderOnConfirm: true,
        preConfirm: async () => {
        const updatedTitle = Swal.getPopup().querySelector('#updateTitle').value;
        const updatedDescription = Swal.getPopup().querySelector('#updateDescription').value;
        try {
        const db = firebase.database();
        console.log(currentData.key)
        firebase.database().ref(`objectForm/${currentData.key}`).once('value',(snapshot => {
            const existingData = snapshot.val();
            existingData.title = updatedTitle;
            existingData.description = updatedDescription;
            firebase.database().ref(`objectForm/${currentData.key}`).set(existingData);
            }));
        Swal.fire({
            title: 'Updated!',
            text: 'Data has been updated.',
            icon: 'success'
        });
        displayData(); 
        } catch (error) {
            Swal.showValidationMessage(`Update failed: ${error}`);
        }}
    });
}
// ===========================reset password==============
async function restPass(index){
    let currentIndex = index
    const data = await fetchFirebaseData();
    let currentData = data[currentIndex]
    console.log(data[currentIndex])
    const SwalInstance = Swal.fire({
        title: 'Rest Password',
        html: `
            <input type="password" id="originalPass" class="swal2-input" placeholder="old password">
            <input type="password" id="newPassword" class="swal2-input" placeholder="new password">
            <input type="password" id="confirmPassword" class="swal2-input" placeholder="confirm new password">
            <div class="invalid-feedback" id="invalidConfirmPassword">
                the new password should be the same as confirm password . try again
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Rest',
        showLoaderOnConfirm: true,
        preConfirm: async () => {
        const originalPass = Swal.getPopup().querySelector('#originalPass').value;
        const newPassword = Swal.getPopup().querySelector('#newPassword').value;
        const confirmPassword = Swal.getPopup().querySelector('#confirmPassword').value;
        var regex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
        let validateNewPassword
        validateNewPassword = true
         if (validateNewPassword == true){
            if ((newPassword == confirmPassword) && (originalPass == currentData.password) ){
                try {
                    const db = firebase.database();
                    console.log(currentData.key)
                    firebase.database().ref(`objectForm/${currentData.key}`).once('value',(snapshot => {
                    const existingData = snapshot.val();
                    existingData.password = confirmPassword;
                    firebase.database().ref(`objectForm/${currentData.key}`).set(existingData);
                    }));
                    Swal.fire({
                        title: 'changed!',
                        text: 'password has been updated.',
                        icon: 'success'
                    });
                    displayData(); 
                    } catch (error) {
                        Swal.showValidationMessage(`Update failed: ${error}`);
                    }        }
                    else {
                        if (newPassword != confirmPassword) {
                            // invalidConfirmPassword.style.display = 'block';
                            SwalInstance.showValidationMessage('Please correct the confirm.');

                        }
                        // SwalInstance.showValidationMessage('Please correct the fields.');
                        return false;
                    }
        }}
    });
}
// =================delete data============================
async function deleteData(index){
    let currentIndex = index
    const data = await fetchFirebaseData();
    let currentData = data[currentIndex]
    console.log(data[currentIndex])
    const db = firebase.database();
    console.log(currentData.key)
    firebase.database().ref(`objectForm/${currentData.key}`).set({
    title: null,
    description: null
    });
    Swal.fire({
        title: 'Deleted!',
        text: 'Data has been deleted.',
        icon: 'success'
    });
    displayData(); 
}
// =================add border when toggle links =============
function toggleBorder(clickedId) {
    const links = document.querySelectorAll('.sidebar a p');
    for (let i = 0; i < links.length; i++) {
         if (links[i].id == clickedId && links[i].id == 'sidebarLink1' ){
            links[i].style.border = '4px solid black';
            main1.style.display = 'block'
            main2.style.display = 'none'
        } else if (links[i].id == clickedId && links[i].id == 'sidebarLink2' ){
            links[i].style.border = '4px solid black';
            main2.style.display = 'block'
            main1.style.display = 'none'
        }else {
            links[i].style.border = 'none';
        }      }
}