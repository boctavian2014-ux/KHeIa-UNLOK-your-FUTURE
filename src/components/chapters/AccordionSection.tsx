import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@/theme';

type AccordionSectionProps = {
  title: string;
  content: string;
};

export const AccordionSection = ({ title, content }: AccordionSectionProps) => {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.container}>
      <Pressable onPress={() => setOpen((prev) => !prev)}>
        <Text style={styles.title}>{title}</Text>
      </Pressable>
      {open ? <Text style={styles.content}>{content}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.sm,
  },
  title: {
    color: colors.light.text,
    fontWeight: '600',
  },
  content: {
    marginTop: spacing.xs,
    color: colors.light.muted,
  },
});
