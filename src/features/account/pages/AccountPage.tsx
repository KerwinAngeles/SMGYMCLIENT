import { useContext } from 'react';
import { UserAuthContext } from '@/features/auth/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IconUser, IconMail, IconUserCircle, IconShield } from '@tabler/icons-react';
import { getRoleBadgeVariant, getInitials } from '@/lib/utils';
import { ModeToggle } from '@/components/custom/ModeTogle';

export default function AccountPage() {
  const { user, isLoading } = useContext(UserAuthContext);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-muted border-t-primary mx-auto"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-r-primary/40 animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">Loading your account</h2>
            <p className="text-muted-foreground">Getting your personal information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto p-6">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
            <IconUserCircle className="h-10 w-10 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-foreground">No authenticated user</h2>
            <p className="text-muted-foreground leading-relaxed">
              Please sign in to access your account information and enjoy all the features.
            </p>
          </div>
          <div className="pt-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-sm text-primary font-medium">Redirecting to sign in...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full p-4 sm:p-6 lg:p-8 space-y-8">

        {/* Profile Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Main Profile Card */}
          <div className="lg:col-span-2">
            <Card className="h-full shadow-lg border-0 bg-card">
              <CardHeader className="pb-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24 ring-4 ring-primary/20 shadow-lg">
                      <AvatarImage src="" alt={user.name} />
                      <AvatarFallback className="text-xl font-bold bg-primary text-primary-foreground">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-card flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="text-center sm:text-left space-y-3">
                    <div>
                      <CardTitle className="text-3xl font-bold text-card-foreground">{user.name}</CardTitle>
                      <CardDescription className="text-lg text-muted-foreground mt-1">
                        @{user.userName}
                      </CardDescription>
                    </div>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                      {user.roles.map((role, index) => (
                        <Badge 
                          key={index} 
                          variant={getRoleBadgeVariant(role)}
                          className="flex items-center gap-1 px-3 py-1 text-sm font-medium"
                        >
                          <IconShield className="h-3 w-3" />
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Personal Information */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-2 border-b border-border">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <IconUser className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-card-foreground">
                      Personal Information
                    </h3>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-muted-foreground">
                        Full Name
                      </label>
                      <div className="p-4 rounded-xl border border-border bg-muted/50 hover:bg-muted transition-colors">
                        <p className="font-semibold text-card-foreground">{user.name}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-muted-foreground">
                        Username
                      </label>
                      <div className="p-4 rounded-xl border border-border bg-muted/50 hover:bg-muted transition-colors">
                        <p className="font-semibold text-card-foreground">@{user.userName}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-2 border-b border-border">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <IconMail className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-card-foreground">
                      Contact Information
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-muted-foreground">
                      Email Address
                    </label>
                    <div className="p-4 rounded-xl border border-border bg-muted/50 hover:bg-muted transition-colors">
                      <p className="font-semibold text-card-foreground">{user.email}</p>
                    </div>
                  </div>
                </div>

                {/* Account Status */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-2 border-b border-border">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <IconShield className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-card-foreground">
                      Account Status
                    </h3>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-muted-foreground">
                        Status
                      </label>
                      <div className="p-4 rounded-xl border border-border bg-muted/50">
                        <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          Active
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-muted-foreground">
                        Assigned Roles
                      </label>
                      <div className="p-4 rounded-xl border border-border bg-muted/50">
                        <div className="flex flex-wrap gap-2">
                          {user.roles.map((role, index) => (
                            <Badge 
                              key={index} 
                              variant={getRoleBadgeVariant(role)}
                              className="text-xs px-2 py-1"
                            >
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Information */}
          <div className="space-y-6">
            {/* Quick Stats Card */}
            <Card className="shadow-lg border-0 bg-card">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg text-card-foreground">
                  <IconUserCircle className="h-5 w-5 text-primary" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-xl bg-primary/10 border border-primary/20">
                    <div className="text-2xl font-bold text-primary">{user.roles.length}</div>
                    <div className="text-sm text-muted-foreground font-medium">Roles</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-accent border border-border">
                    <div className="text-2xl font-bold text-accent-foreground">
                      {user.roles.includes('Administrator') ? '100%' : '75%'}
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">Acceso</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Info Card */}
            <Card className="shadow-lg border-0 bg-card">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg text-card-foreground">
                  <IconShield className="h-5 w-5 text-primary" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-semibold text-green-800 dark:text-green-200">Secure Account</span>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300 leading-relaxed">
                    Your account is protected with secure authentication and end-to-end encryption.
                  </p>
                </div>
                
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                  <div className="flex items-center gap-3 mb-3">
                    <IconShield className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-primary">Permissions</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {user.roles.includes('Administrator') 
                      ? 'You have full system access with all administrative privileges.' 
                      : 'You have limited access based on your assigned roles to maintain security.'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Welcome Message Card */}
            <Card className="shadow-lg border-0 bg-primary/5 border-primary/10">
              <CardContent className="p-6">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                    <IconUserCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-card-foreground">Welcome!</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Thank you for using SMGYM. Your information is secure and up to date.
                  </p>
                  <ModeToggle/>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
