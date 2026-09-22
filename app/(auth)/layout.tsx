export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='min-h-screen bg-amber-50 dark:bg-slate-950'>{children}</div>
  );
}
