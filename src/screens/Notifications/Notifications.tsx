import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MainMenu } from "../../components/MainMenu";
import { BackButton } from "../../components/BackButton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { supabase } from "../../lib/supabase";
import { AnimatedContainer } from "../../components/AnimatedContainer";
import { AnimatedList } from "../../components/AnimatedList";

interface Notification {
  id: string;
  week: string;
  day: number;
  hour: string;
  content: string;
  created_at: string;
}

export const Notifications = (): JSX.Element => {
  const { t } = useTranslation();
  const [weeks, setWeeks] = useState<string[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<string>("2");
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    fetchWeeks();
  }, []);

  useEffect(() => {
    if (selectedWeek && selectedDay) {
      fetchNotifications();
    }
  }, [selectedWeek, selectedDay]);

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
      .eq('week', selectedWeek)
      .eq('day', selectedDay)
      .order('hour');

    if (error) {
      console.error('Error fetching notifications:', error);
      return;
    }

    setNotifications(data || []);
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

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
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

              <div className="flex-1">
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
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <AnimatedList>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-4 border rounded dark:border-gray-700 mb-4 font-inter"
                  >
                    <p className="font-medium">{notification.hour}</p>
                    <p className="mt-2">{notification.content}</p>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <p className="text-center text-gray-500 dark:text-gray-400 font-inter">
                    Không có thông báo
                  </p>
                )}
              </AnimatedList>
            </div>
          </div>
        </div>
      </div>
    </AnimatedContainer>
  );
};