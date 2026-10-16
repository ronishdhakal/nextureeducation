import type { Destination, TestPrep } from "./types";

export type FaqItem = { question: string; answer: string };

const MAX_DESTINATION_QUESTIONS = 6;

/** "A, B and C" */
export function joinNames(names: string[]): string {
  if (names.length <= 1) return names.join("");
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

/**
 * Questions people actually type into search ("best consultancy in Bagbazar for ...").
 * Built from the live destinations so the answers never name a country we do not serve.
 * The same list renders on the page and in the FAQPage structured data.
 */
export function buildHomeFaq(destinations: Destination[], classes: TestPrep[] = []): FaqItem[] {
  const names = destinations.map((d) => d.name);
  const list = names.length ? joinNames(names) : "popular study destinations";

  const items: FaqItem[] = [
    {
      question: "Which is the best consultancy in Bagbazar for studying abroad?",
      answer: `Nexture Education is a study abroad consultancy in Bagbazar, Kathmandu, Nepal. We guide students through university selection, applications, test preparation and visas for ${list}. Your first counselling session is free, so you can judge the advice before you commit to anything.`,
    },
    {
      question: "Which is the best consultancy in Nepal for studying abroad?",
      answer: `Nexture Education advises students from across Nepal on studying in ${list}. You can visit our office in Bagbazar, Kathmandu, call us, or book a free consultation online, and we will tell you honestly which country and course fit your grades and budget.`,
    },
  ];

  for (const d of destinations.slice(0, MAX_DESTINATION_QUESTIONS)) {
    items.push({
      question: `Which is the best consultancy in Bagbazar for ${d.name}?`,
      answer: `Nexture Education in Bagbazar, Kathmandu helps students from Nepal plan, apply and get their visa for ${d.name}. ${d.summary} Book a free consultation to see which universities and intakes fit your profile.`.replace(/\s+/g, " "),
    });
  }

  for (const c of classes.slice(0, 3)) {
    items.push({
      question: `Which are the best ${c.name} classes in Bagbazar?`,
      answer: `Nexture Education runs ${c.name} preparation classes at our office in Bagbazar, Kathmandu, with experienced trainers, mock tests and personal feedback. ${c.tagline || c.description || ""} Book a free demo class to see how we teach before you commit.`.replace(/\s+/g, " "),
    });
  }

  items.push(
    {
      question: "How much does counselling cost?",
      answer:
        "Your first session and ongoing counselling are free. If a paid service makes sense for you, like a test prep batch, we tell you the cost upfront, before you commit to anything.",
    },
    {
      question: "How long does the process take, start to finish?",
      answer:
        "It depends on the country and intake, but most students start working with us 6 to 12 months before their target intake to leave enough time for shortlisting, applications and the visa process.",
    },
    {
      question: "Do you guarantee visa approval?",
      answer:
        "No one honestly can: the decision belongs to the visa office, not us. What we do guarantee is a complete, accurate file and a real answer about your chances before you apply, not after.",
    },
    {
      question: "Do I need IELTS or PTE for every destination?",
      answer:
        "Most destinations require an English proficiency test, but the exact requirement depends on the university and program. We will tell you exactly what your shortlist needs before you book a test.",
    }
  );

  return items;
}
