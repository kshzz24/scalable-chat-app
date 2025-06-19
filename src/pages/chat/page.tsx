import { MessageCircle, MoreVertical, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCallback, useMemo, useState } from "react";
import CreateNewChatModal from "./_components/CreateNewChatModal";
import { useQuery } from "@tanstack/react-query";
import { getAllChats } from "@/api/routes";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useAuthStore, useContactsStore } from "@/store";
import { getInitials } from "@/lib/utils";

const ChatPage = () => {
  const user = useAuthStore((state) => state.user);

  console.log(user, "chatuser");
  const getContactById = useContactsStore((state) => state.getContactById);

  const { data: allChats, isLoading } = useQuery({
    queryKey: ["get-all-chats"],
    queryFn: getAllChats,
  });

  console.log(allChats, "allChats");

  const navigate = useNavigate();
  const [isCreateChatOpen, setIsCreateChatOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleCreateChat = useCallback(() => {
    setIsCreateChatOpen(true);
  }, [setIsCreateChatOpen]);

  const handleCloseCreateChat = useCallback(() => {
    setIsCreateChatOpen(false);
  }, [setIsCreateChatOpen]);

  const chats = useMemo(() => {
    if (isLoading) return [];

    return (
      allChats
        ?.filter((item: any) => !item.isGroup)
        .map((item: any) => {
          const recipientId = item.recipients?.filter(
            (id: string) => id !== user?._id
          );
          const recipientDetails = recipientId?.map((item: string) =>
            getContactById(item)
          );

          let unreadMessages = 0;
          if (Object.keys(item.unreadCounts).length == 0) {
            unreadMessages = 0;
          } else {
            unreadMessages = item.unreadCounts[`${recipientId}`];
          }

          return {
            ...item,
            recipients: recipientDetails,
            unreadCounts: unreadMessages ?? 0,
          };
        }) ?? []
    );
  }, [isLoading, allChats, getContactById]);

  const filteredChats = useMemo(() => {
    if (searchTerm.length === 0 || isLoading || !searchTerm) return chats;

    return chats?.filter((chat: any) => {
      return chat?.recipients[0]?.username?.includes(searchTerm);
    });
  }, [chats, isLoading, searchTerm]);

  return (
    <>
      {isLoading ? (
        <Skeleton />
      ) : allChats?.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
          <div className="text-center max-w-md">
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full flex items-center justify-center border border-blue-500/30">
              <MessageCircle className="w-16 h-16 text-blue-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">No Chats Yet</h2>
            <p className="text-gray-400 mb-8 text-lg">
              Start a conversation by creating your first chat!
            </p>
            <Button
              onClick={handleCreateChat}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-medium shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Chat
            </Button>
          </div>
        </div>
      ) : (
        <div className="h-full w-full flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          {/* Chat List Sidebar */}
          <div
            className={`flex flex-col w-full  border-r border-gray-700/50 bg-gray-900/70 backdrop-blur-xl`}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-700/50">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-white">Chats</h1>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-xl"
                >
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search chats..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 bg-gray-800/50 border-gray-600/50 text-white placeholder:text-gray-400 rounded-xl focus:border-blue-500/50 focus:ring-blue-500/20 h-12"
                />
              </div>
            </div>

            {/* Chat List */}
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-2">
                {filteredChats.map((chat: any) => (
                  <div
                    key={chat.id}
                    onClick={() => {
                      navigate(`/chat/${chat._id}`);
                    }}
                    className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-300 group "hover:bg-gray-800/50 hover:shadow-lg hover:shadow-gray-700/20`}
                  >
                    {/* User Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      {getInitials(chat?.name ?? chat.recipients[0]?.username)}
                    </div>
                    <div className="ml-4 flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-white truncate text-sm">
                          {chat?.name ?? chat.recipients[0]?.username}
                        </h3>
                        <span className="text-xs text-gray-400">
                          {chat.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 truncate">
                        {chat?.name ??
                          chat.recipients[0]?.lastMessage ??
                          "No Last Message"}
                      </p>
                    </div>

                    {chat.unreadCount > 0 && (
                      <div className="ml-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg">
                        {chat.unreadCount}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}
      {isCreateChatOpen && (
        <CreateNewChatModal
          isOpen={isCreateChatOpen}
          onClose={handleCloseCreateChat}
        />
      )}
    </>
  );
};

export default ChatPage;
