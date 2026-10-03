export type BlogBlock = { type: "heading" | "paragraph"; text: string };
export type BlogPost = { slug: string; title: string; date: string; excerpt: string; content: BlogBlock[]; video?: { src: string; poster: string; caption: string }; playHref?: string };

export const blogPosts: BlogPost[] = [
  {
    "slug": "my-journey-into-ai",
    "title": "My Journey Into AI",
    "date": "2026-10-03",
    "excerpt": "Web development, robots, cybersecurity, Berkeley, research, and all the random people and decisions that somehow led me into AI.",
    "content": [
      {
        "type": "paragraph",
        "text": "My journey into AI started before AI became something everyone was talking about."
      },
      {
        "type": "paragraph",
        "text": "And strangely enough, it did not actually start with AI."
      },
      {
        "type": "paragraph",
        "text": "It started with web development."
      },
      {
        "type": "paragraph",
        "text": "Around 2021–2022, way before ChatGPT existed, I became interested in building websites."
      },
      {
        "type": "paragraph",
        "text": "At first, I was fascinated by the simple idea that I could write something on my laptop and somehow turn it into an actual experience that another person could open, click through, and interact with."
      },
      {
        "type": "paragraph",
        "text": "Building my first website completely changed how I saw programming."
      },
      {
        "type": "paragraph",
        "text": "Code suddenly was not just code."
      },
      {
        "type": "paragraph",
        "text": "It could become something visual."
      },
      {
        "type": "paragraph",
        "text": "Something useful."
      },
      {
        "type": "paragraph",
        "text": "Something people could actually experience."
      },
      {
        "type": "paragraph",
        "text": "And that was probably the first thing that really got me hooked."
      },
      {
        "type": "paragraph",
        "text": "Over time, web development became much more than simply learning how websites were coded."
      },
      {
        "type": "paragraph",
        "text": "I found myself thinking about how websites looked, how people interacted with them, how information should be organized, and how an idea could become an actual digital product."
      },
      {
        "type": "paragraph",
        "text": "I started creating websites for different purposes, experimenting with designs, interfaces, and increasingly ambitious ideas."
      },
      {
        "type": "paragraph",
        "text": "Coding broadened almost inevitably."
      },
      {
        "type": "paragraph",
        "text": "Every time I learned one thing, it somehow opened another door."
      },
      {
        "type": "heading",
        "text": "ROBOTICS"
      },
      {
        "type": "paragraph",
        "text": "One of those doors was robotics."
      },
      {
        "type": "paragraph",
        "text": "And funny enough, that one started because of a person I randomly met."
      },
      {
        "type": "paragraph",
        "text": "An Electrical Engineering student I met through a robotics club introduced me to that world, and suddenly programming was no longer something that only existed inside my laptop."
      },
      {
        "type": "paragraph",
        "text": "Code could make something move."
      },
      {
        "type": "paragraph",
        "text": "It could interact with sensors."
      },
      {
        "type": "paragraph",
        "text": "It could control something physical."
      },
      {
        "type": "paragraph",
        "text": "It could exist in the real world."
      },
      {
        "type": "paragraph",
        "text": "That completely changed the way I thought about engineering."
      },
      {
        "type": "paragraph",
        "text": "Robotics made programming feel physical."
      },
      {
        "type": "paragraph",
        "text": "It connected software with hardware, and as a Computer Engineering student, that connection naturally interested me."
      },
      {
        "type": "paragraph",
        "text": "I started realizing how enormous the technology world actually was."
      },
      {
        "type": "heading",
        "text": "AND THEN MY FRIENDS MADE IT WORSE"
      },
      {
        "type": "paragraph",
        "text": "In the best possible way."
      },
      {
        "type": "paragraph",
        "text": "I would rather not expose all of them by name, but each one somehow managed to get me hooked on a completely different area of technology."
      },
      {
        "type": "paragraph",
        "text": "One person introduced me to robotics."
      },
      {
        "type": "paragraph",
        "text": "A few colleagues I met through the Google Developer Student Clubs community at AUM got me interested in cybersecurity."
      },
      {
        "type": "paragraph",
        "text": "Through the community, workshops, competitions, and the people around me, I started exploring cybersecurity challenges and CTFs."
      },
      {
        "type": "paragraph",
        "text": "Suddenly I was looking at technology from another angle entirely."
      },
      {
        "type": "paragraph",
        "text": "Instead of only asking:"
      },
      {
        "type": "paragraph",
        "text": "“How do I build this?”"
      },
      {
        "type": "paragraph",
        "text": "I was also asking:"
      },
      {
        "type": "paragraph",
        "text": "“How could someone break this?”"
      },
      {
        "type": "paragraph",
        "text": "And:"
      },
      {
        "type": "paragraph",
        "text": "“How do I protect it?”"
      },
      {
        "type": "paragraph",
        "text": "That way of thinking was surprisingly addictive."
      },
      {
        "type": "paragraph",
        "text": "Another friend introduced me to game development."
      },
      {
        "type": "paragraph",
        "text": "And naturally, once I realized programming could also create entire interactive worlds, I continued exploring from there."
      },
      {
        "type": "paragraph",
        "text": "At some point, I realized I did not really have one narrow interest in technology."
      },
      {
        "type": "paragraph",
        "text": "I liked building things."
      },
      {
        "type": "paragraph",
        "text": "I liked understanding how things worked."
      },
      {
        "type": "paragraph",
        "text": "And whenever I discovered a new technical area, I wanted to open it up and see what was inside."
      },
      {
        "type": "heading",
        "text": "THEN AI ENTERED THE PICTURE"
      },
      {
        "type": "paragraph",
        "text": "My interest in AI became much more serious through the UC Berkeley AI & Entrepreneurship Program."
      },
      {
        "type": "paragraph",
        "text": "Learning from professors there and being surrounded by people discussing artificial intelligence not simply as an interesting technology, but as something that could become a product, a business, a research direction, or a solution to an actual problem changed my perspective again."
      },
      {
        "type": "paragraph",
        "text": "AI stopped feeling like one isolated technical subject."
      },
      {
        "type": "paragraph",
        "text": "It connected everything."
      },
      {
        "type": "paragraph",
        "text": "Software."
      },
      {
        "type": "paragraph",
        "text": "Data."
      },
      {
        "type": "paragraph",
        "text": "Healthcare."
      },
      {
        "type": "paragraph",
        "text": "Business."
      },
      {
        "type": "paragraph",
        "text": "Research."
      },
      {
        "type": "paragraph",
        "text": "Engineering."
      },
      {
        "type": "paragraph",
        "text": "Human behavior."
      },
      {
        "type": "paragraph",
        "text": "Decision-making."
      },
      {
        "type": "paragraph",
        "text": "And so many other fields."
      },
      {
        "type": "paragraph",
        "text": "That was when I started going much deeper."
      },
      {
        "type": "paragraph",
        "text": "Machine learning led me into data science."
      },
      {
        "type": "paragraph",
        "text": "Data science led me into research."
      },
      {
        "type": "paragraph",
        "text": "And somewhere along the way, I started thinking of data as a kind of joker card."
      },
      {
        "type": "paragraph",
        "text": "Almost every industry has it."
      },
      {
        "type": "paragraph",
        "text": "Every organization creates it."
      },
      {
        "type": "paragraph",
        "text": "Every system depends on it."
      },
      {
        "type": "paragraph",
        "text": "And if you know how to understand it properly, you can enter completely different domains and still have something valuable to contribute."
      },
      {
        "type": "paragraph",
        "text": "That idea fascinated me."
      },
      {
        "type": "heading",
        "text": "FROM BUILDING THINGS TO ASKING RESEARCH QUESTIONS"
      },
      {
        "type": "paragraph",
        "text": "For a long time, I mainly thought like a developer."
      },
      {
        "type": "paragraph",
        "text": "I wanted to build."
      },
      {
        "type": "paragraph",
        "text": "A website."
      },
      {
        "type": "paragraph",
        "text": "An application."
      },
      {
        "type": "paragraph",
        "text": "An AI system."
      },
      {
        "type": "paragraph",
        "text": "A tool."
      },
      {
        "type": "paragraph",
        "text": "A prototype."
      },
      {
        "type": "paragraph",
        "text": "Something that worked."
      },
      {
        "type": "paragraph",
        "text": "But research slowly changed the questions I was asking."
      },
      {
        "type": "paragraph",
        "text": "Instead of only asking:"
      },
      {
        "type": "paragraph",
        "text": "“Can I build this?”"
      },
      {
        "type": "paragraph",
        "text": "I started asking:"
      },
      {
        "type": "paragraph",
        "text": "“Why does this work?”"
      },
      {
        "type": "paragraph",
        "text": "“How well does it work?”"
      },
      {
        "type": "paragraph",
        "text": "“What happens when the data changes?”"
      },
      {
        "type": "paragraph",
        "text": "“Can I trust the result?”"
      },
      {
        "type": "paragraph",
        "text": "“Why did the model make that prediction?”"
      },
      {
        "type": "paragraph",
        "text": "“Would another method behave differently?”"
      },
      {
        "type": "paragraph",
        "text": "And that transition from simply building systems to actually investigating them became one of the biggest changes in my journey."
      },
      {
        "type": "paragraph",
        "text": "There was even a point where I seriously considered taking a different direction and pursuing an MBA."
      },
      {
        "type": "paragraph",
        "text": "Business genuinely interests me, especially entrepreneurship and the process of turning technical ideas into things people can actually use."
      },
      {
        "type": "paragraph",
        "text": "But when I thought about what I wanted to become better at, I kept coming back to the technical and research side."
      },
      {
        "type": "paragraph",
        "text": "There were still too many things I wanted to understand."
      },
      {
        "type": "paragraph",
        "text": "So I continued with a Master’s in Data Science and Artificial Intelligence."
      },
      {
        "type": "heading",
        "text": "MY THESIS"
      },
      {
        "type": "paragraph",
        "text": "I am currently working on my Master’s thesis in Explainable AI for healthcare."
      },
      {
        "type": "paragraph",
        "text": "I like this area because healthcare is one of those fields where AI should not only make predictions, but should also help us understand why a model reached a particular result."
      },
      {
        "type": "paragraph",
        "text": "That combination of AI, data, research, and real-world impact is what made the area especially interesting to me."
      },
      {
        "type": "heading",
        "text": "THE PEOPLE BEHIND THE JOURNEY"
      },
      {
        "type": "paragraph",
        "text": "One thing I have realized is that careers are rarely shaped by courses alone."
      },
      {
        "type": "paragraph",
        "text": "People change them."
      },
      {
        "type": "paragraph",
        "text": "Sometimes one conversation is enough to introduce you to an entire field you had never seriously considered before."
      },
      {
        "type": "paragraph",
        "text": "A student you randomly meet in a robotics club."
      },
      {
        "type": "paragraph",
        "text": "Friends from a developer community."
      },
      {
        "type": "paragraph",
        "text": "A professor explaining something in a way that suddenly makes it click."
      },
      {
        "type": "paragraph",
        "text": "Someone showing you game development."
      },
      {
        "type": "paragraph",
        "text": "Someone convincing you to join a competition."
      },
      {
        "type": "paragraph",
        "text": "Someone asking a question about your work that you cannot stop thinking about afterward."
      },
      {
        "type": "paragraph",
        "text": "A lot of my journey came from those small interactions."
      },
      {
        "type": "paragraph",
        "text": "And I think that is why I have always enjoyed teaching and sharing what I know too."
      },
      {
        "type": "paragraph",
        "text": "There is something beautiful about the idea that knowledge keeps moving from one person to another."
      },
      {
        "type": "paragraph",
        "text": "This also connects strongly with something I value personally in Islam: the importance given to seeking knowledge, teaching it, and benefiting others through it."
      },
      {
        "type": "paragraph",
        "text": "It makes learning feel like more than collecting qualifications."
      },
      {
        "type": "paragraph",
        "text": "Knowledge becomes something you are responsible for using well and passing forward."
      },
      {
        "type": "heading",
        "text": "I STILL BUILD THINGS"
      },
      {
        "type": "paragraph",
        "text": "Research did not replace the part of me that likes creating things."
      },
      {
        "type": "paragraph",
        "text": "If anything, my interests have become even broader."
      },
      {
        "type": "paragraph",
        "text": "I still find myself coding websites for completely different purposes."
      },
      {
        "type": "paragraph",
        "text": "Designing interfaces."
      },
      {
        "type": "paragraph",
        "text": "Experimenting with 3D web experiences."
      },
      {
        "type": "paragraph",
        "text": "Building AI projects."
      },
      {
        "type": "paragraph",
        "text": "Playing with cybersecurity tools."
      },
      {
        "type": "paragraph",
        "text": "Thinking about assistants and agents."
      },
      {
        "type": "paragraph",
        "text": "Trying ideas that have absolutely nothing to do with my thesis."
      },
      {
        "type": "paragraph",
        "text": "And occasionally opening a new project when I already have far too many unfinished ones."
      },
      {
        "type": "paragraph",
        "text": "I do not think that part is going away."
      },
      {
        "type": "paragraph",
        "text": "The difference now is that I see all of these interests as connected rather than random."
      },
      {
        "type": "paragraph",
        "text": "They all come from the same curiosity:"
      },
      {
        "type": "paragraph",
        "text": "“What can I make technology do?”"
      },
      {
        "type": "paragraph",
        "text": "And increasingly:"
      },
      {
        "type": "paragraph",
        "text": "“How can I make sure it does it well?”"
      },
      {
        "type": "heading",
        "text": "LOOKING BACK"
      },
      {
        "type": "paragraph",
        "text": "If you had told the version of me building websites in 2021–2022 that a few years later I would be doing graduate research in AI, I probably would not have predicted that path."
      },
      {
        "type": "paragraph",
        "text": "But looking backward, it makes sense."
      },
      {
        "type": "paragraph",
        "text": "Web development opened the door."
      },
      {
        "type": "paragraph",
        "text": "Robotics connected code to the real world."
      },
      {
        "type": "paragraph",
        "text": "GDSC exposed me to cybersecurity and technical communities."
      },
      {
        "type": "paragraph",
        "text": "Friends kept pulling me into completely different corners of technology."
      },
      {
        "type": "paragraph",
        "text": "UC Berkeley pushed AI from an interest into something I wanted to understand seriously."
      },
      {
        "type": "paragraph",
        "text": "Data science gave me a way to connect technology with almost any domain."
      },
      {
        "type": "paragraph",
        "text": "And my Master’s pushed me from primarily being someone who builds systems into someone who also wants to investigate, evaluate, and understand them."
      },
      {
        "type": "paragraph",
        "text": "I still do not know exactly where all of that will lead."
      },
      {
        "type": "paragraph",
        "text": "And I actually like that."
      },
      {
        "type": "paragraph",
        "text": "There are too many things I still want to build, study, experiment with, and understand."
      },
      {
        "type": "paragraph",
        "text": "But if I had to go back to that first website and choose whether to open that door again,"
      },
      {
        "type": "paragraph",
        "text": "I would choose this path again and again."
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
        "text": "The original Werewolf’s Curse was created in three intense days for the National Cultural Game Jam — Season Two. It earned First Place for Best Game in Kuwait and the Best Game Design Award, both in the Creative Category."
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
      "poster": "/videos/werewolf-intro-2026-poster.jpg",
      "caption": "The actual 3D game introduction: the confrontation, the witch’s curse, and the beginning of the search for a cure. 29 seconds."
    },
    "playHref": "/werewolf/"
  }
];

export const sortedBlogPosts = [...blogPosts].sort((a, b) => b.date.localeCompare(a.date));
