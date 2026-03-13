# 🎬 Movie Discovery & Trending Analytics App

A full-stack movie discovery web application that allows users to search movies using the TMDB API while tracking search trends in a PostgreSQL database. The app also displays trending movies based on user search activity.

## 🚀 Features

* 🔎 Search movies using the **TMDB API**
* ⚡ Debounced search to prevent excessive API requests
* 📈 Track user search activity
* 🗄 Store search data in **PostgreSQL**
* 🔥 Display **Trending Movies** based on search frequency
* 🎥 Movie cards with posters, rating, language, and release year
* 🌐 Full-stack architecture using **React + Express + PostgreSQL**

---

## 🛠 Tech Stack

### Frontend

* React
* Vite
* TailwindCSS
* React Hooks
* Debouncing (react-use)

### Backend

* Node.js
* Express.js
* PostgreSQL
* pg (Postgres client)

### API

* TMDB API (The Movie Database)

---

## 🏗 Project Architecture

User Search
↓
React UI (Debounced Search)
↓
Fetch Movie Data from **TMDB API**
↓
Send Search Data → **Express Backend**
↓
Store/Update Search Metrics in **PostgreSQL**
↓
Fetch Trending Movies from Database
↓
Display Trending Movies in UI

---

## 📊 Database Schema

Table: `metrics`

| Column     | Type    | Description                  |
| ---------- | ------- | ---------------------------- |
| movie_id   | integer | TMDB movie ID                |
| searchterm | text    | Search query entered by user |
| poster_url | text    | Movie poster path            |
| count      | integer | Number of times searched     |

---

## 🔥 Trending Logic

Trending movies are determined by the number of times a movie has been searched.

```sql
SELECT *
FROM metrics
ORDER BY count DESC
LIMIT 5;
```

This returns the **top 5 most searched movies**.

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/movie-app.git
cd movie-app
```

---

### 2️⃣ Install Frontend Dependencies

```bash
npm install
```

---

### 3️⃣ Setup Environment Variables

Create a `.env` file in the root directory:

```
VITE_TMDB_API_KEY=your_tmdb_api_key
```

---

### 4️⃣ Setup PostgreSQL Database

Create database:

```sql
CREATE DATABASE movie_app;
```

Create table:

```sql
CREATE TABLE metrics (
  movie_id INTEGER,
  searchterm TEXT,
  poster_url TEXT,
  count INTEGER DEFAULT 1
);
```

---

### 5️⃣ Start Backend Server

Navigate to backend folder:

```bash
cd server
npm install
nodemon server.js
```

Server runs on:

```
http://localhost:5000
```

---

### 6️⃣ Start Frontend

```bash
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

## 📸 Screenshots

### Home Page
<img width="1900" height="879" alt="image" src="https://github.com/user-attachments/assets/b53d536b-b369-4258-9677-2750b7420f60" />

Movie search and discovery.

### Trending Movies
<img width="1890" height="912" alt="image" src="https://github.com/user-attachments/assets/44dd8732-7975-4df2-9e04-54077b503399" />

Displays top searched movies from the database.

---

## 💡 Future Improvements

* Implement **time-decay trending algorithm**
* Show **full movie cards in trending section**
* Add **search analytics dashboard**
* Add **user authentication**
* Deploy backend and database

---

## 📚 What I Learned

* Building a **full-stack React + Express application**
* Integrating external APIs
* Implementing **debounced search**
* Designing a **search analytics system**
* Working with **PostgreSQL and SQL queries**
* Handling frontend ↔ backend communication

---

## 👨‍💻 Author

**Omik Agrawal**

If you found this project interesting, feel free to ⭐ the repository!
