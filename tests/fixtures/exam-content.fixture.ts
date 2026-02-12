export const enExamFixture = {
  examType: 'EN',
  subjects: [
    {
      id: 'en-romana-8',
      name: 'Română',
      level: 'gimnaziu',
      examType: 'EN',
      chapters: [
        {
          id: 'en-ro-text-literar',
          name: 'Text literar',
          order: 1,
          quizzes: [
            {
              id: 'quiz-en-ro-text-literar-1',
              title: 'Quiz 1 - Text literar',
              difficulty: 'medium',
              examType: 'EN',
              questions: [
                {
                  id: 'q-en-ro-text-literar-1',
                  question: 'Care este trăsătura principală a textului literar?',
                  options: [
                    'Are scop informativ',
                    'Transmite emoții și imagini artistice',
                    'Explică un fenomen științific',
                    'Prezintă date statistice',
                    'Reproduce un articol de ziar',
                  ],
                  correctIndex: 1,
                  xp: 10,
                  explanation:
                    'Textul literar are rol estetic, transmite emoții și imagini artistice.',
                },
              ],
            },
          ],
        },
        {
          id: 'en-ro-gramatica',
          name: 'Gramatică',
          order: 2,
          quizzes: [
            {
              id: 'quiz-en-ro-gramatica-1',
              title: 'Quiz 1 - Gramatică',
              difficulty: 'easy',
              examType: 'EN',
              questions: [
                {
                  id: 'q-en-ro-gramatica-1',
                  question:
                    'Care parte de vorbire denumește ființe, obiecte sau fenomene?',
                  options: ['Adjectiv', 'Substantiv', 'Verb', 'Pronume', 'Adverb'],
                  correctIndex: 1,
                  xp: 10,
                  explanation: 'Substantivul denumește ființe, obiecte sau fenomene.',
                },
              ],
            },
          ],
        },
        {
          id: 'en-ro-text-nonliterar',
          name: 'Text nonliterar',
          order: 3,
          quizzes: [
            {
              id: 'quiz-en-ro-text-nonliterar-1',
              title: 'Quiz 1 - Text nonliterar',
              difficulty: 'easy',
              examType: 'EN',
              questions: [
                {
                  id: 'q-en-ro-text-nonliterar-1',
                  question: 'Scopul principal al unui text informativ este să:',
                  options: [
                    'trezească emoții',
                    'informeze corect despre un fapt',
                    'creeze suspans',
                    'descrie un personaj',
                    'fie rimat',
                  ],
                  correctIndex: 1,
                  xp: 10,
                  explanation: 'Textele informative urmăresc prezentarea clară a faptelor.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'en-mate-8',
      name: 'Matematică',
      level: 'gimnaziu',
      examType: 'EN',
      chapters: [
        {
          id: 'en-mate-fractii',
          name: 'Fracții și rapoarte',
          order: 1,
          quizzes: [
            {
              id: 'quiz-en-mate-fractii-1',
              title: 'Quiz 1 - Fracții',
              difficulty: 'easy',
              examType: 'EN',
              questions: [
                {
                  id: 'q-en-mate-fractii-1',
                  question: 'Care este rezultatul 1/2 + 1/4?',
                  options: ['1/4', '1/2', '2/4', '3/4', '1'],
                  correctIndex: 3,
                  xp: 10,
                  explanation: '1/2 = 2/4, deci 2/4 + 1/4 = 3/4.',
                },
              ],
            },
          ],
        },
        {
          id: 'en-mate-geometrie',
          name: 'Geometrie în plan',
          order: 2,
          quizzes: [
            {
              id: 'quiz-en-mate-geometrie-1',
              title: 'Quiz 1 - Geometrie în plan',
              difficulty: 'easy',
              examType: 'EN',
              questions: [
                {
                  id: 'q-en-mate-geometrie-1',
                  question: 'Suma unghiurilor într-un triunghi este:',
                  options: [
                    '90 de grade',
                    '120 de grade',
                    '180 de grade',
                    '270 de grade',
                    '360 de grade',
                  ],
                  correctIndex: 2,
                  xp: 10,
                  explanation: 'Orice triunghi are suma unghiurilor de 180 de grade.',
                },
              ],
            },
          ],
        },
        {
          id: 'en-mate-ecuatii',
          name: 'Ecuații de gradul I',
          order: 3,
          quizzes: [
            {
              id: 'quiz-en-mate-ecuatii-1',
              title: 'Quiz 1 - Ecuații de gradul I',
              difficulty: 'easy',
              examType: 'EN',
              questions: [
                {
                  id: 'q-en-mate-ecuatii-1',
                  question: 'Rezolvă ecuația: 2x + 3 = 11.',
                  options: ['x = 2', 'x = 3', 'x = 4', 'x = 5', 'x = 6'],
                  correctIndex: 2,
                  xp: 10,
                  explanation: '2x = 8, deci x = 4.',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const bacExamFixture = {
  examType: 'BAC',
  subjects: [
    {
      id: 'bac-romana',
      name: 'Română',
      level: 'liceu',
      examType: 'BAC',
      chapters: [
        {
          id: 'bac-ro-genuri-literare',
          name: 'Genuri și specii literare',
          order: 1,
          quizzes: [
            {
              id: 'quiz-bac-ro-genuri-1',
              title: 'Quiz 1 - Genuri și specii literare',
              difficulty: 'medium',
              examType: 'BAC',
              questions: [
                {
                  id: 'q-bac-ro-genuri-1',
                  question: 'Genul liric se caracterizează prin:',
                  options: [
                    'prezența acțiunii',
                    'prezența dialogului',
                    'exprimarea directă a sentimentelor',
                    'relatarea obiectivă a faptelor',
                    'prezentarea unei intrigi',
                  ],
                  correctIndex: 2,
                  xp: 10,
                  explanation: 'Genul liric exprimă direct stări și emoții.',
                },
              ],
            },
          ],
        },
        {
          id: 'bac-ro-argumentare',
          name: 'Text argumentativ',
          order: 2,
          quizzes: [
            {
              id: 'quiz-bac-ro-argumentare-1',
              title: 'Quiz 1 - Text argumentativ',
              difficulty: 'medium',
              examType: 'BAC',
              questions: [
                {
                  id: 'q-bac-ro-argumentare-1',
                  question: 'Rolul tezei într-un text argumentativ este să:',
                  options: [
                    'listeze exemple',
                    'formuleze punctul de vedere',
                    'prezinte sursele',
                    'descrie un personaj',
                    'detalieze concluzia',
                  ],
                  correctIndex: 1,
                  xp: 10,
                  explanation: 'Teza exprimă clar punctul de vedere al autorului.',
                },
              ],
            },
          ],
        },
        {
          id: 'bac-ro-eseu',
          name: 'Eseu literar',
          order: 3,
          quizzes: [
            {
              id: 'quiz-bac-ro-eseu-1',
              title: 'Quiz 1 - Eseu literar',
              difficulty: 'medium',
              examType: 'BAC',
              questions: [
                {
                  id: 'q-bac-ro-eseu-1',
                  question: 'Structura de bază a unui eseu este:',
                  options: [
                    'introducere, cuprins, încheiere',
                    'cuprins, încheiere',
                    'titlu, rezumat',
                    'dialog, monolog',
                    'argument, contraargument',
                  ],
                  correctIndex: 0,
                  xp: 10,
                  explanation:
                    'Eseul are structura clasică: introducere, cuprins, încheiere.',
                },
              ],
            },
          ],
        },
        {
          id: 'bac-ro-curente',
          name: 'Curente literare',
          order: 4,
          quizzes: [
            {
              id: 'quiz-bac-ro-curente-1',
              title: 'Quiz 1 - Curente literare',
              difficulty: 'medium',
              examType: 'BAC',
              questions: [
                {
                  id: 'q-bac-ro-curente-1',
                  question: 'Romantismul se caracterizează prin:',
                  options: [
                    'cultul rațiunii',
                    'respectarea strictă a regulilor clasice',
                    'exaltarea sentimentelor și a naturii',
                    'descrierea realistă a societății',
                    'neutralitate emoțională',
                  ],
                  correctIndex: 2,
                  xp: 10,
                  explanation: 'Romantismul pune accent pe emoție și natură.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'bac-mate-real',
      name: 'Matematică',
      level: 'liceu',
      examType: 'BAC',
      profile: 'real',
      chapters: [
        {
          id: 'bac-mate-functii',
          name: 'Funcții și grafice',
          order: 1,
          quizzes: [
            {
              id: 'quiz-bac-mate-functii-1',
              title: 'Quiz 1 - Funcții și grafice',
              difficulty: 'medium',
              examType: 'BAC',
              questions: [
                {
                  id: 'q-bac-mate-functii-1',
                  question: 'Domeniul funcției f(x)=1/(x-2) este:',
                  options: ['R', 'R fără 2', 'x > 2', 'x < 2', 'x diferit de 0'],
                  correctIndex: 1,
                  xp: 10,
                  explanation: 'Funcția nu este definită pentru x = 2.',
                },
              ],
            },
          ],
        },
        {
          id: 'bac-mate-derivate',
          name: 'Derivate',
          order: 2,
          quizzes: [
            {
              id: 'quiz-bac-mate-derivate-1',
              title: 'Quiz 1 - Derivate',
              difficulty: 'medium',
              examType: 'BAC',
              questions: [
                {
                  id: 'q-bac-mate-derivate-1',
                  question: 'Derivata lui x^2 este:',
                  options: ['2x', 'x^2', 'x', '2', '1/x'],
                  correctIndex: 0,
                  xp: 10,
                  explanation: 'd/dx (x^2) = 2x.',
                },
              ],
            },
          ],
        },
        {
          id: 'bac-mate-integrale',
          name: 'Integrale',
          order: 3,
          quizzes: [
            {
              id: 'quiz-bac-mate-integrale-1',
              title: 'Quiz 1 - Integrale',
              difficulty: 'medium',
              examType: 'BAC',
              questions: [
                {
                  id: 'q-bac-mate-integrale-1',
                  question: 'Integrala lui 2x dx este:',
                  options: ['x^2 + C', '2x + C', 'x + C', '2 + C', 'ln x + C'],
                  correctIndex: 0,
                  xp: 10,
                  explanation: 'Integrala lui 2x este x^2 + C.',
                },
              ],
            },
          ],
        },
        {
          id: 'bac-mate-matrici',
          name: 'Matrice și determinanți',
          order: 4,
          quizzes: [
            {
              id: 'quiz-bac-mate-matrici-1',
              title: 'Quiz 1 - Matrice și determinanți',
              difficulty: 'medium',
              examType: 'BAC',
              questions: [
                {
                  id: 'q-bac-mate-matrici-1',
                  question: 'Determinantul matricei [[1,2],[3,4]] este:',
                  options: ['-2', '2', '4', '-4', '0'],
                  correctIndex: 0,
                  xp: 10,
                  explanation: 'Determinantul este 1*4 - 2*3 = -2.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'bac-istorie-uman',
      name: 'Istorie',
      level: 'liceu',
      examType: 'BAC',
      profile: 'uman',
      chapters: [
        {
          id: 'bac-ist-moderna',
          name: 'România modernă',
          order: 1,
          quizzes: [
            {
              id: 'quiz-bac-ist-moderna-1',
              title: 'Quiz 1 - România modernă',
              difficulty: 'medium',
              examType: 'BAC',
              questions: [
                {
                  id: 'q-bac-ist-moderna-1',
                  question: 'Unirea Principatelor Române a avut loc în:',
                  options: ['1859', '1848', '1877', '1918', '1939'],
                  correctIndex: 0,
                  xp: 10,
                  explanation:
                    'Unirea Moldovei și Țării Românești a avut loc în 1859.',
                },
              ],
            },
          ],
        },
        {
          id: 'bac-ist-secol-xx',
          name: 'România în secolul XX',
          order: 2,
          quizzes: [
            {
              id: 'quiz-bac-ist-secol-xx-1',
              title: 'Quiz 1 - România în secolul XX',
              difficulty: 'medium',
              examType: 'BAC',
              questions: [
                {
                  id: 'q-bac-ist-secol-xx-1',
                  question: 'Marea Unire a avut loc în:',
                  options: ['1859', '1877', '1907', '1918', '1947'],
                  correctIndex: 3,
                  xp: 10,
                  explanation: 'Marea Unire s-a realizat la 1 decembrie 1918.',
                },
              ],
            },
          ],
        },
        {
          id: 'bac-ist-relatii',
          name: 'Relații internaționale',
          order: 3,
          quizzes: [
            {
              id: 'quiz-bac-ist-relatii-1',
              title: 'Quiz 1 - Relații internaționale',
              difficulty: 'medium',
              examType: 'BAC',
              questions: [
                {
                  id: 'q-bac-ist-relatii-1',
                  question: 'Războiul Rece a fost conflictul dintre:',
                  options: [
                    'Franța și Germania',
                    'SUA și URSS',
                    'China și Japonia',
                    'Italia și Spania',
                    'India și Pakistan',
                  ],
                  correctIndex: 1,
                  xp: 10,
                  explanation: 'Războiul Rece a opus SUA și URSS.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'bac-fizica-real',
      name: 'Fizică',
      level: 'liceu',
      examType: 'BAC',
      profile: 'real',
      chapters: [
        {
          id: 'bac-fizica-mecanica',
          name: 'Mecanică',
          order: 1,
          quizzes: [
            {
              id: 'quiz-bac-fizica-mecanica-1',
              title: 'Quiz 1 - Mecanică',
              difficulty: 'medium',
              examType: 'BAC',
              questions: [
                {
                  id: 'q-bac-fizica-mecanica-1',
                  question: 'Unitatea de măsură pentru forță este:',
                  options: ['Watt', 'Newton', 'Joule', 'Pascal', 'Volt'],
                  correctIndex: 1,
                  xp: 10,
                  explanation: 'Forța se măsoară în Newton (N).',
                },
              ],
            },
          ],
        },
        {
          id: 'bac-fizica-electricitate',
          name: 'Electricitate',
          order: 2,
          quizzes: [
            {
              id: 'quiz-bac-fizica-electricitate-1',
              title: 'Quiz 1 - Electricitate',
              difficulty: 'medium',
              examType: 'BAC',
              questions: [
                {
                  id: 'q-bac-fizica-electricitate-1',
                  question: 'Legea lui Ohm: U =',
                  options: ['R / I', 'I / R', 'R * I', 'I + R', 'R - I'],
                  correctIndex: 2,
                  xp: 10,
                  explanation: 'Legea lui Ohm este U = R * I.',
                },
              ],
            },
          ],
        },
        {
          id: 'bac-fizica-termodinamica',
          name: 'Termodinamică',
          order: 3,
          quizzes: [
            {
              id: 'quiz-bac-fizica-termodinamica-1',
              title: 'Quiz 1 - Termodinamică',
              difficulty: 'medium',
              examType: 'BAC',
              questions: [
                {
                  id: 'q-bac-fizica-termodinamica-1',
                  question: 'Prima lege a termodinamicii exprimă:',
                  options: [
                    'conservarea energiei',
                    'conservarea masei',
                    'legea lui Boyle',
                    'legea lui Hooke',
                    'principiul lui Arhimede',
                  ],
                  correctIndex: 0,
                  xp: 10,
                  explanation: 'Prima lege exprimă conservarea energiei.',
                },
              ],
            },
          ],
        },
        {
          id: 'bac-fizica-optica',
          name: 'Optică',
          order: 4,
          quizzes: [
            {
              id: 'quiz-bac-fizica-optica-1',
              title: 'Quiz 1 - Optică',
              difficulty: 'medium',
              examType: 'BAC',
              questions: [
                {
                  id: 'q-bac-fizica-optica-1',
                  question: 'Indicele de refracție n este:',
                  options: ['v / c', 'c / v', 'v * c', 'c + v', '1 / v'],
                  correctIndex: 1,
                  xp: 10,
                  explanation: 'n = c / v, unde c este viteza luminii în vid.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'bac-chimie-real',
      name: 'Chimie',
      level: 'liceu',
      examType: 'BAC',
      profile: 'real',
      chapters: [
        {
          id: 'bac-chimie-structura',
          name: 'Structura atomului și periodicitate',
          order: 1,
          quizzes: [
            {
              id: 'quiz-bac-chimie-structura-1',
              title: 'Quiz 1 - Structura atomului',
              difficulty: 'medium',
              examType: 'BAC',
              questions: [
                {
                  id: 'q-bac-chimie-structura-1',
                  question: 'Numărul atomic reprezintă:',
                  options: [
                    'numărul de neutroni',
                    'numărul de protoni',
                    'numărul de electroni pe ultimul strat',
                    'masa atomică',
                    'numărul de molecule',
                  ],
                  correctIndex: 1,
                  xp: 10,
                  explanation: 'Numărul atomic este egal cu numărul de protoni.',
                },
              ],
            },
          ],
        },
        {
          id: 'bac-chimie-legaturi',
          name: 'Legături chimice',
          order: 2,
          quizzes: [
            {
              id: 'quiz-bac-chimie-legaturi-1',
              title: 'Quiz 1 - Legături chimice',
              difficulty: 'medium',
              examType: 'BAC',
              questions: [
                {
                  id: 'q-bac-chimie-legaturi-1',
                  question: 'Legătura ionică se formează prin:',
                  options: [
                    'transfer de electroni',
                    'punere în comun de electroni',
                    'partajare egală',
                    'forțe van der Waals',
                    'legături de hidrogen',
                  ],
                  correctIndex: 0,
                  xp: 10,
                  explanation: 'Legătura ionică apare prin transfer de electroni.',
                },
              ],
            },
          ],
        },
        {
          id: 'bac-chimie-reactii',
          name: 'Reacții chimice',
          order: 3,
          quizzes: [
            {
              id: 'quiz-bac-chimie-reactii-1',
              title: 'Quiz 1 - Reacții chimice',
              difficulty: 'medium',
              examType: 'BAC',
              questions: [
                {
                  id: 'q-bac-chimie-reactii-1',
                  question: 'Într-o reacție de neutralizare se formează:',
                  options: [
                    'sare și apă',
                    'acid și bază',
                    'gaz și metal',
                    'oxid și apă',
                    'precipitat și gaz',
                  ],
                  correctIndex: 0,
                  xp: 10,
                  explanation: 'Neutralizarea produce sare și apă.',
                },
              ],
            },
          ],
        },
        {
          id: 'bac-chimie-solutii',
          name: 'Soluții și pH',
          order: 4,
          quizzes: [
            {
              id: 'quiz-bac-chimie-solutii-1',
              title: 'Quiz 1 - Soluții și pH',
              difficulty: 'medium',
              examType: 'BAC',
              questions: [
                {
                  id: 'q-bac-chimie-solutii-1',
                  question: 'O soluție cu pH 3 este:',
                  options: ['neutră', 'bazică', 'acidă', 'saturată', 'izotonică'],
                  correctIndex: 2,
                  xp: 10,
                  explanation: 'pH < 7 indică o soluție acidă.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'bac-biologie-real',
      name: 'Biologie (inclusiv Anatomie)',
      level: 'liceu',
      examType: 'BAC',
      profile: 'real',
      chapters: [
        {
          id: 'bac-bio-celula',
          name: 'Celula',
          order: 1,
          quizzes: [
            {
              id: 'quiz-bac-bio-celula-1',
              title: 'Quiz 1 - Celula',
              difficulty: 'medium',
              examType: 'BAC',
              questions: [
                {
                  id: 'q-bac-bio-celula-1',
                  question: 'Organitul responsabil cu producerea ATP este:',
                  options: [
                    'ribozomul',
                    'mitocondria',
                    'lizozomul',
                    'aparatul Golgi',
                    'nucleul',
                  ],
                  correctIndex: 1,
                  xp: 10,
                  explanation: 'Mitocondria produce ATP prin respirație celulară.',
                },
              ],
            },
          ],
        },
        {
          id: 'bac-bio-genetica',
          name: 'Genetică',
          order: 2,
          quizzes: [
            {
              id: 'quiz-bac-bio-genetica-1',
              title: 'Quiz 1 - Genetică',
              difficulty: 'medium',
              examType: 'BAC',
              questions: [
                {
                  id: 'q-bac-bio-genetica-1',
                  question: 'Unitatea eredității este:',
                  options: ['cromozomul', 'gena', 'nucleul', 'ARN-ul', 'citoplasma'],
                  correctIndex: 1,
                  xp: 10,
                  explanation: 'Gena este unitatea fundamentală a eredității.',
                },
              ],
            },
          ],
        },
        {
          id: 'bac-bio-anatomie',
          name: 'Anatomie umană',
          order: 3,
          quizzes: [
            {
              id: 'quiz-bac-bio-anatomie-1',
              title: 'Quiz 1 - Anatomie umană',
              difficulty: 'medium',
              examType: 'BAC',
              questions: [
                {
                  id: 'q-bac-bio-anatomie-1',
                  question: 'Inima are:',
                  options: [
                    '2 camere',
                    '3 camere',
                    '4 camere',
                    '5 camere',
                    '6 camere',
                  ],
                  correctIndex: 2,
                  xp: 10,
                  explanation: 'Inima umană are 4 camere: 2 atrii și 2 ventricule.',
                },
              ],
            },
          ],
        },
        {
          id: 'bac-bio-ecologie',
          name: 'Ecologie',
          order: 4,
          quizzes: [
            {
              id: 'quiz-bac-bio-ecologie-1',
              title: 'Quiz 1 - Ecologie',
              difficulty: 'medium',
              examType: 'BAC',
              questions: [
                {
                  id: 'q-bac-bio-ecologie-1',
                  question: 'Lanțul trofic începe cu:',
                  options: ['consumatori', 'decompozitori', 'producători', 'paraziți', 'prădători'],
                  correctIndex: 2,
                  xp: 10,
                  explanation: 'Producătorii sunt baza lanțului trofic.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'bac-informatica-real',
      name: 'Informatică',
      level: 'liceu',
      examType: 'BAC',
      profile: 'real',
      chapters: [
        {
          id: 'bac-info-algoritmi',
          name: 'Algoritmi de bază',
          order: 1,
          quizzes: [
            {
              id: 'quiz-bac-info-algoritmi-1',
              title: 'Quiz 1 - Algoritmi de bază',
              difficulty: 'medium',
              examType: 'BAC',
              questions: [
                {
                  id: 'q-bac-info-algoritmi-1',
                  question: 'Complexitatea parcurgerii unui vector de n elemente este:',
                  options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n^2)'],
                  correctIndex: 2,
                  xp: 10,
                  explanation: 'Parcurgerea elementelor are complexitate liniară O(n).',
                },
              ],
            },
          ],
        },
        {
          id: 'bac-info-structuri',
          name: 'Structuri de date',
          order: 2,
          quizzes: [
            {
              id: 'quiz-bac-info-structuri-1',
              title: 'Quiz 1 - Structuri de date',
              difficulty: 'medium',
              examType: 'BAC',
              questions: [
                {
                  id: 'q-bac-info-structuri-1',
                  question: 'Structura LIFO este:',
                  options: ['coadă', 'stivă', 'arbore', 'listă', 'graf'],
                  correctIndex: 1,
                  xp: 10,
                  explanation: 'Stiva funcționează după principiul LIFO.',
                },
              ],
            },
          ],
        },
        {
          id: 'bac-info-recursivitate',
          name: 'Recursivitate',
          order: 3,
          quizzes: [
            {
              id: 'quiz-bac-info-recursivitate-1',
              title: 'Quiz 1 - Recursivitate',
              difficulty: 'medium',
              examType: 'BAC',
              questions: [
                {
                  id: 'q-bac-info-recursivitate-1',
                  question: 'Condiția de oprire într-o funcție recursivă se numește:',
                  options: [
                    'pas inductiv',
                    'bază',
                    'iterație',
                    'optimizare',
                    'blocare',
                  ],
                  correctIndex: 1,
                  xp: 10,
                  explanation: 'Recursivitatea se oprește în cazul de bază.',
                },
              ],
            },
          ],
        },
        {
          id: 'bac-info-complexitate',
          name: 'Complexitate',
          order: 4,
          quizzes: [
            {
              id: 'quiz-bac-info-complexitate-1',
              title: 'Quiz 1 - Complexitate',
              difficulty: 'medium',
              examType: 'BAC',
              questions: [
                {
                  id: 'q-bac-info-complexitate-1',
                  question: 'Căutarea binară are complexitatea:',
                  options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n^2)'],
                  correctIndex: 1,
                  xp: 10,
                  explanation: 'Căutarea binară reduce spațiul la jumătate: O(log n).',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'bac-geografie-uman',
      name: 'Geografie',
      level: 'liceu',
      examType: 'BAC',
      profile: 'uman',
      chapters: [
        {
          id: 'bac-geo-relief',
          name: 'Relief',
          order: 1,
          quizzes: [
            {
              id: 'quiz-bac-geo-relief-1',
              title: 'Quiz 1 - Relief',
              difficulty: 'medium',
              examType: 'BAC',
              questions: [
                {
                  id: 'q-bac-geo-relief-1',
                  question: 'Cea mai înaltă formă de relief din România este:',
                  options: ['dealurile', 'podișurile', 'Munții Carpați', 'câmpiile', 'delta'],
                  correctIndex: 2,
                  xp: 10,
                  explanation: 'Munții Carpați reprezintă cea mai înaltă formă de relief.',
                },
              ],
            },
          ],
        },
        {
          id: 'bac-geo-clima',
          name: 'Climă',
          order: 2,
          quizzes: [
            {
              id: 'quiz-bac-geo-clima-1',
              title: 'Quiz 1 - Climă',
              difficulty: 'medium',
              examType: 'BAC',
              questions: [
                {
                  id: 'q-bac-geo-clima-1',
                  question: 'România are climă:',
                  options: ['tropicală', 'temperată-continentală', 'subpolară', 'mediteraneană', 'deşertică'],
                  correctIndex: 1,
                  xp: 10,
                  explanation: 'Clima României este temperată-continentală.',
                },
              ],
            },
          ],
        },
        {
          id: 'bac-geo-hidrografie',
          name: 'Hidrografie',
          order: 3,
          quizzes: [
            {
              id: 'quiz-bac-geo-hidrografie-1',
              title: 'Quiz 1 - Hidrografie',
              difficulty: 'medium',
              examType: 'BAC',
              questions: [
                {
                  id: 'q-bac-geo-hidrografie-1',
                  question: 'Cel mai lung râu din România este:',
                  options: ['Mureș', 'Olt', 'Dunărea', 'Prut', 'Someș'],
                  correctIndex: 2,
                  xp: 10,
                  explanation: 'Dunărea este cel mai lung râu de pe teritoriul României.',
                },
              ],
            },
          ],
        },
        {
          id: 'bac-geo-umana',
          name: 'Geografie umană',
          order: 4,
          quizzes: [
            {
              id: 'quiz-bac-geo-umana-1',
              title: 'Quiz 1 - Geografie umană',
              difficulty: 'medium',
              examType: 'BAC',
              questions: [
                {
                  id: 'q-bac-geo-umana-1',
                  question: 'Migrația dinspre rural spre urban se numește:',
                  options: [
                    'depopulare',
                    'urbanizare',
                    'ruralizare',
                    'navetism',
                    'migrație externă',
                  ],
                  correctIndex: 1,
                  xp: 10,
                  explanation: 'Urbanizarea descrie migrația spre orașe.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'bac-logica-uman',
      name: 'Logică, argumentare și comunicare',
      level: 'liceu',
      examType: 'BAC',
      profile: 'uman',
      chapters: [
        {
          id: 'bac-logica-notiuni',
          name: 'Noțiuni de logică',
          order: 1,
          quizzes: [
            {
              id: 'quiz-bac-logica-notiuni-1',
              title: 'Quiz 1 - Noțiuni de logică',
              difficulty: 'medium',
              examType: 'BAC',
              questions: [
                {
                  id: 'q-bac-logica-notiuni-1',
                  question: 'Un enunț care poate fi adevărat sau fals se numește:',
                  options: [
                    'propoziție logică',
                    'interjecție',
                    'axiomă',
                    'definiție',
                    'termen',
                  ],
                  correctIndex: 0,
                  xp: 10,
                  explanation: 'Propoziția logică poate primi valoare de adevăr.',
                },
              ],
            },
          ],
        },
        {
          id: 'bac-logica-rationamente',
          name: 'Raționamente',
          order: 2,
          quizzes: [
            {
              id: 'quiz-bac-logica-rationamente-1',
              title: 'Quiz 1 - Raționamente',
              difficulty: 'medium',
              examType: 'BAC',
              questions: [
                {
                  id: 'q-bac-logica-rationamente-1',
                  question: 'Un raționament deductiv clasic se numește:',
                  options: ['inducție', 'silogism', 'analogie', 'paradox', 'sofism'],
                  correctIndex: 1,
                  xp: 10,
                  explanation: 'Silogismul este forma clasică a raționamentului deductiv.',
                },
              ],
            },
          ],
        },
        {
          id: 'bac-logica-argumentare',
          name: 'Argumentare',
          order: 3,
          quizzes: [
            {
              id: 'quiz-bac-logica-argumentare-1',
              title: 'Quiz 1 - Argumentare',
              difficulty: 'medium',
              examType: 'BAC',
              questions: [
                {
                  id: 'q-bac-logica-argumentare-1',
                  question: 'Teza într-un text argumentativ este:',
                  options: ['exemplul', 'ideea principală', 'concluzia secundară', 'definiția', 'argumentul'],
                  correctIndex: 1,
                  xp: 10,
                  explanation: 'Teza exprimă ideea principală ce urmează a fi susținută.',
                },
              ],
            },
          ],
        },
        {
          id: 'bac-logica-comunicare',
          name: 'Comunicare',
          order: 4,
          quizzes: [
            {
              id: 'quiz-bac-logica-comunicare-1',
              title: 'Quiz 1 - Comunicare',
              difficulty: 'medium',
              examType: 'BAC',
              questions: [
                {
                  id: 'q-bac-logica-comunicare-1',
                  question: 'Funcția limbajului orientată spre receptor este:',
                  options: ['emotivă', 'conativă', 'referențială', 'metalingvistică', 'poetică'],
                  correctIndex: 1,
                  xp: 10,
                  explanation: 'Funcția conativă urmărește influențarea receptorului.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'bac-psihologie-uman',
      name: 'Psihologie',
      level: 'liceu',
      examType: 'BAC',
      profile: 'uman',
      chapters: [
        {
          id: 'bac-psi-procese',
          name: 'Procese psihice',
          order: 1,
          quizzes: [
            {
              id: 'quiz-bac-psi-procese-1',
              title: 'Quiz 1 - Procese psihice',
              difficulty: 'medium',
              examType: 'BAC',
              questions: [
                {
                  id: 'q-bac-psi-procese-1',
                  question: 'Memoria de scurtă durată are o capacitate:',
                  options: ['nelimitată', 'limitată', 'zero', 'infinită', 'egală cu cea de lungă durată'],
                  correctIndex: 1,
                  xp: 10,
                  explanation: 'Memoria de scurtă durată este limitată.',
                },
              ],
            },
          ],
        },
        {
          id: 'bac-psi-personalitate',
          name: 'Personalitate',
          order: 2,
          quizzes: [
            {
              id: 'quiz-bac-psi-personalitate-1',
              title: 'Quiz 1 - Personalitate',
              difficulty: 'medium',
              examType: 'BAC',
              questions: [
                {
                  id: 'q-bac-psi-personalitate-1',
                  question: 'Temperamentul se referă la:',
                  options: [
                    'trăsături înnăscute ale comportamentului',
                    'convingeri morale',
                    'educație',
                    'inteligență',
                    'valori sociale',
                  ],
                  correctIndex: 0,
                  xp: 10,
                  explanation: 'Temperamentul descrie latura înnăscută a personalității.',
                },
              ],
            },
          ],
        },
        {
          id: 'bac-psi-motivatie',
          name: 'Motivație și emoție',
          order: 3,
          quizzes: [
            {
              id: 'quiz-bac-psi-motivatie-1',
              title: 'Quiz 1 - Motivație și emoție',
              difficulty: 'medium',
              examType: 'BAC',
              questions: [
                {
                  id: 'q-bac-psi-motivatie-1',
                  question: 'În piramida lui Maslow, la bază se află:',
                  options: [
                    'nevoile de stimă',
                    'nevoile fiziologice',
                    'nevoile de autorealizare',
                    'nevoile sociale',
                    'nevoile de siguranță',
                  ],
                  correctIndex: 1,
                  xp: 10,
                  explanation: 'Nevoile fiziologice sunt fundamentale în ierarhia lui Maslow.',
                },
              ],
            },
          ],
        },
        {
          id: 'bac-psi-dezvoltare',
          name: 'Dezvoltare',
          order: 4,
          quizzes: [
            {
              id: 'quiz-bac-psi-dezvoltare-1',
              title: 'Quiz 1 - Dezvoltare',
              difficulty: 'medium',
              examType: 'BAC',
              questions: [
                {
                  id: 'q-bac-psi-dezvoltare-1',
                  question: 'Adolescența este etapa caracterizată prin:',
                  options: [
                    'dezvoltare fizică și psihică accelerată',
                    'stabilitate absolută',
                    'regres cognitiv',
                    'lipsa schimbărilor',
                    'îmbătrânire',
                  ],
                  correctIndex: 0,
                  xp: 10,
                  explanation: 'Adolescența presupune schimbări rapide și intense.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'bac-economie-uman',
      name: 'Economie',
      level: 'liceu',
      examType: 'BAC',
      profile: 'uman',
      chapters: [
        {
          id: 'bac-eco-piata',
          name: 'Piață și cerere/ofertă',
          order: 1,
          quizzes: [
            {
              id: 'quiz-bac-eco-piata-1',
              title: 'Quiz 1 - Piață și cerere/ofertă',
              difficulty: 'medium',
              examType: 'BAC',
              questions: [
                {
                  id: 'q-bac-eco-piata-1',
                  question: 'Dacă prețul crește, cererea de regulă:',
                  options: ['crește', 'scade', 'rămâne aceeași', 'devine zero', 'nu se poate determina'],
                  correctIndex: 1,
                  xp: 10,
                  explanation: 'Creșterea prețului reduce, de regulă, cantitatea cerută.',
                },
              ],
            },
          ],
        },
        {
          id: 'bac-eco-costuri',
          name: 'Producție și costuri',
          order: 2,
          quizzes: [
            {
              id: 'quiz-bac-eco-costuri-1',
              title: 'Quiz 1 - Producție și costuri',
              difficulty: 'medium',
              examType: 'BAC',
              questions: [
                {
                  id: 'q-bac-eco-costuri-1',
                  question: 'Costul total este:',
                  options: [
                    'cost fix + cost variabil',
                    'cost fix - cost variabil',
                    'cost variabil / cost fix',
                    'profit + cost',
                    'venit - cost',
                  ],
                  correctIndex: 0,
                  xp: 10,
                  explanation: 'Costul total se calculează ca sumă între cost fix și variabil.',
                },
              ],
            },
          ],
        },
        {
          id: 'bac-eco-inflatie',
          name: 'Inflație și șomaj',
          order: 3,
          quizzes: [
            {
              id: 'quiz-bac-eco-inflatie-1',
              title: 'Quiz 1 - Inflație și șomaj',
              difficulty: 'medium',
              examType: 'BAC',
              questions: [
                {
                  id: 'q-bac-eco-inflatie-1',
                  question: 'Inflația reprezintă:',
                  options: [
                    'scăderea generală a prețurilor',
                    'creșterea generală a prețurilor',
                    'creșterea salariilor',
                    'scăderea șomajului',
                    'creșterea producției',
                  ],
                  correctIndex: 1,
                  xp: 10,
                  explanation: 'Inflația este creșterea generală a prețurilor.',
                },
              ],
            },
          ],
        },
        {
          id: 'bac-eco-politici',
          name: 'Politici economice',
          order: 4,
          quizzes: [
            {
              id: 'quiz-bac-eco-politici-1',
              title: 'Quiz 1 - Politici economice',
              difficulty: 'medium',
              examType: 'BAC',
              questions: [
                {
                  id: 'q-bac-eco-politici-1',
                  question: 'Politica fiscală se referă la:',
                  options: [
                    'taxe și cheltuieli publice',
                    'dobânzi',
                    'curs valutar',
                    'importuri',
                    'exporturi',
                  ],
                  correctIndex: 0,
                  xp: 10,
                  explanation: 'Politica fiscală reglementează taxele și cheltuielile publice.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'bac-sociologie-uman',
      name: 'Sociologie',
      level: 'liceu',
      examType: 'BAC',
      profile: 'uman',
      chapters: [
        {
          id: 'bac-socio-structuri',
          name: 'Structuri sociale',
          order: 1,
          quizzes: [
            {
              id: 'quiz-bac-socio-structuri-1',
              title: 'Quiz 1 - Structuri sociale',
              difficulty: 'medium',
              examType: 'BAC',
              questions: [
                {
                  id: 'q-bac-socio-structuri-1',
                  question: 'Familia este un exemplu de:',
                  options: [
                    'grup primar',
                    'instituție economică',
                    'organizație formală',
                    'grup secundar',
                    'strat social',
                  ],
                  correctIndex: 0,
                  xp: 10,
                  explanation: 'Familia este considerată un grup primar.',
                },
              ],
            },
          ],
        },
        {
          id: 'bac-socio-socializare',
          name: 'Socializare',
          order: 2,
          quizzes: [
            {
              id: 'quiz-bac-socio-socializare-1',
              title: 'Quiz 1 - Socializare',
              difficulty: 'medium',
              examType: 'BAC',
              questions: [
                {
                  id: 'q-bac-socio-socializare-1',
                  question: 'Socializarea primară are loc în:',
                  options: ['familie', 'mass-media', 'companie', 'piață', 'stat'],
                  correctIndex: 0,
                  xp: 10,
                  explanation: 'Socializarea primară are loc în familie.',
                },
              ],
            },
          ],
        },
        {
          id: 'bac-socio-stratificare',
          name: 'Stratificare',
          order: 3,
          quizzes: [
            {
              id: 'quiz-bac-socio-stratificare-1',
              title: 'Quiz 1 - Stratificare',
              difficulty: 'medium',
              examType: 'BAC',
              questions: [
                {
                  id: 'q-bac-socio-stratificare-1',
                  question: 'Stratificarea socială se referă la:',
                  options: [
                    'ierarhizarea grupurilor',
                    'egalitate totală',
                    'dispariția claselor',
                    'migrație',
                    'urbanizare',
                  ],
                  correctIndex: 0,
                  xp: 10,
                  explanation: 'Stratificarea este ierarhizarea grupurilor sociale.',
                },
              ],
            },
          ],
        },
        {
          id: 'bac-socio-metodologie',
          name: 'Metodologia cercetării',
          order: 4,
          quizzes: [
            {
              id: 'quiz-bac-socio-metodologie-1',
              title: 'Quiz 1 - Metodologia cercetării',
              difficulty: 'medium',
              examType: 'BAC',
              questions: [
                {
                  id: 'q-bac-socio-metodologie-1',
                  question: 'Un instrument de colectare a datelor este:',
                  options: ['chestionarul', 'demonstrația', 'axioma', 'paradigma', 'dezbaterea'],
                  correctIndex: 0,
                  xp: 10,
                  explanation: 'Chestionarul este un instrument standard de colectare a datelor.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'bac-filosofie-uman',
      name: 'Filosofie',
      level: 'liceu',
      examType: 'BAC',
      profile: 'uman',
      chapters: [
        {
          id: 'bac-filo-cunoastere',
          name: 'Cunoaștere și adevăr',
          order: 1,
          quizzes: [
            {
              id: 'quiz-bac-filo-cunoastere-1',
              title: 'Quiz 1 - Cunoaștere și adevăr',
              difficulty: 'medium',
              examType: 'BAC',
              questions: [
                {
                  id: 'q-bac-filo-cunoastere-1',
                  question: 'Ramura filosofiei care studiază cunoașterea se numește:',
                  options: ['epistemologie', 'estetică', 'etică', 'ontologie', 'logică'],
                  correctIndex: 0,
                  xp: 10,
                  explanation: 'Epistemologia studiază cunoașterea.',
                },
              ],
            },
          ],
        },
        {
          id: 'bac-filo-etica',
          name: 'Etică',
          order: 2,
          quizzes: [
            {
              id: 'quiz-bac-filo-etica-1',
              title: 'Quiz 1 - Etică',
              difficulty: 'medium',
              examType: 'BAC',
              questions: [
                {
                  id: 'q-bac-filo-etica-1',
                  question: 'Etica se ocupă cu:',
                  options: [
                    'norme și valori morale',
                    'procese economice',
                    'structuri politice',
                    'fenomene naturale',
                    'sisteme tehnice',
                  ],
                  correctIndex: 0,
                  xp: 10,
                  explanation: 'Etica studiază normele și valorile morale.',
                },
              ],
            },
          ],
        },
        {
          id: 'bac-filo-existenta',
          name: 'Existență',
          order: 3,
          quizzes: [
            {
              id: 'quiz-bac-filo-existenta-1',
              title: 'Quiz 1 - Existență',
              difficulty: 'medium',
              examType: 'BAC',
              questions: [
                {
                  id: 'q-bac-filo-existenta-1',
                  question: 'Întrebările despre ființă aparțin:',
                  options: ['ontologiei', 'epistemologiei', 'esteticii', 'eticii', 'psihologiei'],
                  correctIndex: 0,
                  xp: 10,
                  explanation: 'Ontologia se ocupă cu studiul ființei.',
                },
              ],
            },
          ],
        },
        {
          id: 'bac-filo-curente',
          name: 'Curente și filosofi',
          order: 4,
          quizzes: [
            {
              id: 'quiz-bac-filo-curente-1',
              title: 'Quiz 1 - Curente și filosofi',
              difficulty: 'medium',
              examType: 'BAC',
              questions: [
                {
                  id: 'q-bac-filo-curente-1',
                  question: 'Raționalismul îl are ca reprezentant pe:',
                  options: ['Descartes', 'Hume', 'Kant', 'Platon', 'Aristotel'],
                  correctIndex: 0,
                  xp: 10,
                  explanation: 'Descartes este un reprezentant al raționalismului.',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const examContentFixture = [enExamFixture, bacExamFixture];
