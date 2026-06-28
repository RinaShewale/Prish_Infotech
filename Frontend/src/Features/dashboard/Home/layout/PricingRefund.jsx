import PageLayout from './PageLayout';

export default function PricingRefund() {
  return (
    <PageLayout title="Pricing & Refund" subtitle="Transparency">
      <div className="space-y-8 text-white/60">
        <div className="border border-white/10 p-8 rounded-sm bg-white/5">
          <h3 className="text-white text-2xl mb-4">Refund Policy</h3>
          <p>We offer a 7-day satisfaction guarantee. If you are not satisfied with our digital products, a full refund can be requested within one week of purchase.</p>
        </div>
        <p>Pricing for custom services is project-based. Contact our sales team for a detailed quote tailored to your tech stack.</p>
      </div>
    </PageLayout>
  );
}