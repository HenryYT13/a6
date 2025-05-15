import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MainMenu } from "../../components/MainMenu";
import { BackButton } from "../../components/BackButton";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { supabase } from "../../lib/supabase";

interface User {
  id: string;
  email: string;
  created_at: string;
}

export const AdminUsers = (): JSX.Element => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setMessage(t('notAuthenticated'));
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error checking admin status:', error);
        setMessage(t('error'));
        setIsLoading(false);
        return;
      }

      setIsAdmin(data?.is_admin || false);
      setIsLoading(false);

      if (data?.is_admin) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setMessage(t('error'));
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      // Query auth.users through a join with our users table to respect RLS policies
      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          auth_user:id (
            email,
            created_at
          )
        `)
        .order('id');

      if (error) {
        console.error('Error fetching users:', error);
        setMessage(t('error'));
        return;
      }

      // Transform the data to match the User interface
      const transformedUsers = data.map(user => ({
        id: user.id,
        email: user.auth_user.email,
        created_at: user.auth_user.created_at
      }));

      setUsers(transformedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      setMessage(t('error'));
    }
  };

  const createUser = async () => {
    if (!isAdmin) {
      setMessage(t('notAuthorized'));
      return;
    }

    try {
      // First create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newEmail,
        password: newPassword,
      });

      if (authError) throw authError;

      // Then create the corresponding user record
      if (authData.user) {
        const { error: userError } = await supabase
          .from('users')
          .insert([{ id: authData.user.id }]);

        if (userError) throw userError;
      }

      setMessage(t('userCreated'));
      setNewEmail("");
      setNewPassword("");
      await fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      setMessage(t('error'));
    }
  };

  const deleteUser = async (userId: string) => {
    if (!isAdmin) {
      setMessage(t('notAuthorized'));
      return;
    }

    try {
      // Delete the user record first (this will cascade to auth.users due to the foreign key)
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      setMessage(t('userDeleted'));
      await fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      setMessage(t('error'));
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <p className="text-lg">{t('loading')}</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="bg-white dark:bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <BackButton />
              <MainMenu />
            </div>
            <h1 className="text-xl md:text-2xl font-semibold text-black dark:text-white text-center flex-1">
              {t('users')}
            </h1>
            <div className="w-6" />
          </div>
          <div className="bg-red-100 dark:bg-red-900 p-4 rounded">
            <p className="text-red-700 dark:text-red-100">{t('notAuthorized')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <BackButton />
            <MainMenu />
          </div>
          <h1 className="text-xl md:text-2xl font-semibold text-black dark:text-white text-center flex-1">
            {t('users')}
          </h1>
          <div className="w-6" />
        </div>

        {message && (
          <div className="mb-4 p-4 bg-blue-100 dark:bg-blue-900 rounded">
            {message}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Create User Form */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-center">{t('createNewUser')}</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">{t('email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="password">{t('password')}</Label>
                <Input
                  id="password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <Button onClick={createUser}>{t('createUser')}</Button>
            </div>
          </div>

          {/* User List */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-center">{t('users')}</h2>
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border dark:border-gray-700 rounded"
                >
                  <div>
                    <p className="font-medium">{user.email}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteUser(user.id)}
                  >
                    {t('delete')}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};