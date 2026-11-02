import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LibraryProvider, useLibrary } from "./src/lib/LibraryContext";
import { loadOnboarded, saveOnboarded } from "./src/lib/storage";
import { OnboardingScreen } from "./src/screens/OnboardingScreen";
import { FeedScreen } from "./src/screens/FeedScreen";
import { theme } from "./src/lib/theme";

function Root() {
  const { ready, lastIndex } = useLibrary();
  const [onboarded, setOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      setOnboarded(await loadOnboarded());
    })();
  }, []);

  if (!ready || onboarded === null) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={theme.accent} />
      </View>
    );
  }

  if (!onboarded) {
    return (
      <OnboardingScreen
        onDone={() => {
          saveOnboarded();
          setOnboarded(true);
        }}
      />
    );
  }

  return <FeedScreen startIndex={lastIndex} />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <LibraryProvider>
        <Root />
      </LibraryProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: theme.bg,
    alignItems: "center",
    justifyContent: "center",
  },
});
