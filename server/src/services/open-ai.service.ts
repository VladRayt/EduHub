import { openai } from '@/config/open-ai';
import { Test } from '@/@types/type';

const mocked = {
  title: 'Тест з Angular',
  description: 'Перевірте свої знання фреймворку Angular.',
  theme: 'Angular',
  questions: [
    {
      title: 'Які з наступних тегів використовуються для створення компонента в Angular?',
      answers: [
        {
          title: '<ng-component>',
          isCorrect: false,
        },
        {
          title: '<app-component>',
          isCorrect: false,
        },
        {
          title: '<ng-app>',
          isCorrect: false,
        },
        {
          title: '<app-root>',
          isCorrect: true,
        },
      ],
    },
    {
      title: "Яка директива в Angular використовується для зв'язування даних?",
      answers: [
        {
          title: '*ngFor',
          isCorrect: false,
        },
        {
          title: '*ngIf',
          isCorrect: false,
        },
        {
          title: '[ngModel]',
          isCorrect: true,
        },
        {
          title: '(ngSubmit)',
          isCorrect: false,
        },
      ],
    },
    {
      title:
        "Яким буде результат виконання наступного коду?\n\n```html\n<app-example [data]=\"{'name': 'John', 'age': 30}\"></app-example>\n```",
      answers: [
        {
          title: 'Викличе помилку компіляції',
          isCorrect: true,
        },
        {
          title: 'Відобразить компонент app-example з даними',
          isCorrect: false,
        },
        {
          title: 'Відобразить компонент app-example без даних',
          isCorrect: false,
        },
        {
          title: "Дані будуть неправильно зв'язані з компонентом",
          isCorrect: false,
        },
      ],
    },
    {
      title:
        "Що буде виведено на екран після виконання наступного коду?\n\n```typescript\nlet myString = 'Hello';\nconsole.log(myString[0]);\n```",
      answers: [
        {
          title: "'H'",
          isCorrect: true,
        },
        {
          title: "'e'",
          isCorrect: false,
        },
        {
          title: "'l'",
          isCorrect: false,
        },
        {
          title: "'o'",
          isCorrect: false,
        },
      ],
    },
    {
      title: 'Як правильно імпортувати FormsModule для використання ngModel в Angular?',
      answers: [
        {
          title: "import { FormsModule } from '@angular/core';",
          isCorrect: false,
        },
        {
          title: "import { FormsModule } from '@angular/forms';",
          isCorrect: true,
        },
        {
          title: "import FormsModule from '@angular/forms';",
          isCorrect: false,
        },
        {
          title: "import { FormsModule } from '@angular';",
          isCorrect: false,
        },
      ],
    },
    {
      title:
        'Яким буде результат виконання наступного коду?\n\n```typescript\nlet x = 10;\nlet y = x++;\nconsole.log(y);\n```',
      answers: [
        {
          title: '10',
          isCorrect: true,
        },
        {
          title: '11',
          isCorrect: false,
        },
        {
          title: '9',
          isCorrect: false,
        },
        {
          title: 'Викличе помилку компіляції',
          isCorrect: false,
        },
      ],
    },
    {
      title: 'Яка команда використовується для створення нового Angular проекту через Angular CLI?',
      answers: [
        {
          title: 'ng new',
          isCorrect: true,
        },
        {
          title: 'ng generate',
          isCorrect: false,
        },
        {
          title: 'ng create',
          isCorrect: false,
        },
        {
          title: 'ng build',
          isCorrect: false,
        },
      ],
    },
    {
      title: 'Як правильно визначити вхідні дані (input) у компоненті Angular?',
      answers: [
        {
          title: '@Input() myInput: string;',
          isCorrect: true,
        },
        {
          title: 'input myInput: string;',
          isCorrect: false,
        },
        {
          title: 'myInput: string;',
          isCorrect: false,
        },
        {
          title: '@Input myInput: string;',
          isCorrect: false,
        },
      ],
    },
    {
      title:
        "Яким буде результат виконання наступного коду в Angular?\n\n```typescript\nimport { Component } from '@angular/core';\n\n@Component({\n  selector: 'app-root',\n  template: `<div>{{getValue()}}</div>`\n})\nexport class AppComponent {\n  getValue(): string {\n    return 'Value';\n  }\n}\n```",
      answers: [
        {
          title: '{{getValue()}}',
          isCorrect: true,
        },
        {
          title: 'Value',
          isCorrect: false,
        },
        {
          title: 'Викличе помилку компіляції',
          isCorrect: false,
        },
        {
          title: 'Порожній рядок',
          isCorrect: false,
        },
      ],
    },
    {
      title: 'Як можна використовувати сервіси (services) у Angular?',
      answers: [
        {
          title:
            "Шляхом імпортування сервісу та включення його в розділ 'providers' компоненту або модуля",
          isCorrect: true,
        },
        {
          title: 'Просто створюючи і викликаючи його',
          isCorrect: false,
        },
        {
          title: 'Використовуючи глобальну змінну',
          isCorrect: false,
        },
        {
          title: 'Не можна використовувати сервіси у Angular',
          isCorrect: false,
        },
      ],
    },
  ],
};

