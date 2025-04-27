const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const Request = require('./models/Request');
const Mechanic = require('./models/Mechanic')
require('dotenv').config();

// Initialize express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));




// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    // console.log("decode user : ", user)
    
    req.user = user;
    next();
  });
};

// Routes
app.get('/', (req, res) =>{
  res.send({
    activeStatus : true,
    error:false,

  })
})

app.post('/api/signup', async (req, res) => {
  try {
    const {name,
      email,
      password,
      address,
      phoneNumber,
      userType} = req.body;
      
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const mechanicExists = await Mechanic.findOne({ email });
    if (mechanicExists) {
      return res.status(400).json({ message: 'Mechanic already exists' });
    }
    
    let newUser ;
    if (userType === 'user') {
      newUser = await User.create({
        name,
        email,
        password,
        address,
        phoneNumber,
        userType
      });
    } else if (userType === 'mechanic') {
      newUser = await Mechanic.create({
        name,
        email,
        password,
        address,
        phoneNumber,
        userType
      });
    } else {

      return res.status(400).json({ message: 'Invalid user type' });
    }
    
    try{
      const token = jwt.sign(
        { id: newUser._id, email: newUser.email, userType: newUser.userType },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '30d' }
      );

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          userType: newUser.userType,
          address: newUser.address,
          phoneNumber: newUser.phoneNumber
        }
      });

    }
    catch{
      res.status(201).json({
        message: "Error while send to database"
      })
    }
    
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});



app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    let userType;
    
    // Find user
    const user = await User.findOne({ email });
    const mech = await Mechanic.findOne({ email })
    if (!user && !mech) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    if(user) {
      userType = user
    }

    if(mech){
       userType = mech
    }
    
    // Check password
    const isMatch = await userType.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Create token
    const token = jwt.sign(
      { id: userType._id, email: userType.email, userType: userType.userType },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '30d' }
    );
    
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: userType._id,
        name: userType.name,
        email: userType.email,
        userType: userType.userType,
        address: userType.address,
        phoneNumber: userType.phoneNumber
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Protected route example
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Service request routes
app.post('/api/requests',authenticateToken, async (req, res) => {

  try {

    const { vehicleType, serviceType, description, image } = req.body;
    const newRequest = await Request.create({
      user: req.user.id,
      vehicleType,
      serviceType,
      description,
      image,
      status: 'pending'
    });
    
    // saving the data to request database\
    await newRequest.save();
    
    res.status(201).json({ 
      message: 'Service request created successfully',
      request : newRequest
    });
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/requests', authenticateToken, async (req, res) => {
  try {
    let requests;
    
    // If user is a mechanic, show all pending requests
    if (req.user.userType === 'mechanic') {
      requests = await Request.find({ 
        $or: [
          { status: 'pending' },
          { assignedTo: req.user.id }
        ]
      }).populate('user', 'name phoneNumber address');


    } else {
      // If regular user, show only their requests
      requests = await Request.find({ user: req.user.id })
                              .populate('assignedTo', 'name phoneNumber');
    }
    
    res.status(200).json(requests);
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/requests/:id/accept', authenticateToken, async (req, res) => {
  try {
    // Only mechanics can accept requests
    if (req.user.userType !== 'mechanic') {
      return res.status(403).json({ message: 'Only mechanics can accept requests' });
    }
    
    const request = await Request.findById(req.params.id);

    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request is not in pending state' });
    }
    
    request.status = 'accepted';
    request.assignedTo = req.user.id;
    await request.save();
    
    res.status(200).json({ message: 'Request accepted', request });
  } catch (error) {
    console.error('Accept request error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
