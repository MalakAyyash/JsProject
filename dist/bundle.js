(()=>{let e=document.getElementById("title"),t=document.getElementById("password"),n=document.getElementById("desc"),a=(document.getElementById("save"),document.getElementById("main2")),d=document.getElementById("main1"),o=document.getElementById("main2Row"),s=(document.getElementById("update"),document.getElementById("updateTitle"),document.getElementById("updateDescription"),document.getElementById("sidebarLink2")),l=document.getElementById("sidebarLink1"),c=document.getElementById("invalid-password"),i=(document.getElementById("invalidConfirmPassword"),document.getElementById("date"));firebase.initializeApp({apiKey:"AIzaSyDdfE21LS1sTmwbO1hY50B2ICDy4Zc2J5U",authDomain:"java-crud-second.firebaseapp.com",databaseURL:"https://java-crud-second-default-rtdb.firebaseio.com",projectId:"java-crud-second",storageBucket:"java-crud-second.appspot.com",messagingSenderId:"600378685457",appId:"1:600378685457:web:322dd6bc5740ce307ed9b0"});var r=firebase.database().ref("objectForm");a.style.display="none",document.getElementById("objectForm").addEventListener("submit",(function(a){a.preventDefault(),u(e.value,i.value,n.value,t.value)}));const u=(e,t,n,o)=>{c.style.display="none",1==/(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/.test(o)?(r.push().set({title:e,date:t,description:n,password:o}),p(),m(),s.style.border="4px solid black",l.style.border="none",a.style.display="block",d.style.display="none",Swal.fire({position:"center",icon:"success",title:"data added successfully",showConfirmButton:!1,timer:1500})):c.style.display="block"};function m(){e.value="",n.value="",t.value="",i.value=""}const p=async()=>{console.log("Starting displayData function");const e=await new Promise(((e,t)=>{r.on("value",(function(t){const n=[];t.forEach((function(e){const t=e.val().title,a=e.val().date,d=e.val().password,o=e.val().description,s=e.key;n.push({key:s,title:t,date:a,password:d,description:o})})),e(n)}),t)}));console.log("Fetched data from Firebase:",e);let t="",n=[],a="mb-4 d-flex justify-content-center";for(let d=0;d<e.length;d++)n[d]="*".repeat(e[d].password.length),t+=`\n                <div class="col-4">\n                    <div class="card border border-4 border-black mb-3">\n                    <div class="close-b">\n                        <button type="button" class="btn-close" aria-label="Close" onclick="deleteData(${d})"></button>\n                    </div>\n                        <h2 class="${a}">${e[d].title}</h2>\n                        <h4 class="${a}">${e[d].date}</h4>\n                        <h5 class="${a}">${n[d]}</h5>\n                        <p class="d-flex justify-content-center">${e[d].description}</p>\n                        <button class="btn btn-primary w-100 rounded-0 update-btn" onclick="updateData(${d})">Update</button>\n                        <button class="btn btn-secondary w-100 rounded-0 update-btn" onclick="resetPass(${d})">Reset Password</button>\n                    </div>\n                </div>\n            `;o.innerHTML=t,console.log("Data displayed.")};document.addEventListener("DOMContentLoaded",(function(){p()}))})();