import Link from 'next/link';

export const metadata = {
  title: 'Page not found | Banana Invitation',
  description: 'The page you requested could not be found.',
};

export default function NotFound() {
  return (
    <div>
      <div>
        <h1>404</h1>
        <p>The page you requested could not be found.</p>
        <Link href="/" prefetch={false}>
          Back to home
        </Link>
      </div>
    </div>
  );
}
