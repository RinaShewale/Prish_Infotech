import PageLayout from './PageLayout';

export default function TermsCondition() {
  return (
    <PageLayout title="Terms & Conditions" subtitle="Agreement">
      <div className="space-y-8 text-white/60">
        <p>By using our services, you agree to the following terms. Prish Infotech reserves the right to modify these terms at any time.</p>
        <ul className="list-disc pl-5 space-y-4">
          <li>All code delivered is subject to the agreed-upon license.</li>
          <li>Users must not attempt to breach our security infrastructure.</li>
          <li>Payment terms are strictly adhered to as per the service contract.</li>
        </ul>
      </div>
    </PageLayout>
  );
}