import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Car, Bike, Upload, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { signup, SignupData } from "./../services/api";
import { toast } from "sonner";
import React from 'react';
import Navbar from "./../components/Navbar";
import { Input } from "./../components/ui/input";
import { Button } from "./../components/ui/button";
import { Textarea } from "./../components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./../components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./../components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./../components/ui/select";

import { createServiceRequest, CreateRequestData } from "./../services/api";

const formSchema = z.object({
  vehicleType: z.enum(["car", "motorbike"], {
    required_error: "Please select a vehicle type",
  }),
  serviceType: z.enum(["flatTire", "fuel", "engine", "spark", "oilLeakage"], {
    required_error: "Please select a service type",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const RequestService = () => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: CreateRequestData) => createServiceRequest(data),
    onSuccess: () => {
      toast.success("Service requested successfully!");
      navigate("/logmain");
    },
    onError: (error) => {
      console.error("Error creating service request:", error);
      toast.error("Failed to create service request. Please try again.");
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (values: FormValues) => {
    const requestData: CreateRequestData = {
      vehicleType: values.vehicleType,
      serviceType: values.serviceType,
      description: values.description,
      image: imagePreview || undefined,
    };
    
    mutation.mutate(requestData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-12">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl">Request Service</CardTitle>
            <CardDescription>
              Fill out the form below to request assistance from a mechanic
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="vehicleType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vehicle Type</FormLabel>
                        <div className="grid grid-cols-2 gap-4">
                          <Button
                            type="button"
                            variant={field.value === "car" ? "default" : "outline"}
                            className="flex flex-col items-center gap-2 h-auto py-4"
                            onClick={() => field.onChange("car")}
                          >
                            <Car className="h-8 w-8" />
                            <span>Car</span>
                          </Button>
                          <Button
                            type="button"
                            variant={field.value === "motorbike" ? "default" : "outline"}
                            className="flex flex-col items-center gap-2 h-auto py-4"
                            onClick={() => field.onChange("motorbike")}
                          >
                            <Bike className="h-8 w-8" />
                            <span>Motorbike</span>
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="serviceType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Required</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select service type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="flatTire">Flat Tire</SelectItem>
                            <SelectItem value="fuel">Fuel</SelectItem>
                            <SelectItem value="engine">Engine</SelectItem>
                            <SelectItem value="spark">Spark</SelectItem>
                            <SelectItem value="oilLeakage">Oil Leakage</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Problem Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Please describe the problem you're facing in detail..."
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide as much detail as possible to help the mechanic understand your issue
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-3">
                  <FormLabel>Upload Image (Optional)</FormLabel>
                  <div className="flex items-center gap-4">
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-500" />
                        <p className="text-sm text-gray-500">Click to upload image</p>
                      </div>
                      <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>

                    {imagePreview && (
                      <div className="relative h-32 w-32">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="h-full w-full object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                          onClick={() => {
                            setImagePreview(null);
                            setImageFile(null);
                          }}
                        >
                          &times;
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              className="mr-2"
              onClick={() => navigate("/")}
            >
              Cancel
            </Button>
            <Button 
              onClick={form.handleSubmit(onSubmit)} 
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Request Service"
              )}
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default RequestService;
