const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const mongoose = require("mongoose")
mongoose.connect('mongodb://localhost:27017/usersDB', { useNewUrlParser: true});

const usersSchema = new mongoose.Schema ({
  username: String,
  password: String,
})

const Users = new mongoose.model("Users", usersSchema);


app.use(express.json())

// const users = []

app.get('/users', async (req, res) => {
  try {
     const allUser = await Users.find()
      res.status(200).json(allUser)
  } catch (error) {
    res.status(400).json(error.message)
  }
  

})




app.post('/users', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const user = { ...req.body, password: hashedPassword }
    const newUser = await Users.create(user)
    res.status(201).json(newUser)
  } catch(error) {
    res.status(500).json(error)
     
  }
})

app.post('/users/login', async (req, res) => {
  const user = await Users.find({username: req.body.username})
  if (!user) {
        res.status(400).json('Kindly create new account')
  }

  try {
    if(await bcrypt.compare(req.body.password, user.password)) {
      res.status(200).json('User logged in successfully')
    } else {
      res.status(404).json('Incorrect password')
    }
  } catch(error) {
    res.status(500).json(error.message)

  }
})

app.listen(3000, ()=>{
  console.log("listening on port 3000")
})