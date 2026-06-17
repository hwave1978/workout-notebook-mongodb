const weekContainer = document.getElementById("week-container");

const days = [
  { name: "Sunday", date: "6/14" },
  { name: "Monday", date: "6/15" },
  { name: "Tuesday", date: "6/16" },
  { name: "Wednesday", date: "6/17" },
  { name: "Thursday", date: "6/18" },
  { name: "Friday", date: "6/19" },
  { name: "Saturday", date: "6/20" },
];

const exercisesByBodyPart = {
  Chest: ["Bench Press", "Push Ups", "Chest Fly", "Incline Press"],
  Back: ["Pull Ups", "Lat Pulldown", "Rows", "Deadlift"],
  Shoulders: ["Shoulder Press", "Lateral Raises", "Front Raises", "Shrugs"],
  Arms: ["Bicep Curls", "Tricep Extensions", "Hammer Curls", "Dips"],
  Legs: ["Squats", "Leg Press", "Lunges", "Calf Raises"],
  Core: ["Plank", "Crunches", "Leg Raises", "Russian Twists"],
  Cardio: ["Running", "Walking", "Bike", "Elliptical"],
};

let workouts = {};

days.forEach((day) => {
  workouts[day.name] = [];
});

async function loadWorkoutsFromMongoDB() {
  const response = await fetch("/api/workouts");
  const savedWorkouts = await response.json();

  days.forEach((day) => {
    workouts[day.name] = savedWorkouts.filter(
      (workout) => workout.day === day.name
    );
  });
}

function renderWeek() {
  weekContainer.innerHTML = "";

  days.forEach((day) => {
    const dayCard = document.createElement("div");
    dayCard.className = "day-card";

    dayCard.innerHTML = `
      <h3>${day.name} ${day.date}</h3>

      <h4>Workouts</h4>

      <div class="workout-list" id="workout-list-${day.name}"></div>

      <div class="workout-actions">
        <button class="show-form-btn" data-day="${day.name}">Add Workout</button>
      </div>

      <form class="workout-form" id="form-${day.name}" style="display: none;">
        <select class="body-part">
          <option>Chest</option>
          <option>Back</option>
          <option>Shoulders</option>
          <option>Arms</option>
          <option>Legs</option>
          <option>Core</option>
          <option>Cardio</option>
        </select>

        <select class="exercise"></select>

        <input class="sets" type="number" min="1" step="1" placeholder="Sets" required />
        <input class="reps" type="number" min="1" step="1" placeholder="Reps" required />
        <input class="weight" type="number" min="0" step="1" placeholder="Weight" required />

        <textarea class="notes" placeholder="Notes"></textarea>

        <button type="submit">Save Workout</button>
      </form>
    `;

    weekContainer.appendChild(dayCard);

    setupDay(day.name);
    renderWorkouts(day.name);
  });
}

function setupDay(dayName) {
  const form = document.getElementById(`form-${dayName}`);
  const showFormButton = document.querySelector(
    `.show-form-btn[data-day="${dayName}"]`
  );

  const bodyPartSelect = form.querySelector(".body-part");
  const exerciseSelect = form.querySelector(".exercise");

  function updateExercises() {
    const bodyPart = bodyPartSelect.value;
    exerciseSelect.innerHTML = "";

    exercisesByBodyPart[bodyPart].forEach((exercise) => {
      const option = document.createElement("option");
      option.textContent = exercise;
      exerciseSelect.appendChild(option);
    });
  }

  updateExercises();

  bodyPartSelect.addEventListener("change", updateExercises);

  showFormButton.addEventListener("click", () => {
    form.style.display = form.style.display === "none" ? "block" : "none";
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const workout = {
      day: dayName,
      bodyPart: bodyPartSelect.value,
      exercise: exerciseSelect.value,
      sets: form.querySelector(".sets").value,
      reps: form.querySelector(".reps").value,
      weight: form.querySelector(".weight").value,
      notes: form.querySelector(".notes").value,
    };

    const response = await fetch("/api/workouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(workout),
    });

    const savedWorkout = await response.json();

    workouts[dayName].push(savedWorkout);

    form.reset();
    updateExercises();
    form.style.display = "none";

    renderWorkouts(dayName);
  });
}

function renderWorkouts(dayName) {
  const workoutList = document.getElementById(`workout-list-${dayName}`);
  workoutList.innerHTML = "";

  if (workouts[dayName].length === 0) {
    workoutList.innerHTML = "<p>No workouts added yet.</p>";
    return;
  }

  workouts[dayName].forEach((workout) => {
    const workoutEntry = document.createElement("div");
    workoutEntry.className = "workout-entry";

    workoutEntry.innerHTML = `
      <p><strong>Body Part:</strong> ${workout.bodyPart}</p>
      <p><strong>Exercise:</strong> ${workout.exercise}</p>
      <p><strong>Sets:</strong> ${workout.sets}</p>
      <p><strong>Reps:</strong> ${workout.reps}</p>
      <p><strong>Weight:</strong> ${workout.weight}</p>
      <div class="notes-box">${workout.notes || "No notes added."}</div>
      <button class="delete-btn" data-day="${dayName}" data-id="${workout._id}">
        Delete
      </button>
    `;

    workoutList.appendChild(workoutEntry);
  });

  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", async () => {
      const day = button.dataset.day;
      const id = button.dataset.id;

      await fetch(`/api/workouts/${id}`, {
        method: "DELETE",
      });

      workouts[day] = workouts[day].filter((workout) => workout._id !== id);
      renderWorkouts(day);
    });
  });
}

async function startApp() {
  await loadWorkoutsFromMongoDB();
  renderWeek();
}

startApp();