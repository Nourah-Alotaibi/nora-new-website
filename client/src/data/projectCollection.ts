import { PA_PROJECTS } from "./portfolio";

export type ProjectCategory = "AI & machine learning" | "Data analysis" | "Cybersecurity" | "Games & applications";
export type CollectionProject = {
  id: string;
  title: string;
  question: string;
  category: ProjectCategory;
  subtitle: string;
  description: string;
  tags: string[];
  href?: string;
  linkLabel?: string;
  status?: string;
  hidden?: boolean;
  image?: string;
  imageAlt?: string;
  sourceHref?: string;
  screenshots?: { src: string; caption: string }[];
  artIndex?: number;
  video?: string;
  metric?: { value: string; label: string };
  note?: string;
  noteLabel?: string;
};

const plain = (text: string) => text.replace(/\[\[(?:org|num|rank):([^\]]+)\]\]/g, "$1");

const studioQuestions: Record<number, string> = {
  1: "What if care had fewer disconnected pieces?",
  2: "What if your everyday assistant came with you?",
  3: "Can a game-jam idea grow fangs?",
  4: "What’s for dinner when one size doesn’t fit all?",
  5: "Can market data make a little more sense?",
};

// Keep the original portfolio as the source of truth for the five gallery projects.
const studioProjectCatalog: CollectionProject[] = [
  ...PA_PROJECTS.map((project, index): CollectionProject => ({
    id: project.title.toLowerCase().replaceAll(" ", "-"),
    title: project.title === "WEREWOLF CURSE" ? "Werewolf’s Curse" : project.title === "EPICARE" ? "EpiCare & Hayat" : project.title === "AAFIYA" ? "Aafiya" : project.title,
    question: studioQuestions[project.id],
    category: project.id === 3 || project.id === 4 ? "Games & applications" : "AI & machine learning",
    subtitle: project.subtitle,
    description: plain(project.desc),
    tags: project.tags.slice(0, 4),
    href: project.id === 3 ? "/blog/werewolf-curse-reimagined" : `/?project=${encodeURIComponent(project.title.toLowerCase())}#studio-project`,
    linkLabel: project.id === 3 ? "Read the game’s story" : "Explore the project",
    status: project.id === 5 ? "In development · paper trading" : undefined,
    artIndex: index,
    video: project.video,
  })),
  {
    id: "noor", title: "Noor", category: "AI & machine learning",
    question: "What if my computer knew how to lend a hand?",
    subtitle: "A personal Windows AI assistant",
    description: "I wanted my computer’s assistant to feel like my own. I customized the open-source Jarvis project into Noor, with a redesigned interface, configurable cloud and local AI providers, voice interaction and productivity tools.",
    tags: ["Python", "Desktop apps", "Voice interfaces", "AI integration"],
    href: "/#main", linkLabel: "Meet Noor on the studio laptop",
    image: "/laptop/projects/noor.png", imageAlt: "Noor desktop assistant interface",
    note: "Built on ONEPUNCHMAN411/Jarvis, with upstream credits preserved.",
  },
  {
    id: "phi2-science-lab", title: "Phi-2 Science Lab", category: "AI & machine learning",
    question: "Can a small model tackle big science questions?",
    subtitle: "A hackathon spark, rebuilt into a local learning lab",
    description: "A science question box became an experiment in building—and questioning—an AI study companion. I rebuilt my hackathon prototype with local Phi-2 inference, learning controls, a study journal and notes lookup, then tested the explanations to see where fluent answers still go wrong.",
    tags: ["Python", "Streamlit", "Phi-2", "Local AI"],
    status: "Working local prototype",
    image: "/project-results/phi2-science-lab.png", imageAlt: "Phi-2 Science Lab answering a question about evaporation in the rebuilt interface",
    note: "Application tests and real model runs are documented. Uses Microsoft’s pretrained Phi-2 without fine-tuning; generated explanations can contain factual errors. Reference notes use a separate extractive lookup.",
  },
  {
    id: "decafshot", title: "DecafShot", category: "Cybersecurity",
    hidden: true,
    question: "What would Sherlock bring to a CTF?",
    subtitle: "A detective’s approach to CTF learning",
    description: "Inspired by Sherlock Holmes, DecafShot brings a detective’s curiosity to cybersecurity practice. A trained local ML classifier categorizes CTF challenges, while a toolkit helps organize security-tool testing and flag hunting.",
    tags: ["Python", "CTF", "Local ML", "Security tooling"],
    href: "https://github.com/Nourah-Alotaibi/DecafShot-No-AI-CTF-tool", linkLabel: "Explore DecafShot on GitHub",
    image: "/blog-media/decaf-thumbnail.png", imageAlt: "DecafShot’s detective-inspired project illustration",
  },
  {
    id: "ctf-control-room", title: "CTF Control Room", category: "Cybersecurity",
    question: "What if every clue had a place to land?",
    subtitle: "A personal workspace for CTF challenges",
    description: "A personal AI tool for analyzing and organizing CTF challenges. It grew alongside my cybersecurity practice and Team Matcha Latte’s competitions, with Sara as its first product tester. The story is public; the methods are still under wraps.",
    tags: ["Cybersecurity", "AI tooling", "CTF workflows"],
    href: "/blog/ctf-control-room", linkLabel: "Read the story", status: "Private project",
    image: "/blog-media/ctf-welcome.png", imageAlt: "CTF Control Room welcome screen",
  },
];

