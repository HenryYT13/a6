import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MainMenu } from "../../components/MainMenu";
import { BackButton } from "../../components/BackButton";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { supabase } from "../../lib/supabase";
import { AnimatedContainer } from "../../components/AnimatedContainer";
import { AnimatedList } from "../../components/AnimatedList";
import { AnimatedMessage } from "../../components/AnimatedMessage";

export const AdminWeeks = (): JSX.Element => {
  const { t } = useTranslation();
  const [weeks, setWeeks] = useState<string[]>([]);
  const [newWeek, setNewWeek] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchWeeks();
    setIsLoading(false);
  }, []);

  const fetchWeeks = async () => {
    try {
      const { data, error } = await supabase
        .from('weeks')
        .select('week_number')
        .order('week_number', { ascending: true });

      if (error) throw error;

      setWeeks(data?.map(w => w.week_number) || []);
    } catch (error) {
      console.error('Error fetching weeks:', error);
      setMessage(t('error'));
      setMessageType('error');
    }
  };

  const validateWeekNumber = (week: string) => {
    const weekNumber = parseInt(week);
    return !isNaN(weekNumber) && weekNumber > 0 && weekNumber <= 52;
  };

  const handleSave = async () => {
    if (!newWeek.trim()) {
      setMessage('Please enter a week number');
      setMessageType('error');
      return;
    }

    if (!validateWeekNumber(newWeek)) {
      setMessage('Please enter a valid week number (1-52)');
      setMessageType('error');
      return;
    }

    if (weeks.includes(newWeek)) {
      setMessage('This week already exists');
      setMessageType('error');
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('weeks')
        .insert([{ week_number: newWeek.trim() }]);

      if (error) throw error;

      await fetchWeeks();
      setNewWeek('');
      setMessage('Week added successfully');
      setMessageType('success');
    } catch (error) {
      console.error('Error adding week:', error);
      setMessage('Failed to add week');
      setMessageType('error');
    } finally {
      setIsSaving(false);
    }
  };

  const removeWeek = async (week: string) => {
    try {
      const { error } = await supabase
        .from('weeks')
        .delete()
        .eq('week_number', week);

      if (error) throw error;

      await fetchWeeks();
      setMessage('Week removed successfully');
      setMessageType('success');
    } catch (error) {
      console.error('Error removing week:', error);
      setMessage('Failed to remove week');
      setMessageType('error');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-inter">{t('loading')}</p>
      </div>
    );
  }

  return (
    <AnimatedContainer>
      <div className="bg-white dark:bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center mb-8">
            <div className="flex items-center gap-2">
              <BackButton />
              <MainMenu />
            </div>
            <h1 className="text-xl md:text-2xl font-semibold text-black dark:text-white font-inter text-center flex-1">
              {t('weekManagement')}
            </h1>
          </div>

          {message && (
            <AnimatedMessage message={message} type={messageType} />
          )}

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder={t('newWeek')}
                  className="flex-1 font-inter"
                  value={newWeek}
                  onChange={(e) => setNewWeek(e.target.value)}
                  onKeyPress={handleKeyPress}
                  type="number"
                  min="1"
                  max="52"
                />
                <Button 
                  onClick={handleSave}
                  className="font-inter"
                  disabled={isSaving}
                >
                  {isSaving ? t('loading') : t('save')}
                </Button>
              </div>
              <AnimatedList>
                {weeks.map((week) => (
                  <div
                    key={week}
                    className="flex items-center justify-between p-4 border dark:border-gray-700 rounded font-inter"
                  >
                    <span className="text-lg">{t('week')} {week}</span>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeWeek(week)}
                      className="font-inter"
                    >
                      {t('delete')}
                    </Button>
                  </div>
                ))}
              </AnimatedList>
            </div>
          </div>
        </div>
      </div>
    </AnimatedContainer>
  );
};