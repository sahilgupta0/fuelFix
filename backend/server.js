require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const Request = require('./models/Request');
const Mechanic = require('./models/Mechanic');
const Otp = require('./models/Otp')
const path = require('path');
const app = express();
const mapRoutes = require('./routes/map.routes')


//for otp
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const { timeStamp } = require('console');




// ------------------------------Middleware-----------------------
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



//------------send all the maps related routes to the mapRoutes----------------

app.use('/maps', mapRoutes);



// ------------------------socket.io-----------------
const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app); // Use the same app instance
const io = new Server(server, {
  cors: {
    origin: '*', // Replace with your frontend URL in production
  },
});


// ----------------------Connect to MongoDB------------------------------
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));


// ----------------------Get Request Location------------------------------
app.get('/api/request-location/:id', async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    const { destination } = request;
    res.status(200).json({ destination });
  } catch (error) {
    console.error('Get request location error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});



// -----------------------Auth Middleware---------------------------
const authenticateToken = (req, res, next) => {
  // console.log("in the authorize section")
  const authHeader = req.headers['authorization']; //it can contain many thing so we havve to split the 
  const token = authHeader

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  });
};





// -----------------------Routes---------------------------------
app.get('/', (req, res) => {
  res.send({
    activeStatus: true,
    error: false,

  })
})





// ------------------SOS EMAIL---------------------------

app.post('/api/sos/send', (req, res) => {

  const email = "sahilroy1918912@gmail.com";
  const { user, latitude  , longitude } = req.body;


  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // use TLS
    auth: {
      user: process.env.MAIL_USER, // Your Gmail email address
      pass: process.env.MAIL_PASS // Your Gmail password
    }
  });

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }
  console.log("the email is :", email)


  // Email configuration
  const SendEmail = async () => {
    try {

      const info = await transporter.sendMail({
        from: `"Fule Fix" <${process.env.MAIL_USER}>`,
        to: email,
        subject: 'Need Help',
        html: `<!DOCTYPE html>
              <html lang="en">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>SOS Alert</title>
                <style>
                  body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                  }
                  .email-container {
                    max-width: 600px;
                    margin: 20px auto;
                    background-color: #ffffff;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                  }
                  .email-header {
                    background-color: #dc3545;
                    color: #ffffff;
                    text-align: center;
                    padding: 20px;
                  }
                  .email-header h1 {
                    margin: 0;
                    font-size: 24px;
                  }
                  .email-body {
                    padding: 20px;
                    color: #333333;
                    line-height: 1.6;
                  }
                  .email-body h2 {
                    color: #dc3545;
                    font-size: 20px;
                  }
                  .alert-message {
                    background-color: #f8d7da;
                    color: #721c24;
                    font-size: 18px;
                    font-weight: bold;
                    padding: 15px;
                    border-radius: 4px;
                    margin: 20px 0;
                    text-align: center;
                  }
                  .email-footer {
                    text-align: center;
                    padding: 20px;
                    background-color: #f8f9fa;
                    color: #666666;
                    font-size: 14px;
                  }
                  .email-footer a {
                    color: #007bff;
                    text-decoration: none;
                  }
                </style>
              </head>
              <body>
                <div class="email-container">
                  <div class="email-header">
                    <h1>SOS Alert - Fule Fix</h1>
                  </div>
                  <div class="email-body">
                    <h2>Emergency Assistance Required</h2>
                    <p>An SOS alert has been triggered by a user. Please respond to this emergency as soon as possible.</p>
                    <div class="alert-message">
                      Name: ${user.name}<br>
                      Email: ${user.email}<br>
                      Location: ${latitude}, ${longitude}<br>
                    </div>
                    <p>If you have received this email in error, please disregard it.</p>
                    <p>Thank you,<br>The Fule Fix Team</p>
                  </div>
                  <div class="email-footer">
                    <p>&copy; 2025 Fule Fix. All rights reserved.</p>
                    <p><a href="https://fuelfix.vercel.app">Visit our website</a></p>
                  </div>
                </div>
              </body>
              </html>`
      })

      console.log("SOS send succuessfully")

      res.status(200).json(info)
    }
    catch (error) {
      res.status(500).json({
        message: "server error"
      })
      console.log(error)
    }
  }

  SendEmail()

});





