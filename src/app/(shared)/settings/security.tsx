import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../../theme';
import { Screen } from '../../../components/layout/screen';
import { Card, Button, Input } from '../../../components/ui';
import { useToast } from '../../../components/ui/toast';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../../constants/theme';

export default function SecuritySettingsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const toast = useToast();

  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Password change form
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast.success('Mot de passe modifié !');
    setShowPasswordForm(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const toggleBiometric = () => {
    setBiometricEnabled(!biometricEnabled);
    toast.success(biometricEnabled ? 'Face ID désactivé' : 'Face ID activé');
  };

  const toggleTwoFactor = () => {
    if (!twoFactorEnabled) {
      toast.info('Configuration de la 2FA à venir');
    } else {
      setTwoFactorEnabled(false);
      toast.success('2FA désactivée');
    }
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
            Sécurité
          </Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Password Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textMuted }]}>
            Mot de passe
          </Text>
          <Card>
            {!showPasswordForm ? (
              <TouchableOpacity onPress={() => setShowPasswordForm(true)}>
                <View style={styles.menuItem}>
                  <Text style={styles.menuIcon}>🔑</Text>
                  <Text style={[styles.menuLabel, { color: theme.colors.text }]}>
                    Modifier le mot de passe
                  </Text>
                  <Text style={{ color: theme.colors.textMuted }}>›</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <Card.Body>
                <Input
                  label="Mot de passe actuel"
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  secureTextEntry
                  placeholder="••••••••"
                />
                <Input
                  label="Nouveau mot de passe"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                  placeholder="••••••••"
                  helperText="8 caractères minimum"
                />
                <Input
                  label="Confirmer le mot de passe"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  placeholder="••••••••"
                />
                <View style={styles.passwordActions}>
                  <Button
                    title="Annuler"
                    onPress={() => setShowPasswordForm(false)}
                    variant="outline"
                    size="medium"
                    style={{ flex: 1 }}
                  />
                  <Button
                    title="Confirmer"
                    onPress={handleChangePassword}
                    variant="primary"
                    size="medium"
                    style={{ flex: 1 }}
                    loading={isLoading}
                  />
                </View>
              </Card.Body>
            )}
          </Card>
        </View>

        {/* Authentication Methods */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textMuted }]}>
            Méthodes d'authentification
          </Text>
          <Card>
            <View style={[styles.menuItem, { borderBottomColor: theme.colors.outline }]}>
              <Text style={styles.menuIcon}>🔐</Text>
              <View style={styles.menuLabelContainer}>
                <Text style={[styles.menuLabel, { color: theme.colors.text }]}>
                  Face ID / Touch ID
                </Text>
                <Text style={[styles.menuDescription, { color: theme.colors.textMuted }]}>
                  Utilise la biométrie pour te connecter
                </Text>
              </View>
              <Switch
                value={biometricEnabled}
                onValueChange={toggleBiometric}
                trackColor={{ false: '#767577', true: theme.colors.primary }}
                thumbColor="#fff"
              />
            </View>
            <View style={styles.menuItem}>
              <Text style={styles.menuIcon}>📱</Text>
              <View style={styles.menuLabelContainer}>
                <Text style={[styles.menuLabel, { color: theme.colors.text }]}>
                  Authentification à deux facteurs
                </Text>
                <Text style={[styles.menuDescription, { color: theme.colors.textMuted }]}>
                  Ajoute une couche de sécurité
                </Text>
              </View>
              <Switch
                value={twoFactorEnabled}
                onValueChange={toggleTwoFactor}
                trackColor={{ false: '#767577', true: theme.colors.primary }}
                thumbColor="#fff"
              />
            </View>
          </Card>
        </View>

        {/* Sessions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textMuted }]}>
            Sessions actives
          </Text>
          <Card>
            <Card.Body>
              <View style={styles.sessionItem}>
                <View style={styles.sessionIcon}>
                  <Text style={styles.sessionEmoji}>📱</Text>
                </View>
                <View style={styles.sessionInfo}>
                  <Text style={[styles.sessionDevice, { color: theme.colors.text }]}>
                    iPhone 15 Pro • Paris
                  </Text>
                  <Text style={[styles.sessionTime, { color: theme.colors.success }]}>
                    Session actuelle
                  </Text>
                </View>
              </View>
            </Card.Body>
          </Card>
          <Button
            title="Déconnecter toutes les autres sessions"
            onPress={() => toast.success('Autres sessions déconnectées')}
            variant="outline"
            size="medium"
            fullWidth
            style={styles.logoutAllButton}
          />
        </View>

        {/* Security Tips */}
        <Card style={styles.tipsCard}>
          <Card.Body style={styles.tipsContent}>
            <Text style={styles.tipsEmoji}>💡</Text>
            <View style={styles.tipsText}>
              <Text style={[styles.tipsTitle, { color: theme.colors.text }]}>
                Conseils de sécurité
              </Text>
              <Text style={[styles.tipsDescription, { color: theme.colors.textMuted }]}>
                • Utilise un mot de passe unique{'\n'}
                • Active l'authentification à deux facteurs{'\n'}
                • Ne partage jamais tes identifiants
              </Text>
            </View>
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
  section: {
    marginBottom: SPACING.l,
    paddingHorizontal: SPACING.m,
  },
  sectionTitle: {
    ...TYPOGRAPHY.caption,
    textTransform: 'uppercase',
    marginBottom: SPACING.s,
    marginLeft: SPACING.s,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.m,
    paddingHorizontal: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  menuIcon: {
    fontSize: 20,
    marginRight: SPACING.m,
  },
  menuLabelContainer: {
    flex: 1,
  },
  menuLabel: {
    ...TYPOGRAPHY.body,
  },
  menuDescription: {
    ...TYPOGRAPHY.caption,
  },
  passwordActions: {
    flexDirection: 'row',
    gap: SPACING.m,
    marginTop: SPACING.m,
  },
  sessionItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(132, 94, 247, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.m,
  },
  sessionEmoji: {
    fontSize: 20,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionDevice: {
    ...TYPOGRAPHY.body,
    fontWeight: '500',
  },
  sessionTime: {
    ...TYPOGRAPHY.caption,
  },
  logoutAllButton: {
    marginTop: SPACING.m,
  },
  tipsCard: {
    marginHorizontal: SPACING.m,
  },
  tipsContent: {
    flexDirection: 'row',
  },
  tipsEmoji: {
    fontSize: 28,
    marginRight: SPACING.m,
  },
  tipsText: {
    flex: 1,
  },
  tipsTitle: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  tipsDescription: {
    ...TYPOGRAPHY.caption,
    lineHeight: 20,
  },
});
