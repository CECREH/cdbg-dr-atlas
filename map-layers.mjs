import {albers,regionFor} from './domain.mjs';

// Scale is projected metres per CSS pixel, not a zoom level relative to a fitted state.
export const DETAIL = Object.freeze({county:4000,municipality:750});
export function fittedViewport(box,width,height){
  const ratio=Math.max(width,1)/Math.max(height,1);
  let w=box.w,h=box.h;
  if(w/h<ratio)w=h*ratio;else h=w/ratio;
  return {cx:box.cx,cy:box.cy,w,h,x0:box.cx-w/2,y0:box.cy-h/2,x1:box.cx+w/2,y1:box.cy+h/2,resolution:w/Math.max(width,1)};
}
export function detailAt(resolution){return {county:resolution<=DETAIL.county,municipality:resolution<=DETAIL.municipality};}
export function intersects(bounds,viewport,padding=0){
  return bounds[0]<=viewport.x1+viewport.w*padding&&bounds[2]>=viewport.x0-viewport.w*padding&&bounds[1]<=viewport.y1+viewport.h*padding&&bounds[3]>=viewport.y0-viewport.h*padding;
}
export function projectedBounds(feature,region){
  const b=[Infinity,Infinity,-Infinity,-Infinity];
  const polys=feature.geometry.type==='Polygon'?[feature.geometry.coordinates]:feature.geometry.coordinates;
  for(const polygon of polys)for(const ring of polygon)for(let i=0;i<ring.length;i++){
    const a=ring[i],z=ring[(i+1)%ring.length];let dx=z[0]-a[0];if(dx>180)dx-=360;if(dx< -180)dx+=360;
    // Match the display path's densification, including projection curvature and the date line.
    const n=Math.max(1,Math.ceil(Math.max(Math.abs(dx),Math.abs(z[1]-a[1]))/.3));
    for(let j=0;j<n;j++){
      const [x,y]=albers(a[0]+dx*j/n,a[1]+(z[1]-a[1])*j/n,region);
      if(Number.isFinite(x)&&Number.isFinite(y)){b[0]=Math.min(b[0],x);b[1]=Math.min(b[1],y);b[2]=Math.max(b[2],x);b[3]=Math.max(b[3],y);}
    }
  }
  return b;
}
export function visibleStates(states,region,viewport,boundsFor){return states.filter(f=>regionFor(f.properties.state)===region&&intersects(boundsFor(f),viewport,.12));}
export function referenceClass(feature,classification){
  const p=feature.properties;
  if(p.kind!=='place')return {county:'county',cousub:'subdivision',concity:'consolidated',state:'state'}[p.kind]||'unclassified';
  return classification?.places?.[p.geoid]?.[1]||'unclassified';
}
export const CLASS_LABELS={state:'State / territory',county:'County / equivalent',municipal:'Municipal place reference',consolidated:'Consolidated city',statistical:'Statistical place (CDP)',balance:'City balance (partial area)',subdivision:'County subdivision',unclassified:'Unclassified reference'};
export function includeReference(feature,classification,includeStatistical,selected){
  if(feature.properties.id===selected)return true;
  return includeStatistical||!['statistical','balance','unclassified'].includes(referenceClass(feature,classification));
}
export function resolutionFactor(resolution,factor,minResolution,maxResolution){
  const target=Math.min(maxResolution,Math.max(minResolution,resolution/factor));
  return resolution/target;
}
export function zoomAt(box,current,factor,anchor={x:.5,y:.5},width=800,height=480){
  const zoom=current*factor,scale=current/zoom;
  const v=fittedViewport(box,width,height);
  return {zoom,box:{cx:box.cx+(anchor.x-.5)*v.w*(1-scale),cy:box.cy+(anchor.y-.5)*v.h*(1-scale),w:box.w*scale,h:box.h*scale}};
}
export function wheelFactor(event,armed,height=480){
  // Leave browser zoom gestures and ordinary page scrolling untouched.
  if(!armed||event.ctrlKey||event.metaKey||!Number.isFinite(event.deltaY)||event.deltaY===0)return null;
  const delta=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?height:1);
  return Math.exp(-Math.max(-180,Math.min(180,delta))*.003);
}
export async function mapPool(items,work,concurrency=4){
  let cursor=0;const results=new Array(items.length);
  await Promise.all(Array.from({length:Math.min(items.length,concurrency)},async()=>{while(cursor<items.length){const index=cursor++;results[index]=await work(items[index],index);}}));
  return results;
}
