const express=require("express");
const mysql=require("mysql");
const app=express();
const port=3000;
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const cors = require('cors');

app.use(cors());

const pool=mysql.createPool({
    connectionLimit:10,
    host:'sql982.main-hosting.eu',
    user:'u391940495_prabhu_finance',
    password:'Prabhu@985',
    database:'u391940495_prabhu_finance',
    connectTimeout:1000,
    acquireTimeout:1000,
    waitForConnections:true
});

pool.on('error', (err) => {
    console.error('Database error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Lost database connection, attempting to reconnect...');
    } else {
      throw err;
    }
  });

  app.get('/',(req,res)=>{
    res.json({
        status:200,
        message:"API IS WORKING"
    })
  })

  // get user details
  app.get('/api/getuser',(req,res)=>{
    pool.query('select * from users',(err,results)=>{
        if(err){
        res.json({
            status:500,
            message:"Internal Server Error"
        })
    }else{
        res.json({
            status:200,
            message:results
        })

    }
    })
    
  });
  app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
  
    // Create the SQL query
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
  
    // Execute the query
    pool.query(query, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
  
      if (results.length === 0) {
        return res.status(401).json({
          error: 'Invalid username or password',
          message: 'If you did not find your credentials, please contact Prabhuteja',
        });
      }
  
      // Handle successful login here
      // ...
  
      res.status(200).json({ message: 'Login successful' });
    });
  });

//   create user account
app.post('/api/create',(req,res)=>{
    const data=req.body;
   


    pool.query(`INSERT INTO users (name, username, password) values (?, ?, ?)`,[data.name,data.username,data.password],(err,results)=>{
     
        if(err)
        {
            res.json({
                status:500,
                error:"Internal Server Error"
            })
        }else{
            res.json({
                status:200,
                message:results
            })
        }
    })
});

// create accounts
app.post('/api/accounts',(req,res)=>{
    const data=req.body;
   

    pool.query(`insert into accounts (accounttype, category) values (?, ?)`,[data.accounttype, data.category],(err,results)=>{
        if(err)
        {
            res.json({
                status:500,
                error:"Internal Server Error"
            })
        }else{
            res.json({
                status:200,
                message:"Accounts Created Successfully"
            })
        }
    })
});

// getdata accounts
app.get('/api/account',(req,res)=>{
    pool.query(`select * from accounts`,(err,results)=>{
        if(err)
        {
            res.json({
                status:500,
                error:"Internal Server Error"
            })
        }else{
            res.json({
                status:200,
                data:results
            })
        }
    })
});

//create transfer type
app.post('/api/createtransfer',(req,res)=>{
    const data=req.body;
    
    pool.query(`insert into transfer (transfer, category) values (?, ?)`,[data.transfer, data.category],(err,results)=>{
        if(err)
        {
            res.json({
                status:500,
                error:"Internal Server Error"
            })
        }else{
            res.json({
                status:200,
                message:"Transfer Name Created Successfully"
            })
        }

    })
});

//get transfer 
app.get('/api/gettransfer',(req,res)=>{
    pool.query(`select * from transfer`,(err,results)=>{
        if(err)
        {
            res.json({
                status:500,
                error:"Internal Server Error"
            })
        }else{
            res.json({
                status:200,
                data:results
            })
        }
    })
})

// create money transfer
app.post('/api/createmoney',(req,res)=>{
    const data=req.body;
    console.log(data)
    pool.query(`insert into moneytransfer (transfertype, date, amount, note, description,accounttype) values (?, ?, ?, ?, ?, ?)`,[data.transfertype, data.date, data.amount, data.note, data.description,data.accounttype],(err,results)=>{
        if(err)
        {
            res.json({
                status:500,
                error:"Internal Server Error"
            })
        }else{
            res.json({
                status:200,
                message:"Money Transfer Created Successfully"
            })
        }
    })
})

// get money transfer data
app.get('/api/transferdetails',(req,res)=>{
    pool.query(`select * from moneytransfer`,(err,results)=>{
        console.log(results) 
    if(err)
    {
        res.json({
            status:500,
            error:"Internal Server Error"
        })
    }else{
        res.json({
            status:200,
            data:results
        })
    }
})
});

//get summary details












app.listen(port,()=>{
    console.log(`Server started on ${port}`)
})