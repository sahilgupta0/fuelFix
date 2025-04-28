
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./../components/ui/button";
import { Input } from "./../components/ui/input";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "./../contexts/AuthContext";
import { login, LoginData } from "./../services/api";
import React from 'react';
import axios from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./../components/ui/form";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {

 

  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

   // if the user is login then after pressing back it shoudl not go back to login in paga again so we are redirecting it to main page 
  const { user } = useAuth(); // assuming AuthProvider provides `user`


  useEffect(() => {
    if (user) {
      console.log("stop the user from going further back")
      navigate("/logmain", { replace: true }); // Already logged in, redirect
    }
  }, [user, navigate]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const login = async (data: LoginData) => {
    console.log("before callling")
    console.log(`${import.meta.env.VITE_PROXY_URL}api/login`)
    return await axios.post(`${import.meta.env.VITE_PROXY_URL}api/login`, data);

  };

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      const response = await login(data as LoginData);

      console.log("data came from database")
      const responseData = response.data;
      
      // Store token and user data
      authLogin(responseData.token, {
        name: responseData.user.name,
        email: responseData.user.email,
        userType: responseData.user.userType,
      });
      
      // Show success toast
      toast.success("Login successful!");
      
      // Redirect to home page
      navigate("/logmain");
    } catch (error) {
      toast.error("Invalid email or password. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="font-medium text-purple-600 hover:text-purple-500"
          >
            Sign up
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

              <div className="text-sm text-gray-600 mb-4">
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
