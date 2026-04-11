import { Nav } from "./_components/nav";
import { Hero } from "./_components/hero";
import { GraphCard } from "./_components/graph-card";
import { Terminal } from "./_components/terminal";
import { Footer } from "./_components/footer";
import { TabProvider } from "./_components/tab-context";

export default function Page() {
  return (
    <main
      style={{
        backgroundColor: "#000000",
        minHeight: "100vh",
        color: "#FFFFFF",
      }}
    >
      <TabProvider>
        <Nav />
        <section
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 96,
            paddingTop: 80,
            paddingBottom: 140,
            paddingInline: 80,
          }}
        >
          <Hero />
          <GraphCard />
        </section>
        <section
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: 0,
            paddingBottom: 100,
            paddingInline: 80,
          }}
        >
          <Terminal />
        </section>
        <Footer />
      </TabProvider>
    </main>
  );
}
