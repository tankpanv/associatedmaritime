import { cookies } from 'next/headers';
import HomeContent from './HomeContent';
import { titleFor } from './lib/meta';

export async function generateMetadata() {
  return titleFor('home', await cookies());
}

export default function Page() {
  return <HomeContent />;
}
