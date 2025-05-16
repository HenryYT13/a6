import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MainMenu } from "../../components/MainMenu";
import { BackButton } from "../../components/BackButton";
import { Button } from "../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { supabase } from "../../lib/supabase";
import { AnimatedContainer } from "../../components/AnimatedContainer";
import { AnimatedList } from "../../components/AnimatedList";
import { motion } from "framer-motion";

interface Submission {
  id: string;
  submitter_name?: string;
  type: string;
  week: string;
  person_name: string;
  notes: string;
  status: string;
  period?: string;
  time_of_day?: string;
}

export const AdminSubmissions = (): JSX.Element => {
  const { t } = useTranslation();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [weeks, setWeeks] = useState<string[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');

  useEffect(() => {
    fetchWeeks();
    fetchSubmissions();
  }, []);

  const fetchWeeks = async () => {
    const { data, error } = await supabase
      .from('weeks')
      .select('week_number')
      .order('week_number', { ascending: true });

    if (error) {
      console.error('Error fetching weeks:', error);
      return;
    }

    setWeeks(data?.map(w => w.week_number) || []);
  };

  const fetchSubmissions = async () => {
    let query = supabase
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (selectedWeek !== 'all') {
      query = query.eq('week', selectedWeek);
    }

    if (selectedStatus !== 'all') {
      query = query.eq('status', selectedStatus);
    }

    if (selectedTimeOfDay !== 'all') {
      query = query.eq('time_of_day', selectedTimeOfDay);
    }

    if (selectedPeriod !== 'all') {
      query = query.eq('period', selectedPeriod);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching submissions:', error);
      return;
    }

    setSubmissions(data || []);
  };

  useEffect(() => {
    fetchSubmissions();
  }, [selectedWeek, selectedStatus, selectedTimeOfDay, selectedPeriod]);

  const updateSubmissionStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('submissions')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating submission:', error);
      return;
    }

    await fetchSubmissions();
  };

  const deleteSubmission = async (id: string) => {
    const { error } = await supabase
      .from('submissions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting submission:', error);
      return;
    }

    await fetchSubmissions();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100';
      case 'rejected':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100';
    }
  };

  const periods = [
    { value: '1', label: 'Tiết 1' },
    { value: '2', label: 'Tiết 2' },
    { value: '3', label: 'Tiết 3' },
    { value: '4', label: 'Tiết 4' },
    { value: '5', label: 'Tiết 5' },
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
              {t('submissions')}
            </h1>
            <div className="w-6" />
          </div>

          <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={selectedWeek} onValueChange={setSelectedWeek}>
              <SelectTrigger className="font-inter">
                <SelectValue placeholder="Filter by week" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="font-inter">All Weeks</SelectItem>
                {weeks.map((week) => (
                  <SelectItem key={week} value={week} className="font-inter">
                    {t('week')} {week}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="font-inter">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="font-inter">All Status</SelectItem>
                <SelectItem value="pending" className="font-inter">{t('pending')}</SelectItem>
                <SelectItem value="approved" className="font-inter">{t('approved')}</SelectItem>
                <SelectItem value="rejected" className="font-inter">{t('rejected')}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedTimeOfDay} onValueChange={setSelectedTimeOfDay}>
              <SelectTrigger className="font-inter">
                <SelectValue placeholder="Filter by time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="font-inter">All Times</SelectItem>
                <SelectItem value="morning" className="font-inter">Sáng</SelectItem>
                <SelectItem value="afternoon" className="font-inter">Chiều</SelectItem>
              </SelectContent>
            </Select>

            <Select 
              value={selectedPeriod} 
              onValueChange={setSelectedPeriod}
              disabled={selectedTimeOfDay === 'all'}
            >
              <SelectTrigger className="font-inter">
                <SelectValue placeholder="Filter by period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="font-inter">All Periods</SelectItem>
                {periods.map((period) => (
                  <SelectItem key={period.value} value={period.value} className="font-inter">
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <AnimatedList>
            {submissions.map((submission) => (
              <motion.div
                key={submission.id}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    {submission.submitter_name && (
                      <p className="font-medium font-inter">{submission.submitter_name}</p>
                    )}
                    <p className="text-sm text-gray-600 dark:text-gray-300 font-inter">
                      {t('week')}: {submission.week}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 font-inter">
                      {submission.type === 'strength' ? t('strength') : t('weakness')}: {submission.person_name}
                    </p>
                    {submission.time_of_day && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 font-inter">
                        {submission.time_of_day === 'morning' ? 'Sáng' : 'Chiều'}
                        {submission.period && ` - Tiết ${submission.period}`}
                      </p>
                    )}
                    <p className="text-sm mt-2 font-inter">{submission.notes}</p>
                  </div>
                  <div className="flex gap-2">
                    <motion.div
                      animate={{
                        backgroundColor: submission.status === 'approved' ? '#10B981' : 
                                      submission.status === 'rejected' ? '#EF4444' : '#6B7280',
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <Select
                        defaultValue={submission.status}
                        onValueChange={(value) => updateSubmissionStatus(submission.id, value)}
                      >
                        <SelectTrigger className={`w-28 font-inter ${getStatusColor(submission.status)}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="approved" className="font-inter">{t('approved')}</SelectItem>
                          <SelectItem value="rejected" className="font-inter">{t('rejected')}</SelectItem>
                          <SelectItem value="pending" className="font-inter">{t('pending')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </motion.div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteSubmission(submission.id)}
                      className="font-inter"
                    >
                      ×
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatedList>
        </div>
      </div>
    </AnimatedContainer>
  );
};