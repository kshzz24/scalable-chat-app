import { MessageCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCallback, useState } from "react";
import CreateNewChatModal from "./_components/CreateNewChatModal";

const ChatPage = () => {
  const [chats, setChats] = useState([]);
  const [isCreateChatOpen, setIsCreateChatOpen] = useState(false);

  const handleCreateChat = useCallback(() => {
    setIsCreateChatOpen(true);
  }, [setIsCreateChatOpen]);

  const handleCloseCreateChat = useCallback(() => {
    setIsCreateChatOpen(false);
    // setIsGroupChat(false);
    // setSelectedContacts([]);
    // setContactSearchTerm("");
    // setGroupName("");
  }, [setIsCreateChatOpen]);

  return (
    <>
      {chats?.length === 0 ? (
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
      ) : null}
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
