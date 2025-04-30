import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { MainMenu } from "../../components/MainMenu";
import { Button } from "../../components/ui/button";

export const AdminDashboard = (): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center mb-8">
          <div className="flex items-center gap-2">
            <MainMenu />
          </div>
          <h1 className="text-xl md:text-2xl font-semibold text-black dark:text-white text-center flex-1">
            {t('adminDashboard')}
          </h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Button
            className="p-6 h-auto text-left flex flex-col items-start"
            onClick={() => navigate('/admin/submissions')}
          >
            <h2 className="text-lg font-semibold mb-2">{t('submissions')}</h2>
            <p className="text-sm opacity-80">Manage and review student submissions</p>
          </Button>

          <Button
            className="p-6 h-auto text-left flex flex-col items-start"
            onClick={() => navigate('/admin/weeks')}
          >
            <h2 className="text-lg font-semibold mb-2">{t('weekManagement')}</h2>
            <p className="text-sm opacity-80">Add or remove available weeks</p>
          </Button>

          <Button
            className="p-6 h-auto text-left flex flex-col items-start"
            onClick={() => navigate('/admin/timetable')}
          >
            <h2 className="text-lg font-semibold mb-2">{t('schedule')}</h2>
            <p className="text-sm opacity-80">Manage class schedule</p>
          </Button>

          <Button
            className="p-6 h-auto text-left flex flex-col items-start"
            onClick={() => navigate('/admin/home-times')}
          >
            <h2 className="text-lg font-semibold mb-2">{t('homeTimes')}</h2>
            <p className="text-sm opacity-80">Manage home times</p>
          </Button>
        </div>
      </div>
    </div>
  );
};