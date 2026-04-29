// js/data.js
// Quiz data with short learning explanations for each answer.

const quizData = {
  general: [
    {
      question: "What is the smallest prime number?",
      options: ["0", "1", "2", "3"],
      answer: "2",
      explanation: "A prime number has exactly two factors: 1 and itself. The number 2 is the smallest number that fits that rule."
    },
    {
      question: "What is the longest river in the world?",
      options: ["Amazon", "Nile", "Yangtze", "Mississippi"],
      answer: "Nile",
      explanation: "The Nile is traditionally taught as the world's longest river, while the Amazon is known for its huge water volume."
    },
    {
      question: "Who painted the Mona Lisa?",
      options: ["Michelangelo", "Leonardo da Vinci", "Raphael", "Caravaggio"],
      answer: "Leonardo da Vinci",
      explanation: "The Mona Lisa was painted by Leonardo da Vinci and is one of the most famous artworks from the Renaissance."
    },
    {
      question: "What is the capital of Canada?",
      options: ["Toronto", "Vancouver", "Ottawa", "Montreal"],
      answer: "Ottawa",
      explanation: "Ottawa is Canada's capital city, even though Toronto is larger and more internationally well known."
    },
    {
      question: "What element has the chemical symbol 'O'?",
      options: ["Gold", "Oxygen", "Osmium", "Oganesson"],
      answer: "Oxygen",
      explanation: "The symbol O stands for oxygen, the element essential for breathing and many chemical reactions."
    },
    {
      question: "In what year did the Titanic sink?",
      options: ["1912", "1905", "1898", "1923"],
      answer: "1912",
      explanation: "The Titanic sank in 1912 after striking an iceberg during its maiden voyage."
    },
    {
      question: "What is the largest mammal in the world?",
      options: ["Elephant", "Blue whale", "Giraffe", "Great white shark"],
      answer: "Blue whale",
      explanation: "The blue whale is the largest mammal and the largest animal known to have lived on Earth."
    },
    {
      question: "How many continents are there on Earth?",
      options: ["5", "6", "7", "8"],
      answer: "7",
      explanation: "The standard school model counts seven continents across the world."
    },
    {
      question: "Who wrote the novel '1984'?",
      options: ["Aldous Huxley", "George Orwell", "Ray Bradbury", "Margaret Atwood"],
      answer: "George Orwell",
      explanation: "George Orwell wrote 1984, a famous dystopian novel about surveillance and authoritarian power."
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      answer: "Mars",
      explanation: "Mars is called the Red Planet because iron oxide on its surface gives it a reddish color."
    }
  ],

  programming: [
    {
      question: "What is the primary language for native iOS development?",
      options: ["Java", "Swift", "Kotlin", "C#"],
      answer: "Swift",
      explanation: "Swift is Apple's main modern language for building native iPhone and iPad apps."
    },
    {
      question: "What does CSS stand for?",
      options: ["Cascading Style Sheets", "Computer Style Sheets", "Creative Style System", "Colorful Sheet Syntax"],
      answer: "Cascading Style Sheets",
      explanation: "CSS stands for Cascading Style Sheets and controls the design and layout of web pages."
    },
    {
      question: "Which JavaScript method adds an item to the end of an array?",
      options: ["push()", "pop()", "shift()", "unshift()"],
      answer: "push()",
      explanation: "push() adds a value to the end of an array. In contrast, pop() removes the last value."
    },
    {
      question: "What does typeof null return in JavaScript?",
      options: ["null", "undefined", "object", "boolean"],
      answer: "object",
      explanation: "typeof null returns object because of a long-standing JavaScript quirk kept for backward compatibility."
    },
    {
      question: "Which of these is a popular version control system?",
      options: ["Git", "jQuery", "React", "Sass"],
      answer: "Git",
      explanation: "Git is a version control system used to track changes in code and support collaboration."
    },
    {
      question: "What keyword is used to define a function in Python?",
      options: ["func", "define", "def", "function"],
      answer: "def",
      explanation: "Python uses the def keyword to declare a function before its name and parameter list."
    },
    {
      question: "What does SQL stand for?",
      options: ["Structured Query Language", "Simple Query Language", "Sequential Query Language", "Standard Question Language"],
      answer: "Structured Query Language",
      explanation: "SQL stands for Structured Query Language and is used to read and manage relational database data."
    },
    {
      question: "What is the syntax for a single-line comment in JavaScript?",
      options: ["//", "/*", "#", "<!--"],
      answer: "//",
      explanation: "JavaScript uses double forward slashes for a single-line comment. Block comments use slash-star syntax."
    },
    {
      question: "What does HTML stand for?",
      options: ["Hyper Text Markup Language", "High Text Markup Language", "Hyper Tool Markup Language", "None of the above"],
      answer: "Hyper Text Markup Language",
      explanation: "HTML stands for Hyper Text Markup Language and provides the structure of a web page."
    },
    {
      question: "Which HTTP status code represents 'Not Found'?",
      options: ["200", "301", "404", "500"],
      answer: "404",
      explanation: "A 404 response means the requested page or resource could not be found by the server."
    }
  ],

  fun: [
    {
      question: "Which Disney movie features the song 'Let It Go'?",
      options: ["Moana", "Tangled", "Frozen", "The Little Mermaid"],
      answer: "Frozen",
      explanation: "Let It Go is the signature song from Frozen and is sung by Elsa in the film."
    },
    {
      question: "What is the name of Harry Potter's owl?",
      options: ["Errol", "Hedwig", "Pigwidgeon", "Crookshanks"],
      answer: "Hedwig",
      explanation: "Hedwig is Harry Potter's snowy owl and one of the most memorable animal companions in the series."
    },
    {
      question: "Which band performed 'Bohemian Rhapsody'?",
      options: ["Led Zeppelin", "Queen", "The Beatles", "Pink Floyd"],
      answer: "Queen",
      explanation: "Bohemian Rhapsody is one of Queen's best-known songs and a landmark in rock music."
    },
    {
      question: "What is the name of Thor's hammer in Norse mythology?",
      options: ["Stormbreaker", "Mjolnir", "Jarnbjorn", "Dragonfang"],
      answer: "Mjolnir",
      explanation: "Mjolnir is Thor's hammer in Norse mythology and became even more famous through Marvel films."
    },
    {
      question: "In what year was the first iPhone released?",
      options: ["2005", "2007", "2008", "2010"],
      answer: "2007",
      explanation: "Apple launched the first iPhone in 2007, changing the direction of the smartphone market."
    },
    {
      question: "What is the best-selling video game of all time (as of 2024)?",
      options: ["Minecraft", "Grand Theft Auto V", "Tetris", "Wii Sports"],
      answer: "Minecraft",
      explanation: "Minecraft is widely recognized as the best-selling video game ever based on total copies sold."
    },
    {
      question: "Which artist is known as the 'Queen of Pop'?",
      options: ["Beyonce", "Lady Gaga", "Madonna", "Taylor Swift"],
      answer: "Madonna",
      explanation: "Madonna is often called the Queen of Pop because of her long influence on music, fashion, and popular culture."
    },
    {
      question: "What is the name of Simba's father in The Lion King?",
      options: ["Scar", "Mufasa", "Timon", "Rafiki"],
      answer: "Mufasa",
      explanation: "Mufasa is Simba's father and the king of the Pride Lands in The Lion King."
    },
    {
      question: "Which superhero is known for climbing walls and shooting webs?",
      options: ["Superman", "Spider-Man", "Iron Man", "Batman"],
      answer: "Spider-Man",
      explanation: "Spider-Man is known for wall-crawling, web-shooting, and spider-like agility."
    },
    {
      question: "What is the name of the cowboy toy in Toy Story?",
      options: ["Buzz Lightyear", "Woody", "Jessie", "Rex"],
      answer: "Woody",
      explanation: "Woody is the cowboy toy who serves as one of the central characters in the Toy Story series."
    }
  ]
};

if (typeof window !== 'undefined') {
  window.quizData = quizData;
}
