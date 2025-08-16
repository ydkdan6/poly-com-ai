import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ChatInterface from '@/components/ChatInterface';
import { GraduationCap, LogOut, MessageCircle, Users, BookOpen, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      navigate('/auth');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <GraduationCap className="h-12 w-12 text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-subtle)' }}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10"></div>
      
      {/* Header */}
      <header className="glass-card shadow-elegant border-b-0 relative z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-primary/20 animate-glow"></div>
                <GraduationCap className="h-10 w-10 text-primary relative z-10" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Computer Science Department
                </h1>
                <p className="text-sm text-muted-foreground">Kaduna Polytechnic</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {user.email}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSignOut}
                className="glass-card btn-modern transition-smooth hover:shadow-elegant"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Quick Info Cards */}
          <div className="lg:col-span-1 space-y-6 animate-slide-up">
            <Card className="glass-card shadow-elegant transition-smooth hover:shadow-glow">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <MessageCircle className="h-5 w-5 text-primary" />
                  </div>
                  Quick Help
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Ask questions about:
                </p>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    Admission requirements
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    Course programs
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    School fees
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    Academic calendar
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    Department facilities
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    Career opportunities
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="glass-card shadow-elegant transition-smooth hover:shadow-glow">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  Department Info
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Get instant answers about Computer Science programs, facilities, and opportunities at Kaduna Polytechnic.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card shadow-elegant transition-smooth hover:shadow-glow">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  Programs Offered
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    National Diploma (ND)
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    Higher National Diploma (HND)
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3 animate-fade-in">
            <ChatInterface />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
