import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MainMenu } from "../../components/MainMenu";
import { BackButton } from "../../components/BackButton";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { supabase } from "../../lib/supabase";
import { AnimatedContainer } from "../../components/AnimatedContainer";
import { AnimatedMessage } from "../../components/AnimatedMessage";

interface HomeTime {
  id: string;
  week: string;
  day: number;
  morning_time: string;
  afternoon_time: string;
}

export const AdminHomeTimes = (): JSX.Element => {
  const { t } = useTranslation();
  const [weeks, setWeeks] = useState<string[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<string>("2");
  const [morningTime, setMorningTime] = useState("11:30");
  const [afternoonTime, setAfternoonTime] = useState("17:00");
  const [homeTimes, setHomeTimes] = useState<HomeTime[]>([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [noMorningTime, setNoMorningTime] = useState(false);
  const [noAfternoonTime, setNoAfternoonTime] = useState(false);

  useEffect(() => {
    fetchWeeks();
  }, []);

  useEffect(() => {
    if (selectedWeek && selectedDay) {
      fetchHomeTimes();
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

  const fetchHomeTimes = async () => {
    const { data, error } = await supabase
      .from('home_times')
      .select('*')
      .eq('week', selectedWeek)
      .eq('day', selectedDay);

    if (error) {
      console.error('Error fetching home times:', error);
      return;
    }

    setHomeTimes(data || []);
    if (data && data.length > 0) {
      const mTime = data[0].morning_time;
      const aTime = data[0].afternoon_time;
      
      setNoMorningTime(mTime === "00:00" || mTime === "Không có");
      setNoAfternoonTime(aTime === "00:00" || aTime === "Không có");
      
      setMorningTime(mTime === "00:00" || mTime === "Không có" ? "00:00" : mTime);
      setAfternoonTime(aTime === "00:00" || aTime === "Không có" ? "00:00" : aTime);
    } else {
      setMorningTime("11:30");
      setAfternoonTime("17:00");
      setNoMorningTime(false);
      setNoAfternoonTime(false);
    }
  };

  const handleSave = async () => {
    try {
      const mTime = noMorningTime || morningTime === "00:00" ? "Không có" : morningTime;
      const aTime = noAfternoonTime || afternoonTime === "00:00" ? "Không có" : afternoonTime;

      const { error } = await supabase
        .from('home_times')
        .upsert({
          week: selectedWeek,
          day: parseInt(selectedDay),
          morning_time: mTime,
          afternoon_time: aTime
        }, {
          onConflict: 'week,day'
        });

      if (error) throw error;

      setMessage('Home times updated successfully');
      setMessageType('success');
      fetchHomeTimes();
    } catch (error) {
      console.error('Error updating home times:', error);
      setMessage('Error updating home times');
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
              {t('homeTimes')}
            </h1>
          </div>

          {message && (
            <AnimatedMessage message={message} type={messageType} />
          )}

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
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
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium font-inter">{t('morningHomeTime')}</label>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={noMorningTime}
                      onChange={(e) => {
                        setNoMorningTime(e.target.checked);
                        if (e.target.checked) {
                          setMorningTime("00:00");
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm font-inter">Không có</span>
                  </label>
                </div>
                <Input
                  type="time"
                  value={morningTime}
                  onChange={(e) => setMorningTime(e.target.value)}
                  className="w-full font-inter"
                  disabled={noMorningTime}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium font-inter">{t('afternoonHomeTime')}</label>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={noAfternoonTime}
                      onChange={(e) => {
                        setNoAfternoonTime(e.target.checked);
                        if (e.target.checked) {
                          setAfternoonTime("00:00");
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm font-inter">Không có</span>
                  </label>
                </div>
                <Input
                  type="time"
                  value={afternoonTime}
                  onChange={(e) => setAfternoonTime(e.target.value)}
                  className="w-full font-inter"
                  disabled={noAfternoonTime}
                />
              </div>

              <Button onClick={handleSave} className="w-full font-inter">
                {t('save')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AnimatedContainer>
  );
};