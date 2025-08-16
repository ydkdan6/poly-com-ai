import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Loader2, GraduationCap, Sparkles, Shield } from 'lucide-react';

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate(); 

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Welcome back!',
          description: 'You have successfully signed in.',
        });
        navigate('/'); 
        console.log('Navigation to home page would happen here');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signUp(email, password, fullName);
      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Account created!',
          description: 'Please check your email to verify your account.',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 lg:p-8">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-emerald-800 to-green-900">
        <div className="absolute inset-0 bg-gradient-to-t from-green-900/50 to-transparent"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-20 h-20 bg-green-400/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-60 right-32 w-16 h-16 bg-emerald-300/30 rounded-full blur-lg animate-pulse delay-1000"></div>
      <div className="absolute bottom-40 left-40 w-24 h-24 bg-green-500/10 rounded-full blur-2xl animate-pulse delay-2000"></div>
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-emerald-400/10 rounded-full blur-xl animate-pulse delay-500"></div>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '50px 50px',
        }}
      ></div>

      <Card className="w-full max-w-6xl relative z-10 bg-white/10 backdrop-blur-xl border-green-200/20 shadow-2xl shadow-green-900/20 overflow-hidden">
        {/* Top Accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-emerald-500 to-green-400"></div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 min-h-[600px]">
          {/* Left Side - Form */}
          <div className="p-8 lg:p-12 flex flex-col justify-center relative">
            {/* Sparkle Effects */}
            <div className="absolute top-4 right-4 text-green-300/50 lg:hidden">
              <Sparkles className="h-4 w-4 animate-pulse" />
            </div>
            <div className="absolute top-20 left-6 text-emerald-300/30 lg:hidden">
              <Sparkles className="h-3 w-3 animate-pulse delay-1000" />
            </div>

            <CardHeader className="text-center pb-8 pt-0">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  {/* Glowing Ring */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 opacity-20 animate-pulse scale-110"></div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 opacity-30 animate-ping"></div>

                  {/* Icon Background */}
                  <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-full shadow-xl shadow-green-900/30">
                    <GraduationCap className="h-8 w-8 text-white relative z-10" />
                  </div>
                </div>
              </div>

              <CardTitle className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-green-100 to-emerald-100 bg-clip-text text-transparent mb-2">
                Computer Science Department
              </CardTitle>
              <CardDescription className="text-green-200/80 text-sm lg:text-base">
                Kaduna Polytechnic - Student Portal
              </CardDescription>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 mt-4 text-green-300/70 text-sm">
                <Shield className="h-4 w-4" />
                <span>Secure Access</span>
              </div>
            </CardHeader>

            <CardContent className="px-0 pb-0">
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-green-800/30 backdrop-blur-sm border-green-600/30 p-1 mx-8">
                  <TabsTrigger
                    value="signin"
                    className="text-green-200 data-[state=active]:bg-green-500/20 data-[state=active]:text-white transition-all duration-300 data-[state=active]:shadow-lg data-[state=active]:shadow-green-500/20"
                  >
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger
                    value="signup"
                    className="text-green-200 data-[state=active]:bg-green-500/20 data-[state=active]:text-white transition-all duration-300 data-[state=active]:shadow-lg data-[state=active]:shadow-green-500/20"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                <div className="px-8">
                  {/* SIGN IN FORM */}
                  <TabsContent value="signin" className="space-y-6">
                    <form onSubmit={handleSignIn} className="space-y-6">
                      <div className="space-y-3">
                        <Label
                          htmlFor="signin-email"
                          className="text-sm font-medium text-green-100 flex items-center gap-2"
                        >
                          Email Address
                        </Label>
                        <Input
                          id="signin-email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="bg-white/10 border-green-400/30 text-white placeholder:text-green-300/50 focus:border-green-400 focus:ring-green-400/20 focus:bg-white/20 transition-all duration-300 backdrop-blur-sm"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label
                          htmlFor="signin-password"
                          className="text-sm font-medium text-green-100"
                        >
                          Password
                        </Label>
                        <Input
                          id="signin-password"
                          type="password"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="bg-white/10 border-green-400/30 text-white placeholder:text-green-300/50 focus:border-green-400 focus:ring-green-400/20 focus:bg-white/20 transition-all duration-300 backdrop-blur-sm"
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold shadow-xl shadow-green-500/20 hover:shadow-2xl hover:shadow-green-600/30 transition-all duration-300 border-0 rounded-lg"
                        disabled={loading}
                      >
                        {loading && (
                          <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                        )}
                        {loading ? 'Signing In...' : 'Sign In to Portal'}
                      </Button>

                      <p className="text-center text-green-300/60 text-sm">
                        Secure access to your academic resources
                      </p>
                    </form>
                  </TabsContent>

                  {/* SIGN UP FORM */}
                  <TabsContent value="signup" className="space-y-6">
                    <form onSubmit={handleSignUp} className="space-y-6">
                      <div className="space-y-3">
                        <Label
                          htmlFor="signup-name"
                          className="text-sm font-medium text-green-100"
                        >
                          Full Name
                        </Label>
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="Enter your full name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                          className="bg-white/10 border-green-400/30 text-white placeholder:text-green-300/50 focus:border-green-400 focus:ring-green-400/20 focus:bg-white/20 transition-all duration-300 backdrop-blur-sm"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label
                          htmlFor="signup-email"
                          className="text-sm font-medium text-green-100"
                        >
                          Email Address
                        </Label>
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="bg-white/10 border-green-400/30 text-white placeholder:text-green-300/50 focus:border-green-400 focus:ring-green-400/20 focus:bg-white/20 transition-all duration-300 backdrop-blur-sm"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label
                          htmlFor="signup-password"
                          className="text-sm font-medium text-green-100"
                        >
                          Password
                        </Label>
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="Create a strong password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="bg-white/10 border-green-400/30 text-white placeholder:text-green-300/50 focus:border-green-400 focus:ring-green-400/20 focus:bg-white/20 transition-all duration-300 backdrop-blur-sm"
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-12 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold shadow-xl shadow-emerald-500/20 hover:shadow-2xl hover:shadow-emerald-600/30 transition-all duration-300 border-0 rounded-lg"
                        disabled={loading}
                      >
                        {loading && (
                          <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                        )}
                        {loading ? 'Creating Account...' : 'Create Account'}
                      </Button>

                      <p className="text-center text-green-300/60 text-sm">
                        Join the Computer Science community
                      </p>
                    </form>
                  </TabsContent>
                </div>
              </Tabs>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-green-400/20 text-center mx-8 mb-8">
                <p className="text-green-300/50 text-xs">
                  © 2024 Kaduna Polytechnic - Computer Science Department
                </p>
              </div>
            </CardContent>
          </div>

          {/* Right Side - Kaduna Polytechnic Image/Info */}
          <div className="hidden lg:flex flex-col justify-center items-center p-8 bg-gradient-to-br from-green-600/20 to-emerald-700/20 border-l border-green-400/20 relative">
            {/* Decorative Elements */}
            <div className="absolute top-8 right-8 text-green-300/30">
              <Sparkles className="h-6 w-6 animate-pulse" />
            </div>
            <div className="absolute bottom-12 left-8 text-emerald-300/20">
              <Sparkles className="h-4 w-4 animate-pulse delay-2000" />
            </div>

            {/* Placeholder for Kaduna Polytechnic Image */}
            <div className="w-80 h-80 rounded-2xl bg-gradient-to-br from-green-400/20 to-emerald-500/30 backdrop-blur-sm border-2 border-green-300/30 shadow-2xl shadow-green-900/20 flex flex-col items-center justify-center mb-8 relative overflow-hidden">
              {/* Image placeholder with institution info */}
              <div className="absolute inset-0 bg-gradient-to-t from-green-900/60 to-transparent"></div>

              <div className="relative z-10 text-center p-8">
                <div className="mb-6">
                  <GraduationCap className="h-20 w-20 text-green-200 mx-auto mb-4" />
                  <div className="w-16 h-1 bg-gradient-to-r from-green-400 to-emerald-500 mx-auto rounded-full"></div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">
                  Kaduna Polytechnic
                </h3>
                <p className="text-green-200/80 text-sm mb-4">
                  Excellence in Technical Education
                </p>
                <p className="text-green-300/70 text-xs">
                  Est. 1968 | Kaduna State, Nigeria
                </p>
              </div>

              {/* Decorative pattern overlay */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)`,
                  backgroundSize: '20px 20px',
                }}
              ></div>
            </div>

            {/* Institution Features */}
            <div className="space-y-4 w-full max-w-xs">
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-green-400/20">
                <h4 className="text-green-100 font-semibold text-sm mb-2">
                  🎓 Quality Education
                </h4>
                <p className="text-green-200/70 text-xs">
                  Over 50 years of excellence in technical and vocational
                  education
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-green-400/20">
                <h4 className="text-green-100 font-semibold text-sm mb-2">
                  💻 Modern Facilities
                </h4>
                <p className="text-green-200/70 text-xs">
                  State-of-the-art computer labs and learning resources
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-green-400/20">
                <h4 className="text-green-100 font-semibold text-sm mb-2">
                  🌟 Career Success
                </h4>
                <p className="text-green-200/70 text-xs">
                  Graduates working in top tech companies nationwide
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
