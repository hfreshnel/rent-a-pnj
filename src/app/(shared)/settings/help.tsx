import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../../theme';
import { Screen } from '../../../components/layout/screen';
import { Card, Button, Input } from '../../../components/ui';
import { useToast } from '../../../components/ui/toast';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../../constants/theme';

const FAQ_ITEMS = [
  {
    question: 'Comment réserver un PNJ ?',
    answer:
      'Parcours la liste des PNJ disponibles, choisis celui qui te plaît, sélectionne une activité, une date et une heure, puis confirme ta réservation !',
  },
  {
    question: 'Comment devenir PNJ ?',
    answer:
      'Va dans ton profil et clique sur "Devenir PNJ". Tu devras compléter un formulaire avec tes activités, tarifs et disponibilités.',
  },
  {
    question: 'Comment fonctionne le paiement ?',
    answer:
      "Le paiement est sécurisé par Stripe. L'argent est prélevé lors de la confirmation de la réservation par le PNJ et reversé après la rencontre.",
  },
  {
    question: "Puis-je annuler une réservation ?",
    answer:
      'Oui, tu peux annuler une réservation jusqu\'à 24h avant. Au-delà, des frais d\'annulation peuvent s\'appliquer.',
  },
  {
    question: "Comment ça marche les niveaux et l'XP ?",
    answer:
      'Tu gagnes de l\'XP en complétant des réservations et des missions. Plus tu accumules d\'XP, plus tu montes en niveau et débloques des avantages !',
  },
];

export default function HelpScreen() {
  const theme = useTheme();
  const router = useRouter();
  const toast = useToast();

  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [contactMessage, setContactMessage] = useState('');

  const handleContactSupport = () => {
    if (!contactMessage.trim()) {
      toast.error('Écris un message avant d\'envoyer');
      return;
    }
    toast.success('Message envoyé ! Nous te répondrons rapidement.');
    setContactMessage('');
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
            Centre d'aide
          </Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroEmoji}>❓</Text>
          <Text style={[styles.heroTitle, { color: theme.colors.text }]}>
            Comment pouvons-nous t'aider ?
          </Text>
        </View>

        {/* FAQ */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Questions fréquentes
          </Text>

          {FAQ_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setExpandedFaq(expandedFaq === index ? null : index)}
            >
              <Card style={styles.faqCard}>
                <View style={styles.faqHeader}>
                  <Text style={[styles.faqQuestion, { color: theme.colors.text }]}>
                    {item.question}
                  </Text>
                  <Text style={{ color: theme.colors.primary, fontSize: 16 }}>
                    {expandedFaq === index ? '−' : '+'}
                  </Text>
                </View>
                {expandedFaq === index && (
                  <Text style={[styles.faqAnswer, { color: theme.colors.textMuted }]}>
                    {item.answer}
                  </Text>
                )}
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        {/* Contact */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Contacter le support
          </Text>
          <Card>
            <Card.Body>
              <Text style={[styles.contactDescription, { color: theme.colors.textMuted }]}>
                Tu n'as pas trouvé ta réponse ? Écris-nous et nous te répondrons dans les plus brefs délais.
              </Text>
              <Input
                placeholder="Décris ton problème..."
                value={contactMessage}
                onChangeText={setContactMessage}
                multiline
                numberOfLines={4}
              />
              <Button
                title="Envoyer"
                onPress={handleContactSupport}
                variant="primary"
                size="medium"
                fullWidth
              />
            </Card.Body>
          </Card>
        </View>

        {/* Quick Links */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Liens rapides
          </Text>
          <View style={styles.quickLinks}>
            <QuickLink
              icon="📜"
              title="CGU"
              onPress={() => {}}
              theme={theme}
            />
            <QuickLink
              icon="🔒"
              title="Confidentialité"
              onPress={() => {}}
              theme={theme}
            />
            <QuickLink
              icon="💬"
              title="Discord"
              onPress={() => toast.info('Lien Discord à venir')}
              theme={theme}
            />
            <QuickLink
              icon="📧"
              title="Email"
              onPress={() => toast.info('contact@rentapnj.com')}
              theme={theme}
            />
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const QuickLink = ({
  icon,
  title,
  onPress,
  theme,
}: {
  icon: string;
  title: string;
  onPress: () => void;
  theme: ReturnType<typeof useTheme>;
}) => (
  <TouchableOpacity
    style={[styles.quickLink, { backgroundColor: theme.colors.surface }]}
    onPress={onPress}
  >
    <Text style={styles.quickLinkIcon}>{icon}</Text>
    <Text style={[styles.quickLinkTitle, { color: theme.colors.text }]}>{title}</Text>
  </TouchableOpacity>
);

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
  hero: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  heroEmoji: {
    fontSize: 64,
    marginBottom: SPACING.m,
  },
  heroTitle: {
    ...TYPOGRAPHY.h3,
    textAlign: 'center',
  },
  section: {
    marginBottom: SPACING.l,
    paddingHorizontal: SPACING.m,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h4,
    marginBottom: SPACING.m,
  },
  faqCard: {
    marginBottom: SPACING.s,
    padding: SPACING.m,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    flex: 1,
    marginRight: SPACING.m,
  },
  faqAnswer: {
    ...TYPOGRAPHY.body,
    marginTop: SPACING.m,
    lineHeight: 22,
  },
  contactDescription: {
    ...TYPOGRAPHY.body,
    marginBottom: SPACING.m,
  },
  quickLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.s,
  },
  quickLink: {
    width: '48%',
    padding: SPACING.m,
    borderRadius: BORDER_RADIUS.m,
    alignItems: 'center',
  },
  quickLinkIcon: {
    fontSize: 28,
    marginBottom: SPACING.xs,
  },
  quickLinkTitle: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
  },
});
