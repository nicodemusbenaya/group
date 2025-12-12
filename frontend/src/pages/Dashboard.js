import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useRoom } from '../contexts/RoomContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { ROLES } from '../mock/mockData';
import { User, Briefcase, Tag, Users, LogOut, Loader2 } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-slate-900">Group Matchmaking</h1>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Keluar
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Profil Anda</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{user?.name}</h3>
                    <p className="text-sm text-slate-600">@{user?.username}</p>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t">
                  <div className="flex items-start gap-3">
                    <Briefcase className="h-5 w-5 text-slate-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-slate-600 mb-1">Role</p>
                      <Badge className={`${getRoleColor(user?.role)} text-white`}>
                        {user?.role}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Tag className="h-5 w-5 text-slate-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-slate-600 mb-2">Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {user?.skills?.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Matchmaking Section */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Cari Tim Proyek</CardTitle>
                <CardDescription>
                  Temukan anggota tim dengan role yang saling melengkapi
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {matchmakingStatus === 'idle' && (
                  <div className="text-center py-8">
                    <Users className="h-16 w-16 mx-auto text-slate-400 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Siap mencari tim?</h3>
                    <p className="text-slate-600 mb-6">
                      Klik tombol di bawah untuk memulai matchmaking
                    </p>
                    <Button size="lg" onClick={handleStartMatchmaking}>
                      Mulai Matchmaking
                    </Button>
                  </div>
                )}

                {matchmakingStatus === 'searching' && (
                  <div className="text-center py-8">
                    <Loader2 className="h-16 w-16 mx-auto text-blue-500 mb-4 animate-spin" />
                    <h3 className="text-xl font-semibold mb-2">Mencari tim...</h3>
                    <p className="text-slate-600">
                      Sedang mencocokkan Anda dengan anggota tim lain
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Room History */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Riwayat Tim</CardTitle>
                <CardDescription>
                  Daftar tim yang pernah Anda ikuti
                </CardDescription>
              </CardHeader>
              <CardContent>
                {roomHistory.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <Users className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                    <p>Belum ada riwayat tim</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {roomHistory.map((room) => (
                      <Card key={room.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold">Tim #{room.id.slice(-8)}</h4>
                              <p className="text-xs text-slate-500">
                                {new Date(room.createdAt).toLocaleString('id-ID')}
                              </p>
                            </div>
                            <Badge variant="secondary">{room.members.length} Anggota</Badge>
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
