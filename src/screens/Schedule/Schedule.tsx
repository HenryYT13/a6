import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { MainMenu } from "../../components/MainMenu";
import { BackButton } from "../../components/BackButton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { supabase } from "../../lib/supabase";
import { AnimatedPage } from "../../components/AnimatedPage";

interface TimetableEntry {
  id: string;
  week: string;
  day: number;
  period: number;
  subject: string;
  uniform: string;
  hometime?: string;
}

export const Schedule = (): JSX.Element => {
  const { t } = useTranslation();
  const [weeks, setWeeks] = useState<string[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<string>("");
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);

  useEffect(() => {
    fetchWeeks();
  }, []);

  useEffect(() => {
    if (selectedWeek) {
      fetchTimetable();
    }
  }, [selectedWeek]);

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
      .order('day')
      .order('period');

    if (error) {
      console.error('Error fetching timetable:', error);
      return;
    }

    setTimetable(data || []);
  };

  const days = [2, 3, 4, 5, 6, 7];
  const morningPeriods = [1, 2, 3, 4, 5];
  const afternoonPeriods = [6, 7, 8, 9];

  const getEntryForDayAndPeriod = (day: number, period: number) => {
    return timetable.find(entry => entry.day === day && entry.period === period);
  };

  const getDayUniforms = (day: number) => {
    const dayEntries = timetable.filter(entry => entry.day === day);
    const morning = dayEntries
      .filter(entry => entry.period <= 5)
      .map(entry => entry.uniform);
    const afternoon = dayEntries
      .filter(entry => entry.period > 5)
      .map(entry => entry.uniform);

    return {
      morning: [...new Set(morning)].join(', ') || 'Không có',
      afternoon: [...new Set(afternoon)].join(', ') || 'Không có'
    };
  };

  const getHomeTime = (day: number) => {
    // Find the first entry for this day that has a hometime set
    const dayEntry = timetable.find(entry => entry.day === day && entry.hometime);
    return dayEntry?.hometime || '';
  };

  return (
    <AnimatedPage>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center mb-8">
          <div className="flex items-center gap-2">
            <BackButton />
            <MainMenu />
          </div>
          <h1 className="text-xl md:text-2xl font-semibold text-black dark:text-white text-center flex-1">
            {t('schedule')}
          </h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <Select value={selectedWeek} onValueChange={setSelectedWeek}>
            <SelectTrigger className="w-[200px] font-inter">
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="overflow-x-auto space-y-8"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <h2 className="text-lg font-semibold mb-4 font-inter">Sáng</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="border p-2 font-semibold font-inter">{t('period')}</th>
                  {days.map(day => (
                    <th key={day} className="border p-2 font-semibold font-inter">
                      {t(`${['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][day - 2]}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {morningPeriods.map(period => (
                  <tr key={period}>
                    <td className="border p-2 font-semibold font-inter text-center">{period}</td>
                    {days.map(day => {
                      const entry = getEntryForDayAndPeriod(day, period);
                      return (
                        <td key={`${period}-${day}`} className="border p-2 font-inter">
                          {entry && (
                            <div>
                              <div className="font-medium">{entry.subject}</div>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <td className="border p-2 font-semibold font-inter text-center">Đồng phục</td>
                  {days.map(day => {
                    const uniforms = getDayUniforms(day);
                    return (
                      <td key={`uniform-${day}`} className="border p-2 font-inter text-sm text-gray-600 dark:text-gray-400">
                        {uniforms.morning}
                      </td>
                    );
                  })}
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <td className="border p-2 font-semibold font-inter text-center">{t('homeTime')}</td>
                  {days.map(day => {
                    const hometime = getHomeTime(day);
                    return (
                      <td key={`home-${day}`} className="border p-2 font-inter text-sm">
                        {hometime ? (
                          <span className="text-green-600 dark:text-green-400 font-medium">
                            {hometime}
                          </span>
                        ) : (
                          <span className="text-gray-400">--:--</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <h2 className="text-lg font-semibold mb-4 font-inter">Chiều</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="border p-2 font-semibold font-inter">{t('period')}</th>
                  {days.map(day => (
                    <th key={day} className="border p-2 font-semibold font-inter">
                      {t(`${['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][day - 2]}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {afternoonPeriods.map(period => (
                  <tr key={period}>
                    <td className="border p-2 font-semibold font-inter text-center">{period - 5}</td>
                    {days.map(day => {
                      const entry = getEntryForDayAndPeriod(day, period);
                      return (
                        <td key={`${period}-${day}`} className="border p-2 font-inter">
                          {entry && (
                            <div>
                              <div className="font-medium">{entry.subject}</div>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <td className="border p-2 font-semibold font-inter text-center">Đồng phục</td>
                  {days.map(day => {
                    const uniforms = getDayUniforms(day);
                    return (
                      <td key={`uniform-${day}`} className="border p-2 font-inter text-sm text-gray-600 dark:text-gray-400">
                        {uniforms.afternoon}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </motion.div>
        </motion.div>
      </div>
    </AnimatedPage>
  );
};