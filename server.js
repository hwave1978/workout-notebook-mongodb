const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.static("public"));

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

let workoutsCollection;

async function connectToMongoDB() {
  await client.connect();

  const database = client.db("workout_notebook");
  workoutsCollection = database.collection("workouts");

  console.log("Connected to MongoDB Atlas");
}

app.get("/", (req, res) => {
  res.send("Workout Notebook API Running");
});

app.get("/api/workouts", async (req, res) => {
  const workouts = await workoutsCollection.find().toArray();
  res.json(workouts);
});

app.post("/api/workouts", async (req, res) => {
  const workout = {
    day: req.body.day,
    bodyPart: req.body.bodyPart,
    exercise: req.body.exercise,
    sets: Number(req.body.sets),
    reps: Number(req.body.reps),
    weight: Number(req.body.weight),
    notes: req.body.notes || "",
    createdAt: new Date(),
  };

  const result = await workoutsCollection.insertOne(workout);

  res.status(201).json({
    _id: result.insertedId,
    ...workout,
  });
});

app.delete("/api/workouts/:id", async (req, res) => {
  const id = req.params.id;

  await workoutsCollection.deleteOne({
    _id: new ObjectId(id),
  });

  res.json({ message: "Workout deleted" });
});

connectToMongoDB()
  .then(() => {
    app.listen(3000, () => {
      console.log("Workout Notebook API running on port 3000");
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed");
    console.error(error);
  });