export type BlogBlock = { type: "heading" | "paragraph" | "link" | "quote"; text: string; href?: string; lang?: string };
export type BlogPost = { slug: string; title: string; date: string; excerpt: string; content: BlogBlock[]; video?: { src: string; poster: string; caption: string }; playHref?: string };

export const blogPosts: BlogPost[] = [
  {
    "slug": "my-journey-into-ai",
    "title": "A Path I Would Choose Again",
    "date": "2026-10-01",
    "excerpt": "From painting and web development to AI, a three-day game jam, entrepreneurship, and research—the doors I opened and the path I chose.",
    "content": [
      {
        "type": "paragraph",
        "text": "My journey into AI began around 2021–2022, before the generative AI boom. But my first step was learning how to build a website."
      },
      {
        "type": "paragraph",
        "text": "Around 2021–2022, I was studying mechanical engineering and still figuring out where I belonged. Then I joined a web development bootcamp at CODED, and something clicked. I could take an idea, design it, code it, publish it, and watch someone interact with something that had previously existed only in my head."
      },
      {
        "type": "paragraph",
        "text": "I loved it. And apparently, I never grew out of it."
      },
      {
        "type": "paragraph",
        "text": "Even now, I find myself designing and coding websites for completely different purposes. Sometimes I need one. Sometimes an idea gets stuck in my head, and I just want to see it come alive. There is something satisfying about taking a thought from “what if?” to something you can actually open, click, and share."
      },
      {
        "type": "paragraph",
        "text": "Looking back, perhaps that feeling was familiar because I had always loved creating. I grew up painting, and coding eventually gave me a similar sense of possibility. A blank canvas and an empty code editor both leave room for you to make something of your own."
      },
      {
        "type": "paragraph",
        "text": "There are techniques and rules behind both, but also enormous freedom in what you choose to create. That combination of logic, experimentation, and creativity became one of my favorite things about technology."
      },
      {
        "type": "paragraph",
        "text": "Then robotics pulled me in."
      },
      {
        "type": "paragraph",
        "text": "An electrical engineering student I randomly met through a robotics club introduced me to another side of programming. Code could control something physical, respond to the world around it, and become part of a bigger system. That gave me a whole new set of things to be curious about."
      },
      {
        "type": "paragraph",
        "text": "After that came the Google Developer Student Club community at AUM. Through friends, colleagues, workshops, and competitions, I started exploring cybersecurity and CTFs. Other people introduced me to game development and different corners of computing."
      },
      {
        "type": "paragraph",
        "text": "Someone would open one door, and I would somehow end up exploring the entire room."
      },
      {
        "type": "paragraph",
        "text": "AI became the next major turning point through the UC Berkeley AI & Entrepreneurship Program. I began seeing how AI, data, software, and entrepreneurship could come together to solve actual problems. An idea could grow into a project, a product, or a question worth investigating."
      },
      {
        "type": "paragraph",
        "text": "From there, AI and data science became the area I wanted to understand more deeply. Through my studies and projects, coding gradually became something I did for fun as well as something I studied. I could spend hours experimenting simply because I wanted to know what would happen."
      },
      {
        "type": "heading",
        "text": "Three days, one curse, and very little sleep"
      },
      {
        "type": "paragraph",
        "text": "After diving deeper into AI, I found myself joining a game competition right after my last university final. My friend had been insisting that I join while I was still studying for exams. On her last call, she told me she had joined a team of artists and was the only programmer."
      },
      {
        "type": "paragraph",
        "text": "Neither of us knew game development yet. There had been a week to learn, but I joined with only four days left before the competition. I used AI tools and YouTube tutorials to learn what I could, including how to animate. Then came three intense days of building."
      },
      {
        "type": "paragraph",
        "text": "I had barely slept during finals, and I barely slept during the competition either. But together, we made it happen. Our original 2D game, Werewolf’s Curse, won First Place for Best Game in Kuwait and the Best Game Design Award, both in the Creative Category at the National Cultural Game Jam — Season Two."
      },
      {
        "type": "paragraph",
        "text": "Looking back, that competition feels very typical of me: a friend convincing me to try something new, barely enough time to learn it, and somehow making it happen."
      },
      {
        "type": "paragraph",
        "text": "That story has a new chapter now: I independently reimagined the game as a 3D online adventure."
      },
      {
        "type": "link",
        "text": "A little detour into the world we built → Werewolf’s Curse",
        "href": "/blog/werewolf-curse-reimagined"
      },
      {
        "type": "heading",
        "text": "My joker card"
      },
      {
        "type": "paragraph",
        "text": "I started thinking of AI and data science as my “joker card.” Healthcare has data. Cybersecurity has data. Games, robotics, and businesses have data. Each field has its own questions, but learning how to work with data gave me a way to explore them."
      },
      {
        "type": "paragraph",
        "text": "Over time, that became something I noticed almost automatically. In game development, I began seeing data in how players moved, the choices they made, and where they struggled. In cybersecurity, I saw it in network traffic, system logs, and patterns that could reveal something unusual."
      },
      {
        "type": "paragraph",
        "text": "Once I started seeing data everywhere, I started imagining the models I could build from it—what they could recognize, what they might predict, and whether they would actually be useful. Every new field gave me another set of questions to explore."
      },
      {
        "type": "paragraph",
        "text": "Give me a new field, and I will probably start wondering: What could its data tell us? What could a model learn from it? What could we build with it?"
      },
      {
        "type": "link",
        "text": "A few places that curiosity has taken me → RISE, my AI fintech project in development",
        "href": "/?project=rise#studio-project"
      },
      {
        "type": "link",
        "text": "From curiosity to an interactive world → Werewolf’s Curse",
        "href": "/blog/werewolf-curse-reimagined"
      },
      {
        "type": "link",
        "text": "A cybersecurity detour → DecafShot, my CTF automation toolkit with a trained local ML classifier",
        "href": "https://github.com/Nourah-Alotaibi/DecafShot-No-AI-CTF-tool"
      },
      {
        "type": "link",
        "text": "Another corner of my cybersecurity work → CTF Control Room",
        "href": "https://github.com/Nourah-Alotaibi/ctf-control-house"
      },
      {
        "type": "heading",
        "text": "Choosing my own path"
      },
      {
        "type": "paragraph",
        "text": "Before that decision, I had taken EVA, my project from the UC Berkeley × AUM AI & Entrepreneurship Program, into competitions across Kuwait and the Gulf region. EVA is an AI-powered wearable assistant designed to support people with specific needs in everyday life. It combines computer vision and intelligent assistance to help users understand their surroundings, communicate, and receive real-time support."
      },
      {
        "type": "paragraph",
        "text": "In Kuwait, our team won a major prize that opened the door to competing internationally. EVA earned 2nd Place at the AUM Startup Challenge, 1st Place at the Gulf Hult Business & Innovation Competition, and Top 12 recognition globally at Babson College. Seeing an idea grow beyond the program into a project recognized locally, regionally, and internationally made entrepreneurship feel very real to me."
      },
      {
        "type": "link",
        "text": "The project, the prizes, and the places it took us → Explore EVA’s competition details",
        "href": "/?project=eva#studio-project"
      },
      {
        "type": "paragraph",
        "text": "After winning a regional competition, I was offered a **fully funded MBA at a prestigious university in Dubai** as part of the prize. It was an opportunity I deeply appreciated, and one I took seriously."
      },
      {
        "type": "paragraph",
        "text": "I loved entrepreneurship. My startup had become my little world, and I could imagine continuing down that path. But having another possibility in front of me made me think carefully about what I wanted to spend my days doing."
      },
      {
        "type": "paragraph",
        "text": "The answer kept being AI."
      },
      {
        "type": "paragraph",
        "text": "I turned down the fully funded MBA to pursue a **Master’s in Data Science and Artificial Intelligence** instead. I still value business and entrepreneurship, but I wanted to develop my technical understanding and explore research. There were too many questions I wanted to pursue."
      },
      {
        "type": "paragraph",
        "text": "**Being offered a good opportunity does not mean it has to be your opportunity.**"
      },
      {
        "type": "paragraph",
        "text": "Even during my master’s, some amazing job opportunities have come along, but their working hours conflicted with my class times. I appreciated those opportunities, but I couldn’t risk compromising my studies. I kept choosing to give my master’s the time it needed."
      },
      {
        "type": "paragraph",
        "text": "I am now working on my thesis in **Explainable AI for healthcare**, an area that brings together several things I care about: technology, understanding, and work that can benefit people."
      },
      {
        "type": "heading",
        "text": "Research changed my questions"
      },
      {
        "type": "paragraph",
        "text": "I am grateful to my professor and thesis supervisor, **Dr. Iyad Abu Doush**, for helping me understand the difference between developing a system and researching an idea."
      },
      {
        "type": "paragraph",
        "text": "As a developer, my instinct was to start building and find a way to make something work. As an entrepreneur, I also asked: *Who needs it?*"
      },
      {
        "type": "paragraph",
        "text": "Through his guidance, I am learning that a researcher starts earlier: *Why should this approach work? What does previous research tell us? What assumptions am I making, and how will I test them?* I am learning to understand why I am choosing a method before I start coding it."
      },
      {
        "type": "paragraph",
        "text": "Making a system work is still important. Research also asks what its performance tells us, whether the comparison is fair, and whether the evidence supports the explanation. I still love building things; I am learning to explain why I made each choice and what the evidence actually supports."
      },
      {
        "type": "paragraph",
        "text": "There is creativity in that, too."
      },
      {
        "type": "paragraph",
        "text": "Sometimes that creativity comes from looking at a result more carefully and finding a perspective that was previously hidden. Dr. Iyad encourages me to ask what a result actually reveals, what else could explain it, and how to present it in a way that helps others see something new."
      },
      {
        "type": "paragraph",
        "text": "I deeply value learning from someone whose approach to research gives me something to aspire to. He is helping me develop the habits of the researcher I hope to become."
      },
      {
        "type": "paragraph",
        "text": "Maybe I never really left the canvas. I just changed what I create on it."
      },
      {
        "type": "heading",
        "text": "Knowledge worth passing forward"
      },
      {
        "type": "paragraph",
        "text": "Teaching has remained another meaningful part of my journey. Through teaching and mentoring in programming, AI, robotics, and entrepreneurship, I have discovered how fulfilling it is to watch someone understand an idea, create something of their own, build it, and even win with it—and know that I helped them along the way."
      },
      {
        "type": "paragraph",
        "text": "My faith gives that a deeper meaning. The idea of beneficial knowledge—knowledge that continues to help others—shapes what I hope to contribute through teaching and research."
      },
      {
        "type": "paragraph",
        "text": "The Prophet Muhammad (ﷺ) said:"
      },
      {
        "type": "quote",
        "lang": "ar",
        "text": "«إِذَا مَاتَ الإِنْسَانُ انْقَطَعَ عَنْهُ عَمَلُهُ إِلَّا مِنْ ثَلَاثَةٍ: إِلَّا مِنْ صَدَقَةٍ جَارِيَةٍ، أَوْ عِلْمٍ يُنْتَفَعُ بِهِ، أَوْ وَلَدٍ صَالِحٍ يَدْعُو لَهُ»"
      },
      {
        "type": "quote",
        "text": "Meaning in English: When a person dies, their deeds cease except for three: ongoing charity, knowledge that benefits others, or a righteous child who prays for them."
      },
      {
        "type": "link",
        "text": "Sahih Muslim, Hadith 1631 → Read the source",
        "href": "https://sunnah.com/muslim/25/20"
      },
      {
        "type": "paragraph",
        "text": "What moves me most is the idea that beneficial knowledge can continue helping people long after the person who shared it is gone. It makes teaching and research feel especially meaningful: something I explain, build, or discover may help someone else learn, solve a problem, or pass that understanding on to another person."
      },
      {
        "type": "paragraph",
        "text": "Visiting doctors, hospitals, and clinics while working on medical AI—and seeing patients directly—made me feel how important this work really is. It became much more personal when I could see the people behind the problems we were trying to solve. Those experiences made the possibility of helping someone through technology feel real."
      },
      {
        "type": "paragraph",
        "text": "That is part of what connects projects such as Hayat, the AI assistant within EpiCare, and EVA, our AI-powered wearable assistant designed to support people with specific needs. They gave me different ways to think about how technology could support people in healthcare and everyday life."
      },
      {
        "type": "link",
        "text": "The people behind the purpose → Explore EpiCare and its AI assistant, Hayat",
        "href": "/?project=epicare#studio-project"
      },
      {
        "type": "link",
        "text": "AI support beyond the screen → Explore EVA",
        "href": "/?project=eva#studio-project"
      },
      {
        "type": "paragraph",
        "text": "That is part of what I want from research: to seek truth carefully, publish knowledge, and teach what I learn. Something I build, publish, or simply teach could help someone make a better decision—or give them the knowledge to build something that saves another person’s life. In healthcare, that could literally mean helping save a life. In other fields, it could mean protecting someone or easing their suffering. I want what I contribute to help relieve pain in its many forms and at every level, from making a difficult day easier to helping someone through something life-changing."
      },
      {
        "type": "paragraph",
        "text": "**I want to learn, but I also want what I learn to travel.**"
      },
      {
        "type": "heading",
        "text": "A path I would choose again"
      },
      {
        "type": "paragraph",
        "text": "Looking back, I can see how these different interests have connected. Painting gave me a love of creating. Web development gave me a way to turn ideas into experiences. Robotics made code physical. GDSC introduced me to communities and new challenges. Berkeley pushed me deeper into AI. Entrepreneurship taught me to think about who a project could help. Research is teaching me to question what I find."
      },
      {
        "type": "paragraph",
        "text": "And I am still curious."
      },
      {
        "type": "paragraph",
        "text": "I still want to build, create, teach, and research. Whether I am opening an empty code editor, looking at a dataset, or examining a result, I keep coming back to the same questions:"
      },
      {
        "type": "paragraph",
        "text": "*What can I create from this? What can I discover? And who could it help?*"
      },
      {
        "type": "paragraph",
        "text": "There is too much left to learn, too much left to build, and too much knowledge worth sharing."
      },
      {
        "type": "paragraph",
        "text": "**If I were given those choices again, I would choose this path again and again.**"
      }
    ]
  },
  {
    "slug": "werewolf-curse-reimagined",
    "title": "From first place in 2D to a new world in 3D.",
    "date": "2026-10-03",
    "excerpt": "Werewolf’s Curse has a new chapter. I’ve independently reimagined the award-winning 2D game as a playable 3D online adventure.",
    "content": [
      {
        "type": "heading",
        "text": "An award was a milestone. I wanted to keep building."
      },
      {
        "type": "paragraph",
        "text": "I created the original Werewolf’s Curse with a team in three intense days for the National Cultural Game Jam — Season Two. It earned First Place for Best Game in Kuwait and the Best Game Design Award, both in the Creative Category."
      },
      {
        "type": "paragraph",
        "text": "That achievement remains a proud part of the game’s story. But I kept wondering what this adventure could become in a different dimension."
      },
      {
        "type": "paragraph",
        "text": "For this new 3D version, I took on the development independently. Revisiting the idea gave me a chance to apply what I’ve learned, experiment, and build a world players can explore from a new perspective."
      },
      {
        "type": "heading",
        "text": "One curse. A journey back to being human."
      },
      {
        "type": "paragraph",
        "text": "A man confronts a witch, only to be cursed and transformed into a werewolf. He wakes in a strange cave, where his search for a way out begins."
      },
      {
        "type": "paragraph",
        "text": "The adventure takes him across cave ledges and past bats, into a forest to collect ingredients, and finally to a hidden laboratory. There, the right mixture can break the curse and restore his human form."
      },
      {
        "type": "paragraph",
        "text": "The video above shows the full opening from the actual game. You can then step into the adventure yourself."
      },
      {
        "type": "heading",
        "text": "Old ideas can open new doors."
      },
      {
        "type": "paragraph",
        "text": "Returning to a project can show you how much you’ve grown. An idea you once brought to life under a deadline can become a new challenge, with more room to explore and learn."
      },
      {
        "type": "paragraph",
        "text": "If there’s something you still think about building, give it another chance. Start with what you know, stay curious, and see how far you can take it."
      }
    ],
    "video": {
      "src": "/videos/werewolf-intro-2026.mp4",
      "poster": "/videos/werewolf-intro-cover.png",
      "caption": "The actual 3D game introduction: the confrontation, the witch’s curse, and the beginning of the search for a cure. 29 seconds."
    },
    "playHref": "/werewolf/"
  }
];

export const sortedBlogPosts = [...blogPosts].sort((a, b) => b.date.localeCompare(a.date));
