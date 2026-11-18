import { useRef } from 'react';
import { useConfigurator } from '../state/store';
import type { Artwork } from '../types/config';
import { Move, RotateCw } from 'lucide-react';
const id = () => crypto.randomUUID();
export function Editor2D() {
  const fileRef = useRef<HTMLInputElement>(null);
  const { config, activeSurface, selectedArtwork, selectArtwork, addArtwork, updateArtwork } = useConfigurator();
  const surface = config.surfaces[activeSurface];
  const onFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader(); reader.onload = () => addArtwork({ id: id(), kind: 'image', src: String(reader.result), fileName: file.name, color: '#17221e', fontSize: 28, x: 50, y: 50, scale: 1, rotation: 0 }); reader.readAsDataURL(file);
  };
  const drag = (e: React.PointerEvent, art: Artwork) => {
    e.preventDefault(); e.stopPropagation(); selectArtwork(art.id); (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    const startX = e.clientX, startY = e.clientY, initialX = art.x, initialY = art.y, rect = (e.currentTarget.parentElement as HTMLElement).getBoundingClientRect();
    const move = (ev: PointerEvent) => updateArtwork(art.id, { x: Math.max(5, Math.min(95, initialX + (ev.clientX - startX) / rect.width * 100)), y: Math.max(8, Math.min(92, initialY + (ev.clientY - startY) / rect.height * 100)) });
    const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); }; window.addEventListener('pointermove', move); window.addEventListener('pointerup', up, { once: true });
  };
  return <section className="editor-card">
    <div className="section-heading"><div><span className="eyebrow">ARTWORK STUDIO</span><h2>Design your surface</h2></div><span className="tool-hint"><Move size={14}/> Drag to position</span></div>
    <div className="editor-toolbar"><button className="tool-button" onClick={() => addArtwork({ id: id(), kind: 'text', text: 'YOUR BRAND', color: '#17221e', fontSize: 28, x: 50, y: 50, scale: 1, rotation: 0 })}>＋ Add text</button><button className="tool-button" onClick={() => fileRef.current?.click()}>＋ Upload artwork</button><input ref={fileRef} type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" hidden onChange={e => onFile(e.target.files?.[0])}/><span className="editor-hint">PNG, JPG, SVG · Transparent PNG recommended</span></div>
    <div className={`design-canvas ${activeSurface === 'roof' ? 'roof-canvas' : ''}`} style={{ backgroundColor: surface.color }} onPointerDown={() => selectArtwork(null)}>
      {activeSurface === 'roof' && <div className="roof-seam"/>}
      {surface.artworks.map(a => <div key={a.id} className={`art-object ${selectedArtwork === a.id ? 'is-selected' : ''}`} style={{ left: `${a.x}%`, top: `${a.y}%`, color: a.color, fontSize: `${a.fontSize}px`, transform: `translate(-50%,-50%) rotate(${a.rotation}deg) scale(${a.scale})` }} onPointerDown={e => drag(e, a)}>
        {a.kind === 'text' ? a.text : <img src={a.src} alt={a.fileName || 'Uploaded artwork'} draggable={false} />}
        {selectedArtwork === a.id && <span className="selection-corner"/>}
      </div>)}
      {!surface.artworks.length && <div className="canvas-placeholder"><span>LOGO / DESIGN AREA</span><small>Artwork is saved to {activeSurface === 'roof' ? 'the roof' : `the ${activeSurface} panel`}</small></div>}
    </div>
    {selectedArtwork && <div className="object-properties"><strong>Selected element</strong>{surface.artworks.filter(a => a.id === selectedArtwork).map(a => <div className="property-controls" key={a.id}>
      {a.kind === 'text' && <label>Text<input value={a.text} onChange={e => updateArtwork(a.id, { text: e.target.value })}/></label>}
      {a.kind === 'text' && <label>Text color<input type="color" value={a.color} onChange={e => updateArtwork(a.id, { color: e.target.value })}/></label>}
      <label>Scale <input type="range" min="0.5" max="2.5" step="0.05" value={a.scale} onChange={e => updateArtwork(a.id, { scale: +e.target.value })}/></label>
      {a.kind === 'text' && <label>Text size <input type="range" min="14" max="64" value={a.fontSize} onChange={e => updateArtwork(a.id, { fontSize: +e.target.value })}/></label>}
      <label className="rotation-label"><RotateCw size={14}/> Rotation <input type="range" min="-180" max="180" value={a.rotation} onChange={e => updateArtwork(a.id, { rotation: +e.target.value })}/></label>
    </div>)}</div>}
  </section>;
}
