import type { BlogPost } from "./blogPosts";

export const phiSciencePost: BlogPost = {
  slug: "phi2-science-lab",
  title: "Small model. Big curiosity. My Phi-2 hackathon project, revisited.",
  date: "2026-10-08",
  excerpt: "A science question, a small language model, and a hackathon prototype that deserved a second chapter. I rebuilt it into a local study companion—and tested where it still gets things wrong.",
  category: "AI · Hackathon · Local language models",
  cover: "/project-results/phi2-science-lab.png",
  content: [
    { type: "paragraph", text: "It started with a very hackathon-shaped idea: could I put a small language model behind a science question box and make learning a little more interactive? My first Phi-2 prototype got the idea onto a screen. Coming back to it, I wanted to turn that first spark into something I could actually use, test and explain." },
    { type: "heading", text: "A second chapter for the prototype" },
    { type: "paragraph", text: "The original app loaded the model when the script started and could generate before a question was ready. I rebuilt the flow around a deliberate action: write a question, choose a learning level and response style, then ask. The new version reuses a local model service, validates input and explains connection or model errors in the interface." },
    { type: "image", text: "The rebuilt Phi-2 Science Lab answering a real question about evaporation on my computer.", href: "/project-results/phi2-science-lab.png" },
    { type: "paragraph", text: "The app now offers explanations, comparisons and practice questions, with an adjustable response budget and a session study journal that downloads as Markdown. I ran the quantized Phi-2 model locally through Ollama and verified GPU execution. No paid inference API is needed for this setup." },
    { type: "heading", text: "The most useful part was catching it being wrong" },
    { type: "paragraph", text: "A fluent answer is easy to admire. A wrong fluent answer is more useful to investigate. My initial checks caught an invented explanation about air inside floating ice, and an iron boiling-point answer that used roughly its melting-point temperature instead. Those failures changed the application." },
    { type: "paragraph", text: "A shorter prompt improved one saved ice explanation, but the same error returned in a later spot check. That made the limit clear: a better prompt was not a reliable factual fix. For reference notes, I made a more specific design choice: the app quotes passages selected by keyword overlap, rather than asking the model to invent a note-grounded answer. If nothing matches, it says so. The interface labels that workflow as a lookup; a matching passage still needs the reader’s judgment." },
    { type: "heading", text: "What I tested—and what still needs care" },
    { type: "paragraph", text: "The rebuilt workflow passed eleven application unit tests and browser checks for real generation, blank-input feedback, the study journal, downloads, notes lookup and mobile rendering. I also saved four live Phi-2 answers and two reference lookups with a written review, so the results can be inspected rather than reduced to a flattering score." },
    { type: "paragraph", text: "These examples are not an accuracy benchmark. A misleading photosynthesis example remained in the final run, and the model did not always follow the requested format. This is a working educational prototype: useful for exploring local AI and reviewing study drafts, with explanations that still need checking against course materials." },
    { type: "heading", text: "What I built" },
    { type: "paragraph", text: "My contribution is the application and its learning workflow: the interface, local inference integration, input limits, error handling, notes lookup, journal, export and repeatable checks. Microsoft trained Phi-2; I did not train or fine-tune the base model. Revisiting the hackathon project taught me as much about evaluating an AI feature as building one." },
    { type: "link", text: "Phi-2 model card and original model credits", href: "https://huggingface.co/microsoft/phi-2" },
    { type: "link", text: "Back to my selected projects", href: "/project#phi2-science-lab" },
  ],
};
