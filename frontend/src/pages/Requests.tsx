
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./../contexts/AuthContext";
import { Phone, CheckCircle, AlertCircle, X, Check, Eye } from "lucide-react";
import { toast } from "sonner";
import React, { useState } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { io } from 'socket.io-client';

import Navbar from "./../components/Navbar";
import { Button } from "./../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./../components/ui/table";
import { Badge } from "./../components/ui/badge";
import { getServiceRequests, acceptServiceRequest, ServiceRequest, User, completedServiceRequest, canceledServiceRequest } from "./../services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";


const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">{status}</Badge>;
    case "accepted":
      return <Badge variant="outline" className="bg-blue-100 text-blue-800">{status}</Badge>;
    case "completed":
      return <Badge variant="outline" className="bg-green-100 text-green-950">{status}</Badge>;
    case "cancelled":
      return <Badge variant="outline" className="bg-red-100 text-red-800">{status}</Badge>;
    case "user have completed":
      return <Badge variant="outline" className="bg-green-=100 text-green-600">{status}</Badge>;
    case "mechanic have completed":
      return <Badge variant="outline" className="bg-green-100 text-green-600">{status}</Badge>;


    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};



const getServiceTypeDisplay = (serviceType: string) => {
  switch (serviceType) {
    case "flatTire": return "Flat Tire";
    case "fuel": return "Fuel";
    case "engine": return "Engine";
    case "spark": return "Spark";
    case "oilLeakage": return "Oil Leakage";
    default: return serviceType;
  }
};


// Helper function to check if user is a User object (not a string)
const isUserObject = (user: User | string): user is User => {
  return typeof user !== 'string';
};

const isRequestObject = (request: Request | string): request is Request => {
  return typeof request !== 'string';
};


