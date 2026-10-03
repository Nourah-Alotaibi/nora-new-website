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
        "text": "My journey into AI started before AI became something everyone was talking about. And strangely enough, it did not start with AI."
      },
      {
        "type": "paragraph",
        "text": "It started with learning how to build a website."
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
        "text": "Give me a new field, and I will probably start wondering: What could its data tell us? What could a model learn from it? What could we build with it?"
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
        "text": "After winning a regional competition, I was offered a **fully funded MBA** as part of the prize. It was an opportunity I deeply appreciated, and one I took seriously."
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
        "text": "I turned down the MBA opportunity and chose to continue deeper into AI and data science. I still value business and entrepreneurship, but I wanted to develop my technical understanding and explore research. There were too many questions I wanted to pursue."
      },
      {
        "type": "paragraph",
        "text": "**Being offered a good opportunity does not mean it has to be your opportunity.**"
      },
      {
        "type": "paragraph",
        "text": "That choice led me to a Master’s in Data Science and Artificial Intelligence. I am now working on my thesis in **Explainable AI for healthcare**, an area that brings together several things I care about: technology, understanding, and work that can benefit people."
      },
      {
        "type": "heading",
        "text": "Research changed my questions"
      },
      {
        "type": "paragraph",
        "text": "As a developer, I often thought: *Can I build it?*"
      },
      {
        "type": "paragraph",
        "text": "As an entrepreneur: *Who needs it?*"
      },
      {
        "type": "paragraph",
        "text": "Now, as a researcher: *Why did it work? Is the comparison fair? Can I trust this result? What does the evidence actually allow me to say?*"
      },
      {
        "type": "paragraph",
        "text": "I still love building things. Research is teaching me to examine them more carefully—to question a result, investigate what might explain it, and look for a perspective I had missed."
      },
      {
        "type": "paragraph",
        "text": "There is creativity in that, too."
      },
      {
        "type": "heading",
        "text": "Knowledge worth passing forward"
      },
      {
        "type": "paragraph",
        "text": "Teaching has remained another meaningful part of my journey. Through teaching and mentoring in programming, AI, robotics, and entrepreneurship, I have discovered how fulfilling it is to watch someone understand something because you helped make it clearer."
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
        "text": "I am especially grateful to my professor and thesis supervisor, **Dr. Iyad Abu Doush**. He encourages me to go beyond obtaining results and ask what those results reveal, what else could explain them, and how to present them in a way that shows a new perspective."
      },
      {
        "type": "paragraph",
        "text": "His guidance is helping shape the researcher I hope to become."
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
