# Workout Notebook (MongoDB)

## Overview

Workout Notebook is a workout tracking application built with Node.js, Express, and MongoDB Atlas.

Users can:

- View a full week from Sunday through Saturday
- Add workouts for any day
- Select a body part and exercise
- Record sets, reps, and weight
- Add workout notes
- Delete workouts
- Save workout data to MongoDB Atlas

## Technologies Used

- Node.js
- Express
- MongoDB Atlas
- HTML
- CSS
- JavaScript

## Features

- Sunday–Saturday workout tracking
- Dynamic exercise dropdowns
- MongoDB document storage
- Persistent data after browser refresh
- Workout deletion

## MongoDB Usage

This project uses MongoDB Atlas as a non-relational database.

Workout data is stored as documents inside a MongoDB collection rather than rows in a relational database.

Example document:

```json
{
  "day": "Saturday",
  "bodyPart": "Back",
  "exercise": "Lat Pulldown",
  "sets": 4,
  "reps": 10,
  "weight": 120,
  "notes": "Felt strong today"
}
```

## Running the Project

Install dependencies:

```bash
npm install
```

Create a .env file:

```env
MONGODB_URI=your_connection_string
```

Start the server:

```bash
node server.js
```

Open:

```text
http://localhost:3000
```

## Course Requirement

This project was created for the CS233 Non-Standard Database Micro-Project and demonstrates the use of MongoDB Atlas as a document-oriented database.