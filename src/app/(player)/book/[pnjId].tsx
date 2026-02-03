import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../../../theme';
import { Screen } from '../../../components/layout/screen';
import { Button, Card, Badge, Input } from '../../../components/ui';
import { useToast } from '../../../components/ui/toast';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../../constants/theme';
import { BOOKING_DURATIONS, calculateBookingPrice } from '../../../types/booking';

export default function BookingScreen() {
  const { pnjId } = useLocalSearchParams();
  const theme = useTheme();
  const router = useRouter();
  const toast = useToast();

  // Mock PNJ data - in real app, fetch by ID
  const pnj = { id: pnjId, name: 'Alex', hourlyRate: 25 };

  const [step, setStep] = useState(1);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState(60);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [location, setLocation] = useState('');

  const activities = ['Randonnée', 'Escalade', 'VTT', 'Course à pied'];
  const dates = ['Aujourd\'hui', 'Demain', 'Sam 25', 'Dim 26', 'Lun 27'];
  const timeSlots = ['10:00', '11:00', '14:00', '15:00', '16:00'];

  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const pricing = calculateBookingPrice(pnj.hourlyRate, selectedDuration);

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const handleConfirm = () => {
    toast.success('Demande envoyée !');
    router.replace('/(player)');
  };

  return (
    <Screen>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack}>
            <Text style={{ color: theme.colors.primary, fontSize: 24 }}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Réserver {pnj.name}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Progress */}
        <View style={styles.progress}>
          {[1, 2, 3, 4].map((s) => (
            <View
              key={s}
              style={[
                styles.progressDot,
                {
                  backgroundColor:
                    s <= step ? theme.colors.primary : theme.colors.outline,
                },
              ]}
            />
          ))}
        </View>

        {/* Step 1: Activity */}
        {step === 1 && (
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: theme.colors.text }]}>
              Choisis une activité 🎯
            </Text>
            <View style={styles.options}>
              {activities.map((activity) => (
                <TouchableOpacity
                  key={activity}
                  onPress={() => setSelectedActivity(activity)}
                >
                  <View
                    style={[
                      styles.option,
                      {
                        backgroundColor:
                          selectedActivity === activity
                            ? theme.colors.primaryLight
                            : theme.colors.surface,
                        borderColor:
                          selectedActivity === activity
                            ? theme.colors.primary
                            : theme.colors.outline,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        {
                          color:
                            selectedActivity === activity
                              ? theme.colors.primary
                              : theme.colors.text,
                        },
                      ]}
                    >
                      {activity}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Step 2: Date & Time */}
        {step === 2 && (
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: theme.colors.text }]}>
              Quand ? 📅
            </Text>

            {/* Date Selection */}
            <Text style={[styles.label, { color: theme.colors.textMuted }]}>
              Jour
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.dateScroll}
            >
              {dates.map((date) => (
                <TouchableOpacity
                  key={date}
                  onPress={() => setSelectedDate(date)}
                >
                  <View
                    style={[
                      styles.dateChip,
                      {
                        backgroundColor:
                          selectedDate === date
                            ? theme.colors.primary
                            : theme.colors.surface,
                        borderColor:
                          selectedDate === date
                            ? theme.colors.primary
                            : theme.colors.outline,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color:
                          selectedDate === date
                            ? theme.colors.onPrimary
                            : theme.colors.text,
                        fontWeight: '600',
                      }}
                    >
                      {date}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Time Selection */}
            <Text style={[styles.label, { color: theme.colors.textMuted }]}>
              Heure
            </Text>
            <View style={styles.timeGrid}>
              {timeSlots.map((time) => (
                <TouchableOpacity
                  key={time}
                  onPress={() => setSelectedTime(time)}
                  style={{ width: '30%' }}
                >
                  <View
                    style={[
                      styles.timeChip,
                      {
                        backgroundColor:
                          selectedTime === time
                            ? theme.colors.primary
                            : theme.colors.surface,
                        borderColor:
                          selectedTime === time
                            ? theme.colors.primary
                            : theme.colors.outline,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color:
                          selectedTime === time
                            ? theme.colors.onPrimary
                            : theme.colors.text,
                        fontWeight: '600',
                      }}
                    >
                      {time}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Duration */}
            <Text style={[styles.label, { color: theme.colors.textMuted }]}>
              Durée
            </Text>
            <View style={styles.durationOptions}>
              {BOOKING_DURATIONS.map((d) => (
                <TouchableOpacity
                  key={d.value}
                  onPress={() => setSelectedDuration(d.value)}
                  style={{ flex: 1 }}
                >
                  <View
                    style={[
                      styles.durationChip,
                      {
                        backgroundColor:
                          selectedDuration === d.value
                            ? theme.colors.primary
                            : theme.colors.surface,
                        borderColor:
                          selectedDuration === d.value
                            ? theme.colors.primary
                            : theme.colors.outline,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color:
                          selectedDuration === d.value
                            ? theme.colors.onPrimary
                            : theme.colors.text,
                        fontWeight: '600',
                        fontSize: 12,
                      }}
                    >
                      {d.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Step 3: Location */}
        {step === 3 && (
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: theme.colors.text }]}>
              Où ? 📍
            </Text>
            <Input
              label="Lieu de rendez-vous"
              placeholder="Ex: Café de Flore, Paris"
              value={location}
              onChangeText={setLocation}
            />
            <Text style={[styles.hint, { color: theme.colors.textMuted }]}>
              Choisis un lieu public pour votre première rencontre
            </Text>
          </View>
        )}

        {/* Step 4: Recap */}
        {step === 4 && (
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: theme.colors.text }]}>
              Récapitulatif 📋
            </Text>

            <Card>
              <Card.Body>
                <RecapItem label="Activité" value={selectedActivity || '-'} theme={theme} />
                <RecapItem label="Date" value={selectedDate || '-'} theme={theme} />
                <RecapItem label="Heure" value={selectedTime || '-'} theme={theme} />
                <RecapItem
                  label="Durée"
                  value={BOOKING_DURATIONS.find((d) => d.value === selectedDuration)?.label || '-'}
                  theme={theme}
                />
                <RecapItem label="Lieu" value={location || '-'} theme={theme} />

                <View style={[styles.divider, { backgroundColor: theme.colors.outline }]} />

                <RecapItem
                  label="Tarif horaire"
                  value={`${pnj.hourlyRate}€`}
                  theme={theme}
                />
                <RecapItem
                  label="Total"
                  value={`${pricing.totalPrice}€`}
                  theme={theme}
                  highlight
                />
              </Card.Body>
            </Card>

            <Text style={[styles.paymentNote, { color: theme.colors.textMuted }]}>
              💳 Le paiement sera prélevé après confirmation du PNJ
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Button */}
      <View
        style={[
          styles.bottomBar,
          { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.outline },
        ]}
      >
        {step < 4 ? (
          <Button
            title="Continuer"
            onPress={handleNext}
            variant="primary"
            size="large"
            fullWidth
            disabled={
              (step === 1 && !selectedActivity) ||
              (step === 2 && (!selectedDate || !selectedTime)) ||
              (step === 3 && !location)
            }
          />
        ) : (
          <Button
            title="Confirmer la réservation"
            onPress={handleConfirm}
            variant="primary"
            size="large"
            fullWidth
          />
        )}
      </View>
    </Screen>
  );
}

const RecapItem = ({
  label,
  value,
  theme,
  highlight,
}: {
  label: string;
  value: string;
  theme: ReturnType<typeof useTheme>;
  highlight?: boolean;
}) => (
  <View style={styles.recapItem}>
    <Text style={[styles.recapLabel, { color: theme.colors.textMuted }]}>{label}</Text>
    <Text
      style={[
        styles.recapValue,
        {
          color: highlight ? theme.colors.primary : theme.colors.text,
          fontWeight: highlight ? '700' : '500',
        },
      ]}
    >
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.m,
  },
  title: {
    ...TYPOGRAPHY.h4,
  },
  progress: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.s,
    marginBottom: SPACING.l,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stepContent: {
    paddingHorizontal: SPACING.m,
  },
  stepTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.l,
  },
  options: {
    gap: SPACING.s,
  },
  option: {
    padding: SPACING.m,
    borderRadius: BORDER_RADIUS.m,
    borderWidth: 2,
  },
  optionText: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
  },
  label: {
    ...TYPOGRAPHY.caption,
    marginBottom: SPACING.s,
    marginTop: SPACING.m,
  },
  dateScroll: {
    marginBottom: SPACING.m,
  },
  dateChip: {
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    borderRadius: BORDER_RADIUS.m,
    borderWidth: 1,
    marginRight: SPACING.s,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.s,
  },
  timeChip: {
    paddingVertical: SPACING.s,
    borderRadius: BORDER_RADIUS.m,
    borderWidth: 1,
    alignItems: 'center',
  },
  durationOptions: {
    flexDirection: 'row',
    gap: SPACING.s,
  },
  durationChip: {
    paddingVertical: SPACING.s,
    borderRadius: BORDER_RADIUS.m,
    borderWidth: 1,
    alignItems: 'center',
  },
  hint: {
    ...TYPOGRAPHY.caption,
    marginTop: SPACING.s,
  },
  recapItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.s,
  },
  recapLabel: {
    ...TYPOGRAPHY.body,
  },
  recapValue: {
    ...TYPOGRAPHY.body,
  },
  divider: {
    height: 1,
    marginVertical: SPACING.m,
  },
  paymentNote: {
    ...TYPOGRAPHY.caption,
    textAlign: 'center',
    marginTop: SPACING.l,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.m,
    borderTopWidth: 1,
  },
});
