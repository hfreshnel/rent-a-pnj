import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme';
import { Screen } from '../../components/layout/screen';
import { Card, Badge, Button } from '../../components/ui';
import { useToast } from '../../components/ui/toast';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants/theme';
import { MOCK_CALENDAR_BOOKINGS } from '../../mocks';

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const TIME_SLOTS = ['Matin', 'Après-midi', 'Soir'];

export default function CalendarScreen() {
  const theme = useTheme();
  const toast = useToast();

  // Availability state: [day][slot] = available
  const [availability, setAvailability] = useState<boolean[][]>(
    DAYS.map(() => TIME_SLOTS.map(() => true))
  );

  const toggleSlot = (dayIndex: number, slotIndex: number) => {
    const booking = MOCK_CALENDAR_BOOKINGS.find(
      (b) => b.day === dayIndex && b.slot === slotIndex
    );

    if (booking) {
      toast.warning('Ce créneau a déjà une réservation');
      return;
    }

    setAvailability((prev) => {
      const newAvailability = prev.map((day) => [...day]);
      newAvailability[dayIndex][slotIndex] = !newAvailability[dayIndex][slotIndex];
      return newAvailability;
    });
  };

  const getSlotStatus = (dayIndex: number, slotIndex: number) => {
    const booking = MOCK_CALENDAR_BOOKINGS.find(
      (b) => b.day === dayIndex && b.slot === slotIndex
    );

    if (booking) return 'booked';
    return availability[dayIndex][slotIndex] ? 'available' : 'unavailable';
  };

  const handleSave = () => {
    toast.success('Disponibilités mises à jour !');
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
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Calendrier 📅
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
            Gère tes disponibilités
          </Text>
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <LegendItem color={theme.colors.success} label="Disponible" />
          <LegendItem color={theme.colors.primary} label="Réservé" />
          <LegendItem color={theme.colors.surfaceVariant} label="Indisponible" />
        </View>

        {/* Week Navigation */}
        <Card style={styles.weekCard}>
          <Card.Body style={styles.weekNav}>
            <TouchableOpacity>
              <Text style={[styles.navArrow, { color: theme.colors.primary }]}>←</Text>
            </TouchableOpacity>
            <Text style={[styles.weekTitle, { color: theme.colors.text }]}>
              Semaine du 20 Jan
            </Text>
            <TouchableOpacity>
              <Text style={[styles.navArrow, { color: theme.colors.primary }]}>→</Text>
            </TouchableOpacity>
          </Card.Body>
        </Card>

        {/* Calendar Grid */}
        <Card>
          <Card.Body>
            {/* Days Header */}
            <View style={styles.daysRow}>
              <View style={styles.timeLabel} />
              {DAYS.map((day, index) => (
                <View key={day} style={styles.dayCell}>
                  <Text style={[styles.dayText, { color: theme.colors.text }]}>
                    {day}
                  </Text>
                  <Text style={[styles.dateText, { color: theme.colors.textMuted }]}>
                    {20 + index}
                  </Text>
                </View>
              ))}
            </View>

            {/* Time Slots */}
            {TIME_SLOTS.map((slot, slotIndex) => (
              <View key={slot} style={styles.slotRow}>
                <View style={styles.timeLabel}>
                  <Text style={[styles.timeLabelText, { color: theme.colors.textMuted }]}>
                    {slot}
                  </Text>
                </View>
                {DAYS.map((_, dayIndex) => {
                  const status = getSlotStatus(dayIndex, slotIndex);
                  const booking = MOCK_CALENDAR_BOOKINGS.find(
                    (b) => b.day === dayIndex && b.slot === slotIndex
                  );

                  return (
                    <TouchableOpacity
                      key={`${dayIndex}-${slotIndex}`}
                      style={[
                        styles.slotCell,
                        {
                          backgroundColor:
                            status === 'booked'
                              ? theme.colors.primaryLight
                              : status === 'available'
                              ? theme.colors.success + '30'
                              : theme.colors.surfaceVariant,
                          borderColor:
                            status === 'booked'
                              ? theme.colors.primary
                              : status === 'available'
                              ? theme.colors.success
                              : theme.colors.outline,
                        },
                      ]}
                      onPress={() => toggleSlot(dayIndex, slotIndex)}
                    >
                      {booking ? (
                        <Text style={styles.bookingEmoji}>📅</Text>
                      ) : status === 'available' ? (
                        <Text style={[styles.checkMark, { color: theme.colors.success }]}>
                          ✓
                        </Text>
                      ) : null}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </Card.Body>
        </Card>

        {/* Upcoming Bookings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Réservations cette semaine
          </Text>

          {MOCK_CALENDAR_BOOKINGS.map((booking) => (
            <Card key={booking.id} style={styles.bookingCard}>
              <Card.Body style={styles.bookingContent}>
                <View style={styles.bookingInfo}>
                  <Text style={[styles.bookingDay, { color: theme.colors.primary }]}>
                    {DAYS[booking.day]} {20 + booking.day} • {TIME_SLOTS[booking.slot]}
                  </Text>
                  <Text style={[styles.bookingPlayer, { color: theme.colors.text }]}>
                    {booking.playerName}
                  </Text>
                  <Text style={[styles.bookingActivity, { color: theme.colors.textMuted }]}>
                    {booking.activity}
                  </Text>
                </View>
                <Badge label="Confirmé" variant="success" size="small" />
              </Card.Body>
            </Card>
          ))}
        </View>

        {/* Save Button */}
        <Button
          title="Enregistrer les modifications"
          onPress={handleSave}
          variant="primary"
          size="large"
          fullWidth
          style={styles.saveButton}
        />
      </ScrollView>
    </Screen>
  );
}

const LegendItem = ({ color, label }: { color: string; label: string }) => (
  <View style={styles.legendItem}>
    <View style={[styles.legendDot, { backgroundColor: color }]} />
    <Text style={styles.legendText}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: SPACING.xxl,
  },
  header: {
    paddingVertical: SPACING.l,
  },
  title: {
    ...TYPOGRAPHY.h2,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.m,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: SPACING.xs,
  },
  legendText: {
    fontSize: 12,
    color: '#a0a0b8',
  },
  weekCard: {
    marginBottom: SPACING.m,
  },
  weekNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navArrow: {
    fontSize: 24,
    fontWeight: '600',
  },
  weekTitle: {
    ...TYPOGRAPHY.h4,
  },
  daysRow: {
    flexDirection: 'row',
    marginBottom: SPACING.s,
  },
  timeLabel: {
    width: 60,
    justifyContent: 'center',
  },
  timeLabelText: {
    ...TYPOGRAPHY.caption,
    fontSize: 10,
  },
  dayCell: {
    flex: 1,
    alignItems: 'center',
  },
  dayText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
  },
  dateText: {
    ...TYPOGRAPHY.caption,
    fontSize: 10,
  },
  slotRow: {
    flexDirection: 'row',
    marginBottom: SPACING.xs,
  },
  slotCell: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: BORDER_RADIUS.s,
    borderWidth: 1,
    marginHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookingEmoji: {
    fontSize: 14,
  },
  checkMark: {
    fontSize: 14,
    fontWeight: '700',
  },
  section: {
    marginTop: SPACING.l,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h4,
    marginBottom: SPACING.m,
  },
  bookingCard: {
    marginBottom: SPACING.s,
  },
  bookingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bookingInfo: {
    flex: 1,
  },
  bookingDay: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
  },
  bookingPlayer: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
  },
  bookingActivity: {
    ...TYPOGRAPHY.caption,
  },
  saveButton: {
    marginTop: SPACING.l,
  },
});
