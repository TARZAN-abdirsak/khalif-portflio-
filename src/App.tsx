import { About } from './components/About';
import { Approach } from './components/Approach';
import { ChatWidget } from './components/ChatWidget';
import { Cursor } from './components/Cursor';
import { Engagements } from './components/Engagements';
import { SkillFan } from './components/SkillFan';
import { Feedback } from './components/Feedback';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { Marquee } from './components/Marquee';
import { TopBar } from './components/TopBar';
import { expertise } from './data/expertise';
import { services } from './data/services';

export default function App() {
  return (
    <>
      <Cursor />
      <TopBar />

      <main>
        <Hero />
        <Marquee />
        <About />
        <SkillFan
          id="expertise"
          num="03"
          label="Expertise"
          meta="Where I Work"
          eyebrow="Expertise"
          items={expertise}
        />
        <SkillFan
          id="services"
          num="04"
          label="Services"
          meta="What I Deliver"
          eyebrow="Services"
          items={services}
        />
        <Approach />
        <Engagements />
        <Feedback />
      </main>

      <Footer />
      <ChatWidget />
    </>
  );
}
