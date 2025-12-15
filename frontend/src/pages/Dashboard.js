import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useRoom } from '../contexts/RoomContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { ROLES } from '../mock/mockData';
import { User, Briefcase, Tag, Users, LogOut, Loader2, Zap, MapPin, Settings, UserCircle } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { startMatchmaking, matchmakingStatus, roomHistory, activeRoom } = useRoom();

  const getRoleColor = (role) => {
    return ROLES.find(r => r.value === role)?.color || 'bg-slate-500';
  };

  const handleStartMatchmaking = () => {
    startMatchmaking();
  };

  React.useEffect(() => {
    if (matchmakingStatus === 'matched' && activeRoom) {
      navigate('/room');
    }
  }, [matchmakingStatus, activeRoom, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-cyan-600">TeamSync</h1>
            <Button variant="ghost" onClick={handleLogout} className="text-slate-600 hover:text-cyan-600">
              <LogOut className="h-4 w-4 mr-2" />
              Keluar
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-3">
            Find Your Perfect Team
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Temukan anggota tim dengan role yang saling melengkapi untuk proyek Anda
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="bg-white rounded-2xl shadow-sm border border-slate-100">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-slate-900">Profil Anda</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-20 w-20 mb-3">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="bg-cyan-100 text-cyan-600 text-xl font-semibold">
                      {user?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-lg text-slate-900">{user?.name}</h3>
                  <p className="text-sm text-slate-500 mb-3">@{user?.username}</p>
                  <Badge className="bg-cyan-500 text-white rounded-full px-3 py-1">
                    {user?.role}
                  </Badge>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div>
                    <p className="text-xs text-slate-500 mb-2 flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Skills
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {user?.skills?.map((skill, index) => (
                        <Badge key={index} className="bg-slate-100 text-slate-600 rounded-full px-3 py-1 text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Matchmaking Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Auto Matchmaking Card */}
              <Card className="bg-white rounded-2xl shadow-sm border-2 border-cyan-100 hover:shadow-cyan-100/50 transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-5 w-5 text-cyan-600" />
                    <CardTitle className="text-slate-900">Auto Matchmaking</CardTitle>
                  </div>
                  <CardDescription className="text-slate-500">
                    Sistem otomatis mencari tim dengan role yang seimbang
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {matchmakingStatus === 'idle' && (
                    <Button 
                      size="lg" 
                      className="w-full bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg shadow-sm font-medium"
                      onClick={handleStartMatchmaking}
                    >
                      Start Matching
                    </Button>
                  )}
                  {matchmakingStatus === 'searching' && (
                    <div className="text-center py-4">
                      <Loader2 className="h-10 w-10 mx-auto text-cyan-500 mb-3 animate-spin" />
                      <p className="text-sm text-slate-600">Mencari tim...</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Local Matchmaking Card */}
              <Card className="bg-white rounded-2xl shadow-sm border border-slate-100">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-5 w-5 text-slate-600" />
                    <CardTitle className="text-slate-900">Local Matchmaking</CardTitle>
                  </div>
                  <CardDescription className="text-slate-500">
                    Bergabung dengan room menggunakan kode
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    size="lg" 
                    className="w-full border-2 border-slate-200 text-slate-600 hover:border-cyan-500 hover:text-cyan-600 bg-transparent rounded-lg font-medium"
                    onClick={() => {}}
                  >
                    Join Room
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Room History */}
            <Card className="bg-white rounded-2xl shadow-sm border border-slate-100">
              <CardHeader>
                <CardTitle className="text-slate-900">Riwayat Tim</CardTitle>
                <CardDescription className="text-slate-500">
                  Daftar tim yang pernah Anda ikuti
                </CardDescription>
              </CardHeader>
              <CardContent>
                {roomHistory.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <Users className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                    <p className="text-sm">Belum ada riwayat tim</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {roomHistory.map((room) => (
                      <Card key={room.id} className="hover:shadow-md transition-shadow border border-slate-100">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold text-slate-900">Tim #{room.id.slice(-8)}</h4>
                              <p className="text-xs text-slate-500">
                                {new Date(room.createdAt).toLocaleString('id-ID')}
                              </p>
                            </div>
                            <Badge className="bg-slate-100 text-slate-600">{room.members.length} Anggota</Badge>
                          </div>
                          <div className="flex -space-x-2">
                            {room.members.map((member) => (
                              <Avatar key={member.id} className="h-8 w-8 border-2 border-white">
                                <AvatarImage src={member.avatar} />
                                <AvatarFallback>{member.name?.charAt(0)}</AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;