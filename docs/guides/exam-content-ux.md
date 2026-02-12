# Structura JSON EN + BAC (materii -> capitole -> quiz-uri)

## Model generic
```ts
type ExamType = 'EN' | 'BAC';

interface Subject {
  id: string;
  name: string; // ex. "Română"
  level: 'gimnaziu' | 'liceu';
  examType: ExamType; // 'EN' sau 'BAC'
  profile?: string; // ex. "real", "uman" (mai relevant pentru BAC)
  chapters: Chapter[];
}

interface Chapter {
  id: string;
  name: string; // ex. "Fracții" / "Text literar"
  order: number;
  quizzes: Quiz[];
}

interface Quiz {
  id: string;
  title: string; // ex. "Quiz 1 - Fracții de bază"
  difficulty: 'easy' | 'medium' | 'hard';
  examType: ExamType;
  questions: Question[];
}

interface Question {
  id: string;
  question: string;
  options: string[]; // 5 variante
  correctIndex: number; // 0-4
  xp: number;
  explanation?: string;
}
```

## Exemplu JSON - Evaluare Nationala
```json
{
  "examType": "EN",
  "subjects": [
    {
      "id": "en-romana-8",
      "name": "Română",
      "level": "gimnaziu",
      "examType": "EN",
      "chapters": [
        {
          "id": "en-ro-text-literar",
          "name": "Text literar",
          "order": 1,
          "quizzes": [
            {
              "id": "quiz-en-ro-tl-1",
              "title": "Quiz 1 - Text literar (clasa a VIII-a)",
              "difficulty": "medium",
              "examType": "EN",
              "questions": [
                {
                  "id": "q-en-ro-tl-1",
                  "question": "Care este trăsătura principală a textului literar?",
                  "options": [
                    "Are scop informativ",
                    "Transmite emoții și imagini artistice",
                    "Explică un fenomen științific",
                    "Prezintă date statistice",
                    "Reproduce un articol de ziar"
                  ],
                  "correctIndex": 1,
                  "xp": 10,
                  "explanation": "Textul literar are rol estetic, transmite emoții și imagini artistice."
                }
              ]
            }
          ]
        },
        {
          "id": "en-ro-gramatica",
          "name": "Gramatică",
          "order": 2,
          "quizzes": []
        }
      ]
    },
    {
      "id": "en-mate-8",
      "name": "Matematică",
      "level": "gimnaziu",
      "examType": "EN",
      "chapters": [
        {
          "id": "en-mate-fractii",
          "name": "Fracții și rapoarte",
          "order": 1,
          "quizzes": [
            {
              "id": "quiz-en-mate-fr-1",
              "title": "Quiz 1 - Fracții de bază",
              "difficulty": "easy",
              "examType": "EN",
              "questions": []
            }
          ]
        },
        {
          "id": "en-mate-geometrie",
          "name": "Geometrie în plan",
          "order": 2,
          "quizzes": []
        }
      ]
    }
  ]
}
```

## Exemplu JSON - Bacalaureat (profil real/uman)
```json
{
  "examType": "BAC",
  "subjects": [
    {
      "id": "bac-romana",
      "name": "Română",
      "level": "liceu",
      "examType": "BAC",
      "chapters": [
        {
          "id": "bac-ro-genuri-literare",
          "name": "Genuri și specii literare",
          "order": 1,
          "quizzes": []
        },
        {
          "id": "bac-ro-argumentare",
          "name": "Text argumentativ",
          "order": 2,
          "quizzes": []
        }
      ]
    },
    {
      "id": "bac-mate-real",
      "name": "Matematică",
      "level": "liceu",
      "examType": "BAC",
      "profile": "real",
      "chapters": [
        {
          "id": "bac-mate-functii",
          "name": "Funcții și grafice",
          "order": 1,
          "quizzes": []
        }
      ]
    },
    {
      "id": "bac-istorie-uman",
      "name": "Istorie",
      "level": "liceu",
      "examType": "BAC",
      "profile": "uman",
      "chapters": [
        {
          "id": "bac-ist-moderna",
          "name": "România modernă",
          "order": 1,
          "quizzes": []
        }
      ]
    }
  ]
}
```

## Materii BAC (profil real/uman)
- Matematica (real)
- Fizica (real)
- Chimie (real)
- Biologie (inclusiv Anatomie) (real)
- Informatica (real)
- Istorie (uman)
- Geografie (uman)
- Logica, argumentare si comunicare (uman)
- Psihologie (uman)
- Economie (uman)
- Sociologie (uman)
- Filosofie (uman)

# Model UX/UI - gimnaziu/liceu

## Home screen (hub principal)
Scop: intrare rapida in flow-ul de invatare.

Elemente principale:
- Header sus: salut personal, nivel si avatar.
- Subtitlu motivational scurt: XP ramas pana la urmatorul nivel.
- Carduri examene: Evaluare Nationala si Bacalaureat, cu progres si buton "Continua".
- Sectiune "Continua de unde ai ramas": ultimul quiz cu buton "Reia/Continua".
- Daily streak + misiuni: 2-3 misiuni zilnice cu recompense.
- Shortcut-uri: butoane rapide pe materii (configurabile).

Ton vizual: colorat, curat, iconite clare pe materii, font mare.

## Ecran de quiz (10 intrebari, 5 variante)
Scop: ritm rapid, feedback clar, zero frictiune.

Elemente:
- Bara sus: progres "Intrebarea 3/10" + bara orizontala.
- Indicator discret de timp (optional).
- Intrebarea centrala, text mare, spatiu alb.
- 5 variante A-E, carduri tap-abile.
- Feedback: corect verde, gresit rosu + explicatie scurta.
- Gamification: +XP, combo pentru streak.
- Navigare: buton mare "Urmatoarea intrebare".
- Final quiz: scor mare, XP castigat, progres capitol, lista intrebari, butoane de actiune.

## Ecran profil (XP, nivel, badge-uri)
Scop: progres vizibil in timp.

Sectiuni:
- Header profil: avatar, nume, clasa, scoala optional.
- Level mare + bara XP pana la urmatorul nivel.
- Statistici rapide: total XP, quiz-uri, streak.
- Progres pe materii: carduri cu procente si dificultate medie.
- Badge-uri: grila cu obtinute/locked + hint de deblocare.
- Activity feed (optional): timeline cu realizari.