// ----------------FrontEnd call it to send the OTP--------------------------



app.post('/api/otp/send', (req, res) => {

  const { email } = req.body;

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // use TLS
    auth: {
      user: process.env.MAIL_USER, // Your Gmail email address
      pass: process.env.MAIL_PASS // Your Gmail password
    }
  });


  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000);
  }


  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }
  
  const otp = generateOtp();
  console.log(otp)
  console.log("the email is :", email)


  // Email configuration
  const SendEmail = async () => {
    try {

      const info = await transporter.sendMail({
        from: `"Fule Fix" <${process.env.MAIL_USER}>`,
        to: email,
        subject: 'Email Verification OTP',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
                body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
                }
                .email-container {
                  max-width: 600px;
                  margin: 20px auto;
                  background-color: #ffffff;
                  border-radius: 8px;
                  overflow: hidden;
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                .email-header {
                  background-color: #007bff;
                  color: #ffffff;
                  text-align: center;
                  padding: 20px;
                }
                .email-header h1 {
                  margin: 0;
                  font-size: 24px;
                }
                .email-body {
                  padding: 20px;
                  color: #333333;
                  line-height: 1.6;
                }
                .email-body h2 {
                  color: #007bff;
                  font-size: 20px;
                }
                .otp-code {
                  display: inline-block;
                  background-color: #f8f9fa;
                  color: #007bff;
                  font-size: 24px;
                  font-weight: bold;
                  padding: 10px 20px;
                  border-radius: 4px;
                  margin: 20px 0;
                }
                .email-footer {
                  text-align: center;
                  padding: 20px;
                  background-color: #f8f9fa;
                  color: #666666;
                  font-size: 14px;
                }
                .email-footer a {
                  color: #007bff;
                  text-decoration: none;
                }
              </style>

          </head>
          <body>
            <div class="email-container">
              <div class="email-header">
                <h1>Fule Fix</h1>
              </div>
              <div class="email-body">
                <h2>Email Verification</h2>
                <p>Thank you for choosing <strong>Fule Fix</strong>. To complete your email verification, please use the OTP below:</p>
                <div class="otp-code">${otp}</div>
                <p>If you did not request this verification, please ignore this email.</p>
                <p>Thank you,<br>The Fule Fix Team</p>
              </div>
              <div class="email-footer">
                <p>&copy; 2025 Fule Fix. All rights reserved.</p>
                <p><a href="https://fuelfix.vercel.app">Visit our website</a></p>
              </div>
            </div>
          </body>
          </html>
        `,
      })

      console.log("OTP send succuessfully")
      const newOtp = await Otp.create({ email, otp })

      res.status(200).json(info)
    }
    catch (error) {
      res.status(500).json({
        message: "server error"
      })
      console.log(error)
    }
  }

  SendEmail()

});


app.post('/api/otp/verify', async (req, res) => {
  const { email, otp } = req.body;

  //check if user exists
  const otpData = await Otp.findOne({ email })

  if (otpData.verified == true) {
    res.status(200)
  }

  if (!otpData.email) {
    console.log("user not found")
    return res.status(400).json({
      message: 'User not found'
    });
  }


  // Check if OTP is correct
  if (otpData.otp === parseInt(otp)) {
    otpData.verified = true
    return res.status(200).json({
      message: 'OTP verified successfully'
    });
  } else {
    return res.status(401).send('Invalid OTP');
  }

})




// -------------------Both can call to register themselve-----------------------------


app.post('/api/signup', async (req, res) => {
  try {
    const { name,
      email,
      password,
      address,
      phoneNumber,
      userType } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const mechanicExists = await Mechanic.findOne({ email });
    if (mechanicExists) {
      return res.status(400).json({ message: 'Mechanic already exists' });
    }

    let newUser;
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

    try {
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
    catch {
      res.status(201).json({
        message: "Error while send to database"
      })
    }

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// -----------------Both user and mechanic can call to login------------------

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
    if (user) {
      userType = user
    }

    if (mech) {
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



// --------------Only User can call this to Request the service -------------------------

// Service request routes
app.post('/api/requests', authenticateToken, async (req, res) => {

  try {

    const { vehicleType, serviceType, description, image, destination } = req.body;
    const newRequest = await Request.create({
      user: req.user.id,
      vehicleType,
      serviceType,
      description,
      destination,
      image,
      status: 'pending'
    });

    // saving the data to request database\
    await newRequest.save();

    res.status(201).json({
      message: 'Service request created successfully',
      request: newRequest
    });
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// --------------Only Mechanic can call this to dispaly all the pending request-----------------------

app.get('/api/requests', authenticateToken, async (req, res) => {
  try {
    let requests;

    // If user is a mechanic, show all pending requests
    if (req.user.userType === 'mechanic') {
      requests = await Request.find({
        $or: [
          { status: 'pending' },
          // { assignedTo: req.user.id } //removing this because we only want to show the pending request
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

// --------------Only Mechanic can call this to dispaly all the request that he have Accepted-----------------------


app.get('/api/myrequests', authenticateToken, async (req, res) => {
  try {
    let requests;

    requests = await Request.find({
      $or: [
        // { status: 'pending' },    // because we only want to show the request assign to the mechanic, since it is the only their request
        { assignedTo: req.user.id }
      ]
    }).populate('user', 'name phoneNumber address');

    res.status(200).json(requests);
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// ------------- Mechanic Can call this for marking there Request Accepted -------------------------------


app.get('/api/requests/:id/accept', authenticateToken, async (req, res) => {
  try {
    console.log("in the accept request section")
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

    console.log("the request  ", request)

    console.log("the request status before ", request.status)

    request.status = 'accepted';

    console.log("the request status after ", request.status)

    request.assignedTo = req.user.id;
    await request.save();

    const mechanic = await Mechanic.findById(req.user.id);

    res.status(200).json({
      message: 'Request accepted',
      request,
      mechanicLocation: {
        latitude: mechanic.location?.latitude,
        longitude: mechanic.location?.longitude,
      },
    });

  } catch (error) {
    console.error('Accept request error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// -------------both the user and Mechanic Can call this for marking there Request cancel -------------------------------

app.put('/api/myrequests/:id/cancel', authenticateToken, async (req, res) => {
  try {

    const request = await Request.findById(req.params.id);


    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    if (request.status == "accepted" || request.status == "pending") {
      request.status = 'cancelled';
      await request.save();
    }
    else {
      res.status(400).json({ message: "Request is not accepted" })
    }
    res.status(200).json({ message: 'Request accepted', request });
  } catch (error) {
    console.error('Accept request error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});



// -------------both the user and Mechanic Can call this for marking there Request completed -------------------------------

app.put('/api/myrequests/:id/completed', authenticateToken, async (req, res) => {
  try {

    const request = await Request.findById(req.params.id);


    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    if (req.user.userType == 'mechanic') {
      if (request.status == "accepted") {
        request.status = 'mechanic have completed'
      }
      else if (request.status == "user have completed") {
        request.status = "completed"
      }
      else {
        res.status(400).json({ message: "Already accepted" })
      }
      await request.save();
    }
    else {
      if (request.status == "accepted") {
        request.status = 'user have completed'
      }
      else if (request.status == "mechanic have completed") {
        request.status = "completed"
      }
      else {
        res.status(400).json({ message: "Already accepted" })
      }
      await request.save();
    }
    res.status(200).json({ message: 'Request accepted', request });
  } catch (error) {
    console.error('Accept request error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});






// ------------to avoid reload redirecting to homePage---------------------

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


