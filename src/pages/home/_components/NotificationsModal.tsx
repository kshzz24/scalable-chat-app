import { useCallback, useEffect } from "react";
import { Bell, Users, UserPlus, Clock, Check, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDatePipe, getInitials } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptInvite, allMyInvites, rejectInvite } from "@/api/routes";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationsModal = ({ isOpen, onClose }: NotificationsModalProps) => {
  const queryClient = useQueryClient();

  const {
    data: activeInvities,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["get-all-invites"],
    queryFn: allMyInvites,
    enabled: isOpen,
  });

  const { mutate: acceptInvitation, isPending: isPendingAccept } = useMutation({
    mutationFn: acceptInvite,
    onSuccess: () => {
      toast.success("Invite Accepted Successfully");
      queryClient.invalidateQueries({
        queryKey: ["get-all-invites", "get-currentUserDetails"],
      });
      onClose();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || "Failed to accept invite");
    },
  });

  const { mutate: rejectInvitation, isPending: isPendingReject } = useMutation({
    mutationFn: rejectInvite,
    onSuccess: () => {
      toast.success("Invite Rejected Successfully"); //  Fixed success message
      queryClient.invalidateQueries({ queryKey: ["get-all-invites"] });
      onClose();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || "Failed to reject invite"); //  Fixed error message
    },
  });

  //  Fixed useCallback with proper dependencies
  const handleAcceptInvite = useCallback(
    (inviteId: string) => {
      acceptInvitation(inviteId);
    },
    [acceptInvitation]
  );

  //  Fixed useCallback with proper dependencies
  const handleRejectInvite = useCallback(
    (inviteId: string) => {
      rejectInvitation(inviteId);
    },
    [rejectInvitation]
  );

  //  Fixed useEffect with proper dependencies
  useEffect(() => {
    if (error && isOpen) {
      toast.error("Something went wrong while fetching invites", {
        id: "all-invites", //  Fixed toast id to match functionality
      });
    }
  }, [error, isOpen]); //  Added missing dependencies

  console.log(activeInvities, "activeInvities");

  return isLoading ? (
    <Skeleton />
  ) : (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-2xl max-h-[80vh] bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl text-white">
            <Bell className="w-5 h-5 text-blue-400" />
            Notifications
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-blue-600/20 text-blue-400 border-blue-500/30"
              >
                <UserPlus className="w-3 h-3 mr-1" />
                {activeInvities?.invites?.length || 0} pending
              </Badge>
              <Badge
                variant="secondary"
                className="bg-gray-600/20 text-gray-400 border-gray-500/30"
              >
                <Users className="w-3 h-3 mr-1" />
                {activeInvities?.invites?.length || 0} total
              </Badge>
            </div>
          </div>

          <Separator className="bg-gray-700" />

          {/* Invitations List */}
          <ScrollArea className="h-80">
            {activeInvities?.invites?.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No pending invitations</p>
                <p className="text-sm mt-1">You're all caught up!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeInvities?.invites?.map((invitation: any) => (
                  <div
                    key={invitation._id}
                    className="flex items-center gap-3 p-4 rounded-lg border bg-gray-800/50 border-gray-700/50 hover:bg-gray-800 hover:border-gray-600 transition-all duration-200"
                  >
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm font-medium">
                        {getInitials(invitation?.sender?.username)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-white truncate">
                          {invitation?.sender?.username}
                        </p>
                      </div>
                      <p className="text-sm text-gray-400 truncate mb-1">
                        {invitation?.sender?.email}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {formatDatePipe(invitation?.createdAt)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        disabled={isPendingAccept}
                        onClick={() => handleAcceptInvite(invitation._id)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Check className="w-4 h-4" />
                      </Button>

                      <Button
                        size="sm"
                        disabled={isPendingReject}
                        onClick={() => handleRejectInvite(invitation._id)}
                        variant="outline"
                        className="border-red-500/30 text-red-400 hover:bg-red-600/10 hover:border-red-500/50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        <DialogFooter className="flex justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-gray-800 border-gray-600 text-gray-200 hover:bg-gray-700"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationsModal;
