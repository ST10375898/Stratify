


/*=================== firebasae setup ======================*/

  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";

  import { getFirestore, collection, addDoc,getDocs } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyD63RcMGnZSamyTkQKJ-Qj2MNBDXcm8d8I",
    authDomain: "stratify-b096e.firebaseapp.com",
    projectId: "stratify-b096e",
    storageBucket: "stratify-b096e.firebasestorage.app",
    messagingSenderId: "846166364409",
    appId: "1:846166364409:web:51910921262aac71399228"
  };

  // Initialize Firebase
  const application = initializeApp(firebaseConfig);

  const db = getFirestore(application);

/*=================== firebasae end ======================*/


document.addEventListener("DOMContentLoaded",function () {
    const form = document.getElementById("project_form");

    form.addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent actual form submission

        let project_name = document.getElementById("project_name").value;
        let budget = document.getElementById("budget").value
        let start_date = document.getElementById("start_date").value
        let end_date = document.getElementById("finish_date").value
        let strategy = document.getElementById("strategy").value
        let completed_tasks = document.getElementById("num_complete_tasks").value
        let incomplete_tasks = document.getElementById("num_incomplete_tasks").value
             let aiResponse ='';
             //fetch AI response from the server or generate it here
              fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.DEEP_SEEK_API_KEY}`, // Replace with your actual API key
          "HTTP-Referer": "https://your-site.com", // Optional: replace with your site URL
          "X-Title": "Your Site Name",             // Optional: replace with your site name
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1-0528:free",
          messages: [
            {
              role: "user",
              content: `This is our project called ${project_name} and it has a budget of ${budget} rands and
              needs has a time line of ${start_date} to ${end_date}. The project has ${completed_tasks + incomplete_tasks}
              and ${completed_tasks} are done and ${incomplete_tasks} are incomplete. The project is using the ${strategy}.
              Is the project on schedule according to the strategy and will the project be completed on time and within budget?
              If it will not be completed on budget or on time then give us some suggestions that can help to finish the project on time.`
            }
          ]
        })
        
      })
      .then(response => response.json())
      .then(data => {
        aiResponse = data.choices[0].message.content;
        console.log(aiResponse); 
      })
      .catch(error => console.error("Error:", error));
       alert("Submission Successful. Your Response is loading");
      // 4 minutes in milliseconds
             setTimeout(async() => {
      
          try {
            await addDoc(collection(db, "Project Analysis Object"), {
                projectName :project_name,
                budgetTotal:budget,
                startDate:start_date,
                endDate:end_date,
                strategyDescription:strategy,
                numCompletedTasks:completed_tasks,
                numIncompleteTasks:incomplete_tasks,
                aiAdvice:aiResponse
               
            });


             
            alert("Your response is ready");
            // Redirect to dashboard after submission
            window.location.href = "dash.html"; //change to the new dashboard file
            form.reset();
        } catch (error) {
            console.error("Error adding document: ", error);
            alert("Error submitting data.");
        }
        }, 4 * 60 * 1000); 
        
    });
// =======Visualizing the AI responses===========
    async function loadProjects() {
      const querySnapshot = await getDocs(collection(db, "Project Analysis Object"));
      const container = document.getElementById("project-container");

      querySnapshot.forEach(doc => {
        const data = doc.data();
        
        //  Simulated AI response
        const aiResponse = generateAIResponse(data);

        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <h3>${data.projectName}</h3>
          <p><strong>Budget:</strong> $${data.budgetTotal}</p>
          <p><strong>Start Date:</strong> ${data.startDate}</p>
          <p><strong>End Date:</strong> ${data.endDate}</p>
          <p><strong>Strategy:</strong> ${data.strategyDescription}</p>
          <p><strong>Completed Tasks:</strong> ${data.numCompletedTasks}</p>
          <p><strong>Incomplete Tasks:</strong> ${data.numIncompleteTasks}</p>
          <div class="response"><strong>AI Insight:</strong> ${aiResponse}</div>
        `;
        container.appendChild(card);
      });
    }

    function generateAIResponse(data) {
      const completionRate = (parseInt(data.numCompletedTasks) / (parseInt(data.numCompletedTasks) + parseInt(data.numIncompleteTasks))) * 100;
      return `Based on the current strategy, you're achieving a completion rate of ${completionRate.toFixed(2)}%. 
              Keep monitoring progress and adjust timelines if needed.`;
    }

    document.addEventListener("DOMContentLoaded", loadProjects);


});