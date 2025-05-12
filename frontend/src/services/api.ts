
import axios from 'axios';

export interface SignupData {
  name: string;
  email: string;
  re_password:string;
  password: string;
  address: string;
  phoneNumber: string;
  userType: 'user' | 'mechanic';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  userType: "user" | "mechanic";
  address: string;
  phoneNumber: string;
}


export interface AuthResponse {
  token: string;
  user: User;
  message: string;
}

export interface ServiceRequest {
  id: string;
  vehicleType: "car" | "motorbike";
  serviceType: "flatTire" | "fuel" | "engine" | "spark" | "oilLeakage";
  description: string;
  status: "pending" | "accepted" | "completed" | "cancelled" | 'mechanic have completed' | 'user have completed';
  image?: string;
  user: User | string;
  assignedTo?: User | string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRequestData {
  vehicleType: "car" | "motorbike";
  serviceType: "flatTire" | "fuel" | "engine" | "spark" | "oilLeakage";
  description: string;
  destination: string;
  image?: string;
}

// Authorization header function
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// In a real app, these functions would make actual API calls
// For now, we'll simulate the responses

export const signup = async (data: SignupData): Promise<AuthResponse> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate successful response
  return {
    token: `mock-token-${Math.random().toString(36).substring(2)}`,
    user: {
      id: `user-${Math.random().toString(36).substring(2)}`,
      name: data.name,
      email: data.email,
      userType: data.userType,
      address: data.address,
      phoneNumber: data.phoneNumber
    },
    message: 'Account created successfully'
  };
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For demo purposes, simulate successful login with fixed credentials
  if (data.email === 'user@example.com' && data.password === 'password') {
    return {
      token: `mock-token-${Math.random().toString(36).substring(2)}`,
      user: {
        id: `user-${Math.random().toString(36).substring(2)}`,
        name: 'John Doe',
        email: data.email,
        userType: 'user',
        address: '123 Main St',
        phoneNumber: '123-456-7890'
      },
      message: 'Login successful'
    };
  }
  
  if (data.email === 'mechanic@example.com' && data.password === 'password') {
    return {
      token: `mock-token-${Math.random().toString(36).substring(2)}`,
      user: {
        id: `user-${Math.random().toString(36).substring(2)}`,
        name: 'Jane Smith',
        email: data.email,
        userType: 'mechanic',
        address: '456 Oak Ave',
        phoneNumber: '098-765-4321'
      },
      message: 'Login successful'
    };
  }
  
  // Simulate error for invalid credentials
  throw new Error('Invalid credentials');
};

export const sendOtp = async () =>{
  const response = await axios.post(`${import.meta.env.VITE_PROXY_URL}api/requests`);
}

// Service requests API functions
export const createServiceRequest = async (data: CreateRequestData): Promise<ServiceRequest> => {

  // Retrieve the stored token from localStorage
  const storedToken = localStorage.getItem("authToken");

  // Make the API request
  const response = await axios.post(`${import.meta.env.VITE_PROXY_URL}api/requests`, // Your API endpoint
    data, // The actual request data
    {
      headers: {
        'Authorization': `${storedToken}` // Pass the token in the Authorization header
      }
    }
  );


  // Return the API response data
  return response.data;
};


export const getServiceRequests = async (): Promise<ServiceRequest[]> => {
  // Simulate API call
  const storedToken = localStorage.getItem('authToken');
  
  const response = await axios.get(`${import.meta.env.VITE_PROXY_URL}api/requests`, {
    headers: {
      Authorization: `${storedToken}`
    }
  });


  return response.data; 
};

export const getMyServiceRequests = async (): Promise<ServiceRequest[]> => {
  // Simulate API call
  const storedToken = localStorage.getItem('authToken');
  
  const response = await axios.get(`${import.meta.env.VITE_PROXY_URL}api/myrequests`, {
    headers: {
      Authorization: `${storedToken}`
    }
  });
  return response.data; 
};

export const acceptServiceRequest = async (requestId: string): Promise<ServiceRequest> => {
  // Simulate API call

  // console.log("from frontend api  this is the requestId: ", requestId)
  // console.log(`${import.meta.env.VITE_PROXY_URL}api/requests/${requestId}/accept`)
  
  const storedToken = localStorage.getItem('authToken');
  const response = await axios.get(`${import.meta.env.VITE_PROXY_URL}api/requests/${requestId}/accept`, {
    headers: {
      Authorization: `${storedToken}`
    }
  });

  console.log("this is the accepted response data : ", response.data)

  // Simulate successful response
  return response.data; 
};


export const canceledServiceRequest = async (requestId: string): Promise<ServiceRequest> => {
  // Simulate API call
  const storedToken = localStorage.getItem('authToken');
  const response = await axios.put(
  `${import.meta.env.VITE_PROXY_URL}api/myrequests/${requestId}/cancel`,
  {}, // Empty body
  {
    headers: {
      Authorization: `${storedToken}`
    }
  }
);

  console.log(response.data)

  // Simulate successful response
  return response.data; 
};


export const completedServiceRequest = async (requestId: string): Promise<ServiceRequest> => {
  // Simulate API call
  const storedToken = localStorage.getItem('authToken');
  const response = await axios.put(
  `${import.meta.env.VITE_PROXY_URL}api/myrequests/${requestId}/completed`,
  {}, // Empty body
  {
    headers: {
      Authorization: `${storedToken}`
    }
  }
);

  console.log(response.data)

  // Simulate successful response
  return response.data; 
};


export const getDirection = async (requestId:string , source: string): Promise<any> => {
  const storedToken = localStorage.getItem('authToken');
  const response = await axios.get(`${import.meta.env.VITE_PROXY_URL}maps/get-directions?source=${source}&requestId=${requestId}`);
  if(response.status !== 200) {
    throw new Error("Error fetching directions");
  }

  // console.log("this is the direction response data : ", response)

  // Simulate successful response
  return response; 
}