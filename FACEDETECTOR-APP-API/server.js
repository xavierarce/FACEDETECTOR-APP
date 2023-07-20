import Express  from "express";
import bcrypt from "bcryptjs";
import cors from 'cors';


const app = Express();

app.use(Express.json());
app.use(cors());

const database = {
  users:[
    {
      id:'123',
      name : 'John',
      password:'cookies',
      email: 'john@gmail.com',
      entries: 0,
      joined: new Date()
    },
    {
      id:'124',
      name : 'Sally',
      password:'bananas',
      email: 'sally@gmail.com',
      entries: 0,
      joined: new Date()
    }
  ]
}

app.get('/',(req,res)=>{
  res.send(database.users)
})

app.post('/signin',(req,res)=>{
  //*   // Load hash from your password DB.
  //* bcrypt.compare("cookies", '$2a$10$wfb8gN0bIZie1pBE/cjE9OSrbK7tCuDuSHGgru/yiua7InbF3aHlu', function(err, res) {
  //*   // res === true
  //*   console.log('first guess', res)
  //* });
  //* bcrypt.compare("not_bacon", '$2a$10$wfb8gN0bIZie1pBE/cjE9OSrbK7tCuDuSHGgru/yiua7InbF3aHlu', function(err, res) {
  //*   console.log('second guess', res)
  //*   // res === false
  //* });
  if(req.body.email=== database.users[0].email &&
    req.body.password === database.users[0].password){
      res.json(database.users[0]);
    }else{
      alert(Error);
      res.status(404).json('error logging in')
    }
})

app.post('/register',(req,res)=>{
  const {email, name, password} = req.body;
  //* bcrypt.genSalt(10, function(err, salt) {
  //*   bcrypt.hash(password, salt, function(err, hash) {
  //*     console.log(hash)
  //*   });
  //* });
  database.users.push({
    id:'125',
    name : name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date()
  })
  res.json(database.users[database.users.length-1]);
})

app.get('/profile/:id',(req,res)=>{
  const {id}=req.params;
  let found = false
  database.users.forEach(user=>{
    if(user.id === id){
      found = true;
      return res.json(user);
    }
  })  
  if(!found){
    res.status(400).json('Not found')
  }
})

app.put('/image',(req,res)=>{
  const {id}=req.body;
  let found = false
  database.users.forEach(user=>{
    if(user.id === id){
      found = true;
      user.entries++
      return res.json(user.entries);
    }
  })
    if(!found){
    res.status(400).json('Not found')
  }
})





// // As of bcryptjs 2.4.0, compare returns a promise if callback is omitted:
// bcrypt.compare("B4c0/\/", hash).then((res) => {
//   // res === true
// });


app.listen(3000,()=>{
    console.log('runnin')
})


/* 
! --> res= this is working
! signin  --> POST = success/fail
! register --> POST =  user
! profile/:userId --> GET = user
! image --> PUT --> user (count)
*/ 
