import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { MainMenu } from "../../components/MainMenu";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";

export const AdminPage = (): JSX.Element => {
  const { t } = useTranslation();
  const [weeks, setWeeks] = useState(['33', '34', '35']);
  const [submissions] = useState([
    {
      id: 1,
      submitter: "John Doe",
      type: "strength",
      week: "33",
      personName: "Alice Smith",
      notes: "Very helpful in class",
      status: "pending"
    },
    // Add more mock data as needed
  ]);

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <MainMenu />
          <h1 className="text-xl md:text-2xl font-semibold text-black dark:text-white">
            {t('adminDashboard')}
          </h1>
          <div className="w-6" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Submissions Management */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-black dark:text-white">
              {t('submissions')}
            </h2>
            <div className="space-y-4">
              {submissions.map((submission) => (
                <div key={submission.id} className="border dark:border-gray-700 p-4 rounded">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">{submission.submitter}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {t('week')}: {submission.week}
                      </p>
                    </div>
                    <Select defaultValue={submission.status}>
                      <SelectTrigger className="w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="approved">{t('approved')}</SelectItem>
                        <SelectItem value="rejected">{t('rejected')}</SelectItem>
                        <SelectItem value="pending">{t('pending')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-sm">{submission.notes}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Week Management */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-black dark:text-white">
              {t('weekManagement')}
            </h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder={t('newWeek')}
                  className="flex-1"
                />
                <Button>{t('add')}</Button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {weeks.map((week) => (
                  <div
                    key={week}
                    className="flex items-center justify-between p-2 border dark:border-gray-700 rounded"
                  >
                    <span>{t('week')} {week}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-black dark:text-white">
              {t('statistics')}
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>{t('totalSubmissions')}</span>
                <span className="font-semibold">24</span>
              </div>
              <div className="flex justify-between items-center">
                <span>{t('pendingReview')}</span>
                <span className="font-semibold">5</span>
              </div>
              <div className="flex justify-between items-center">
                <span>{t('approvedSubmissions')}</span>
                <span className="font-semibold">18</span>
              </div>
              <div className="flex justify-between items-center">
                <span>{t('rejectedSubmissions')}</span>
                <span className="font-semibold">1</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};