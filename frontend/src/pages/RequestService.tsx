import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import axios from "axios";

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

  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [address, setAddress] = useState("");

  const [suggestions, setSuggestions] = useState<string[]>([]); // Suggestions list
  const [isFetching, setIsFetching] = useState(false); // Loading state for suggestions



  const fetchSuggestions = async (input: string) => {
    console.log("Fetching suggestions for:", input);
    if (!input) {
      setSuggestions([]);
      return;
    }

    setIsFetching(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_PROXY_URL}maps/get-suggestions?input=${input}`);
      setSuggestions(response.data.data.suggestions.map((s: any) => s.description));
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      toast.error("Failed to fetch suggestions.");
    } finally {
      setIsFetching(false);
    }
  };

  // Debounce the API call to avoid excessive requests
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchSuggestions(address);
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [address]);

  const handleAddressSelect = (selectedAddress: string) => {
    setAddress(selectedAddress);
    setSuggestions([]); // Clear suggestions after selection
  };


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


  const getUserLocation = () => {
    setUseCurrentLocation(!useCurrentLocation)
    if (useCurrentLocation) {
      return;
    }
    setAddress("");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setLocation(newLocation);
          console.log("Location fetched is :", newLocation);

          toast.success("Location fetched successfully!");
        },
        (error) => {
          console.error("Error fetching location:", error);
          toast.error("Failed to fetch location. Please enable location services.");
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser.");
    }
  };

  const onSubmit = async (values: FormValues) => {
    if (location==null && address.trim() === "") {
      toast.error("Location is required to submit the request.");
      return;
    }
    let lat;
    let long;
    if (location) {
      lat = location.latitude;
      long = location.longitude;
    }
    if (address.trim() !== "") {
      const coordinates = await axios.get(`${import.meta.env.VITE_PROXY_URL}maps/coordinates?address=${address}`)
      lat = coordinates.data.data.coordinates.latitude;
      long = coordinates.data.data.coordinates.longitude;
    }

    const requestData: CreateRequestData = {
      vehicleType: values.vehicleType,
      serviceType: values.serviceType,
      description: values.description,
      destination: `${lat},${long}` || 'birgunj', // Example destination
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
                  <div className="space-y-3">
                    <FormLabel>Address</FormLabel>
                    <div className="flex items-center gap-4">
                      <Input
                        type="text"
                        placeholder="Enter your address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        disabled={useCurrentLocation} // Disable input if toggle is on
                      />
                      <Button
                        type="button"
                        variant={useCurrentLocation ? "default" : "outline"}
                        onClick={() => getUserLocation()}
                      >
                        {useCurrentLocation ? "Using Current Location" : "Use Current Location"}
                      </Button>
                    </div>
                    {useCurrentLocation && location && (
                      <p className="text-sm text-gray-500">
                        Current Location: {location.latitude}, {location.longitude}
                      </p>
                    )}

                    {isFetching && <p className="text-sm text-gray-500">Fetching suggestions...</p>}
                    {suggestions.length > 0 && (
                      <ul className="border border-gray-300 rounded-md shadow-md bg-white max-h-40 overflow-y-auto">
                        {suggestions.map((suggestion, index) => (
                          <li
                            key={index}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleAddressSelect(suggestion)}
                          >
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

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
