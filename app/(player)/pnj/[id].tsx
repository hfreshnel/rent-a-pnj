import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  MessageCircle,
  Shield,
  ChevronRight,
} from 'lucide-react-native';
import { colors, spacing, textStyles, borderRadius, classNames, classEmojis } from '@/theme';
import { Button, Avatar, Badge, LoadingState, ErrorState } from '@/components/ui';
import { usePNJProfile } from '@/hooks';

const { width } = Dimensions.get('window');

export default function PNJDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: pnj, isLoading, error } = usePNJProfile(id);

  if (isLoading) {
    return <LoadingState fullScreen message="Chargement du profil..." />;
  }

  if (error || !pnj) {
    return (
      <ErrorState
        title="Profil introuvable"
        message="Ce PNJ n'existe pas ou a été désactivé"
        onRetry={() => router.back()}
        retryLabel="Retour"
      />
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View style={styles.headerImage}>
          <Image
            source={{ uri: pnj.avatar || 'https://via.placeholder.com/400' }}
            style={styles.coverImage}
            contentFit="cover"
          />
          <SafeAreaView style={styles.headerOverlay}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <ArrowLeft size={24} color={colors.white} />
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.nameRow}>
            <View>
              <Text style={styles.name}>{pnj.displayName}</Text>
              <View style={styles.classRow}>
                <Text style={styles.classEmoji}>{classEmojis[pnj.class]}</Text>
                <Text style={styles.className}>
                  {classNames[pnj.class]}
                  {pnj.secondaryClass && ` / ${classNames[pnj.secondaryClass]}`}
                </Text>
              </View>
            </View>
            {pnj.verified && (
              <View style={styles.verifiedBadge}>
                <Shield size={16} color={colors.success} />
                <Text style={styles.verifiedText}>Vérifié</Text>
              </View>
            )}
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Star size={18} color={colors.warning} fill={colors.warning} />
              <Text style={styles.statValue}>{pnj.rating.toFixed(1)}</Text>
              <Text style={styles.statLabel}>({pnj.reviewCount} avis)</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <MapPin size={18} color={colors.text.secondary} />
              <Text style={styles.statValue}>{pnj.city}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Clock size={18} color={colors.text.secondary} />
              <Text style={styles.statValue}>{pnj.responseTime || '<1'}h</Text>
              <Text style={styles.statLabel}>réponse</Text>
            </View>
          </View>

          {/* Bio */}
          <View style={styles.bioSection}>
            <Text style={styles.sectionTitle}>À propos</Text>
            <Text style={styles.bio}>{pnj.bio}</Text>
          </View>

          {/* Activities */}
          <View style={styles.activitiesSection}>
            <Text style={styles.sectionTitle}>Activités proposées</Text>
            <View style={styles.activitiesGrid}>
              {pnj.activities.slice(0, 6).map((activity) => (
                <Badge key={activity} label={activity} variant="neutral" size="md" />
              ))}
              {pnj.activities.length > 6 && (
                <Badge label={`+${pnj.activities.length - 6}`} variant="primary" size="md" />
              )}
            </View>
          </View>

          {/* Languages */}
          {pnj.languages && pnj.languages.length > 0 && (
            <View style={styles.languagesSection}>
              <Text style={styles.sectionTitle}>Langues</Text>
              <View style={styles.languagesRow}>
                {pnj.languages.map((lang) => (
                  <Badge key={lang} label={lang.toUpperCase()} variant="neutral" size="sm" />
                ))}
              </View>
            </View>
          )}

          {/* Reviews Preview */}
          <TouchableOpacity style={styles.reviewsSection}>
            <View style={styles.reviewsHeader}>
              <Text style={styles.sectionTitle}>Avis</Text>
              <ChevronRight size={20} color={colors.text.secondary} />
            </View>
            <View style={styles.reviewPreview}>
              <Star size={16} color={colors.warning} fill={colors.warning} />
              <Text style={styles.reviewScore}>{pnj.rating.toFixed(1)}</Text>
              <Text style={styles.reviewCount}>
                basé sur {pnj.reviewCount} avis
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <SafeAreaView edges={['bottom']} style={styles.bottomAction}>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{pnj.hourlyRate}€</Text>
          <Text style={styles.priceUnit}>/heure</Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.messageButton}>
            <MessageCircle size={24} color={colors.primary[400]} />
          </TouchableOpacity>
          <Button
            title="Réserver"
            onPress={() => router.push(`/(player)/book/${pnj.id}`)}
            variant="primary"
            size="lg"
            style={styles.bookButton}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  headerImage: {
    width: width,
    height: width * 0.8,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.lg,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileSection: {
    padding: spacing.lg,
    marginTop: -spacing.xl,
    backgroundColor: colors.bg.primary,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  name: {
    ...textStyles.h2,
    color: colors.white,
  },
  classRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  classEmoji: {
    fontSize: 18,
  },
  className: {
    ...textStyles.body,
    color: colors.text.secondary,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success + '20',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  verifiedText: {
    ...textStyles.caption,
    color: colors.success,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.bg.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statValue: {
    ...textStyles.bodySemiBold,
    color: colors.white,
  },
  statLabel: {
    ...textStyles.caption,
    color: colors.text.tertiary,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.bg.tertiary,
  },
  bioSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...textStyles.bodySemiBold,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  bio: {
    ...textStyles.body,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  activitiesSection: {
    marginBottom: spacing.lg,
  },
  activitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  languagesSection: {
    marginBottom: spacing.lg,
  },
  languagesRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  reviewsSection: {
    backgroundColor: colors.bg.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  reviewPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  reviewScore: {
    ...textStyles.h4,
    color: colors.white,
  },
  reviewCount: {
    ...textStyles.bodySmall,
    color: colors.text.secondary,
  },
  bottomAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.bg.secondary,
    borderTopWidth: 1,
    borderTopColor: colors.bg.tertiary,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    ...textStyles.h2,
    color: colors.white,
  },
  priceUnit: {
    ...textStyles.body,
    color: colors.text.secondary,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  messageButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary[500] + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookButton: {
    minWidth: 140,
  },
});
