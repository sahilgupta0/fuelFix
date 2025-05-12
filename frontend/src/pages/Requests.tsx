
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./../contexts/AuthContext";
import { Phone, CheckCircle, AlertCircle, X, Check, Eye } from "lucide-react";
import { toast } from "sonner";
import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, DirectionsRenderer, DirectionsService, Marker, Polyline } from '@react-google-maps/api';


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
import { getServiceRequests, acceptServiceRequest, ServiceRequest, User, completedServiceRequest, canceledServiceRequest, getDirection } from "./../services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import router from "../../../backend/routes/map.routes";


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

  const GOOGLE_MAPS_API_KEY = import.meta.env.GOOGLE_MAP_API

  const { user } = useAuth();
  const [mechanicLocation, setMechanicLocation] = useState<{ latitude: number; longitude: number }>({
  latitude: 0,
  longitude: 0,
});
  const [view, setView] = useState(false);
  const [directions, setDirections] = useState<{ lat: number; lng: number }[] | null>(null);
  const [time, setTime] = useState(null);
  const [distance, setDistance] = useState(null);
  const [destination, setDestination] = useState<{ latitude: number; longitude: number }>({
  latitude: 0,
  longitude: 0,
});
  const [map, setMap] = useState(null);
  const [polyline, setPolyline] = useState("");


  const placeholderPolyline = polyline;


  const decodedPath = window.google?.maps.geometry.encoding.decodePath(placeholderPolyline);

  const onLoad = (mapInstance) => {
    setMap(mapInstance);

    // Fit the map bounds to the polyline
    if (decodedPath) {
      const bounds = new window.google.maps.LatLngBounds();
      decodedPath.forEach((point) => bounds.extend(point));
      mapInstance.fitBounds(bounds);
    }
  };

  const nav = useNavigate();


  const queryClient = useQueryClient();
  const isMechanic = user?.userType === "mechanic";

  const handnewClick = () => {
    nav('/requestservice')
  }

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

  useEffect(() => {
    getMechanicLocation();
  }, []);


  const getMechanicLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            latitude: position.coords.latitude,

            longitude: position.coords.longitude,
          };
          setMechanicLocation(newLocation);

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


  const handleViewUser = async (requestId: string) => {
    // In a real app, this would open a modal or navigate to a user profile
    const requestAddress = await axios.get(`${import.meta.env.VITE_PROXY_URL}api/request-location/${requestId}`);
    // console.log("this is the request address : ", requestAddress.data.);
    setDestination(requestAddress.data.destination);
    console.log("this is the request origin : ", requestAddress.data.destination);

    const arr = requestAddress.data.destination?.split(',');

    const lat = arr ? parseFloat(arr[0]) : null;
    const lng = arr ? parseFloat(arr[1]) : null;



    if (lat != null && lng != null) {
      setDestination({
        latitude: lat,
        longitude: lng,
      });
    }

    setView(true);
    const routeData = await getDirection(requestId, `${mechanicLocation?.latitude},${mechanicLocation?.longitude}`.toString())
    const path = routeData.data.directions.steps.map((step: { lat: number; lng: number }) => ({
      lat: step.lat,
      lng: step.lng,
    }));

    // setDirections(path);
    setTime(routeData.data.directions.duration);
    setDistance(routeData.data.directions.distance);
    setPolyline(routeData.data.directions.polyline);



    console.log("this is the route data : ", routeData.data.directions);
    console.log("this is the direction: ", path);

    // console.log("this is the route data : ", routeData);
  };

  const closeModal = () => {
    setView(false);
  }

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

  const handleDirectionsRequest = (origin, destination) => {
    const l = `${origin.latitude},${origin.longitude}`.toString();
    console.log("this is the origin : ", l);
    console.log("this is the destination : ", destination);
    return {

      origin: l, // Convert to string
      destination: destination, // Convert to string
      travelMode: "DRIVING",
    };
  };

  const handleDirectionsCallback = (response: any) => {
    if (response !== null) {
      if (response.status === "OK") {
        setDirections(response);

      } else {
        console.error("Error fetching directions:", response);
      }
    }
    else {
      console.error("Error fetching directions: No response");
    }
  };

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
                                onClick={() => handleViewUser(request["_id"])}
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
                                onClick={() => handleViewUser(request["_id"])}
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

      </main>

      {view && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={closeModal}
            >
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-bold mb-4">Location</h2>
            {mechanicLocation ? (
              <div className="space-y-4">
                <p>
                  <strong>Distance :</strong> {distance}
                </p>
                <p>
                  <strong>Time :</strong> {time}
                </p>
                <div className="h-64 w-full">
                  {/* <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
                    <GoogleMap
                      center={{
                        lat: mechanicLocation.latitude,
                        lng: mechanicLocation.longitude,
                      }}
                      zoom={15}
                      mapContainerStyle={{ width: "100%", height: "100%" }}
                    >
                      <Marker
                        position={{
                          lat: mechanicLocation.latitude,
                          lng: mechanicLocation.longitude,
                        }}
                      />
                    </GoogleMap>
                  </LoadScript> */}


                  <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={['geometry']}>
                    <GoogleMap
                      mapContainerStyle={{ width: "100%", height: "100%" }}
                      center={{
                        lat: (mechanicLocation.latitude + destination.latitude) / 2,
                        lng: (mechanicLocation.longitude + destination.longitude) / 2,
                      }}
                      zoom={15}
                      onLoad={onLoad}
                    >
                      {/* {directions && (
                      <>
                        <DirectionsRenderer
                          directions={{
                            routes: [
                              {
                                legs: [{
                                  // start_location: center,
                                  end_location: { lat: 34.0522, lng: -118.2437 },
                                  steps: directions.map((step, index) => ({
                                    start_location: step,
                                    end_location: directions[index + 1] || step,
                                    travel_mode: 'DRIVING'
                                  }))
                                }]
                              }
                            ]
                          }}
                        />
                      </>
                    )} */}
                      {/* DirectionsRenderer used to display the directions on the map */}
                      {/* {directions && (
                        <DirectionsRenderer
                          directions={{
                            routes: [
                              {
                                legs: [{
                                  start_location: center,
                                  end_location: { lat: 34.0522, lng: -118.2437 },
                                  steps: directions.map((step, index) => ({
                                    start_location: step,
                                    end_location: directions[index + 1] || step,
                                    travel_mode: "DRIVING",  // Travel mode should be defined here
                                  })),
                                }]
                              }
                            ]
                          }}
                        />
                      )} */}

                      {/* Draw the polyline */}
                      {decodedPath && (
                        <Polyline
                          path={decodedPath}
                          options={{
                            strokeColor: "#FF0000",
                            strokeOpacity: 1.0,
                            strokeWeight: 2,
                          }}
                        />
                      )}


                      {/* Add markers for origin and destination */}
                      <Marker position={{
                        lat: mechanicLocation.latitude,
                        lng: mechanicLocation.longitude,
                      }} title="Origin" />
                      <Marker position={{
                        lat: destination.latitude,
                        lng: destination.longitude,
                      }} title="Destination" />

                    </GoogleMap>
                  </LoadScript>
                </div>
              </div>
            ) : (
              <p>Loading location...</p>
            )}
          </div>
        </div>
      )}



    </div>
  );
};

export default Requests;
// function useEffect(arg0: () => (() => void) | undefined, arg1: any[]) {
//   throw new Error("Function not implemented.");
// }

