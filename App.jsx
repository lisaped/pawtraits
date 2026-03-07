import { useState, useRef, useCallback } from "react";

const STYLES = [
  { id: "oil", label: "Oil Painting", emoji: "🎨", desc: "Rich brushstrokes, classic masters", filter: "saturate(1.4) contrast(1.1) sepia(0.2)", price: 0 },
  { id: "watercolor", label: "Watercolour", emoji: "💧", desc: "Soft washes, dreamy edges", filter: "saturate(0.85) brightness(1.1) contrast(0.9) hue-rotate(5deg)", price: 0 },
  { id: "pencil", label: "Pencil Sketch", emoji: "✏️", desc: "Detailed graphite linework", filter: "grayscale(1) contrast(1.5) brightness(1.1)", price: 0 },
  { id: "popArt", label: "Pop Art", emoji: "🌈", desc: "Bold colours, Warhol-inspired", filter: "saturate(3) contrast(1.4) brightness(1.05)", price: 5 },
  { id: "renaissance", label: "Renaissance", emoji: "🏛️", desc: "Golden-era portrait mastery", filter: "sepia(0.5) contrast(1.2) saturate(0.9) brightness(0.95)", price: 5 },
  { id: "impressionist", label: "Impressionist", emoji: "🌸", desc: "Monet's light & atmosphere", filter: "blur(0.5px) saturate(1.3) brightness(1.1) hue-rotate(-10deg)", price: 0 },
];

const SIZES = [
  { id: "s8x10", label: '8"×10"', price: 29 },
  { id: "s11x14", label: '11"×14"', price: 49 },
  { id: "s16x20", label: '16"×20"', price: 79 },
  { id: "s20x24", label: '20"×24"', price: 109 },
  { id: "s24x30", label: '24"×30"', price: 149 },
];

const FRAMES = [
  { id: "none", label: "No Frame", price: 0, color: "transparent", border: "#ccc" },
  { id: "white", label: "White Float", price: 35, color: "#f5f5f0", border: "#ddd" },
  { id: "black", label: "Matte Black", price: 35, color: "#1a1a1a", border: "#111" },
  { id: "walnut", label: "Walnut Wood", price: 55, color: "#5c3d2e", border: "#3d2517" },
  { id: "gold", label: "Antique Gold", price: 65, color: "#b8860b", border: "#8b6914" },
  { id: "silver", label: "Brushed Silver", price: 55, color: "#9e9e9e", border: "#707070" },
];

const MOUNTS = [
  { id: "none", label: "Print Only", price: 0 },
  { id: "foam", label: "Foam Mount", price: 15 },
  { id: "canvas", label: "Canvas Wrap", price: 45 },
  { id: "acrylic", label: "Acrylic Face Mount", price: 75 },
];

