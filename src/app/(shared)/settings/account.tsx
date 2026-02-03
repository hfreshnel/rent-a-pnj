import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../../theme';
import { Screen } from '../../../components/layout/screen';
import { Card, Avatar, Button, Input } from '../../../components/ui';
import { useToast } from '../../../components/ui/toast';
import { useAuthStore } from '../../../stores/authStore';
import { SPACING, TYPOGRAPHY } from '../../../constants/theme';

export default function AccountSettingsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const toast = useToast();
  const user = useAuthStore((s) => s.user);

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast.success('Profil mis à jour !');
  };

  const handleChangeAvatar = () => {
    toast.info('Fonctionnalité à venir');
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
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ color: theme.colors.primary, fontSize: 24 }}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Informations personnelles
          </Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <Avatar name={user?.displayName} size="xl" />
          <TouchableOpacity onPress={handleChangeAvatar}>
            <Text style={[styles.changeAvatarText, { color: theme.colors.primary }]}>
              Changer la photo
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <Card style={styles.formCard}>
          <Card.Body>
            <Input
              label="Nom d'affichage"
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Ton nom"
            />
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="ton@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Input
              label="Téléphone"
              value={phone}
              onChangeText={setPhone}
              placeholder="+33 6 00 00 00 00"
              keyboardType="phone-pad"
            />
          </Card.Body>
        </Card>

        {/* Save Button */}
        <Button
          title="Enregistrer"
          onPress={handleSave}
          variant="primary"
          size="large"
          fullWidth
          loading={isLoading}
          style={styles.saveButton}
        />

        {/* Danger Zone */}
        <Card style={[styles.dangerCard, { borderColor: theme.colors.error }]}>
          <Card.Body>
            <Text style={[styles.dangerTitle, { color: theme.colors.error }]}>
              Zone de danger
            </Text>
            <Text style={[styles.dangerDescription, { color: theme.colors.textMuted }]}>
              La suppression de ton compte est irréversible. Toutes tes données seront perdues.
            </Text>
            <Button
              title="Supprimer mon compte"
              onPress={() => toast.warning('Contacte le support pour supprimer ton compte')}
              variant="danger"
              size="medium"
              fullWidth
            />
          </Card.Body>
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: SPACING.xxl,
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
  avatarSection: {
    alignItems: 'center',
    paddingVertical: SPACING.l,
  },
  changeAvatarText: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    marginTop: SPACING.m,
  },
  formCard: {
    marginHorizontal: SPACING.m,
    marginBottom: SPACING.l,
  },
  saveButton: {
    marginHorizontal: SPACING.m,
    marginBottom: SPACING.xl,
  },
  dangerCard: {
    marginHorizontal: SPACING.m,
    borderWidth: 1,
  },
  dangerTitle: {
    ...TYPOGRAPHY.h4,
    marginBottom: SPACING.xs,
  },
  dangerDescription: {
    ...TYPOGRAPHY.body,
    marginBottom: SPACING.m,
  },
});
