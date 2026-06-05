import { cookies } from 'next/headers';
import Content from './Content';
import { titleFor } from '../lib/meta';

export async function generateMetadata() {
  return titleFor('careers', await cookies());
}

export default function Page() {
  return <Content />;
}
