import { useState } from "react";

const VERDE = "#00C853";
const GRIS = "#1A1A1A";
const GRIS2 = "#252525";
const GRIS3 = "#333";
const TEXTO = "#F0F0F0";
const TEXTO2 = "#888";

export default function MisPicks({ usuario, partidos, pronosticosIniciales = [], onGuardar }) {
  const [picks, setPicks] = useState(() => {
    const init = {};
    pronosticosIniciales.forEach(p => {
      init[`${p.partidoId}-l`] = String(p.gL);
      init[`${p.partidoId}-v`] = String(p.gV);
    });
    return init;
  });
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState(false);

  const pendientes = partidos.filter(p => p.status === "pendiente");
  const llenados = pendientes.filter(p =>
    picks[`${p.id}-l`] !== undefined && picks[`${p.id}-v`] !== undefined &&
    picks[`${p.id}-l`] !== "" && picks[`${p.id}-v`] !== ""
  ).length;

  const handleGuardar = () => {
    const data = pendientes.map(p => ({
      usuarioId: usuario?.id || "demo",
      partidoId: p.id,
      gL: parseInt(picks[`${p.id}-l`]) || 0,
      gV: parseInt(picks[`${p.id}-v`]) || 0,
      fecha: new Date().toISOString(),
    }));
    onGuardar && onGuardar(data);
    setSaved(true);
    setToast(true);
    setTimeout(() => setToast(false), 2500);
    setTimeout(() => setSaved(false), 3000);
  };

  const grupos = [...new Set(pendientes.map(p => p.grupo))];

  return (
    <div style={{ padding:"1.5rem", maxWidth:800, margin:"0 auto" }}>
      <div style={{ position:"fixed", bottom:"2rem", right:"2rem", background:VERDE, color:"#000", padding:"12px 20px", borderRadius:8, fontWeight:800, fontSize:"0.85rem", zIndex:999, transform: toast ? "translateY(0)" : "translateY(100px)", opacity: toast ? 1 : 0, transition:"all 0.3s" }}>
        ✅ Pronósticos guardados
      </div>

      <div style={{ background:"rgba(0,200,83,0.07)", border:"1px solid rgba(0,200,83,0.2)", borderRadius:10, padding:16, marginBottom:"1.5rem", display:"flex", alignItems:"center", gap:14 }}>
        <span style={{ fontSize:"2.2rem" }}>🔐</span>
        <div>
          <div style={{ fontWeight:700, marginBottom:3 }}>Tus pronósticos · {usuario?.nombre || "Demo"}</div>
          <div style={{ fontSize:"0.78rem", color:TEXTO2, lineHeight:1.5 }}>
            Este formulario es privado. Solo tú puedes ver y editar tus picks.<br/>
            Puedes modificar hasta 1 hora antes de cada partido.
          </div>
        </div>
      </div>

      <div style={{ background:GRIS, border:`1px solid ${GRIS3}`, borderRadius:10, padding:16, marginBottom:"1.5rem" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontSize:"0.85rem", fontWeight:600 }}>Progreso de llenado</span>
          <span style={{ fontWeight:900, fontSize:"1.1rem", color:VERDE }}>{llenados}/{pendientes.length} <span style={{ fontSize:"0.65rem", fontFamily:"monospace", color:TEXTO2 }}>partidos</span></span>
        </div>
        <div style={{ background:GRIS2, borderRadius:4, height:6, marginTop:6, overflow:"hidden" }}>
          <div style={{ height:"100%", borderRadius:4, background:`linear-gradient(90deg,${VERDE},#00E090)`, width:`${pendientes.length ? (llenados/pendientes.length)*100 : 0}%`, transition:"width 0.5s" }} />
        </div>
        <p style={{ fontSize:"0.72rem", color:TEXTO2, marginTop:8 }}>⚡ Los partidos ya jugados no se pueden modificar</p>
      </div>

      {partidos.filter(p => p.status === "jugado").length > 0 && (
        <div style={{ marginBottom:"1.5rem" }}>
          <div style={{ fontWeight:700, fontSize:"0.85rem", color:TEXTO2, textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>
            Partidos ya jugados
          </div>
          {partidos.filter(p => p.status === "jugado").map(p => {
            const miL = picks[`${p.id}-l`];
            const miV = picks[`${p.id}-v`];
            const tieneProno = miL !== undefined && miV !== undefined;
            const esExacto = tieneProno && parseInt(miL)===p.gL && parseInt(miV)===p.gV;
            const resReal = Math.sign(p.gL - p.gV);
            const resPron = tieneProno ? Math.sign(parseInt(miL)-parseInt(miV)) : null;
            const acierto = tieneProno && resPron === resReal;
            return (
              <div key={p.id} style={{ display:"grid", gridTemplateColumns:"1fr 50px 30px 50px 1fr 60px", gap:8, alignItems:"center", background:GRIS, border:`1px solid ${GRIS3}`, borderRadius:8, padding:"10px 14px", marginBottom:6, opacity:0.7 }}>
                <div style={{ fontSize:"0.82rem", display:"flex", alignItems:"center", gap:6 }}>{p.flagL} {p.local}</div>
                <div style={{ textAlign:"center", fontWeight:800, fontSize:"1.1rem", color:TEXTO2 }}>{tieneProno ? `${miL}–${miV}` : "—"}</div>
                <div style={{ textAlign:"center", fontSize:"0.65rem", color:TEXTO2 }}>VS</div>
                <div style={{ textAlign:"center", fontWeight:800, fontSize:"1.1rem", color:TEXTO }}>{p.gL}–{p.gV}</div>
                <div style={{ fontSize:"0.82rem", display:"flex", alignItems:"center", justifyContent:"flex-end", gap:6 }}>{p.visitante} {p.flagV}</div>
                <div style={{ textAlign:"center", fontSize:"0.75rem", fontWeight:700 }}>
                  {!tieneProno ? <span style={{ color:TEXTO2 }}>—</span>
                    : esExacto ? <span style={{ color:VERDE }}>⚡ +5</span>
                    : acierto ? <span style={{ color:"#66BB6A" }}>✅ +3</span>
                    : <span style={{ color:"#EF5350" }}>❌ +0</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {grupos.map(grupo => (
        <div key={grupo} style={{ marginBottom:"1.5rem" }}>
          <div style={{ fontWeight:700, fontSize:"0.85rem", color:VERDE, textTransform:"uppercase", letterSpacing:1, marginBottom:10, paddingBottom:8, borderBottom:`1px solid ${GRIS3}` }}>
            Grupo {grupo} — Pendientes
          </div>
          {pendientes.filter(p => p.grupo === grupo).map(p => (
            <div key={p.id} style={{ display:"grid", gridTemplateColumns:"1fr 50px 30px 50px 1fr", gap:8, alignItems:"center", background:GRIS, border:`1px solid ${GRIS3}`, borderRadius:8, padding:"11px 14px", marginBottom:8 }}>
              <div style={{ fontSize:"0.85rem", fontWeight:600, display:"flex", alignItems:"center", gap:6 }}>{p.flagL} {p.local}</div>
              <input type="number" min="0" max="20"
                style={{ width:46, height:40, background:GRIS2, border:`1px solid ${GRIS3}`, borderRadius:6, color:TEXTO, textAlign:"center", fontSize:"1.2rem", fontWeight:800, outline:"none", fontFamily:"inherit" }}
                value={picks[`${p.id}-l`] ?? ""}
                onChange={e => setPicks({ ...picks, [`${p.id}-l`]: e.target.value })}
              />
              <div style={{ textAlign:"center", fontSize:"0.65rem", color:TEXTO2, fontFamily:"monospace" }}>VS</div>
              <input type="number" min="0" max="20"
                style={{ width:46, height:40, background:GRIS2, border:`1px solid ${GRIS3}`, borderRadius:6, color:TEXTO, textAlign:"center", fontSize:"1.2rem", fontWeight:800, outline:"none", fontFamily:"inherit" }}
                value={picks[`${p.id}-v`] ?? ""}
                onChange={e => setPicks({ ...picks, [`${p.id}-v`]: e.target.value })}
              />
              <div style={{ fontSize:"0.85rem", fontWeight:600, display:"flex", alignItems:"center", justifyContent:"flex-end", gap:6 }}>{p.visitante} {p.flagV}</div>
            </div>
          ))}
        </div>
      ))}

      {pendientes.length === 0 && (
        <div style={{ textAlign:"center", padding:"3rem", color:TEXTO2 }}>
          <div style={{ fontSize:"3rem", marginBottom:8 }}>🎉</div>
          <p>¡Todos los partidos han sido jugados!</p>
        </div>
      )}

      {pendientes.length > 0 && (
        <div style={{ display:"flex", alignItems:"center", gap:14, marginTop:"1.5rem" }}>
          {saved
            ? <div style={{ background:GRIS2, color:VERDE, border:`1px solid ${VERDE}`, padding:"13px 28px", borderRadius:8, fontSize:"0.9rem", fontWeight:800 }}>✅ Guardado</div>
            : <button onClick={handleGuardar} style={{ background:VERDE, color:"#000", border:"none", padding:"13px 28px", borderRadius:8, fontSize:"0.9rem", fontWeight:800, cursor:"pointer", fontFamily:"inherit" }}>💾 Guardar pronósticos</button>
          }
          <span style={{ fontSize:"0.75rem", color:TEXTO2 }}>Se guardan en Google Sheets</span>
        </div>
      )}
    </div>
  );
}
