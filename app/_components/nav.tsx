export function Nav() {
  return (
    <div
      className="catafract-nav"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingBlock: 24,
        paddingInline: 80,
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <div
        className="catafract-nav-logo"
        style={{
          color: "#FFFFFF",
          fontSize: 20,
          fontStyle: "italic",
          fontWeight: 800,
          letterSpacing: "-0.5px",
          lineHeight: "24px",
        }}
      >
        CATAFRACT.COM
      </div>
      <div
        className="catafract-nav-desktop-spacer"
        style={{ width: 114, height: 34 }}
      />
      <div
        className="catafract-nav-hamburger catafract-mobile-only"
        aria-hidden="true"
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: 32,
          height: 32,
          backgroundColor: "#0A0A0A",
          border: "1px solid #1A1A1A",
          borderRadius: 8,
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <div
            style={{
              width: 14,
              height: 1.5,
              borderRadius: 1,
              backgroundColor: "#888888",
            }}
          />
          <div
            style={{
              width: 14,
              height: 1.5,
              borderRadius: 1,
              backgroundColor: "#888888",
            }}
          />
          <div
            style={{
              width: 14,
              height: 1.5,
              borderRadius: 1,
              backgroundColor: "#888888",
            }}
          />
        </div>
      </div>
    </div>
  );
}
