import { calcularPuntos } from "../data.js";

const VERDE = "#00C853";
const ORO = "#FFD600";
const GRIS = "#1A1A1A";
const GRIS3 = "#333";
const TEXTO = "#F0F0F0";
const TEXTO2 = "#888";

const COLORES = ["#E53935","#8E24AA","#1565C0","#00838F","#2E7D32","#F57F17","#4527A0","#AD1457","#00695C","#6D4C41"];

const posIcon = (i) => i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1;

const rowBg = (i) => {
  if (i === 0) return { background: "rgba(255,214,0,0.07)", borderLeft: `3px solid ${ORO}` };
  if (i === 1) return { background: "rgba(200,200,200,0.04)", borderLeft: "3px solid #C0C0C0" };
  if (i === 2) return { background: "rgba(205,127,50,0.05)", borderLeft: "3px solid #CD7F32" };
  return { borderLeft: "3px solid transparent" };
};

export default function Ranking({ participantes, pronosticos, partidos, onVerPicks }) {
  const ranking = participantes
    .map((p, i) => {
      const misPicks = pronosticos.filter(x => x.usuarioId === p.id);
      const { aciertos, exactos, total } = calcularPuntos(misPicks, partidos);
      return { ...p, aciertos, exactos, total, color: COLORES[i % COLORES.length] };
    })
    .sort((a, b) => b.total - a.total);

  const jugados = partidos.filter(p => p.status === "jugado").length;
  const pendientes = partidos.filter(p => p.status === "pendiente").length;

  return (
    <div style={{ padding:"1.5rem", maxWidth:900, margin:"0 auto" }}>
      <div style={{ textAlign:"center", marginBottom:"2rem" }}>
        <div style={{ display:"inline-block", background:"rgba(0,200,83,0.12)", border:"1px solid rgba(0,200,83,0.25)", color:VERDE, padding:"3px 14px", borderRadius:20, fontSize:"0.7rem", fontWeight:700, letterSpacing:1, textTransform:"uppercase", marginBottom:10 }}>
          ⚽ FIFA World Cup 2026
        </div>
        <h1 style={{ fontWeight:900, fontSize:"clamp(2rem,6vw,3.2rem)", letterSpacing:1, lineHeight:1.05, marginBottom:6, textTransform:"uppercase" }}>
          Tabla de <span style={{ color:VERDE }}>Posiciones</span>
        </h1>
        <p style={{ fontSize:"0.85rem", color:TEXTO2, marginBottom:"1.5rem" }}>
          Actualizado automáticamente · {jugados} partidos jugados
        </p>
        <div style={{ display:"flex", gap:"2.5rem", justifyContent:"center" }}>
          {[[participantes.length,"Participantes"],[jugados,"Jugados"],[pendientes,"Restantes"]].map(([n,l]) => (
            <div key={l} style={{ textAlign:"center" }}>
              <div style={{ fontWeight:900, fontSize:"2.2rem", color:VERDE, lineHeight:1 }}>{n}</div>
              <div style={{ fontSize:"0.68rem", color:TEXTO2, textTransform:"uppercase", letterSpacing:1 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display:"flex", gap:8, marginBottom:"1.2rem", flexWrap:"wrap", justifyContent:"center" }}>
        {[["✅ Resultado correcto","3 pts","rgba(0,200,83,0.1)","rgba(0,200,83,0.3)",VERDE],
          ["⚡ Marcador exacto","5 pts","rgba(255,214,0,0.1)","rgba(255,214,0,0.3)",ORO],
          ["❌ Fallo","0 pts","rgba(255,255,255,0.03)","#333",TEXTO2]].map(([label,pts,bg,border,color]) => (
          <div key={label} style={{ background:bg, border:`1px solid ${border}`, borderRadius:8, padding:"6px 14px", fontSize:"0.75rem", color, display:"flex", gap:8, alignItems:"center" }}>
            <span>{label}</span><strong>{pts}</strong>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"44px 1fr 70px 70px 80px", padding:"6px 14px", fontSize:"0.65rem", color:TEXTO2, textTransform:"uppercase", letterSpacing:1, marginBottom:4, fontFamily:"monospace" }}>
        <div style={{ textAlign:"center" }}>#</div>
        <div>Participante</div>
        <div style={{ textAlign:"center" }}>Aciertos</div>
        <div style={{ textAlign:"center" }}>Exactos</div>
        <div style={{ textAlign:"center" }}>Puntos</div>
      </div>

      {ranking.map((j, i) => (
        <div key={j.id}
          onClick={() => onVerPicks && onVerPicks(j)}
          style={{ display:"grid", gridTemplateColumns:"44px 1fr 70px 70px 80px", padding:"11px 14px", background:GRIS, borderRadius:8, marginBottom:5, alignItems:"center", cursor:"pointer", border:"1px solid transparent", transition:"all 0.15s", ...rowBg(i) }}>
          <div style={{ textAlign:"center", fontWeight:900, fontSize:"1rem" }}>{posIcon(i)}</div>
          <div style={{ display:"flex", alignItems:"center", gap:9 }}>
            <div style={{ width:30, height:30, borderRadius:"50%", background:j.color+"22", color:j.color, border:`1px solid ${j.color}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.7rem", fontWeight:700, flexShrink:0 }}>
              {j.nombre.split(" ").map(x=>x[0]).slice(0,2).join("")}
            </div>
            <div>
              <div style={{ fontSize:"0.88rem", fontWeight:600 }}>{j.nombre}</div>
              <div style={{ fontSize:"0.7rem", color:TEXTO2 }}>{j.cargo || "Participante"}</div>
            </div>
          </div>
          <div style={{ textAlign:"center", fontSize:"0.82rem", fontFamily:"monospace" }}>{j.aciertos}/{jugados}</div>
          <div style={{ textAlign:"center" }}>
            {j.exactos > 0
              ? <span style={{ background:"rgba(0,200,83,0.12)", border:"1px solid rgba(0,200,83,0.25)", color:VERDE, padding:"2px 7px", borderRadius:4, fontSize:"0.62rem", fontFamily:"monospace" }}>⚡ {j.exactos}</span>
              : <span style={{ color:TEXTO2 }}>—</span>}
          </div>
          <div style={{ textAlign:"center", fontWeight:900, fontSize:"1.3rem", color:VERDE }}>{j.total}</div>
        </div>
      ))}

      {ranking.length === 0 && (
        <div style={{ textAlign:"center", padding:"3rem", color:TEXTO2 }}>
          <div style={{ fontSize:"3rem", marginBottom:8 }}>👥</div>
          <p>Cargando participantes...</p>
        </div>
      )}
    </div>
  );
}
