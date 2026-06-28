import PageLayout from './PageLayout';

export default function PrivacyPolicy() {
  return (
    <PageLayout title="Privacy Policy" subtitle="Legal">
      <div className="space-y-8 text-white/60">
        <section>
          <h2 className="text-white text-xl uppercase tracking-widest mb-4">Data Collection</h2>
          <p>We collect only the information necessary to provide our services. Your data is encrypted and never sold to third parties.</p>
        </section>
        <section>
          <h2 className="text-white text-xl uppercase tracking-widest mb-4">Cookies</h2>
          <p>We use minimal cookies to enhance site performance and remember your preferences.</p>
        </section>
      </div>
    </PageLayout>
  );
}