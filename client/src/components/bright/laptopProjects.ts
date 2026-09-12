export const laptopProjects = [
  { title: "Noor", description: "A personal Windows AI assistant that lets me interact with and control my computer and PC using voice, different AI models, and built-in productivity tools.", image: "/laptop/projects/noor.png" as string | null, github: "https://github.com/Nourah-Alotaibi/noor-desktop-assistant" as string | null },
  { title: "DecafShot", description: "Decaffeinated. De-AI’d. A cybersecurity toolkit that automates CTF testing and flag hunting. No generative AI, no LLMs, just security tools getting to work. No caffeine required.", image: null as string | null, github: "https://github.com/Nourah-Alotaibi/DecafShot-No-AI-CTF-tool" as string | null },
  { title: "Project RISE", description: "An interactive project currently being developed.", image: "/rise-trade.png" as string | null, github: null as string | null },
];
export type LaptopKey = { label: string; upper?: string; width?: number; icon?: string; split?: boolean };
const letters = (text: string): LaptopKey[] => text.split(" ").map(label => ({ label }));
export const keyboardRows: LaptopKey[][] = [
  [{label:"Esc"}, {label:"F1",icon:"sun-low"}, {label:"F2",icon:"sun-high"}, {label:"F3",icon:"keyboard"}, {label:"F4",icon:"mute"}, {label:"F5",icon:"volume-low"}, {label:"F6",icon:"volume-high"}, {label:"",icon:"camera"}, {label:"F7",icon:"mic"}, {label:"F8",icon:"display"}, {label:"F9",icon:"wireless"}, {label:"F10",icon:"mode"}, {label:"F11",upper:"PrtSc"}, {label:"F12",upper:"Ins"}, {label:"Del"}],
  [{label:"`",upper:"~"}, ...letters("1 2 3 4 5 6 7 8 9 0").map((k,i)=>({...k,upper:["!","@","#","$","%","^","&","*","(",")"][i]})), {label:"-",upper:"_"},{label:"=",upper:"+"},{label:"Backspace",width:2}],
  [{label:"Tab",width:1.5}, ...letters("Q W E R T Y U I O P"),{label:"[",upper:"{"},{label:"]",upper:"}"},{label:"\\",upper:"|",width:1.5}],
  [{label:"Caps",width:1.75}, ...letters("A S D F G H J K L"),{label:";",upper:":"},{label:"'",upper:'"'},{label:"Enter",width:2.25}],
  [{label:"Shift",width:2.25}, ...letters("Z X C V B N M"),{label:",",upper:"<"},{label:".",upper:">"},{label:"/",upper:"?"},{label:"Shift",width:2.75}],
  [{label:"Ctrl",width:1.1},{label:"Fn"},{label:"Win",icon:"windows"},{label:"Alt"},{label:"Space",width:5.5},{label:"Alt"},{label:"Ctrl"},{label:"◀"},{label:"▲",split:true},{label:"▶"}],
];
export function isProjectTypingKey(e: {key:string; ctrlKey:boolean; metaKey:boolean; altKey:boolean; isComposing:boolean; repeat:boolean}, target: Element | null) {
  if (e.ctrlKey || e.metaKey || e.altKey || e.isComposing || e.repeat) return false;
  if (target?.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="textbox"], [role="combobox"], [role="menu"]')) return false;
  // Printable letters, numbers and punctuation; preserve navigation and native controls.
  return e.key.length === 1 && e.key !== " ";
}
