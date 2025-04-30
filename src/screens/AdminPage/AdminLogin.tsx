import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { supabase } from "../../lib/supabase";
import { AnimatedContainer } from "../../components/AnimatedContainer";
import { AnimatedMessage } from "../../components/AnimatedMessage";
import { BackButton } from "../../components/BackButton";
import { MainMenu } from "../../components/MainMenu";

export const AdminLogin = (): JSX.Element => {
  const navigate = useNavigate();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: usernameOrEmail,
        password
      });

      if (error) throw error;

      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Error logging in:', error);
      setMessage('Invalid credentials');
      setMessageType('error');
    }
  };

  return (
    <AnimatedContainer>
      <div className="bg-white dark:bg-gray-900 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center mb-8">
            <div className="flex items-center gap-2">
              <BackButton />
              <MainMenu />
            </div>
            <h1 className="text-xl md:text-2xl font-semibold text-black dark:text-white font-inter text-center flex-1">
              Quản trị A6
            </h1>
          </div>

          {message && (
            <AnimatedMessage message={message} type={messageType} />
          )}

          <div className="max-w-md mx-auto">
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <Label htmlFor="username-email" className="text-base font-semibold font-inter">
                  Username / Email
                </Label>
                <Input
                  id="username-email"
                  type="text"
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  className="mt-2 h-12 font-inter"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-base font-semibold font-inter">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 h-12 font-inter"
                  required
                />
              </div>

              <div className="flex justify-center pt-4">
                <Button type="submit" className="px-8 py-2 font-inter">
                  Login
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AnimatedContainer>
  );
};