const Requests = () => {

  const { user } = useAuth();
  const [disableCompletButton, setDisableCompletButton] = useState(false)
  const [mechanicLocation, setMechanicLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);

  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);


  const nav = useNavigate();



  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.GOOGLE_MAP_API || '', // Add your API key here
  });

  const handnewClick = () => {
    nav('/requestservice')
  }

  const queryClient = useQueryClient();
  const isMechanic = user?.userType === "mechanic";

  const { data, isLoading, error } = useQuery({
    queryKey: ['serviceRequests'],
    queryFn: getServiceRequests
  });

  const acceptMutation = useMutation({
    mutationFn: (requestId: string) => acceptServiceRequest(requestId),
    onSuccess: () => {
      toast.success("Request accepted successfully!");
      queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
    },
    onError: () => {
      console.log("in the mutation");
      toast.error("Failed to accept request. Please try again.");
    },
  });

  const handleAcceptRequest = (requestId: string) => {
    acceptMutation.mutate(requestId, {
      onSuccess: () => {
        toast.success("Request accepted successfully! Mechanic's location is now visible.");
      },
      onError: () => {
        toast.error("Failed to accept request. Please try again.");
      },
    });

  };

  const handleContactUser = (user: User | string) => {
    // In a real app, this would open the phone dialer or show contact options
    if (isUserObject(user) && user.phoneNumber) {
      toast.info(`Contacting user at ${user.phoneNumber}`);
    } else {
      toast.warning("Phone number not available");
    }
  };


    const getMechanicLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const newLocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            setLocation(newLocation);
            toast.success("Location fetched successfully!");
            console.log("Location of mechanic is :", newLocation.latitude, newLocation.longitude);
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

  const handleViewUser = (request: Request | string) => {
    // In a real app, this would open a modal or navigate to a user profile
    if (isRequestObject(request)) {
      console.log("Viewing Request Info :", request);
      getMechanicLocation();
    } else {
      toast.warning("Request not available");
    }
  };


  const cancelMutation = useMutation({
    mutationFn: (requestId: string) => canceledServiceRequest(requestId),
    onSuccess: () => {
      toast.success("Request canceled successfully!");
      queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
    },
    onError: () => {
      toast.error("Failed to cancel request. Please try again.");
    },
  });

  const handleCancelUser = (requestId: string) => {
    cancelMutation.mutate(requestId)
  };


  const completeMutation = useMutation({
    mutationFn: (requestId: string) => completedServiceRequest(requestId),
    onSuccess: () => {
      toast.success("Request Completed successfully!");
      queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
    },
    onError: () => {
      toast.error("Failed to Complete request. Please try again.");
    },
  });


  const handleCompletedUser = (requestId: string) => {
    completeMutation.mutate(requestId)
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Loading requests...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-6 py-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-500">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Failed to load service requests. Please try again later.</p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-12">
        <Card>
          <CardHeader>
            <CardTitle>{isMechanic ? "Available Requests" : "My Requests"}</CardTitle>
            <CardDescription>
              {isMechanic
                ? "View and accept service requests from users"
                : "Track the status of your service requests"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data && data.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      {isMechanic && <TableHead>User</TableHead>}
                      {!isMechanic && <TableHead>Mechanic</TableHead>}
                      <TableHead>Date</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((request: ServiceRequest) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium capitalize">
                          {request.vehicleType}
                        </TableCell>
                        <TableCell>
                          {getServiceTypeDisplay(request.serviceType)}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {request.description}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(request.status)}
                        </TableCell>
                        {isMechanic && (
                          <TableCell>

                            {request.user && isUserObject(request.user)
                              ? request.user.name
                              : '-'}
                          </TableCell>
                        )}
                        {!isMechanic && (
                          <TableCell>
                            {request.assignedTo && isUserObject(request.assignedTo)
                              ? request.assignedTo.name
                              : '-'}
                          </TableCell>
                        )}
                        <TableCell>
                          {formatDate(request.createdAt)}
                        </TableCell>
                        <TableCell>
                          {isMechanic && request.status === 'pending' && (
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => handleAcceptRequest(request["_id"])}
                                disabled={acceptMutation.isPending}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewUser(request)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </div>
                          )}
                          {isMechanic && request.status === 'accepted' && (
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewUser(request)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </div>
                          )}
                          {!isMechanic && request.status === 'pending' && (
                            <div className="space-x-2">
                              <Button
                                className="bg-red-400"
                                size="sm"
                                variant="outline"
                                onClick={() => handleCancelUser(request["_id"])}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Cancel
                              </Button>
                            </div>
                          )}
                          {!isMechanic && request.status === 'accepted' && (
                            <div className="flex space-x-2">
                              {request.assignedTo && (
                                <div className="flex space-x-2">
                                  <div className="space-x-2">
                                    <Button
                                      className="bg-red-400"
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleCancelUser(request["_id"])}
                                    >
                                      <X className="h-4 w-4 mr-1" />
                                      Cancel
                                    </Button>
                                  </div>
                                  <div className="space-x-2">
                                    <Button
                                      className="bg-green-400"
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleCompletedUser(request["_id"])}
                                    >
                                      <Check className="h-4 w-4 mr-1" />
                                      Completed
                                    </Button>
                                  </div>
                                  <div className="space-x-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleContactUser(request.assignedTo)}
                                    >
                                      <Phone className="h-4 w-4 mr-1" />
                                      Contact Mechanic
                                    </Button>
                                  </div>

                                </div>
                              )}
                            </div>
                          )}
                          {!isMechanic && request.status === 'mechanic have completed' && (
                            <div className="flex space-x-2">

                              <div className="space-x-2">
                                <Button
                                  className="bg-green-400"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleCompletedUser(request["_id"])}
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Completed
                                </Button>
                              </div>
                              <div className="space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleContactUser(request.assignedTo)}
                                >
                                  <Phone className="h-4 w-4 mr-1" />
                                  Contact Mechanic
                                </Button>
                              </div>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No requests found</h3>
                <p className="text-gray-500 mt-1">
                  {isMechanic
                    ? "There are no pending service requests at the moment."
                    : "You haven't made any service requests yet."}
                </p>
                {!isMechanic && (
                  <Button className="mt-6" onClick={() => handnewClick()}>
                    Request a Service
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {mechanicLocation && isLoaded && (
          <GoogleMap
            center={{ lat: mechanicLocation.latitude, lng: mechanicLocation.longitude }}
            zoom={15}
            mapContainerStyle={{ width: '100%', height: '400px' }}
          >
            <Marker position={{ lat: mechanicLocation.latitude, lng: mechanicLocation.longitude }} />
          </GoogleMap>
        )}

      </main>



    </div>
  );
};

export default Requests;
// function useEffect(arg0: () => (() => void) | undefined, arg1: any[]) {
//   throw new Error("Function not implemented.");
// }

