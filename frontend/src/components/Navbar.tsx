
import { LogOut, PenLine, Eye, UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./../components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "./../contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./../components/ui/dropdown-menu";
import React from "react";

import { Link } from 'react-router-dom';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  const handleViewRequest = () => {
    navigate("/requests");
  };
  const handleMyRequest = () => {
    navigate("/myrequests");
  };

  const handleEditProfile = () => {
    navigate("/profile");
  };
  const isMechanic = user?.userType === "mechanic";

  return (
    <nav className="w-full py-4 px-6 border-b bg-white">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
      <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              Fuel<span className="text-gray-800 dark:text-white">Fix</span>
            </span>
          </Link>
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-3 outline-none">
              <span className="text-gray-600">{user?.name || "User"}</span>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>
                  <UserRound className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="cursor-pointer" onClick={handleViewRequest}>
                <Eye className="mr-2 h-4 w-4" />
                <span>View Request</span>
              </DropdownMenuItem>
              {isMechanic && (
                <DropdownMenuItem className="cursor-pointer" onClick={handleMyRequest}>
                <Eye className="mr-2 h-4 w-4" />
                <span>My Request</span>
              </DropdownMenuItem>
              )}
              <DropdownMenuItem className="cursor-pointer" onClick={handleEditProfile}>
                <PenLine className="mr-2 h-4 w-4" />
                <span>Edit Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-red-600" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex gap-4">
            <button 
              onClick={() => navigate("/login")} 
              className="px-4 py-2 rounded-md text-purple-600 hover:bg-purple-50 transition-colors"
            >
              Login
            </button>
            <button 
              onClick={() => navigate("/signup")} 
              className="px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition-colors"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
