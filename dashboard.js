// <!-- Firebase SDK -->
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
  import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
  const firebaseConfig = {
    apiKey: "AIzaSyD63RcMGnZSamyTkQKJ-Qj2MNBDXcm8d8I",
    authDomain: "stratify-b096e.firebaseapp.com",
    projectId: "stratify-b096e",
    storageBucket: "stratify-b096e.appspot.com",
    messagingSenderId: "846166364409",
    appId: "1:846166364409:web:51910921262aac71399228"
  };
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const form = document.getElementById("projectForm");
  const dashboard = document.getElementById("dashboard");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
      name: document.getElementById("projectName").value,
      tasks: parseInt(document.getElementById("taskCount").value),
      budget: parseFloat(document.getElementById("budget").value),
      start: document.getElementById("startDate").value,
      end: document.getElementById("endDate").value,
      strategy: document.getElementById("strategy").value
    };
    try {
      await addDoc(collection(db, "Project Analysis Object"), data);
      alert("Project submitted successfully!");
      form.reset();
      showDashboard();
    } catch (error) {
      alert("Error submitting project.");
      console.error(error);
    }
  });
  async function showDashboard() {
    document.getElementById("dashboard").classList.remove("hidden");
    document.getElementById("projectForm").classList.add("hidden");
    await displayProjects();
  }
  function showForm() {
    document.getElementById("dashboard").classList.add("hidden");
    document.getElementById("projectForm").classList.remove("hidden");
  }
// generating the responses
  async function generateAIResponse(p) {
    const completionEstimate = p.tasks > 0 ? Math.min(100, p.tasks * 5) : 0;
    return ` AI Insight: With ${p.tasks} tasks planned and a budget of R${p.budget}, this project has an estimated execution readiness of 
            ${completionEstimate}%. Consider aligning your strategy (“${p.strategy}”) with measurable milestones between ${p.start} and ${p.end}.`;
  }
  async function displayProjects() {
    const container = dashboard;
    const card = document.getElementById("Cards");
    container.innerHTML = `<h2>Welcome to your Dashboard</h2>`;
    const snapshot = await getDocs(collection(db, "Project Analysis Object"));
    if (snapshot.empty) {
      container.innerHTML += `<p style="color: gray;">No projects submitted yet.</p>`;
      return;
    }
    container.innerHTML += `<p>Your uploaded projects:</p>`;

    // Create a wrapper to hold cards in a grid
const gridWrapper = document.createElement("div");
gridWrapper.style.display = "grid";
gridWrapper.style.gridTemplateColumns = "repeat(3, 1fr)";
gridWrapper.style.gap = "20px";

for (const doc of snapshot.docs) {
  const p = doc.data();
  const aiInsight = generateAIResponse(p); // make sure this returns a string

  const cardElement = document.createElement("div");
  cardElement.className = "project-card";
  cardElement.style.padding = "15px";
  cardElement.style.borderRadius = "10px";
  cardElement.style.backgroundColor = "#f0f0f0";
  cardElement.style.width = "90%";
  cardElement.style.height = "20vh";
  cardElement.style.overflowY = "auto";


  cardElement.innerHTML = `
    <strong>${p.projectName}</strong><br>
    Completed Tasks: ${p.numCompletedTasks}<br>
    Incomplete Tasks: ${p.numIncompleteTasks}<br>
    Budget: R${p.budgetTotal}<br>
    Date: ${p.startDate} to ${p.endDate}<br>
    <em>Strategy:</em> ${p.strategyDescription}<br>
    <div style="margin-top:10px; background-color:#0000ff; padding:10px; border-left:4px solid #00a0e3;">
      ${p.aiAdvice}
    </div>
  `;

  gridWrapper.appendChild(cardElement);
}

container.appendChild(gridWrapper);

    // snapshot.forEach((doc) => {
    //   const p = doc.data();
    //   // getting the response and displaying
    //   const aiInsight = generateAIResponse(p);
    //   card.innerHTML += `
    //     <div class="project-card">
    //       <strong>${p.projectName}</strong><br>
    //       Tasks: ${p.numCompletedTasks}<br>
    //       Tasks: ${p.numIncompleteTasks}<br>
    //       Budget: R${p.budgetTotal}<br>
    //       Date: ${p.startDate} to ${p.endDate}<br>
    //       <em>Strategy:</em> ${p.strategyDescription}<br>
    //       <div style="margin-top:10px; background-color:#0000ff; padding:10px; border-left:4px solid #00a0e3;"> 
    //         ${p.aiAdvice}
    //       </div>
    //     </div>`;
    // });
  }
  function logout() {
    alert("You have been logged out.");
    window.location.href = "index.html";
  }
  // Show dashboard on load
  showDashboard();