
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./contexts/AuthContext";
import { Phone, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import React from "react";

import Navbar from "./components/Navbar";
import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import { Badge } from "./components/ui/badge";
import { getServiceRequests, acceptServiceRequest, ServiceRequest, User } from "./services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Helper function to check if user is a User object (not a string)
const isUserObject = (user: User | string): user is User => {
  return typeof user !== 'string';
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    case "accepted":
      return <Badge variant="outline" className="bg-blue-100 text-blue-800">Accepted</Badge>;
    case "completed":
      return <Badge variant="outline" className="bg-green-100 text-green-800">Completed</Badge>;
    case "cancelled":
      return <Badge variant="outline" className="bg-red-100 text-red-800">Cancelled</Badge>;
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

const Requests = () => {
  const { user } = useAuth();
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
      toast.error("Failed to accept request. Please try again.");
    },
  });

  const handleAcceptRequest = (requestId: string) => {
    acceptMutation.mutate(requestId);
  };

  const handleContactUser = (user: User | string) => {
    // In a real app, this would open the phone dialer or show contact options
    if (isUserObject(user) && user.phoneNumber) {
      toast.info(`Contacting at ${user.phoneNumber}`);
    } else {
      toast.warning("Phone number not available");
    }
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
                            {isUserObject(request.user) ? request.user.name : 'User'}
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
                                onClick={() => handleAcceptRequest(request.id)}
                                disabled={acceptMutation.isPending}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Accept
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleContactUser(request.user)}
                              >
                                <Phone className="h-4 w-4 mr-1" />
                                Contact
                              </Button>
                            </div>
                          )}
                          {isMechanic && request.status === 'accepted' && (
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleContactUser(request.user)}
                              >
                                <Phone className="h-4 w-4 mr-1" />
                                Contact
                              </Button>
                            </div>
                          )}
                          {!isMechanic && request.status === 'pending' && (
                            <div className="flex items-center text-yellow-600">
                              <Clock className="h-4 w-4 mr-1" />
                              Waiting
                            </div>
                          )}
                          {!isMechanic && request.status === 'accepted' && (
                            <div className="flex space-x-2">
                              {request.assignedTo && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleContactUser(request.assignedTo)}
                                >
                                  <Phone className="h-4 w-4 mr-1" />
                                  Contact Mechanic
                                </Button>
                              )}
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
                  <Button className="mt-6" onClick={() => window.location.href = "/requestservice"}>
                    Request a Service
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Requests;
