import express from 'express';
import cors from 'cors';
import pg from 'pg';

// const db = new pg.Client({
//     user : "postgres",
//     host : "localhost",
//     database : "Movie-app",
//     password : "omik",
//     port : 5432,
// });


const db = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

try {
    await db.connect();
    console.log("Database connected");
} catch (err) {
    console.error("Database connection failed:", err);
}

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({message : 'Backend working'});
})

app.post("/api/metrics", async (req, res) => {
    try {
        const { searchTerm, movie_id, poster_path } = req.body;

        console.log("Incoming data:", movie_id,searchTerm,poster_path);

        const result = await db.query(
            "SELECT * FROM metrics WHERE searchterm = $1",
            [searchTerm]
        );

        console.log("Rows found:", result.rows.length);

        if (result.rows.length > 0) {
            await db.query(
                "UPDATE metrics SET count = count + 1 WHERE searchterm = $1",
                [searchTerm]
            );
            console.log("Updating count");
        } else {
            await db.query(
                "INSERT INTO metrics (movie_id, searchterm, poster_url, count) VALUES ($1,$2,$3,1)",
                [movie_id, searchTerm, poster_path]
            );
            console.log("Inserting new row");
        }

        res.json({ message: "Search metrics successfully" });

    } catch (error) {
        console.log(error);
    }
});

app.get("/api/trending",async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM metrics ORDER BY count DESC LIMIT 5");
        res.json(result.rows);

    }catch (error) {
        console.log(error);
        res.status(500).json({error:"unable to fetch trending movies"});
        }
})


// app.listen(5000,()=>{
//     console.log("Server running on port 5000...");
// });

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});