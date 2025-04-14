
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { CalendarIcon, LinkIcon, Mail, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/UI/Header';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Get stored profile data or use defaults
  const storedProfile = localStorage.getItem('flowAI_userProfile');
  const defaultProfile = storedProfile ? JSON.parse(storedProfile) : {
    username: user?.email?.split('@')[0] || '',
    dob: '',
    email: user?.email || '',
    description: '',
    publicLink: '',
  };
  
  const [profile, setProfile] = useState(defaultProfile);
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSave = () => {
    try {
      // Validate description length
      if (profile.description.length > 250) {
        toast({
          title: 'Validation error',
          description: 'Description must be 250 characters or less.',
          variant: 'destructive',
        });
        return;
      }
      
      // Save to localStorage
      localStorage.setItem('flowAI_userProfile', JSON.stringify(profile));
      
      toast({
        title: 'Profile saved',
        description: 'Your profile has been updated successfully.',
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: 'Save failed',
        description: 'Could not save profile. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const handleCancel = () => {
    // Reset to stored values
    const storedProfile = localStorage.getItem('flowAI_userProfile');
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
    }
    setIsEditing(false);
  };
  
  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />
      
      <div className="flex-1 p-4 md:p-8 overflow-auto">
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl">Profile Information</CardTitle>
              <CardDescription>
                Manage your personal information and profile settings
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="w-full md:w-1/2">
                    <Label htmlFor="username" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Username
                    </Label>
                    {isEditing ? (
                      <Input
                        id="username"
                        name="username"
                        value={profile.username}
                        onChange={handleChange}
                        className="mt-1"
                        placeholder="Your username"
                      />
                    ) : (
                      <p className="mt-1 text-sm font-medium">{profile.username}</p>
                    )}
                  </div>
                  
                  <div className="w-full md:w-1/2">
                    <Label htmlFor="dob" className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      Date of Birth
                    </Label>
                    {isEditing ? (
                      <Input
                        id="dob"
                        name="dob"
                        type="date"
                        value={profile.dob}
                        onChange={handleChange}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-sm font-medium">{profile.dob || "Not specified"}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email ID
                  </Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={profile.email}
                      onChange={handleChange}
                      className="mt-1"
                      placeholder="Your email address"
                      disabled={!!user?.email}
                    />
                  ) : (
                    <p className="mt-1 text-sm font-medium">{profile.email}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="description" className="flex items-center gap-2">
                    Description <span className="text-xs text-muted-foreground">(max 250 chars)</span>
                  </Label>
                  {isEditing ? (
                    <>
                      <Textarea
                        id="description"
                        name="description"
                        value={profile.description}
                        onChange={handleChange}
                        className="mt-1"
                        placeholder="Tell us about yourself"
                        maxLength={250}
                      />
                      <p className="text-xs text-muted-foreground text-right mt-1">
                        {profile.description.length}/250 characters
                      </p>
                    </>
                  ) : (
                    <p className="mt-1 text-sm">{profile.description || "No description"}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="publicLink" className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" />
                    Public Profile Link
                  </Label>
                  {isEditing ? (
                    <Input
                      id="publicLink"
                      name="publicLink"
                      value={profile.publicLink}
                      onChange={handleChange}
                      className="mt-1"
                      placeholder="https://yourprofile.com"
                    />
                  ) : (
                    <p className="mt-1 text-sm font-medium">
                      {profile.publicLink ? (
                        <a href={profile.publicLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          {profile.publicLink}
                        </a>
                      ) : (
                        "No public link"
                      )}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-end gap-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                  <Button onClick={handleSave}>Save Changes</Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
