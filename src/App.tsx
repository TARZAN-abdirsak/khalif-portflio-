import { About } from './components/About';
import { Approach } from './components/Approach';
import { ChatWidget } from './components/ChatWidget';
import { Cursor } from './components/Cursor';
import { Engagements } from './components/Engagements';
import { Expertise } from './components/Expertise';
import { Feedback } from './components/Feedback';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { Marquee } from './components/Marquee';
import { TopBar } from './components/TopBar';

export default function App() {
  return (
    <>
      <Cursor />
      <TopBar />

      <main>
        <Hero />
        <Marquee />
        <About />
        <Expertise />
        <Approach />
        <Engagements />
        <Feedback />
      </main>

      <Footer />
      <ChatWidget />
    </>
  );
}
