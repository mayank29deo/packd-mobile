import { Redirect } from 'expo-router';

// Always redirect to tabs for now; add auth gate here once Supabase session is wired up
export default function Index() {
  return <Redirect href="/(tabs)/feed" />;
}
