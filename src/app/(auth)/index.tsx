import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme';
import { Button } from '../../components/ui';
import { SPACING, TYPOGRAPHY } from '../../constants/theme';

const { height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <View style={styles.logoContainer}>
          <Text style={[styles.logo, { color: theme.colors.primary }]}>🎮</Text>
          <Text style={[styles.appName, { color: theme.colors.text }]}>
            Rent a PNJ
          </Text>
        </View>

        <Text style={[styles.tagline, { color: theme.colors.textSecondary }]}>
          Trouve ton compagnon d'aventure
        </Text>

        <Text style={[styles.description, { color: theme.colors.textMuted }]}>
          Réserve des PNJ pour tes activités. Musées, restaurants, jeux vidéo...
          Ne fais plus jamais rien seul.
        </Text>
      </View>

      {/* Features */}
      <View style={styles.features}>
        <FeatureItem
          emoji="🗡️"
          title="8 classes uniques"
          description="Aventurier, Sage, Barde..."
          theme={theme}
        />
        <FeatureItem
          emoji="🎯"
          title="Missions quotidiennes"
          description="Gagne de l'XP et monte en niveau"
          theme={theme}
        />
        <FeatureItem
          emoji="✨"
          title="Collection de souvenirs"
          description="Garde un souvenir de chaque rencontre"
          theme={theme}
        />
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          title="Créer un compte"
          onPress={() => router.push('/(auth)/register')}
          variant="primary"
          size="large"
          fullWidth
        />
        <Button
          title="Se connecter"
          onPress={() => router.push('/(auth)/login')}
          variant="outline"
          size="large"
          fullWidth
          style={{ marginTop: SPACING.m }}
        />
      </View>

      {/* Footer */}
      <Text style={[styles.footer, { color: theme.colors.textMuted }]}>
        En continuant, tu acceptes nos{' '}
        <Text style={{ color: theme.colors.primary }}>CGU</Text> et notre{' '}
        <Text style={{ color: theme.colors.primary }}>Politique de confidentialité</Text>
      </Text>
    </View>
  );
}

interface FeatureItemProps {
  emoji: string;
  title: string;
  description: string;
  theme: ReturnType<typeof useTheme>;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ emoji, title, description, theme }) => (
  <View style={styles.featureItem}>
    <Text style={styles.featureEmoji}>{emoji}</Text>
    <View style={styles.featureText}>
      <Text style={[styles.featureTitle, { color: theme.colors.text }]}>{title}</Text>
      <Text style={[styles.featureDescription, { color: theme.colors.textMuted }]}>
        {description}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING.l,
    paddingTop: height * 0.1,
    paddingBottom: SPACING.xl,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  logo: {
    fontSize: 48,
    marginRight: SPACING.s,
  },
  appName: {
    ...TYPOGRAPHY.h1,
  },
  tagline: {
    ...TYPOGRAPHY.h3,
    textAlign: 'center',
    marginBottom: SPACING.m,
  },
  description: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
    maxWidth: 300,
  },
  features: {
    flex: 1,
    justifyContent: 'center',
    gap: SPACING.l,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureEmoji: {
    fontSize: 32,
    marginRight: SPACING.m,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    ...TYPOGRAPHY.h4,
  },
  featureDescription: {
    ...TYPOGRAPHY.bodySmall,
  },
  actions: {
    marginTop: SPACING.xl,
  },
  footer: {
    ...TYPOGRAPHY.caption,
    textAlign: 'center',
    marginTop: SPACING.l,
  },
});