export default class OpenAIService {
  public static async generateTest(
    title: string,
    description: string,
    theme: string,
    questionCount: number,
    language: string,
    additionalInformation: string
  ): Promise<Test> {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-16k',
      messages: [
        {
          role: 'system',
          content:
            'You are a test generator by theme, title, description and count. You should accept message with test title, test description, test theme theme and count of questions. Return - JUST JSON with this type: \ntype Test = {\n  title: string;\n  description: string;\n  theme: string;\n  questions: {\n    title: string;\n    answers: {\n      title: string;\n      isCorrect: boolean;\n    }[];\n  }[];\n};. Do not pass any unnecessary fields!',
        },
        {
          role: 'user',
          content: 'Generate 4 question(s) by theme: "Math - Multiplication".',
        },
        {
          role: 'assistant',
          content:
            '{\n    "title": "Multiplication Math Test",\n    "description": "Test your multiplication skills with these questions!",\n    "theme": "Math - Multiplication",\n    "questions": [\n      {\n        "title": "What is 6 x 7?",\n        "answers": [\n          { "title": "42", "isCorrect": true },\n          { "title": "36", "isCorrect": false },\n          { "title": "49", "isCorrect": false },\n          { "title": "54", "isCorrect": false }\n        ]\n      },\n      {\n        "title": "What is 4 x 9?",\n        "answers": [\n          { "title": "36", "isCorrect": false },\n          { "title": "45", "isCorrect": true },\n          { "title": "54", "isCorrect": false },\n          { "title": "63", "isCorrect": false }\n        ]\n      },\n      {\n        "title": "What is 8 x 3?",\n        "answers": [\n          { "title": "24", "isCorrect": true },\n          { "title": "27", "isCorrect": false },\n          { "title": "30", "isCorrect": false },\n          { "title": "32", "isCorrect": false }\n        ]\n      },\n      {\n        "title": "What is 5 x 5?",\n        "answers": [\n          { "title": "25", "isCorrect": true },\n          { "title": "30", "isCorrect": false },\n          { "title": "35", "isCorrect": false },\n          { "title": "40", "isCorrect": false }\n        ]\n      }\n    ]\n}',
        },
        {
          role: 'user',
          content: `Generate ${questionCount} question(s) by theme: "${theme}". Title: "${title}". Description: "${description}".Language for questions and answers: "${language}. Additional information: "${additionalInformation}"`,
        },
      ],
      temperature: 1,
      max_tokens: 4000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    const test: Test = JSON.parse(response.choices[0].message.content ?? '{}');

    return test as Test;
  }
}