export default function PetPortraitStudio() {
  const [photo, setPhoto] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0]);
  const [selectedSize, setSelectedSize] = useState(SIZES[1]);
  const [selectedFrame, setSelectedFrame] = useState(FRAMES[0]);
  const [selectedMount, setSelectedMount] = useState(MOUNTS[0]);
  const [step, setStep] = useState("upload"); // upload | design | order | confirm
  const [petName, setPetName] = useState("");
  const [aiDescription, setAiDescription] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const fileRef = useRef();

  const total = (selectedSize.price + selectedStyle.price + selectedFrame.price + selectedMount.price) * quantity;

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setPhoto(file);
    const url = URL.createObjectURL(file);
    setPhotoUrl(url);
    setStep("design");
    generateAiDescription(file);
  };

  const generateAiDescription = async (file) => {
    setLoadingAi(true);
    try {
      const base64 = await new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result.split(",")[1]);
        r.onerror = rej;
        r.readAsDataURL(file);
      });

      const resp = await fetch("/api/describe-pet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64, mediaType: file.type }),
      });
      const data = await resp.json();
      setAiDescription(data.description || "");
    } catch (e) {
      setAiDescription("A beloved companion, full of character and charm — ready to be immortalised in fine art.");
    }
    setLoadingAi(false);
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, []);

  const frameThickness = selectedFrame.id === "none" ? "0px" : "18px";
  const mountStyle = selectedMount.id === "canvas" ? "8px" : "0px";

  return (
    <div style={{
      minHeight: "100vh",
      background: "#faf8f4",
      fontFamily: "'Georgia', 'Times New Roman', serif",
      color: "#2c2416",
    }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Lato:wght@300;400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #faf8f4; }

        .playfair { font-family: 'Playfair Display', Georgia, serif; }
        .lato { font-family: 'Lato', sans-serif; }

        .card {
          background: #fff;
          border: 1px solid #e8e0d4;
          border-radius: 4px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.06);
        }

        .style-pill {
          cursor: pointer;
          border: 2px solid #e0d8cc;
          border-radius: 4px;
          padding: 10px 14px;
          background: #fff;
          transition: all 0.2s;
          text-align: center;
        }
        .style-pill:hover { border-color: #8b6914; background: #fdf9f0; }
        .style-pill.active { border-color: #b8860b; background: #fdf6e3; }

        .option-btn {
          cursor: pointer;
          border: 2px solid #e0d8cc;
          border-radius: 4px;
          padding: 8px 14px;
          background: #fff;
          transition: all 0.2s;
          font-family: 'Lato', sans-serif;
          font-size: 13px;
          white-space: nowrap;
        }
        .option-btn:hover { border-color: #8b6914; }
        .option-btn.active { border-color: #b8860b; background: #fdf6e3; color: #7a5c00; font-weight: 700; }

        .cta-btn {
          background: #b8860b;
          color: #fff;
          border: none;
          padding: 14px 36px;
          font-family: 'Lato', sans-serif;
          font-size: 14px;
          letter-spacing: 2px;
          text-transform: uppercase;
          cursor: pointer;
          border-radius: 2px;
          transition: background 0.2s;
          font-weight: 700;
        }
        .cta-btn:hover { background: #9a6f09; }

        .drop-zone {
          border: 2px dashed #c8b89a;
          border-radius: 8px;
          padding: 60px 40px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          background: #fdf9f4;
        }
        .drop-zone:hover, .drop-zone.dragging { border-color: #b8860b; background: #fdf6e3; }

        .frame-swatch {
          width: 28px; height: 28px;
          border-radius: 3px;
          cursor: pointer;
          border: 2px solid transparent;
          transition: transform 0.15s;
          flex-shrink: 0;
        }
        .frame-swatch:hover { transform: scale(1.15); }
        .frame-swatch.active { border-color: #b8860b; transform: scale(1.15); }

        .step-dot {
          width: 10px; height: 10px;
          border-radius: 50%;
          background: #ddd;
          transition: background 0.3s;
        }
        .step-dot.active { background: #b8860b; }
        .step-dot.done { background: #8b6914; }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.5s ease forwards; }

        @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.5 } }
        .pulse { animation: pulse 1.5s infinite; }

        .divider { border: none; border-top: 1px solid #e8e0d4; margin: 20px 0; }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: #c8b89a; border-radius: 3px; }
      `}</style>

      {/* Header */}
      <header style={{
        borderBottom: "1px solid #e0d8cc",
        background: "#fff",
        padding: "18px 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 28 }}>🐾</div>
          <div>
            <div className="playfair" style={{ fontSize: 22, fontWeight: 700, letterSpacing: "0.02em", lineHeight: 1.1 }}>
              Pawtraits
            </div>
            <div className="lato" style={{ fontSize: 10, letterSpacing: "3px", color: "#9a7a50", textTransform: "uppercase" }}>
              Fine Art Pet Portraits
            </div>
          </div>
        </div>
        {step !== "upload" && (
          <div className="lato" style={{ fontSize: 13, color: "#9a7a50", display: "flex", gap: 20, alignItems: "center" }}>
            {["design", "order", "confirm"].map((s, i) => (
              <span key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span className={`step-dot ${step === s ? "active" : (["design","order","confirm"].indexOf(step) > i ? "done" : "")}`} />
                <span style={{ textTransform: "capitalize" }}>{s === "design" ? "Style" : s === "order" ? "Options" : "Complete"}</span>
              </span>
            ))}
          </div>
        )}
        <div className="lato" style={{ fontSize: 12, color: "#c8a060", letterSpacing: "1px" }}>
          ✦ Free shipping over $99 ✦
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>

        {/* UPLOAD STEP */}
        {step === "upload" && (
          <div className="fade-in" style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
            <p className="lato" style={{ fontSize: 11, letterSpacing: "4px", color: "#b8860b", textTransform: "uppercase", marginBottom: 12 }}>
              Step 1 of 3
            </p>
            <h1 className="playfair" style={{ fontSize: 48, fontWeight: 700, lineHeight: 1.15, marginBottom: 16 }}>
              Your pet, <em>immortalised</em><br />in fine art.
            </h1>
            <p className="lato" style={{ fontSize: 15, color: "#7a6a50", lineHeight: 1.7, marginBottom: 48 }}>
              Upload a clear photo of your dog or cat. We'll transform it into a museum-quality artwork — printed, mounted, and framed to your specifications.
            </p>

            <div
              className={`drop-zone ${dragging ? "dragging" : ""}`}
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
            >
              <div style={{ fontSize: 56, marginBottom: 16 }}>📸</div>
              <p className="playfair" style={{ fontSize: 20, marginBottom: 8, color: "#5c4a2a" }}>
                Drop your photo here
              </p>
              <p className="lato" style={{ fontSize: 13, color: "#9a8a6a" }}>
                or click to browse — JPG, PNG, WEBP accepted
              </p>
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />

            <div style={{ marginTop: 48, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
              {[
                { icon: "🖼️", title: "Museum Quality", desc: "Giclée printing on acid-free archival paper" },
                { icon: "🚢", title: "Ships Worldwide", desc: "Carefully packed in custom art tubes or flat boxes" },
                { icon: "💝", title: "100% Guaranteed", desc: "Love it or we'll reprint it, free of charge" },
              ].map(f => (
                <div key={f.title} style={{ textAlign: "center", padding: "20px 12px" }}>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>{f.icon}</div>
                  <div className="playfair" style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{f.title}</div>
                  <div className="lato" style={{ fontSize: 12, color: "#9a8a6a", lineHeight: 1.5 }}>{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DESIGN STEP */}
        {step === "design" && photoUrl && (
          <div className="fade-in" style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 40, alignItems: "start" }}>
            {/* Left - Preview */}
            <div>
              <p className="lato" style={{ fontSize: 11, letterSpacing: "4px", color: "#b8860b", textTransform: "uppercase", marginBottom: 8 }}>
                Live Preview
              </p>
              <div style={{
                position: "relative",
                display: "inline-block",
                padding: frameThickness,
                background: selectedFrame.color,
                border: selectedFrame.id !== "none" ? `3px solid ${selectedFrame.border}` : "none",
                borderRadius: 2,
                boxShadow: selectedFrame.id !== "none" ? "0 8px 40px rgba(0,0,0,0.25)" : "0 4px 20px rgba(0,0,0,0.1)",
                transition: "all 0.3s",
                maxWidth: "100%",
              }}>
                <img
                  src={photoUrl}
                  alt="Your pet"
                  style={{
                    display: "block",
                    maxWidth: "100%",
                    maxHeight: 440,
                    objectFit: "cover",
                    filter: selectedStyle.filter,
                    transition: "filter 0.5s",
                    margin: mountStyle,
                  }}
                />
              </div>

              {aiDescription && (
                <div className="card fade-in" style={{ marginTop: 24, padding: "20px 24px", borderLeft: "3px solid #b8860b" }}>
                  <p className="playfair" style={{ fontSize: 15, fontStyle: "italic", lineHeight: 1.7, color: "#5c3d2e" }}>
                    "{aiDescription}"
                  </p>
                </div>
              )}
              {loadingAi && (
                <div className="lato pulse" style={{ marginTop: 16, fontSize: 12, color: "#b8860b", letterSpacing: 2 }}>
                  ✦ Analysing your pet...
                </div>
              )}
            </div>

            {/* Right - Controls */}
            <div>
              <h2 className="playfair" style={{ fontSize: 30, fontWeight: 700, marginBottom: 4 }}>
                Choose Your Style
              </h2>
              <p className="lato" style={{ fontSize: 13, color: "#9a7a50", marginBottom: 24 }}>
                Each style is hand-calibrated for pet portraits.
              </p>

              {/* Pet name */}
              <div style={{ marginBottom: 24 }}>
                <label className="lato" style={{ fontSize: 11, letterSpacing: "2px", textTransform: "uppercase", color: "#7a6a50", display: "block", marginBottom: 8 }}>
                  Pet's Name (optional)
                </label>
                <input
                  value={petName}
                  onChange={e => setPetName(e.target.value)}
                  placeholder="e.g. Biscuit, Luna, Milo…"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "1px solid #e0d8cc",
                    borderRadius: 3,
                    fontFamily: "Georgia, serif",
                    fontSize: 14,
                    background: "#fdf9f4",
                    color: "#2c2416",
                    outline: "none",
                  }}
                />
              </div>

              {/* Art Style */}
              <label className="lato" style={{ fontSize: 11, letterSpacing: "2px", textTransform: "uppercase", color: "#7a6a50", display: "block", marginBottom: 12 }}>
                Art Style
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
                {STYLES.map(s => (
                  <div
                    key={s.id}
                    className={`style-pill ${selectedStyle.id === s.id ? "active" : ""}`}
                    onClick={() => setSelectedStyle(s)}
                  >
                    <div style={{ fontSize: 22, marginBottom: 4 }}>{s.emoji}</div>
                    <div className="lato" style={{ fontSize: 13, fontWeight: 700, color: "#2c2416" }}>{s.label}</div>
                    <div className="lato" style={{ fontSize: 11, color: "#9a7a50", marginTop: 2 }}>{s.desc}</div>
                    {s.price > 0 && (
                      <div className="lato" style={{ fontSize: 10, color: "#b8860b", marginTop: 4, letterSpacing: 1 }}>+${s.price}</div>
                    )}
                  </div>
                ))}
              </div>

              <button className="cta-btn" style={{ width: "100%", fontSize: 13 }} onClick={() => setStep("order")}>
                Continue to Options →
              </button>

              <button
                className="lato"
                onClick={() => { setStep("upload"); setPhoto(null); setPhotoUrl(null); setAiDescription(""); }}
                style={{ marginTop: 12, background: "none", border: "none", color: "#9a7a50", fontSize: 12, cursor: "pointer", width: "100%", textAlign: "center" }}
              >
                ← Upload a different photo
              </button>
            </div>
          </div>
        )}

        {/* ORDER STEP */}
        {step === "order" && photoUrl && (
          <div className="fade-in" style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 40, alignItems: "start" }}>
            {/* Left - Options */}
            <div>
              <h2 className="playfair" style={{ fontSize: 30, fontWeight: 700, marginBottom: 4 }}>
                Size, Frame & Finish
              </h2>
              <p className="lato" style={{ fontSize: 13, color: "#9a7a50", marginBottom: 32 }}>
                Craft the perfect piece for your home.
              </p>

              {/* Size */}
              <div style={{ marginBottom: 28 }}>
                <label className="lato" style={{ fontSize: 11, letterSpacing: "2px", textTransform: "uppercase", color: "#7a6a50", display: "block", marginBottom: 12 }}>
                  Print Size
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {SIZES.map(s => (
                    <button key={s.id} className={`option-btn ${selectedSize.id === s.id ? "active" : ""}`} onClick={() => setSelectedSize(s)}>
                      {s.label} — ${s.price}
                    </button>
                  ))}
                </div>
              </div>

              {/* Frame */}
              <div style={{ marginBottom: 28 }}>
                <label className="lato" style={{ fontSize: 11, letterSpacing: "2px", textTransform: "uppercase", color: "#7a6a50", display: "block", marginBottom: 12 }}>
                  Frame
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", marginBottom: 8 }}>
                  {FRAMES.map(f => (
                    <div key={f.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <div
                        className={`frame-swatch ${selectedFrame.id === f.id ? "active" : ""}`}
                        style={{
                          background: f.id === "none" ? "repeating-linear-gradient(45deg, #f0ece4, #f0ece4 4px, #e8e0d4 4px, #e8e0d4 8px)" : f.color,
                          borderColor: f.id === "none" ? "#ccc" : f.border,
                        }}
                        onClick={() => setSelectedFrame(f)}
                      />
                      <span className="lato" style={{ fontSize: 9, color: "#9a7a50", textAlign: "center", maxWidth: 52, lineHeight: 1.2 }}>{f.label}</span>
                    </div>
                  ))}
                </div>
                {selectedFrame.price > 0 && (
                  <p className="lato" style={{ fontSize: 12, color: "#b8860b" }}>
                    {selectedFrame.label} frame +${selectedFrame.price}
                  </p>
                )}
              </div>

              {/* Mount */}
              <div style={{ marginBottom: 28 }}>
                <label className="lato" style={{ fontSize: 11, letterSpacing: "2px", textTransform: "uppercase", color: "#7a6a50", display: "block", marginBottom: 12 }}>
                  Mounting Option
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {MOUNTS.map(m => (
                    <button key={m.id} className={`option-btn ${selectedMount.id === m.id ? "active" : ""}`} onClick={() => setSelectedMount(m)}>
                      {m.label}{m.price > 0 ? ` +$${m.price}` : ""}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div style={{ marginBottom: 28 }}>
                <label className="lato" style={{ fontSize: 11, letterSpacing: "2px", textTransform: "uppercase", color: "#7a6a50", display: "block", marginBottom: 12 }}>
                  Quantity
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {[1,2,3,4,5].map(q => (
                    <button key={q} className={`option-btn ${quantity === q ? "active" : ""}`} style={{ minWidth: 44 }} onClick={() => setQuantity(q)}>
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right - Summary */}
            <div style={{ position: "sticky", top: 90 }}>
              <div className="card" style={{ padding: "28px 24px" }}>
                <p className="lato" style={{ fontSize: 11, letterSpacing: "3px", textTransform: "uppercase", color: "#b8860b", marginBottom: 16 }}>
                  Order Summary
                </p>

                {/* Mini preview */}
                <div style={{
                  padding: selectedFrame.id !== "none" ? "12px" : "0",
                  background: selectedFrame.color,
                  border: selectedFrame.id !== "none" ? `2px solid ${selectedFrame.border}` : "none",
                  borderRadius: 2,
                  marginBottom: 20,
                  boxShadow: selectedFrame.id !== "none" ? "0 4px 16px rgba(0,0,0,0.2)" : "none",
                }}>
                  <img src={photoUrl} alt="preview" style={{
                    width: "100%", height: 180, objectFit: "cover",
                    filter: selectedStyle.filter, transition: "filter 0.4s", display: "block",
                  }} />
                </div>

                <div className="lato" style={{ fontSize: 13, display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    ["Style", selectedStyle.label, selectedStyle.price > 0 ? `+$${selectedStyle.price}` : "Included"],
                    ["Size", selectedSize.label, `$${selectedSize.price}`],
                    ["Frame", selectedFrame.label, selectedFrame.price > 0 ? `+$${selectedFrame.price}` : "Included"],
                    ["Mount", selectedMount.label, selectedMount.price > 0 ? `+$${selectedMount.price}` : "Included"],
                    ["Qty", `×${quantity}`, ""],
                  ].map(([k, v, p]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "#9a7a50" }}>{k}</span>
                      <span style={{ fontWeight: 600, color: "#2c2416" }}>{v} <span style={{ color: "#b8860b" }}>{p}</span></span>
                    </div>
                  ))}
                </div>

                <hr className="divider" />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 }}>
                  <span className="playfair" style={{ fontSize: 18, fontWeight: 600 }}>Total</span>
                  <span className="playfair" style={{ fontSize: 32, fontWeight: 700, color: "#b8860b" }}>${total}</span>
                </div>

                <button className="cta-btn" style={{ width: "100%" }} onClick={() => { setStep("confirm"); setOrderPlaced(true); }}>
                  Place Order
                </button>

                <p className="lato" style={{ fontSize: 11, color: "#9a8a6a", textAlign: "center", marginTop: 12, lineHeight: 1.5 }}>
                  🔒 Secure checkout · Printed within 2–3 business days
                </p>
              </div>

              <button
                className="lato"
                onClick={() => setStep("design")}
                style={{ marginTop: 12, background: "none", border: "none", color: "#9a7a50", fontSize: 12, cursor: "pointer", width: "100%", textAlign: "center" }}
              >
                ← Back to style selection
              </button>
            </div>
          </div>
        )}

        {/* CONFIRM STEP */}
        {step === "confirm" && (
          <div className="fade-in" style={{ maxWidth: 580, margin: "0 auto", textAlign: "center" }}>
            <div style={{ fontSize: 64, marginBottom: 24 }}>🎉</div>
            <h2 className="playfair" style={{ fontSize: 42, fontWeight: 700, marginBottom: 16 }}>
              Order Received!
            </h2>
            {petName && (
              <p className="playfair" style={{ fontSize: 20, fontStyle: "italic", color: "#b8860b", marginBottom: 16 }}>
                {petName}'s portrait is in good hands.
              </p>
            )}
            <p className="lato" style={{ fontSize: 15, color: "#7a6a50", lineHeight: 1.8, marginBottom: 40 }}>
              Your {selectedStyle.label.toLowerCase()} portrait ({selectedSize.label}) will be expertly printed and shipped to you within 5–7 business days. A confirmation email with tracking will be sent shortly.
            </p>

            <div className="card" style={{ padding: "28px 32px", marginBottom: 32, textAlign: "left" }}>
              <p className="lato" style={{ fontSize: 11, letterSpacing: "3px", textTransform: "uppercase", color: "#b8860b", marginBottom: 16 }}>
                What Happens Next
              </p>
              {[
                ["🎨", "Artistic processing", "Our team renders your portrait in your chosen style"],
                ["✅", "Quality review", "Each print is inspected before dispatch"],
                ["📦", "Careful packaging", "Wrapped in tissue and packed to arrive in perfect condition"],
                ["🚀", "Express dispatch", "Shipped with tracking within 3 business days"],
              ].map(([icon, title, desc]) => (
                <div key={title} style={{ display: "flex", gap: 16, marginBottom: 16, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{icon}</span>
                  <div>
                    <div className="lato" style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{title}</div>
                    <div className="lato" style={{ fontSize: 13, color: "#9a7a50" }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button className="cta-btn" onClick={() => {
                setStep("upload"); setPhoto(null); setPhotoUrl(null);
                setAiDescription(""); setPetName(""); setQuantity(1);
                setSelectedStyle(STYLES[0]); setSelectedFrame(FRAMES[0]); setSelectedMount(MOUNTS[0]);
              }}>
                Order Another Portrait
              </button>
            </div>

            <p className="lato" style={{ marginTop: 32, fontSize: 12, color: "#c0a878" }}>
              Questions? Email us at hello@pawtraits.com · We reply within 24 hours
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        marginTop: 80, borderTop: "1px solid #e0d8cc",
        background: "#fff", padding: "24px 40px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div className="playfair" style={{ fontSize: 16, color: "#9a7a50" }}>🐾 Pawtraits</div>
        <div className="lato" style={{ fontSize: 12, color: "#c0a878", letterSpacing: 1 }}>
          ✦ Giclée archival printing · Professional framing · Ships worldwide ✦
        </div>
        <div className="lato" style={{ fontSize: 12, color: "#9a7a50" }}>© 2026 Pawtraits Studio</div>
      </footer>
    </div>
  );
}
