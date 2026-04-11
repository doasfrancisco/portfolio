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
          className="catafract-main-hero"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: 80,
            paddingBottom: 60,
            paddingInline: 80,
          }}
        >
          <Hero />
        </section>
        <section
          className="catafract-main-body"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "center",
            gap: 32,
            paddingTop: 20,
            paddingBottom: 100,
            paddingInline: 60,
            maxWidth: 1440,
            marginInline: "auto",
            boxSizing: "border-box",
          }}
        >
          <div
            className="catafract-main-terminal-wrap"
            style={{
              flex: "1 1 0",
              minWidth: 0,
              order: 1,
            }}
          >
            <Terminal />
          </div>
          <aside
            className="catafract-main-graph-wrap"
            style={{
              width: 320,
              flexShrink: 0,
              order: 2,
              position: "sticky",
              top: "max(24px, calc(50vh - 280px))",
              alignSelf: "flex-start",
            }}
          >
            <GraphCard />
          </aside>
        </section>
        <Footer />
      </TabProvider>
    </main>
  );
}
