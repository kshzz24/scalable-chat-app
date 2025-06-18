import { useCallback, useEffect, useMemo, useState } from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { createChat } from "@/api/routes"; // your API call
import { useAuthStore, useContactsStore } from "@/store";
import { getContactDetails } from "@/api/routes";

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewChatModal = ({ isOpen, onClose }: NewChatModalProps) => {
  const user = useAuthStore((state) => state.user);
  const setContacts = useContactsStore((state) => state.setContacts);

  const [isGroup, setIsGroup] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [groupName, setGroupName] = useState("");

  const queryClient = useQueryClient();

  const { data: contactDetails, isLoading } = useQuery({
    queryKey: ["get-contact-details"],
    queryFn: getContactDetails,
    enabled: isOpen,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  useEffect(() => {
    if (isLoading) {
      return;
    }

    setContacts(contactDetails);
  }, [isLoading, contactDetails]);

  const handleUserToggle = useCallback(
    (userId: string) => {
      if (isGroup) {
        setSelectedUsers((prev) =>
          prev.includes(userId)
            ? prev.filter((id) => id !== userId)
            : [...prev, userId]
        );
      } else {
        setSelectedUsers([userId]); // only one user allowed for individual chat
      }
    },
    [isGroup]
  );

  //   const { mutate: createNewChat, isPending } = useMutation({
  //     mutationFn: createChat,
  //     onSuccess: () => {
  //       toast.success("Chat created!");
  //       onClose();
  //       queryClient.invalidateQueries({ queryKey: ["chats"] });
  //     },
  //     onError: () => toast.error("Failed to create chat"),
  //   });

  const handleCreateChat = useCallback(() => {
    if (selectedUsers.length === 0) {
      return toast.error("Please select at least one user");
    }

    if (isGroup && selectedUsers.length < 2) {
      return toast.error("Select at least 2 users for a group chat");
    }

    // createNewChat({
    //   isGroup,
    //   recipients: selectedUsers,
    //   name: isGroup ? groupName : undefined,
    // });
  }, [isGroup, selectedUsers, groupName]);

  const allContacts = useMemo(() => {
    if (isLoading) return [];
    return contactDetails || [];
  }, []);
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Create New Chat</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Chat Type */}
          <div className="flex items-center gap-4 text-white">
            <label>
              <input
                type="radio"
                checked={!isGroup}
                onChange={() => {
                  setIsGroup(false);
                  setSelectedUsers([]);
                }}
              />{" "}
              Individual
            </label>
            <label>
              <input
                type="radio"
                checked={isGroup}
                onChange={() => {
                  setIsGroup(true);
                  setSelectedUsers([]);
                }}
              />{" "}
              Group
            </label>
          </div>

          {isGroup && (
            <Input
              placeholder="Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="text-white"
            />
          )}

          <Separator className="bg-gray-700" />

          {/* Contacts */}
          <ScrollArea className="h-60">
            <div className="space-y-2 text-white">
              {allContacts.map((contact: any) => (
                <div
                  key={contact._id}
                  className="flex items-center justify-between bg-gray-800 p-3 rounded-md"
                >
                  <div>
                    <p className="font-medium">{contact.username}</p>
                    <p className="text-sm text-gray-400">{contact.email}</p>
                  </div>
                  <Checkbox
                    checked={selectedUsers.includes(contact._id)}
                    onCheckedChange={() => handleUserToggle(contact._id)}
                  />
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button
            onClick={handleCreateChat}
            // disabled={isPending}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewChatModal;
