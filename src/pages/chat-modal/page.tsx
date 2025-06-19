import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getInitials } from "@/lib/utils";
import { ArrowLeft, MoreVertical, Check, CheckCheck } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
const selectedChat = {
  messages: [],
};
const ChatModal = () => {
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  
  
  
  
  const scrollToBottom = () => {
    if (!messagesEndRef || !messagesEndRef.current) {
      return;
    }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat?.messages]);


  const getStatusIcon = useCallback((status: string) => {
    switch (status) {
      case "sent":
        return <Check className="w-6 h-6 text-gray-400" />;
      case "delivered":
        return <CheckCheck className="w-6 h-6 text-gray-400" />;
      case "read":
        return <CheckCheck className="w-6 h-6 text-blue-400" />;
      default:
        return null;
    }
  }, []);

  return (
    <>
      {/* Chat Header */}
      <div className="flex items-center p-6 border-b border-gray-700/50 bg-gray-900/50 backdrop-blur-xl">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            navigate("/chat");
          }}
          className="lg:hidden mr-3 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-xl"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        {/* User Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
          {getInitials(selectedChat.name)}
        </div>

        <div className="ml-4 flex-1">
          <h2 className="font-semibold text-white text-lg">
            {selectedChat.name}
          </h2>
          <p className="text-sm text-gray-400">Click to view profile</p>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-xl"
        >
          <MoreVertical className="w-5 h-5" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-4">
          {selectedChat.messages.map((message: any) => (
            <div
              key={message.id}
              className={`flex ${
                message.sent ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-lg ${
                  message.sent
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-md"
                    : "bg-gray-800/80 text-gray-100 rounded-bl-md border border-gray-700/50"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
                <div
                  className={`flex items-center justify-end mt-2 space-x-1 ${
                    message.sent ? "text-gray-200" : "text-gray-400"
                  }`}
                >
                  <span className="text-xs">{message.timestamp}</span>
                  {message.sent && getStatusIcon(message.status)}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="p-6 border-t border-gray-700/50 bg-gray-900/50 backdrop-blur-xl">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="bg-gray-800/50 border-gray-600/50 text-white placeholder:text-gray-400 rounded-xl focus:border-blue-500/50 focus:ring-blue-500/20 h-12 text-sm"
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl w-12 h-12 p-0 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </>
  );
};

export default ChatModal;
