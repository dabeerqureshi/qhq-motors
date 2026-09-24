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
      "QHQ Motors is based in Chenab Nagar (Rabwah), Punjab, Pakistan. We deliver and collect cars anywhere inside Chenab Nagar and Rabwah free of charge, and we also serve Chiniot, Faisalabad, Sargodha, Jhang, Lahore and Islamabad.",
  },
  {
    question: "Do you offer airport pickup?",
    answer:
      "Yes. We provide 24/7 meet-and-greet pickup and drop-off at Allama Iqbal International Airport Lahore (LHE), Faisalabad International Airport (LYP), Islamabad International Airport (ISB) and Sialkot International Airport (SKT). Our driver waits at arrivals with your name on a board, helps with luggage and drives you straight to Chenab Nagar or Rabwah.",
  },
  {
    question: "Are all your cars automatic?",
    answer:
      "Yes — every car in the QHQ Motors fleet is 100% automatic, so overseas visitors and new drivers can relax. Our current line-up is the Toyota Corolla Altis 1.6 Automatic and the Suzuki Alto VXL Automatic.",
  },
  {
    question: "What are your daily, weekly and monthly rates?",
    answer:
      "Daily rentals start from Rs 5,000 for the Suzuki Alto Automatic and Rs 6,000 for the Toyota Corolla Altis Automatic. The per-day rate drops the longer you book — weekly packages start at Rs 30,000 (7 days) and monthly packages at Rs 100,000 (30 days) — including 100 to 120 free kilometres per day. Message us on WhatsApp for a firm quote.",
  },
  {
    question: "Can overseas Pakistanis book from abroad?",
    answer:
      "Absolutely. Most of our guests book from the UK, USA, Canada, Europe and the Gulf before they fly. Just send your dates and flight number on WhatsApp at +92 332 621 2431 and your car will be waiting at the airport when you land.",
  },
  {
    question: "Do you provide a driver or can I self-drive?",
    answer:
      "Both options are available. Self-drive is offered with a valid driving licence and a refundable security deposit, and a professional, courteous chauffeur can be arranged on request for airport transfers or full-day touring.",
  },
  {
    question: "Is fuel, toll tax and driver food included?",
    answer:
      "The listed rent covers the vehicle and standard maintenance only. Fuel, motorway tolls and driver meals on long trips are paid by the guest. Your quoted rate will always state clearly what is included before you confirm.",
  },
  {
    question: "How do I pay and what documents are required?",
    answer:
      "We accept cash, bank transfer, Easypaisa and JazzCash. For self-drive bookings we need a valid Pakistani or international driving licence, a copy of your CNIC or passport and a refundable security deposit (Rs 12,000 to Rs 20,000 depending on the car).",
  },
  {
    question: "How far in advance should I book?",
    answer:
      "During wedding season, Eid holidays and the December–January peak it is best to book 1–2 weeks ahead. For normal weekdays we can usually arrange a car the same day.",
  },
  {
    question: "Can you deliver the car to my hotel or family home?",
    answer:
      "Yes. We deliver to any address in Chenab Nagar, Rabwah and the surrounding towns, and we can also hand the car over at Lahore, Faisalabad, Islamabad or Sialkot airport, a hotel, a bus terminal or a guest house.",
  },
];

/** Small helper for the hero & contact CTA. */
export const BOOKING_WHATSAPP = SITE.phone.whatsapp;
