import PageLayout from './PageLayout';

export default function AboutUs() {
  return (
    <PageLayout title="About Us" subtitle="Our Vision">
      <div className="grid md:grid-cols-2 gap-12 text-lg text-white/70 leading-relaxed">
        <p>Prish Infotech is a collective of creators, engineers, and designers dedicated to pushing the boundaries of digital experiences. We believe in "Beyond Code"—where functionality meets art.</p>
        <p>Based in Malegaon, we serve global clients by building scalable infrastructure and immersive interfaces that define the next generation of the web.</p>
      </div>
    </PageLayout>
  );
}