import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Search, Users, UserCheck, Loader2, Mail } from "lucide-react";
import { allUserType, User } from "@/types/form";
import { getInitials } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllUsers, sendInvites } from "@/api/routes";
import { toast } from "sonner";
import { SendInviteComponentSkeleton } from "@/components/Skeletons";

interface SendInviteProps {
  isOpen: boolean;
  onClose: () => void;
}

const SendInviteComponent = ({ isOpen, onClose }: SendInviteProps) => {
  const [filteredUsers, setFilteredUsers] = useState<allUserType[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["get-all-users"],
    queryFn: getAllUsers,
    enabled: isOpen,
    staleTime: 1000 * 60 * 60, // 5 minutes cache
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Initialize filteredUsers when users data is loaded
  useEffect(() => {
    if (users) {
      setFilteredUsers(users);
    }
  }, [users]);

  // Fixed handleSelectAll with proper dependencies
  const handleSelectAll = useCallback(() => {
    if (!filteredUsers) return;

    const allFilteredSelected = filteredUsers.every((user) =>
      selectedUsers.includes(user._id)
    );

    if (allFilteredSelected) {
      // Deselect all filtered users
      setSelectedUsers((prev) =>
        prev.filter((id) => !filteredUsers.some((user) => user._id === id))
      );
    } else {
      // Select all filtered users (merge with existing selections)
      setSelectedUsers((prev) => {
        const newSelections = filteredUsers.map((user) => user._id);
        return [...new Set([...prev, ...newSelections])];
      });
    }
  }, [filteredUsers, selectedUsers]); //  Added proper dependencies

  const handleUserSelect = useCallback((_id: string) => {
    setSelectedUsers((prev) =>
      prev.includes(_id) ? prev.filter((id) => id !== _id) : [...prev, _id]
    );
  }, []); //  No dependencies needed since we use functional state update

  const { mutate: sendInvitesMutation, isPending: isSending } = useMutation({
    mutationFn: sendInvites,
    onSuccess: () => {
      toast.success("Invite(s) sent successfully");
      queryClient.invalidateQueries({ queryKey: ["get-all-users"] });
      setSelectedUsers([]);
      setSearchQuery("");
      onClose();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || "Failed to send invites");
    },
  });

  // Fixed handleSendInvites with proper dependencies
  const handleSendInvites = useCallback(() => {
    sendInvitesMutation(selectedUsers);
  }, [selectedUsers, sendInvitesMutation]); //  Added proper dependencies

  // Fixed handleClose with proper dependencies
  const handleClose = useCallback(() => {
    setSelectedUsers([]);
    setSearchQuery("");
    onClose();
  }, [onClose]); //  Added onClose dependency

  // Fixed search effect - removed setFilteredUsers from dependency array
  useEffect(() => {
    if (!users) return;

    console.log(users, "users");
    const filteredUsingSearch = users?.filter(
      (user: User) =>
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filteredUsingSearch);
  }, [searchQuery, users]);

  useEffect(() => {
    if (error && isOpen) {
      toast.error("Something went wrong while fetching users", {
        id: "all-users",
      });
    }
  }, [error, isOpen]);

  // Calculate if all filtered users are selected
  const allFilteredSelected =
    filteredUsers?.length > 0 &&
    filteredUsers.every((user) => selectedUsers.includes(user._id));

  return isLoading ? (
    <SendInviteComponentSkeleton />
  ) : (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        }
      }}
    >
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto overflow-x-hidden bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl text-white">
            <Mail className="w-5 h-5 text-blue-400" />
            Send Invitations
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500"
            />
          </div>

          {/* Select All / Stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Checkbox
                id="select-all"
                checked={allFilteredSelected}
                onCheckedChange={handleSelectAll}
                disabled={isLoading || !filteredUsers?.length}
              />
              <label
                htmlFor="select-all"
                className="text-sm font-medium text-gray-300 cursor-pointer"
              >
                Select All {searchQuery && "(Filtered)"}
              </label>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-blue-600/20 text-blue-400 border-blue-500/30"
              >
                <Users className="w-3 h-3 mr-1" />
                {filteredUsers?.length || 0} users
              </Badge>
              {selectedUsers.length > 0 && (
                <Badge
                  variant="secondary"
                  className="bg-green-600/20 text-green-400 border-green-500/30"
                >
                  <UserCheck className="w-3 h-3 mr-1" />
                  {selectedUsers.length} selected
                </Badge>
              )}
            </div>
          </div>

          <Separator className="bg-gray-700" />

          {/* Users List */}
          <ScrollArea className="h-80">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
                <span className="ml-2 text-gray-400">Loading users...</span>
              </div>
            ) : filteredUsers?.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No users found</p>
                {searchQuery && (
                  <p className="text-sm mt-1">
                    Try adjusting your search terms
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredUsers?.map((user) => {
                  const isSelected = selectedUsers.includes(user._id);
                  return (
                    <div
                      key={user._id}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "bg-blue-600/10 border-blue-500/30 shadow-sm"
                          : "bg-gray-800/50 border-gray-700/50 hover:bg-gray-800 hover:border-gray-600"
                      }`}
                      onClick={() => handleUserSelect(user._id)}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleUserSelect(user._id)}
                        onClick={(e) => e.stopPropagation()}
                      />

                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm font-medium">
                          {getInitials(user.username)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-white truncate">
                            {user.username}
                          </p>
                          <div
                            className={`w-2 h-2 rounded-full ${
                              user.status === "online"
                                ? "bg-green-500"
                                : "bg-gray-500"
                            }`}
                          />
                        </div>
                        <p className="text-sm text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>

                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          user.status === "online"
                            ? "border-green-500/30 text-green-400"
                            : "border-gray-500/30 text-gray-400"
                        }`}
                      >
                        {user.status}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </div>

        <DialogFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSending}
            className="bg-gray-800 border-gray-600 text-gray-200 hover:bg-gray-700"
          >
            Cancel
          </Button>

          <Button
            onClick={handleSendInvites}
            disabled={selectedUsers.length === 0 || isSending}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            {isSending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Invites ({selectedUsers.length})
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SendInviteComponent;
