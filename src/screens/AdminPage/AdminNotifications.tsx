import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MainMenu } from "../../components/MainMenu";
import { BackButton } from "../../components/BackButton";
import { Button } from "../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { supabase } from "../../lib/supabase";
import { AnimatedContainer } from "../../components/AnimatedContainer";
import { AnimatedMessage } from "../../components/AnimatedMessage";
import { AnimatedList } from "../../components/AnimatedList";

interface Notification {
  id: string;
  week: string;
  day: number;
  hour: string;
  content: string;
  created_at: string;
}

export const AdminNotifications = (): JSX.Element => {
  const { t } = useTranslation();
  const [weeks, setWeeks] = useState<string[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<string>("2");
  const [content, setContent] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    fetchWeeks();
    fetchNotifications();
  }, []);

  const fetchWeeks = async () => {
    const { data, error } = await supabase
      .from('weeks')
      .select('week_number')
      .order('week_number');

    if (error) {
      console.error('Error fetching weeks:', error);
      return;
    }

    const weekNumbers = data.map(w => w.week_number);
    setWeeks(weekNumbers);
    if (!selectedWeek && weekNumbers.length > 0) {
      setSelectedWeek(weekNumbers[0]);
    }
  };

  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notifications:', error);
      return;
    }

    setNotifications(data || []);
  };

  const handleSubmit = async () => {
    try {
      const now = new Date();
      const hour = now.getHours().toString().padStart(2, '0') + ':' + 
                  now.getMinutes().toString().padStart(2, '0');

      const { error } = await supabase
        .from('notifications')
        .insert({
          week: selectedWeek,
          day: parseInt(selectedDay),
          hour,
          content
        });

      if (error) throw error;

      setMessage('Notification added successfully');
      setMessageType('success');
      setContent('');
      fetchNotifications();
    } catch (error) {
      console.error('Error adding notification:', error);
      setMessage('Error adding notification');
      setMessageType('error');
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMessage('Notification deleted successfully');
      setMessageType('success');
      fetchNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
      setMessage('Error deleting notification');
      setMessageType('error');
    }
  };

  const days = [
    { value: "2", label: t('monday') },
    { value: "3", label: t('tuesday') },
    { value: "4", label: t('wednesday') },
    { value: "5", label: t('thursday') },
    { value: "6", label: t('friday') },
    { value: "7", label: t('saturday') }
  ];

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
              Thông báo
            </h1>
          </div>

          {message && (
            <AnimatedMessage message={message} type={messageType} />
          )}

          <div className="grid gap-6 md:grid-cols-2">
            {/* Notification Form */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold mb-4 font-inter text-center">Gửi thông báo</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 font-inter">{t('week')}</label>
                  <Select value={selectedWeek} onValueChange={setSelectedWeek}>
                    <SelectTrigger className="w-full font-inter">
                      <SelectValue placeholder={t('week')} />
                    </SelectTrigger>
                    <SelectContent>
                      {weeks.map((week) => (
                        <SelectItem key={week} value={week} className="font-inter">
                          {t('week')} {week}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 font-inter">{t('day')}</label>
                  <Select value={selectedDay} onValueChange={setSelectedDay}>
                    <SelectTrigger className="w-full font-inter">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {days.map((day) => (
                        <SelectItem key={day.value} value={day.value} className="font-inter">
                          {day.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 font-inter">Nội dung</label>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full h-32 font-inter"
                    required
                  />
                </div>

                <Button onClick={handleSubmit} className="w-full font-inter">
                  Gửi
                </Button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold mb-4 font-inter text-center">Danh sách thông báo</h2>
              <AnimatedList>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-4 border rounded dark:border-gray-700 font-inter"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-500">
                          {t('week')} {notification.week} - {days.find(d => d.value === notification.day.toString())?.label}
                        </p>
                        <p className="text-sm text-gray-500">{notification.hour}</p>
                        <p className="mt-2">{notification.content}</p>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteNotification(notification.id)}
                        className="font-inter"
                      >
                        {t('delete')}
                      </Button>
                    </div>
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