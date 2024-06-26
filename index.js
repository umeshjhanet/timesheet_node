const express = require("express");
var cors = require("cors");
const mysql = require("mysql2");
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());


const db = mysql.createConnection({
  host: "localhost",
  port: "3306",
  user: "root",
  password: "root",
  database: "timesheetdb",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
app.options("/users", (req, res) => {
  res.sendStatus(200);
});

 // crud api for task status

app.post("/createstatus", (req, res) => {
    const { username,task,taskstatus } =req.body;
  
    const query =
      "INSERT INTO tbl_status_log (username,task,taskstatus) VALUES (?,?,?)";
  
    db.query(
      query,
      [username,task,taskstatus],
      (err, result) => {
        if (err) {
          console.error("Error creating status:", err);
          res
            .status(500)
            .json({ error: "An error occurred while status" });
        } else {
          console.log("status created successfully:", result);
          res.status(200).json({ message: "status created successfully" });
        }
      }
    );
  });
  
app.get("/getstatus", (req, res) => {
    db.query("select * from tbl_status_log ", (err, results) => {
      if (err) {
        throw err;
      }
      res.json(results);
    });
  });

  app.put("/updatestatus/:id", (req, res) => {
    const { username, task, taskstatus } = req.body;
    const { id } = req.params;
  
    const query = `
      UPDATE tbl_status_log
      SET 
        username = ?, 
        task = ?, 
        taskstatus = ?
      WHERE id = ?
    `;
  
    db.query(query, [username, task, taskstatus, id], (err, results) => {
      if (err) {
        console.error("Error updating status:", err);
        return res.status(500).json({ error: "An error occurred while updating status" });
      }
  
      res.status(200).json({ message: "status updated successfully", id: id });
    });
  });
  
  
app.delete("/deletestatus/:id", (req, res) => {
    const { id} = req.params;
    db.query(
      "DELETE FROM tbl_status_log WHERE id = ?",
      [id],
      (err) => {
        if (err) throw err;
        res.json({ message: "Status deleted successfully" });
      }
    );
  });


  // crud api for create user

app.post("/createuser", (req, res) => {
  const { name, email, password, phone_no, roles } = req.body;

  const query = `
    INSERT INTO tbl_user_master (name, email, password, phone_no, roles) 
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [name, email, password, phone_no, roles],
    (err, result) => {
      if (err) {
        console.error("Error creating user:", err);
        res.status(500).json({ error: "An error occurred while creating the user" });
      } else {
        console.log("User created successfully:", result);
        res.status(200).json({ message: "User created successfully" });
      }
    }
  );
});

app.put("/createuserupdate/:id", (req, res) => {
  const data = req.body;
  const { id } = req.params;

  const query1 = `
      UPDATE tbl_user_master 
      SET 
          name = ?, 
          password = ?, 
          phone_no = ?, 
          roles = ?
      WHERE id = ?
  `;

  const params1 = [
      data.name,
      data.password,
      data.phone_no,
      data.roles,
      id
  ];

  db.query(query1, params1, (err, results) => {
      if (err) {
          console.error("Error updating user:", err);
          return res.status(500).json({ error: "An error occurred while updating user" });
      }

      res.status(200).json({ message: "User updated successfully", id: id });
  });
});

app.delete("/createuserdelete/:id", (req, res) => {
  const { id } = req.params;
  db.query(
    "DELETE FROM tbl_user_master WHERE id = ?",
    [id],
    (err) => {
      if (err) throw err;
      res.json({ message: "User deleted successfully" });
    }
  );
});

app.get("/getuser", (req, res) => {
  db.query("select * from tbl_user_master ", (err, results) => {
    if (err) {
      throw err;
    }
    res.json(results);
  });
});

 // crud api for role

app.post('/add-role',(req,res)=>{
  const {role_name}=req.body;
  const query="INSERT INTO tbl_user_roles(role_name) VALUES(?)";
  db.query(query,[role_name],(err,result)=>{
    if(err){
      console.log("Error inserting role name:",err);
      res.status(500).json({error:"An error occurred while inserting role name"});
    }
    else{
      res.status(200).json({message:"Role name added successfully",id:result.insertId})
    }
  })
});

app.get("/getrole", (req, res) => {
  db.query("select * from tbl_user_roles ", (err, results) => {
    if (err) {
      throw err;
    }
    res.json(results);
  });
});

app.put('/updaterole/:id', (req, res) => {
  const role_id = req.params.id;
  const { role_name } = req.body;
  const query = "UPDATE tbl_user_roles SET role_name = ? WHERE role_id = ?";

  db.query(query, [role_name, role_id], (err, result) => {
    if (err) {
      console.error("Error updating role name:", err);
      res.status(500).json({ error: "An error occurred while updating role name" });
    } else {
      if (result.affectedRows === 0) {
        res.status(404).json({ error: "role not found" });
      } else {
        console.log("role name updated successfully. role ID:", role_id);
        res.status(200).json({ message: "role name updated successfully", id: role_id });
      }
    }
  });
});

app.delete("/deleterole/:role_id", (req, res) => {
  const { role_id} = req.params;
  db.query(
    "DELETE FROM tbl_user_roles WHERE role_id = ?",
    [role_id],
    (err) => {
      if (err) throw err;
      res.json({ message: "role deleted successfully" });
    }
  );
});
    