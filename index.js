const express = require('express');
const app = express();
const cors = require('cors');
const pool = require("./db_pool");

app.use(cors());
app.use(express.json());

//ROUTES//
app.post("/create/:clip_id", async(req, res) => {
    const {clip_id} = req.params;
    
    if(!checkIfRowExists(clip_id)){
    try{
        const {description} = req.body;
        const newClip = await pool.query(
            "INSERT INTO clips (clip_id, description,expire_cnt) VALUES($1, $2, $3) RETURNING *",
            [clip_id, description, 0]);
        res.json(newClip.rows[0]);
    }catch(err){
        console.log(err.message);
    }
}
else{
    res.json({ "message" : "Clip ID already exists, please use different Clip ID to continue" });
}
})

async function checkIfRowExists(clipId) {
  try {
    // Query to check if row exists
    const result = await pool.query('SELECT EXISTS(SELECT 1 FROM clips WHERE clip_id = $1)', [clipId]);
    // Retrieve the result value
    const exists = result.rows[0].exists;
    // Return the boolean result
    return exists;
  } catch (error) {
    // Handle the error
    console.error('Error executing row checking query:', error);
    throw error;
  }
}

app.get("/get/:clip_id", async(req, res) => {
    try{
        const {clip_id} = req.params;
        const clip = await pool.query("SELECT * FROM clips WHERE clip_id = $1 ", [clip_id]);
        if(clip.rows.length > 0)
        {
            if(clip.rows[0].expire_cnt < 6)
            {
                await pool.query("UPDATE clips SET expire_cnt = $1 WHERE clip_id = $2", [clip.rows[0].expire_cnt + 1, clip_id]);
                res.json(clip.rows[0]+1);
            }else{
                await pool.query("DELETE FROM clips WHERE clip_id = $1", [clip_id]);
                res.json({"message" : "Clip expired. Please make a new clip" });
            }
        }else {
            res.json({"message" : "Clip does not exist." });
        }
    }catch(err){
        console.log(err.message);
    }
})


app.listen(5000, () => {
    console.log("server has started on port 5000....");
    const currentTime = new Date();
currentTime.setMinutes(currentTime.getMinutes() + 20);
console.log(currentTime);

  });