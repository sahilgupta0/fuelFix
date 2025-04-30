
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./../components/ui/button";
import { Input } from "./../components/ui/input";
import { RadioGroup, RadioGroupItem } from "./../components/ui/radio-group";
import { Label } from "./../components/ui/label";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signup, SignupData } from "./../services/api";
import React from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./../components/ui/form";
import axios from 'axios';

const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  re_password: z.string().min(6, { message: "Please re-enter your password" }),
  address: z.string().min(5, { message: "Address is required" }),
  phoneNumber: z.string().min(10, { message: "Please enter a valid phone number" }),
  userType: z.enum(["user", "mechanic"], { required_error: "Please select a user type" }),
  otp: z.string().min(6, { message: "OTP is required" }),
})
  .refine((data) => data.password === data.re_password, {
    path: ["re_password"], // This tells Zod where the error should appear
    message: "Passwords do not match",
  });

type SignupFormValues = z.infer<typeof signupSchema>;

const Signup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);




  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      re_password: "",
      address: "",
      phoneNumber: "",
      userType: "user",
    },
  });

  const signup = async (data: SignupData) => {
    console.log(data)
    return await axios.post(`${import.meta.env.VITE_PROXY_URL}api/signup`, data);
  };


  const handleSendOtp = async () => {
    const email = form.getValues("email");
    const name = form.getValues("name");
    const password = form.getValues("password");
    const re_password = form.getValues("re_password");
    const address = form.getValues("address");
    const phoneNumber = form.getValues("phoneNumber");

    
    if(email == "" || name == "" || password == "" || re_password == "" || address =="" || phoneNumber == ""){
      toast.error("Please fill all the details")
      return 
    }
    if(password != re_password){
      toast.error("Password doesn't match")
      return
    }

    try {
      setOtpLoading(true);
      const response = await axios.post(`${import.meta.env.VITE_PROXY_URL}api/otp/send`, { 'email': email });

      if (response.status == 200) {
        toast.success("OTP send successfully!");
        setIsOtpSent(true);
      }

      
    } catch (error) {
      console.error(error);
      form.setError("email", { message: "Could not send OTP. Try again." });
    } finally {
      setOtpLoading(false);
    }
  };


  const handleVerifyOtp = async () => {
    const email = form.getValues("email");
    const otp = form.getValues("otp");


    if (!email) {
      form.setError("email", { message: "Please enter your email first" });
      return;
    }

    try {
      setVerifyLoading(true);
      const data = {
        'email': email,
        'otp': otp
      }
      const response = await axios.post(`${import.meta.env.VITE_PROXY_URL}api/otp/verify`, data);

      if (response.status == 200) {
        toast.success("OTP verified successfully!");
        setIsOtpVerified(true)
      }
      else {
        console.log(response)
      }
    } catch (error) {
      console.error(error);
      toast.error("OTP doesn't match")
    } finally {
      setVerifyLoading(false);
    }
  };


  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);

    try {

      // Show success toast
      console.log("Entering in the sign up")

      const response = await signup(data as SignupData);
      console.log("response got : ", response)
      if (response.status === 201) {
        toast.success("Account created successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else if (response.status === 400) {
        toast.error("Invalid user type or bad request.");
      } else {
        toast.error("Unexpected error occurred.");
      }

      // Redirect to login after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 400) {
          toast.error("Invalid user type. Please check your form.");
        } else if (error.response.status === 500) {
          toast.error("Server error. Please try again later.");
        } else {
          toast.error("Something went wrong. Please try again.");
        }
        console.error("Signup error:", error.response.data);
      } else {
        toast.error("Network error. Please check your internet connection.");
        console.error("Network error:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Create a new account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="font-medium text-purple-600 hover:text-purple-500"
          >
            Sign in
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input type="email" placeholder="example@email.com" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />


              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="re_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Re-Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St, City, State" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="123-456-7890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="userType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Account Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="user" id="user" />
                          <Label htmlFor="user">User</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="mechanic" id="mechanic" />
                          <Label htmlFor="mechanic">Mechanic</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isOtpSent && (
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Enter OTP</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input placeholder="Enter 6-digit OTP" {...field} />
                          <Button type="button" onClick={handleVerifyOtp} disabled={verifyLoading || isOtpVerified}>
                            {verifyLoading ? "Verifying..." : "Verify OTP"}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {!isOtpSent && (
                <Button type="button" className="w-full" onClick={handleSendOtp} disabled={otpLoading || isOtpSent}>
                {otpLoading ? "Sending..." : "Send OTP"}
              </Button>
              )
              }
              {isOtpSent && (
                  <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || !isOtpVerified}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>

              )}
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
