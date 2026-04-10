export function Nav() {
  return (
    <div
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
      <div style={{ width: 114, height: 34 }} />
    </div>
  );
}
