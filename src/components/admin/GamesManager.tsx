
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Plus, Upload, Eye, Settings, Play, Pause, Edit, Trash2 } from 'lucide-react';

interface Game {
  id: string;
  name: string;
  category: string;
  age_range: string;
  status: string;
  analytics_data: {
    sessions: number;
    rating: number;
    completion_rate: number;
  };
  created_at: string;
  description?: string;
}

export function GamesManager() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [gameForm, setGameForm] = useState({
    name: '',
    category: '',
    ageRange: '',
    description: '',
    status: 'draft'
  });
  const { toast } = useToast();
  const { user } = useAdminAuth();

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedGames: Game[] = (data || []).map(game => ({
        id: game.id,
        name: game.name,
        category: game.category,
        age_range: game.age_range,
        status: game.status || 'draft',
        created_at: game.created_at,
        description: game.description || undefined,
        analytics_data: (() => {
          if (game.analytics_data && typeof game.analytics_data === 'object' && game.analytics_data !== null) {
            const data = game.analytics_data as any;
            return {
              sessions: data.sessions || 0,
              rating: data.rating || 0,
              completion_rate: data.completion_rate || 0
            };
          }
          return { sessions: 0, rating: 0, completion_rate: 0 };
        })()
      }));

      setGames(transformedGames);
    } catch (error) {
      console.error('Error fetching games:', error);
      toast({
        title: "Error",
        description: "Failed to fetch games",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createGame = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create games.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('games')
        .insert([{
          name: gameForm.name,
          category: gameForm.category,
          age_range: gameForm.ageRange,
          description: gameForm.description,
          status: gameForm.status,
          created_by: user.id,
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Game created successfully",
      });

      setIsCreateModalOpen(false);
      setGameForm({ name: '', category: '', ageRange: '', description: '', status: 'draft' });
      fetchGames();
    } catch (error) {
      console.error('Error creating game:', error);
      toast({
        title: "Error",
        description: "Failed to create game",
        variant: "destructive",
      });
    }
  };

  const toggleGameStatus = async (gameId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'live' ? 'draft' : 'live';
    
    try {
      const { error } = await supabase
        .from('games')
        .update({ status: newStatus })
        .eq('id', gameId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Game ${newStatus === 'live' ? 'published' : 'unpublished'}`,
      });

      fetchGames();
    } catch (error) {
      console.error('Error updating game status:', error);
      toast({
        title: "Error",
        description: "Failed to update game status",
        variant: "destructive",
      });
    }
  };

  const deleteGame = async (gameId: string) => {
    if (!confirm('Are you sure you want to delete this game?')) return;

    try {
      const { error } = await supabase
        .from('games')
        .delete()
        .eq('id', gameId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Game deleted successfully",
      });

      fetchGames();
    } catch (error) {
      console.error('Error deleting game:', error);
      toast({
        title: "Error",
        description: "Failed to delete game",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live':
        return <Badge className="bg-green-100 text-green-800">Live</Badge>;
      case 'draft':
        return <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>;
      case 'maintenance':
        return <Badge className="bg-red-100 text-red-800">Maintenance</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Games & Activities Manager</h1>
          <p className="text-gray-600 mt-2">Manage educational games and learning content</p>
        </div>
        <div className="flex space-x-3">
          <Button className="flex items-center space-x-2">
            <Upload className="w-4 h-4" />
            <span>Upload Content</span>
          </Button>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add Game</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Game</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Game name"
                  value={gameForm.name}
                  onChange={(e) => setGameForm(prev => ({ ...prev, name: e.target.value }))}
                />
                <Input
                  placeholder="Category (e.g., Literacy, Math, Creativity)"
                  value={gameForm.category}
                  onChange={(e) => setGameForm(prev => ({ ...prev, category: e.target.value }))}
                />
                <Input
                  placeholder="Age range (e.g., 3-6)"
                  value={gameForm.ageRange}
                  onChange={(e) => setGameForm(prev => ({ ...prev, ageRange: e.target.value }))}
                />
                <Input
                  placeholder="Description"
                  value={gameForm.description}
                  onChange={(e) => setGameForm(prev => ({ ...prev, description: e.target.value }))}
                />
                <Button onClick={createGame} className="w-full">
                  Create Game
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <Card key={game.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{game.name}</CardTitle>
                  <CardDescription>{game.category} • Ages {game.age_range}</CardDescription>
                </div>
                {getStatusBadge(game.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sessions:</span>
                  <span className="font-medium">{game.analytics_data.sessions}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Rating:</span>
                  <span className="font-medium">
                    {game.analytics_data.rating > 0 ? `${game.analytics_data.rating}/5` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Completion Rate:</span>
                  <span className="font-medium">
                    {game.analytics_data.completion_rate > 0 ? `${game.analytics_data.completion_rate}%` : 'N/A'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Active:</span>
                    <Switch 
                      checked={game.status === 'live'} 
                      onCheckedChange={() => toggleGameStatus(game.id, game.status)}
                    />
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => deleteGame(game.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {games.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No games yet</h3>
            <p className="text-gray-600 mb-4">Create your first educational game to get started.</p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Game
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Age Level Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Age Level Configuration</CardTitle>
          <CardDescription>Configure which games are available for different age groups</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['2-4 years', '4-6 years', '6-8 years'].map((ageGroup) => (
              <div key={ageGroup} className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">{ageGroup}</h4>
                <div className="space-y-2">
                  {games.filter(game => game.status === 'live').map((game) => (
                    <div key={game.id} className="flex items-center justify-between">
                      <span className="text-sm">{game.name}</span>
                      <Switch />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
