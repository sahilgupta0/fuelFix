
import { useState } from "react";
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
  address: z.string().min(5, { message: "Address is required" }),
  phoneNumber: z.string().min(10, { message: "Please enter a valid phone number" }),
  userType: z.enum(["user", "mechanic"], { required_error: "Please select a user type" }),
});

type SignupFormValues = z.infer<typeof signupSchema>;

const Signup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      address: "",
      phoneNumber: "",
      userType: "user",
    },
  });

  const signup = async (data: SignupData) => {
    console.log(data)
    return await axios.post(`${import.meta.env.VITE_PROXY_URL}api/signup`, data);
  };

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    
    try {
      // await signup(data as SignupData);
      
      // Show success toast

      const response = await signup(data as SignupData);
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
    }  finally {
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
                      <Input type="email" placeholder="example@email.com" {...field} />
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

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
