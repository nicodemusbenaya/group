import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useRoom } from '../contexts/RoomContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { ScrollArea } from '../components/ui/scroll-area';
import { ROLES } from '../mock/mockData';
import { Crown, Send, LogOut, Users } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const Room = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { activeRoom, messages, sendMessage, endSession, leaveRoom } = useRoom();
  const { toast } = useToast();
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!activeRoom) {
      navigate('/dashboard');
    }
  }, [activeRoom, navigate]);

  if (!activeRoom) return null;

  const isLeader = activeRoom.leaderId === user?.id;
  const leader = activeRoom.members.find(m => m.id === activeRoom.leaderId);

  const getRoleColor = (role) => {
    return ROLES.find(r => r.value === role)?.color || 'bg-slate-500';
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim()) {
      sendMessage(messageInput);
      setMessageInput('');
    }
  };

  const handleEndSession = () => {
    endSession();
    toast({ title: 'Sesi selesai', description: 'Tim telah dibubarkan.' });
    navigate('/dashboard');
  };

  const handleLeaveRoom = () => {
    leaveRoom();
    toast({ title: 'Keluar dari room', description: 'Anda telah keluar dari tim.' });
    navigate('/dashboard');
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Tim #{activeRoom.id.slice(-8)}</h1>
              <p className="text-sm text-slate-600 mt-1">
                Leader: {leader?.name} {isLeader && '(Anda)'}
              </p>
            </div>
            <div className="flex gap-2">
              {isLeader ? (
                <Button variant="destructive" onClick={handleEndSession}>
                  Akhiri Sesi
                </Button>
              ) : (
                <Button variant="outline" onClick={handleLeaveRoom}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Keluar
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full">
          {/* Members Sidebar */}
          <div className="lg:w-80 bg-white border-r p-4 overflow-y-auto">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-slate-600" />
              <h2 className="text-lg font-semibold">Anggota Tim</h2>
              <Badge variant="secondary" className="ml-auto">
                {activeRoom.members.length}
              </Badge>
            </div>
            <div className="space-y-3">
              {activeRoom.members.map((member) => (
                <Card key={member.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name?.charAt(0) || 'U'}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-sm truncate">{member.name}</h3>
                          {member.id === activeRoom.leaderId && (
                            <Crown className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mb-2">@{member.username}</p>
                        <Badge className={`${getRoleColor(member.role)} text-white text-xs`}>
                          {member.role}
                        </Badge>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {member.skills?.slice(0, 3).map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-white">
            <div className="border-b px-6 py-4">
              <h2 className="text-lg font-semibold">Chat Tim</h2>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4">
                {messages.map((message) => {
                  const isCurrentUser = message.userId === user?.id;
                  const isSystem = message.type === 'system';
                  const sender = activeRoom.members.find(m => m.id === message.userId);

                  if (isSystem) {
                    return (
                      <div key={message.id} className="flex justify-center">
                        <Badge variant="secondary" className="text-xs">
                          {message.text}
                        </Badge>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${isCurrentUser ? 'flex-row-reverse' : ''}`}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={sender?.avatar} />
                        <AvatarFallback>{sender?.name?.charAt(0) || 'U'}</AvatarFallback>
                      </Avatar>
                      <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-slate-700">
                            {isCurrentUser ? 'Anda' : sender?.name}
                          </span>
                          <span className="text-xs text-slate-400">
                            {new Date(message.timestamp).toLocaleTimeString('id-ID', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <div
                          className={`px-4 py-2 rounded-lg max-w-md ${
                            isCurrentUser
                              ? 'bg-blue-500 text-white'
                              : 'bg-slate-100 text-slate-900'
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="border-t p-4">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Ketik pesan..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={!messageInput.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Room;
