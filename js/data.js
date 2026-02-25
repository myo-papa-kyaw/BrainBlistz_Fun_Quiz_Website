// js/data.js
// Complete Quiz Data: 3 Categories, 10 Questions Each

const quizData = {
  // 🌍 GENERAL KNOWLEDGE (10 Questions)
  general: [
    { 
      question: "What is the smallest prime number?", 
      options: ["0", "1", "2", "3"], 
      answer: "2" 
    },
    { 
      question: "What is the longest river in the world?", 
      options: ["Amazon", "Nile", "Yangtze", "Mississippi"], 
      answer: "Nile" 
    },
    { 
      question: "Who painted the Mona Lisa?", 
      options: ["Michelangelo", "Leonardo da Vinci", "Raphael", "Caravaggio"], 
      answer: "Leonardo da Vinci" 
    },
    { 
      question: "What is the capital of Canada?", 
      options: ["Toronto", "Vancouver", "Ottawa", "Montreal"], 
      answer: "Ottawa" 
    },
    { 
      question: "What element has the chemical symbol 'O'?", 
      options: ["Gold", "Oxygen", "Osmium", "Oganesson"], 
      answer: "Oxygen" 
    },
    { 
      question: "In what year did the Titanic sink?", 
      options: ["1912", "1905", "1898", "1923"], 
      answer: "1912" 
    },
    { 
      question: "What is the largest mammal in the world?", 
      options: ["Elephant", "Blue whale", "Giraffe", "Great white shark"], 
      answer: "Blue whale" 
    },
    { 
      question: "How many continents are there on Earth?", 
      options: ["5", "6", "7", "8"], 
      answer: "7" 
    },
    { 
      question: "Who wrote the novel '1984'?", 
      options: ["Aldous Huxley", "George Orwell", "Ray Bradbury", "Margaret Atwood"], 
      answer: "George Orwell" 
    },
    { 
      question: "Which planet is known as the Red Planet?", 
      options: ["Venus", "Mars", "Jupiter", "Saturn"], 
      answer: "Mars" 
    }
  ],

  // 💻 PROGRAMMING (10 Questions)
  programming: [
    { 
      question: "What is the primary language for native iOS development?", 
      options: ["Java", "Swift", "Kotlin", "C#"], 
      answer: "Swift" 
    },
    { 
      question: "What does CSS stand for?", 
      options: ["Cascading Style Sheets", "Computer Style Sheets", "Creative Style System", "Colorful Sheet Syntax"], 
      answer: "Cascading Style Sheets" 
    },
    { 
      question: "Which JavaScript method adds an item to the end of an array?", 
      options: ["push()", "pop()", "shift()", "unshift()"], 
      answer: "push()" 
    },
    { 
      question: "What does typeof null return in JavaScript?", 
      options: ["null", "undefined", "object", "boolean"], 
      answer: "object" 
    },
    { 
      question: "Which of these is a popular version control system?", 
      options: ["Git", "jQuery", "React", "Sass"], 
      answer: "Git" 
    },
    { 
      question: "What keyword is used to define a function in Python?", 
      options: ["func", "define", "def", "function"], 
      answer: "def" 
    },
    { 
      question: "What does SQL stand for?", 
      options: ["Structured Query Language", "Simple Query Language", "Sequential Query Language", "Standard Question Language"], 
      answer: "Structured Query Language" 
    },
    { 
      question: "What is the syntax for a single-line comment in JavaScript?", 
      options: ["//", "/*", "#", "<!--"], 
      answer: "//" 
    },
    { 
      question: "What does HTML stand for?", 
      options: ["Hyper Text Markup Language", "High Text Markup Language", "Hyper Tool Markup Language", "None of the above"], 
      answer: "Hyper Text Markup Language" 
    },
    { 
      question: "Which HTTP status code represents 'Not Found'?", 
      options: ["200", "301", "404", "500"], 
      answer: "404" 
    }
  ],

  // 🎬 FUN & POP CULTURE (10 Questions)
  fun: [
    { 
      question: "Which Disney movie features the song 'Let It Go'?", 
      options: ["Moana", "Tangled", "Frozen", "The Little Mermaid"], 
      answer: "Frozen" 
    },
    { 
      question: "What is the name of Harry Potter's owl?", 
      options: ["Errol", "Hedwig", "Pigwidgeon", "Crookshanks"], 
      answer: "Hedwig" 
    },
    { 
      question: "Which band performed 'Bohemian Rhapsody'?", 
      options: ["Led Zeppelin", "Queen", "The Beatles", "Pink Floyd"], 
      answer: "Queen" 
    },
    { 
      question: "What is the name of Thor's hammer in Norse mythology?", 
      options: ["Stormbreaker", "Mjolnir", "Jarnbjorn", "Dragonfang"], 
      answer: "Mjolnir" 
    },
    { 
      question: "In what year was the first iPhone released?", 
      options: ["2005", "2007", "2008", "2010"], 
      answer: "2007" 
    },
    { 
      question: "What is the best-selling video game of all time (as of 2024)?", 
      options: ["Minecraft", "Grand Theft Auto V", "Tetris", "Wii Sports"], 
      answer: "Minecraft" 
    },
    { 
      question: "Which artist is known as the 'Queen of Pop'?", 
      options: ["Beyoncé", "Lady Gaga", "Madonna", "Taylor Swift"], 
      answer: "Madonna" 
    },
    { 
      question: "What is the name of Simba's father in The Lion King?", 
      options: ["Scar", "Mufasa", "Timon", "Rafiki"], 
      answer: "Mufasa" 
    },
    { 
      question: "Which superhero is known for climbing walls and shooting webs?", 
      options: ["Superman", "Spider-Man", "Iron Man", "Batman"], 
      answer: "Spider-Man" 
    },
    { 
      question: "What is the name of the cowboy toy in Toy Story?", 
      options: ["Buzz Lightyear", "Woody", "Jessie", "Rex"], 
      answer: "Woody" 
    }
  ]
};

// Make quizData available globally for other scripts
if (typeof window !== 'undefined') {
  window.quizData = quizData;
}