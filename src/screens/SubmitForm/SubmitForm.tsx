import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MainMenu } from "../../components/MainMenu";
import { BackButton } from "../../components/BackButton";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { supabase } from "../../lib/supabase";
import { AnimatedContainer } from "../../components/AnimatedContainer";
import { AnimatedMessage } from "../../components/AnimatedMessage";
import { AnimatedInput } from "../../components/AnimatedInput";
import { motion } from "framer-motion";

export const SubmitForm = (): JSX.Element => {
  const { t } = useTranslation();
  const [selectedType, setSelectedType] = useState("weakness");
  const [submitterName, setSubmitterName] = useState("");
  const [week, setWeek] = useState("");
  const [availableWeeks, setAvailableWeeks] = useState<string[]>([]);
  const [personName, setPersonName] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    fetchWeeks();
  }, []);

  const fetchWeeks = async () => {
    try {
      const { data, error } = await supabase
        .from('weeks')
        .select('week_number')
        .order('week_number', { ascending: true });

      if (error) throw error;

      setAvailableWeeks(data?.map(w => w.week_number) || []);
      if (data?.length > 0) {
        setWeek(data[0].week_number);
      }
    } catch (error) {
      console.error('Error fetching weeks:', error);
      setMessage(t('error'));
      setMessageType('error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const submission = {
        type: selectedType,
        week,
        person_name: personName,
        notes
      };

      // Only include submitter_name if it's not empty
      if (submitterName.trim()) {
        submission['submitter_name'] = submitterName.trim();
      }

      const { error } = await supabase
        .from('submissions')
        .insert(submission);

      if (error) throw error;

      setMessage(t('submissionSuccess'));
      setMessageType('success');
      setSubmitterName("");
      setPersonName("");
      setNotes("");
    } catch (error) {
      console.error('Error submitting:', error);
      setMessage(t('error'));
      setMessageType('error');
    }
  };

  const getPersonNameLabel = () => {
    return `Tên người có ${selectedType === 'strength' ? 'ưu điểm' : 'nhược điểm'}`;
  };

  return (
    <AnimatedContainer>
      <div className="bg-white dark:bg-gray-900 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center mb-8">
            <div className="flex items-center gap-2">
              <BackButton />
              <MainMenu />
            </div>
            <h1 className="text-xl md:text-2xl font-semibold text-black dark:text-white font-inter text-center flex-1">
              A6 (2024 - 2028)
            </h1>
          </div>

          {message && (
            <AnimatedMessage message={message} type={messageType} />
          )}

          <div className="max-w-lg mx-auto">
            <motion.form 
              className="space-y-6" 
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div>
                <Label htmlFor="submitter-name" className="text-base font-semibold font-inter">
                  {t('submitterName')} ({t('optional')})
                </Label>
                <AnimatedInput
                  id="submitter-name"
                  className="mt-2 h-12 font-inter"
                  value={submitterName}
                  onChange={(e) => setSubmitterName(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="strength-weakness" className="text-base font-semibold font-inter">
                  {t('strengthWeakness')}
                </Label>
                <Select 
                  value={selectedType}
                  onValueChange={setSelectedType}
                >
                  <SelectTrigger id="strength-weakness" className="mt-2 h-12 font-inter">
                    <SelectValue placeholder={t('strengthWeakness')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="strength" className="font-inter">{t('strength')}</SelectItem>
                    <SelectItem value="weakness" className="font-inter">{t('weakness')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="week" className="text-base font-semibold font-inter">
                  {t('week')}
                </Label>
                <Select 
                  value={week}
                  onValueChange={setWeek}
                >
                  <SelectTrigger id="week" className="mt-2 h-12 font-inter">
                    <SelectValue placeholder={t('week')} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableWeeks.map((weekNumber) => (
                      <SelectItem key={weekNumber} value={weekNumber} className="font-inter">
                        {t('week')} {weekNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="person-name" className="text-base font-semibold font-inter">
                  {getPersonNameLabel()}
                </Label>
                <AnimatedInput
                  id="person-name"
                  className="mt-2 h-12 font-inter"
                  value={personName}
                  onChange={(e) => setPersonName(e.target.value)}
                  required
                />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Label htmlFor="notes" className="text-base font-semibold font-inter">
                  {t('additionalNotes')}
                </Label>
                <Textarea
                  id="notes"
                  className="mt-2 h-32 font-inter transition-all duration-200 hover:scale-[1.01] focus:scale-[1.01]"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </motion.div>

              <div className="flex justify-center pt-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button type="submit" className="px-8 py-2 font-inter">
                    {t('submit')}
                  </Button>
                </motion.div>
              </div>
            </motion.form>
          </div>
        </div>
      </div>
    </AnimatedContainer>
  );
};