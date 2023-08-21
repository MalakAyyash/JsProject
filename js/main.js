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

    var regex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\W){8}/;
    validate = regex.test(password)
    console.log(validate)
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
        console.log("noooooooooooooooooooooooo")
        invalidPassword.style.display = 'block'
        password.style.border = '4px sloid red'

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
        for (let i = 0; i < data.length; i++) {
            result += `
                <div class="col-4">
                    <div class="card border border-4 border-black mb-3">
                    <div class="close-b">
                        <button type="button" class="btn-close" aria-label="Close" onclick="deleteData(${i})"></button>
                    </div>
                        <h2 class="mb-4 d-flex justify-content-center">${data[i].title}</h2>
                        <h3 class="mb-4 d-flex justify-content-center">${data[i].password}</h3>
                        <p class="d-flex justify-content-center">${data[i].description}</p>
                        <button class="btn btn-primary w-100 rounded-0 update-btn" onclick="updateData(${i})">Update</button>
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
// ===========================get the data ==============
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
        firebase.database().ref(`objectForm/${currentData.key}`).set({
        title: updatedTitle,
        description: updatedDescription
        });
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