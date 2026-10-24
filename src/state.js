// Storyboard Studio Next: central project state, isolated from legacy v0.2.3 saves.
export const KEY='storyboardStudio.next.v03.state';
const LEGACY='storyboardStudio.v01.state';
export const uid=(prefix='id')=>`${prefix}-${crypto.randomUUID?.()||Math.random().toString(36).slice(2)}`;
export const copy=x=>structuredClone(x);
export const date=()=>new Date().toISOString();
export const defaultGridByRatio=()=>({'16:9':{cols:3,rows:4},'9:16':{cols:4,rows:3},'4:3':{cols:3,rows:4}});
export const gridPreset=(settings,format)=>{const base=defaultGridByRatio()[format]||defaultGridByRatio()['16:9'];const saved=settings?.gridByRatio?.[format];return {cols:Math.max(1,Math.min(6,Number(saved?.cols)||base.cols)),rows:Math.max(1,Math.min(7,Number(saved?.rows)||base.rows))};};
export const defaults=()=>({version:10, settings:{gridByRatio:defaultGridByRatio(),theme:'light',sfx:true,sfxVolume:.4,animations:true,numbering:'global',chapterInfo:'range',cardNumbers:true,letterbox:'black',noteSize:14,spacing:28,thumbSize:195,altUndoKeys:false,browserInfo:false,showStickies:true},folders:[{id:'root',name:'All Projects'}],projects:[],globalAssets:[]});
export const take=(i=1)=>({id:uid('take'),name:`Take ${i}`,cues:[],ranges:[],preferred:false,createdAt:date()});
export const chapter=(name='Chapter 1',parentId=null)=>({id:uid('chapter'),name,parentId,complete:false,unused:false});
export const card=(chapterId=null, assetId=null)=>({id:uid('story'),chapterId,variants:assetId?[{assetId}]:[],activeVariant:0,blank:!assetId,tags:[],note:'',reuseOf:null,stickers:[],completionStatus:'red'});
export function newProject(name,ratio,folderId='root'){
 const c=chapter();const now=date();const grid=gridPreset(store.state.settings,ratio);return {id:uid('project'),name,ratio,folderId,createdAt:now,modifiedAt:now,chapters:[c],stories:[],unassigned:[],lost:[],archived:[],stickyNotes:[],archivedStickies:[],customTags:[],assets:[],history:[],viewPrefs:{cardNotesVisible:false,thumbnailSize:195,gridCols:grid.cols,gridRows:grid.rows},perform:{audioAssetId:null,waveform:[],duration:0,chapterAnchors:{},takes:[take()],activeTakeId:null},pinned:false,stickers:[],completion:0};
}
function migrate(p){
 p.ratio=p.ratio==='3:4'?'4:3':p.ratio||'16:9'; p.chapters=Array.isArray(p.chapters)&&p.chapters.length?p.chapters:[chapter()];
 p.chapters.forEach(c=>{c.unused=!!c.unused;c.complete=!!c.complete;c.parentId=c.parentId||null;});
 p.stories ||= [];p.unassigned ||=p.imported||[];p.lost ||= [];p.archived ||= [];p.stickyNotes ||=p.notes||[];p.archivedStickies||=[];p.customTags||=[];p.history=[];
 p.viewPrefs={cardNotesVisible:false,thumbnailSize:195,...p.viewPrefs};
 p.perform ||= {};p.perform.takes=Array.isArray(p.perform.takes)&&p.perform.takes.length?p.perform.takes:[take()];
 p.perform.takes.forEach((t,i)=>{t.id||=uid('take');t.name||=`Take ${i+1}`;t.cues||=[];t.ranges||=[];});
 p.perform.activeTakeId=p.perform.takes.some(t=>t.id===p.perform.activeTakeId)?p.perform.activeTakeId:p.perform.takes[0].id;
 p.perform.waveform||=[];p.perform.chapterAnchors||={};p.perform.duration ||=0;
 [...p.stories,...p.unassigned,...p.lost,...p.archived].forEach(s=>{if((s.tags||[]).includes('done'))s.completionStatus='green';s.tags=(s.tags||[]).filter(t=>!['cleanup','done','blank','variants','reused'].includes(t));s.variants||=[];s.note||='';s.activeVariant||=0;s.blank=!!s.blank;if(!['red','yellow','green'].includes(s.completionStatus))s.completionStatus='red';});
 // Bring older reusable instances into alignment and retain stable copy indices.
 const everyone=[...p.stories,...p.unassigned,...p.lost,...p.archived];
 const bySource=new Map();
 for(const instance of everyone){
   if(!instance.reuseOf)continue;
   const members=bySource.get(instance.reuseOf)||[];
   members.push(instance);bySource.set(instance.reuseOf,members);
 }
 for(const [sourceId,members] of bySource){
   const root=everyone.find(x=>x.id===sourceId);
   const taken=new Set(members.map(x=>x.reuseIndex).filter(x=>Number.isInteger(x)&&x>0));
   let next=1;
   for(const instance of members){if(!Number.isInteger(instance.reuseIndex)||instance.reuseIndex<1){while(taken.has(next))next++;instance.reuseIndex=next;taken.add(next++);}}
   if(root){const grades={red:0,yellow:1,green:2};const best=[root,...members].reduce((v,x)=>grades[x.completionStatus]>grades[v]?x.completionStatus:v,'red');for(const x of [root,...members])x.completionStatus=best;}
 }
 return p;
}
function load(){let data;try{data=JSON.parse(localStorage.getItem(KEY)||'null');}catch{}if(!data){try{data=JSON.parse(localStorage.getItem(LEGACY)||'null');}catch{}}data=data||defaults();
 data.settings={...defaults().settings,...(data.settings||{})};data.settings.gridByRatio={...defaultGridByRatio(),...(data.settings.gridByRatio||{})};data.folders=Array.isArray(data.folders)?data.folders:[{id:'root',name:'All Projects'}];if(!data.folders.some(f=>f.id==='root'))data.folders.unshift({id:'root',name:'All Projects'});
 data.projects=Array.isArray(data.projects)?data.projects.map(migrate):[];data.globalAssets||=[];
 for(const p of data.projects){for(const a of p.assets||[]){if(!data.globalAssets.some(x=>x.id===a.id))data.globalAssets.push(a);}p.assets=[];}
 return data;
}
export class Store {
 constructor(){this.state=load();this.undo=[];this.redo=[];this.listeners=new Set();this.session=[];this.save();}
 subscribe(fn){this.listeners.add(fn);return()=>this.listeners.delete(fn);}
 emit(){for(const f of this.listeners)f(this.state);}
 save(){try{localStorage.setItem(KEY,JSON.stringify(this.state));}catch(e){console.error('Autosave failed',e);document.dispatchEvent(new CustomEvent('ss-save-failed',{detail:e.message}));}}
 change(label,fn,{silent=false}={}){const before=copy(this.state);const result=fn(this.state);if(!silent){this.undo.push({label,before});if(this.undo.length>80)this.undo.shift();this.redo=[];this.session.unshift({label,at:date()});}
 this.save();this.emit();return result;}
 undoNow(){const a=this.undo.pop();if(!a)return;this.redo.push({label:a.label,before:copy(this.state)});this.state=a.before;this.session.unshift({label:`Undo: ${a.label}`,at:date()});this.save();this.emit();}
 redoNow(){const a=this.redo.pop();if(!a)return;this.undo.push({label:a.label,before:copy(this.state)});this.state=a.before;this.session.unshift({label:`Redo: ${a.label}`,at:date()});this.save();this.emit();}
 get project(){return this.state.projects.find(p=>p.id===this.projectId)||null;}
 open(id){this.projectId=id;this.emit();}
}
export const store=new Store();
export const ordered=p=>p.chapters.filter(c=>!c.unused).flatMap(c=>p.stories.filter(s=>s.chapterId===c.id));
export const chapterCards=(p,id)=>p.stories.filter(s=>s.chapterId===id);
export const position=(p,id,scope='global')=>{if(scope==='chapter'){const s=p.stories.find(s=>s.id===id);return chapterCards(p,s?.chapterId).findIndex(s=>s.id===id)+1;}return ordered(p).findIndex(s=>s.id===id)+1;};
export const sourceCard=(p,s)=>s?.reuseOf?[...p.stories,...p.unassigned,...p.lost,...p.archived].find(x=>x.id===s.reuseOf)||s:s;
export const visual=(p,s)=>{const src=sourceCard(p,s);const variants=src?.variants||[];const i=Math.max(0,Math.min(s?.activeVariant||0,variants.length-1));return {variant:variants[i]||null,count:variants.length,index:i,blank:!!s?.blank||!variants.length};};
export const allCards=p=>[...p.stories,...p.unassigned,...p.lost,...p.archived];
export const reuseFamily=(p,s)=>{const root=sourceCard(p,s);return allCards(p).filter(x=>x.id===root.id||x.reuseOf===root.id);};
export const completionOf=(p,s)=>{const root=sourceCard(p,s);const status=root?.completionStatus||s?.completionStatus;return ['red','yellow','green'].includes(status)?status:'red';};
export const setFamilyCompletion=(p,s,status)=>{for(const member of reuseFamily(p,s))member.completionStatus=status;};
export const tags=(p,s)=>{const all=[...(s.tags||[]).filter(t=>!['cleanup','done','blank','variants','reused'].includes(t))];
 if(completionOf(p,s)==='green')all.push('done');
 if(visual(p,s).blank)all.push('blank');
 if(visual(p,s).count>1)all.push('variants');
 if(s.reuseOf||allCards(p).some(x=>x.reuseOf===s.id))all.push('reused');
 return all;};
export const tagDefs={animation:{name:'Animation',icon:'◆',color:'#a38bd6'},review:{name:'Review',icon:'!',color:'#f6cd73'},done:{name:'Done',icon:'✓',color:'#81c8a5'},blank:{name:'Blank',icon:'□',color:'#c0c4d0'},variants:{name:'Variants',icon:'◇',color:'#81acd8'},reused:{name:'Reused',icon:'♻',color:'#ed95a7'}};
export const ratio=p=>p.ratio==='9:16'?'9 / 16':p.ratio==='4:3'?'4 / 3':'16 / 9';
