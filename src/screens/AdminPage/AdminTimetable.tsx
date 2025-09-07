import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MainMenu } from "../../components/MainMenu";
import { BackButton } from "../../components/BackButton";
import { Button } from "../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { supabase } from "../../lib/supabase";
import { AnimatedContainer } from "../../components/AnimatedContainer";
import { AnimatedMessage } from "../../components/AnimatedMessage";

interface TimetableEntry {
  id: string;
  week: string;
  day: number;
  period: number;
  subject: string;
  uniform: string;
}

export const AdminTimetable = (): JSX.Element => {
  const { t } = useTranslation();
  const [weeks, setWeeks] = useState<string[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<string>("2");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("1");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedUniform, setSelectedUniform] = useState<string>("Áo Trắng");
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    fetchWeeks();
    if (selectedWeek && selectedDay) {
      fetchTimetable();
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

  const fetchTimetable = async () => {
    const { data, error } = await supabase
      .from('timetable')
      .select('*')
      .eq('week', selectedWeek)
      .eq('day', selectedDay)
      .order('period');

    if (error) {
      console.error('Error fetching timetable:', error);
      return;
    }

    setTimetable(data);
    
  };

  const handleSubmit = async () => {
    try {
      const entryData = {
        week: selectedWeek,
        day: parseInt(selectedDay),
        period: parseInt(selectedPeriod),
        subject: selectedSubject,
        uniform: selectedUniform
      };

      const { error } = await supabase
        .from('timetable')
        .upsert(entryData, {
          onConflict: 'week,day,period'
        });

      if (error) throw error;

      setMessage('Timetable updated successfully');
      setMessageType('success');
      fetchTimetable();
    } catch (error) {
      console.error('Error updating timetable:', error);
      setMessage('Error updating timetable');
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

  const morningPeriods = Array.from({ length: 5 }, (_, i) => ({
    value: (i + 1).toString(),
    label: `Sáng - ${t('period')} ${i + 1}`
  }));

  const afternoonPeriods = Array.from({ length: 4 }, (_, i) => ({
    value: (i + 6).toString(),
    label: `Chiều - ${t('period')} ${i + 1}`
  }));

  const periods = [...morningPeriods, ...afternoonPeriods];

  const uniforms = [
    { value: "Áo Trắng", label: "Áo Trắng" },
    { value: "Áo Đỏ", label: "Áo Đỏ" },
    { value: "Thể dục", label: "Thể dục" }
  ];

  return (
    <AnimatedContainer>
      <div className="bg-white dark:bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <BackButton />
              <MainMenu />
            </div>
            <h1 className="text-xl md:text-2xl font-semibold text-black dark:text-white font-inter text-center flex-1">
              {t('schedule')}
            </h1>
            <div className="w-6" />
          </div>

          {message && (
            <AnimatedMessage message={message} type={messageType} />
          )}

          <div className="grid gap-6 md:grid-cols-2">
            {/* Timetable Form */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold mb-4 font-inter text-center">{t('schedule')}</h2>
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
                  <label className="block text-sm font-medium mb-1 font-inter">{t('period')}</label>
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="w-full font-inter">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {periods.map((period) => (
                        <SelectItem key={period.value} value={period.value} className="font-inter">
                          {period.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 font-inter">{t('subject')}</label>
                  <input
                    type="text"
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full p-2 border rounded font-inter"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 font-inter">{t('uniform')}</label>
                  <Select value={selectedUniform} onValueChange={setSelectedUniform}>
                    <SelectTrigger className="w-full font-inter">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {uniforms.map((uniform) => (
                        <SelectItem key={uniform.value} value={uniform.value} className="font-inter">
                          {uniform.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

<Button onClick={handleSubmit} className="w-full font-inter">
                  {t('save')}
                </Button>
              </div>
            </div>

            {/* Timetable Display */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold mb-4 font-inter text-center">
                {selectedWeek ? `${t('week')} ${selectedWeek}` : t('schedule')}
              </h2>
              <div className="space-y-4">
                {timetable.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-4 border rounded dark:border-gray-700 font-inter"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">
                          {entry.period <= 5 ? 'Sáng' : 'Chiều'} - {t('period')} {entry.period <= 5 ? entry.period : entry.period - 5}
                        </p>
                        <p>{entry.subject}</p>
                        <p className="text-sm text-gray-500">{entry.uniform}</p>
                        {entry.hometime && (
                          <p className="text-sm text-green-600 dark:text-green-400">
                            Tan học: {entry.hometime}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={async () => {
                          const { error } = await supabase
                            .from('timetable')
                            .delete()
                            .eq('id', entry.id);
                          
                          if (error) {
                            console.error('Error deleting entry:', error);
                            return;
                          }
                          
                          fetchTimetable();
                        }}
                        className="font-inter"
                      >
                        {t('delete')}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedContainer>
  );
};