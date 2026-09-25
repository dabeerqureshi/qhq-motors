import { SITE } from "@/data/site";

export interface Faq {
  question: string;
  answer: string;
}

/** FAQ content — also feeds the FAQPage structured data for Google. */
export const FAQS: Faq[] = [
  {
    question: "Where is QHQ Motors located?",
    answer:
      "QHQ Motors is based in Chenab Nagar (Rabwah), Punjab, Pakistan. We deliver and collect cars anywhere inside Chenab Nagar and Rabwah free of charge, and we also provide car delivery to Faisalabad, Sargodha, Lahore, Islamabad and other cities.",
  },
  {
    question: "Do you deliver cars to the airport?",
    answer:
      "Yes. We provide 24/7 car delivery directly to Allama Iqbal International Airport Lahore (LHE), Faisalabad International Airport (LYP), Islamabad International Airport (ISB) and nearby terminals. Your clean, automatic car is handed over to you on arrival ready for self-drive.",
  },
  {
    question: "Are all your cars automatic?",
    answer:
      "Yes — every car in the QHQ Motors fleet is 100% automatic, so overseas visitors and local drivers can drive with ease. Our current fleet features the Toyota Corolla Altis 1.6 Automatic and the Suzuki Alto VXL Automatic.",
  },
  {
    question: "What are your rental rates?",
    answer:
      "Our rates are simple and transparent based on destination: Faisalabad (Alto Rs 4,500 / Altis Rs 5,000), Sargodha (Alto Rs 4,500 / Altis Rs 5,000), Lahore (Alto Rs 5,000 / Altis Rs 5,500), Islamabad (Alto Rs 5,500 / Altis Rs 6,000), and custom rates for other cities. Monthly packages are Rs 105,000 for Alto and Rs 120,000 for Altis (+ oil change).",
  },
  {
    question: "Do you provide a driver or is it self-drive only?",
    answer:
      "We offer 100% self-drive rentals only (no driver). Both our Corolla Altis and Suzuki Alto are automatic, smooth, and effortless to drive.",
  },
  {
    question: "Can overseas Pakistanis book from abroad?",
    answer:
      "Yes! Most of our guests book from the UK, USA, Canada, Europe and the Gulf before their flight. Simply message us on WhatsApp at +92 332 621 2431 with your arrival details and your car will be delivered to the airport when you land.",
  },
  {
    question: "Is fuel and toll tax included?",
    answer:
      "The rental covers the vehicle. Fuel and motorway tolls are paid by the guest. For monthly rentals, routine oil change is covered as part of the monthly agreement.",
  },
  {
    question: "How do I pay and what documents are required?",
    answer:
      "We accept cash, bank transfer, Easypaisa and JazzCash. All you need is a valid Pakistani or international driving licence and a copy of your CNIC or passport.",
  },
  {
    question: "Can you deliver the car to my hotel or family home?",
    answer:
      "Yes. We offer free doorstep delivery to any residence, hotel or guest house in Chenab Nagar and Rabwah, as well as airport handovers across Punjab.",
  },
];

/** Small helper for the hero & contact CTA. */
export const BOOKING_WHATSAPP = SITE.phone.whatsapp;
