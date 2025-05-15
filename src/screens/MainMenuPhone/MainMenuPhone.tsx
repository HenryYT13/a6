import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { MainMenu } from "../../components/MainMenu";
import { AnimatedPage } from "../../components/AnimatedPage";
import { AnimatedButton } from "../../components/AnimatedButton";

export const MainMenuPhone = (): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <AnimatedPage>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center mb-8">
          <div className="flex items-center gap-2">
            <MainMenu />
          </div>
          <h1 className="flex-1 text-center text-xl md:text-2xl font-semibold text-black dark:text-white font-inter">
            A6 (2024 - 2028)
          </h1>
        </div>

        <div className="max-w-lg mx-auto space-y-6">
          <AnimatedButton
            className="w-full h-16 text-lg font-semibold font-inter"
            onClick={() => navigate('/submit')}
          >
            {t('submitStrengthWeakness')}
          </AnimatedButton>

          <AnimatedButton
            className="w-full h-16 text-lg font-semibold font-inter"
            onClick={() => navigate('/schedule')}
          >
            {t('schedule')}
          </AnimatedButton>

          <AnimatedButton
            className="w-full h-16 text-lg font-semibold font-inter"
            onClick={() => navigate('/admin')}
          >
            {t('admin')}
          </AnimatedButton>
        </div>
      </div>
    </AnimatedPage>
  );
};