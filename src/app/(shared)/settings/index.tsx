import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../../theme';
import { Screen } from '../../../components/layout/screen';
import { Card } from '../../../components/ui';
import { useUIStore } from '../../../stores/uiStore';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../../constants/theme';

export default function SettingsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { themeMode, setThemeMode } = useUIStore();

  const isDarkMode = themeMode === 'dark';

  const toggleDarkMode = () => {
    setThemeMode(isDarkMode ? 'light' : 'dark');
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
            Paramètres
          </Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Account */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textMuted }]}>
            Compte
          </Text>
          <Card>
            <TouchableOpacity onPress={() => router.push('/(shared)/settings/account')}>
              <View style={[styles.menuItem, { borderBottomColor: theme.colors.outline }]}>
                <Text style={styles.menuIcon}>👤</Text>
                <Text style={[styles.menuLabel, { color: theme.colors.text }]}>
                  Informations personnelles
                </Text>
                <Text style={{ color: theme.colors.textMuted }}>›</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/(shared)/settings/security')}>
              <View style={[styles.menuItem, { borderBottomColor: theme.colors.outline }]}>
                <Text style={styles.menuIcon}>🔐</Text>
                <Text style={[styles.menuLabel, { color: theme.colors.text }]}>
                  Mot de passe et sécurité
                </Text>
                <Text style={{ color: theme.colors.textMuted }}>›</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/(shared)/settings/notifications')}>
              <View style={styles.menuItem}>
                <Text style={styles.menuIcon}>🔔</Text>
                <Text style={[styles.menuLabel, { color: theme.colors.text }]}>
                  Notifications
                </Text>
                <Text style={{ color: theme.colors.textMuted }}>›</Text>
              </View>
            </TouchableOpacity>
          </Card>
        </View>

        {/* Appearance */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textMuted }]}>
            Apparence
          </Text>
          <Card>
            <View style={styles.menuItem}>
              <Text style={styles.menuIcon}>🌙</Text>
              <Text style={[styles.menuLabel, { color: theme.colors.text }]}>
                Mode sombre
              </Text>
              <Switch
                value={isDarkMode}
                onValueChange={toggleDarkMode}
                trackColor={{ false: '#767577', true: theme.colors.primary }}
                thumbColor="#fff"
              />
            </View>
          </Card>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textMuted }]}>
            Support
          </Text>
          <Card>
            <TouchableOpacity onPress={() => router.push('/(shared)/settings/help')}>
              <View style={[styles.menuItem, { borderBottomColor: theme.colors.outline }]}>
                <Text style={styles.menuIcon}>❓</Text>
                <Text style={[styles.menuLabel, { color: theme.colors.text }]}>
                  Centre d'aide
                </Text>
                <Text style={{ color: theme.colors.textMuted }}>›</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={[styles.menuItem, { borderBottomColor: theme.colors.outline }]}>
                <Text style={styles.menuIcon}>📝</Text>
                <Text style={[styles.menuLabel, { color: theme.colors.text }]}>
                  Signaler un problème
                </Text>
                <Text style={{ color: theme.colors.textMuted }}>›</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={styles.menuItem}>
                <Text style={styles.menuIcon}>⭐</Text>
                <Text style={[styles.menuLabel, { color: theme.colors.text }]}>
                  Noter l'application
                </Text>
                <Text style={{ color: theme.colors.textMuted }}>›</Text>
              </View>
            </TouchableOpacity>
          </Card>
        </View>

        {/* Legal */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textMuted }]}>
            Légal
          </Text>
          <Card>
            <TouchableOpacity>
              <View style={[styles.menuItem, { borderBottomColor: theme.colors.outline }]}>
                <Text style={styles.menuIcon}>📜</Text>
                <Text style={[styles.menuLabel, { color: theme.colors.text }]}>
                  Conditions générales
                </Text>
                <Text style={{ color: theme.colors.textMuted }}>›</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={[styles.menuItem, { borderBottomColor: theme.colors.outline }]}>
                <Text style={styles.menuIcon}>🔒</Text>
                <Text style={[styles.menuLabel, { color: theme.colors.text }]}>
                  Politique de confidentialité
                </Text>
                <Text style={{ color: theme.colors.textMuted }}>›</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={styles.menuItem}>
                <Text style={styles.menuIcon}>📋</Text>
                <Text style={[styles.menuLabel, { color: theme.colors.text }]}>
                  Licences
                </Text>
                <Text style={{ color: theme.colors.textMuted }}>›</Text>
              </View>
            </TouchableOpacity>
          </Card>
        </View>

        {/* Version */}
        <Text style={[styles.version, { color: theme.colors.textMuted }]}>
          Rent a PNJ v1.0.0
        </Text>
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
    ...TYPOGRAPHY.h3,
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
  menuLabel: {
    ...TYPOGRAPHY.body,
    flex: 1,
  },
  version: {
    ...TYPOGRAPHY.caption,
    textAlign: 'center',
    marginTop: SPACING.l,
  },
});