export const studioProjects = studioProjectCatalog.filter(project => !project.hidden);

const github = (repo: string) => `https://github.com/Nourah-Alotaibi/${repo}`;

export const githubProjects: CollectionProject[] = [
  {
    id: "snake-ai-game", title: "Snake Learning Lab", category: "Games & applications",
    question: "Can my childhood Snake learn a new trick?",
    subtitle: "From my mum’s Nokia to deep reinforcement learning",
    description: "What’s the best way to learn something new? Gamify it! Snake was my first digital game, on my mum’s old Nokia. I first rebuilt it while studying AI to make concepts click—and help me ace my exams. Now it learns through reinforcement learning, explores “what if?” moves and uses SHAP to explain why it turns.",
    tags: ["Double DQN", "Reinforcement learning", "Counterfactual replay", "SHAP / XAI", "JavaScript"],
    status: "Interactive learning lab",
    image: "/snake-lab/screenshots/02-learning-in-action.png", imageAlt: "The working Snake neural-learning lab with a live game, parameter controls and action values",
    screenshots: [
      { src: "/snake-lab/screenshots/01-nokia-meets-neural.png", caption: "A Nokia memory, a neural twist" },
      { src: "/snake-lab/screenshots/02-learning-in-action.png", caption: "Watch learning happen" },
      { src: "/snake-lab/screenshots/03-inside-the-brain.png", caption: "SHAP: what tipped the decision?" },
      { src: "/snake-lab/screenshots/04-the-report-card.png", caption: "A frozen-policy report card" },
    ],
    noteLabel: "How the experiment works",
    note: "Double DQN combines a neural network, replay memory and a stable target network. Optional “what if?” replay adds outcomes from two unchosen moves in a copy of the game. The technical report documents a controlled comparison across three training seeds, with reproducible code and saved results.",
    href: "/snake-lab/", linkLabel: "Play, train & turn the knobs", sourceHref: github("snake-ai-game"),
  },
  {
    id: "customer-satisfaction", title: "Customer Satisfaction", category: "AI & machine learning",
    question: "Can a great score hide unhappy customers?",
    subtitle: "Looking beyond a misleading accuracy score",
    description: "When almost 96% of customers share the same label, accuracy can hide the problem. I compared regularization, PCA and gradient boosting across 76,020 records, using duplicate-aware splits and training-only preprocessing to make the comparison meaningful.",
    tags: ["scikit-learn", "PCA", "Gradient boosting", "Imbalanced learning"],
    metric: { value: "76,020", label: "customer records used in the benchmark" },
    note: "Held-out ROC-AUC was 0.836, compared with 0.779 for the baseline. A development-selected threshold improved minority recall to 45.0%, with a false-positive tradeoff. Threshold results are follow-up analysis, not fresh validation.",
    image: "/project-results/customer-satisfaction.png", imageAlt: "Customer satisfaction validation ROC-AUC comparison across candidate models",
    href: github("customer-satisfaction-pca-benchmark"), linkLabel: "View code & results",
  },
  {
    id: "arabic-sentiment", title: "Arabic Sentiment", category: "AI & machine learning",
    question: "Can a model read the mood in Arabic?",
    subtitle: "Finding the signal in words, characters and emoji",
    description: "Arabic sentiment needs more care than simply removing punctuation. I kept negation and emoji, normalized Arabic text, checked duplicate labels, and combined word and character TF-IDF features to build a stronger classical baseline.",
    tags: ["Arabic NLP", "TF-IDF", "Logistic regression", "Python"],
    metric: { value: "26,082", label: "unique Arabic texts after cleaning" },
    note: "Test accuracy was 70.85%, compared with 61.80% for the baseline, on 5,217 held-out texts. Source-label provenance is unverified; a random split does not establish performance on new dialects or authors.",
    image: "/project-results/arabic-sentiment.png", imageAlt: "Validation comparison of word and character feature models for Arabic sentiment",
    href: github("arabic-sentiment-classification"), linkLabel: "View code & results",
  },
  {
    id: "cosmetics", title: "Cosmetics Catalog", category: "Data analysis",
    question: "What’s hiding behind the beauty labels?",
    subtitle: "The most useful finding was what the data could not say",
    description: "I explored 931 cosmetics products to understand brands, product types, prices and ratings. Missing ratings and mixed currencies changed the story: I built a transparent catalog analysis that makes those gaps visible instead of turning them into market claims.",
    tags: ["pandas", "EDA", "Data quality", "Visualization"],
    metric: { value: "931", label: "cosmetics products explored" },
    note: "Ratings are missing for 63.48% of products, and all 340 rated products lack currency information. A reliable currency-controlled price–rating comparison cannot be estimated from this snapshot.",
    image: "/project-results/cosmetics.png", imageAlt: "Cosmetics catalog composition by brand and product type",
    href: github("cosmetics"), linkLabel: "View code & results",
  },
  {
    id: "tech-layoffs", title: "Technology Layoffs", category: "Data analysis",
    question: "What do the layoff headlines leave out?",
    subtitle: "Making a difficult story readable without filling in the gaps",
    description: "I turned 2,412 reported layoff records into monthly, industry and geographic views. Alongside the trends, I tracked missing counts so readers can see the difference between an observed total and the coverage of the source.",
    tags: ["pandas", "Time-series analysis", "Data storytelling"],
    metric: { value: "2,412", label: "records · March 2020–December 2025 snapshot" },
    note: "372 records have missing counts. The 746,809 reported layoffs in the file are an observed total, not a worldwide census or evidence of causes.",
    image: "/project-results/tech-layoffs.png", imageAlt: "Monthly reported technology layoffs with the dataset’s observed coverage",
    href: github("tech-layoffs-analysis"), linkLabel: "View code & results",
  },
  {
    id: "fashion-mnist", title: "Fashion-MNIST CNN", category: "AI & machine learning",
    question: "Is that a shirt, a coat—or a confused CNN?",
    subtitle: "Teaching a model to tell a shirt from a coat",
    description: "I built a reproducible image-classification experiment with a regularized convolutional network, then looked beyond its headline score at learning curves and class-level errors. Shirts remained the most difficult category—a useful reminder that every score has a story underneath it.",
    tags: ["PyTorch", "Computer vision", "CNN", "Regularization"],
    metric: { value: "93.14%", label: "accuracy on 10,000 official test images" },
    note: "Macro F1 was 0.931. The MLP baseline reached 86.52% accuracy, using a different training budget. This is a small-image benchmark, not a validated real-world fashion product.",
    image: "/project-results/fashion-mnist.png", imageAlt: "Fashion-MNIST CNN training and validation learning curves",
    href: github("fashion-mnist-cnn"), linkLabel: "View code & results",
  },
  {
    id: "arabic-transformers", title: "Arabic Transformer Sentiment", category: "AI & machine learning",
    question: "Does a bigger model get the mood any better?",
    subtitle: "Frozen CAMeLBERT meets a classical baseline",
    description: "Using the same cleaned Arabic text split as my classical benchmark, I compared pretrained CAMeLBERT features with TF-IDF. Frozen embeddings, masked pooling and a trained linear classifier made the experiment practical on CPU and easy to compare.",
    tags: ["Hugging Face", "CAMeLBERT", "Transfer learning", "Arabic NLP"],
    metric: { value: "5,217", label: "held-out Arabic texts evaluated" },
    note: "Test accuracy was 71.55%, with 0.715 macro F1. The 0.71 percentage-point advantage over TF-IDF was not statistically clear. This uses a frozen encoder, not end-to-end transformer fine-tuning.",
    image: "/project-results/arabic-transformers.png", imageAlt: "Paired comparison of Arabic transformer and classical sentiment predictions",
    href: github("arabic-transformer-sentiment"), linkLabel: "View code & results",
  },
  {
    id: "weather-clustering", title: "Weather Pattern Clustering", category: "Data analysis",
    question: "Can the weather sort itself into patterns?",
    subtitle: "Looking for structure when there are no labels",
    description: "I revisited a weather-clustering workflow with circular wind-direction features, chronological validation and stability checks. A 158,726-row sample from 1.59 million minute-level records helped explore recurring patterns without claiming a classification accuracy.",
    tags: ["MiniBatchKMeans", "Feature engineering", "Unsupervised learning"],
    metric: { value: "158,726", label: "weather observations in the analysis sample" },
    note: "The selected two-cluster solution had a held-out silhouette of 0.325. The clusters measure mathematical separation, not verified weather regimes. Refactored from collaborative coursework using a documented public dataset mirror.",
    image: "/project-results/weather-clustering.png", imageAlt: "Weather observations grouped into two clusters",
    href: github("weather-pattern-clustering"), linkLabel: "View code & results",
  },
  {
    id: "german-credit", title: "German Credit Risk", category: "AI & machine learning",
    question: "Which mistakes should a credit model make?",
    subtitle: "Choosing which mistakes a model makes",
    description: "I rebuilt a credit-classification notebook with preprocessing inside cross-validation and compared logistic regression, random forests and SVMs. The result is a clear account of how better minority-class performance can come with lower overall accuracy.",
    tags: ["scikit-learn", "Cross-validation", "Model evaluation"],
    metric: { value: "1,000", label: "historical credit records in the benchmark" },
    note: "Test balanced accuracy rose from 0.710 to 0.742, while overall accuracy fell from 78.0% to 72.5%. This historical educational dataset does not establish fairness or suitability for lending decisions.",
    image: "/project-results/german-credit.png", imageAlt: "Held-out confusion matrix for the selected German credit model",
    href: github("german-credit-risk-benchmark"), linkLabel: "View code & results",
  },
  {
    id: "breast-cancer", title: "Breast-Cancer SVM Benchmark", category: "AI & machine learning",
    question: "Can a little scaling change the whole picture?",
    subtitle: "Small preprocessing choices, measurable differences",
    description: "On the Wisconsin Diagnostic Breast Cancer benchmark, I compared an unscaled baseline with cross-validated, scaled SVMs. I included class-level evaluation and an uncertainty interval so the result stays connected to the small test set behind it.",
    tags: ["SVM", "Preprocessing pipelines", "Cross-validation"],
    metric: { value: "97.37%", label: "test accuracy · 111 of 114 records" },
    note: "Baseline accuracy was 92.11%; the selected model’s 95% accuracy interval is approximately 92.55–99.10%. Educational benchmark only, with no clinical validation.",
    image: "/project-results/breast-cancer.png", imageAlt: "Held-out confusion matrix for the scaled breast-cancer SVM",
    href: github("breast-cancer-svm-benchmark"), linkLabel: "View code & results",
  },
  {
    id: "web-security-extension", title: "AI Web-Security Extension", category: "Cybersecurity",
    question: "Could a browser lend a hand with security?",
    subtitle: "An early browser-extension experiment",
    description: "A Chrome Manifest V3 extension and Flask backend exploring how security utilities could meet in a browser interface. I collected the source and documented the integration gaps to make the next development steps clear.",
    tags: ["Chrome extensions", "Manifest V3", "Flask", "JavaScript"],
    status: "Prototype · unfinished",
    metric: { value: "Prototype", label: "source and implementation audit" },
    note: "Some responses and scores are placeholders, and the popup wiring needs repair. This is not a working or validated security scanner.",
    href: github("ai-web-security-extension-prototype"), linkLabel: "Explore the source & audit",
  },
];
