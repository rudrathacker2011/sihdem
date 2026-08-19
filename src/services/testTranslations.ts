export type TestLang = "en" | "gu" | "hi";

export interface TranslatedOption {
  id: string;
  label: string;
}

export interface TranslatedQuestion {
  id: number;
  title: string;
  subtitle: string;
  options: Record<string, string>;
}

export const TEST_TRANSLATIONS: Record<TestLang, Record<number, TranslatedQuestion>> = {
  en: {
    1: {
      id: 1,
      title: "When you have free time on a weekend, what activity do you enjoy doing the most?",
      subtitle: "Choose one or more activities that you naturally find interesting.",
      options: {
        "q1-a": "Exploring computers, writing simple code, or creating digital apps",
        "q1-b": "Drawing, sketching, graphic design, or photography",
        "q1-c": "Solving math puzzles, riddles, or playing chess and strategy games",
        "q1-d": "Thinking about business ideas, startups, or understanding money and markets",
        "q1-e": "Writing creative stories, public speaking, debate, or making videos",
        "q1-f": "Reading about science, biology, medical inventions, or doing practical experiments",
      },
    },
    2: {
      id: 2,
      title: "Which academic subjects in school do you feel most comfortable and confident studying?",
      subtitle: "Select the subject areas where you score well and enjoy studying.",
      options: {
        "q2-a": "Mathematics and Statistics (Calculus, Algebra, Data Interpretation)",
        "q2-b": "Computer Science / Information Technology and Coding",
        "q2-c": "Physics and Applied Mechanics (How physical machines and circuits work)",
        "q2-d": "Biology and Chemistry (Human anatomy, medicine, living organisms)",
        "q2-e": "Commerce, Economics, and Accountancy (Business, budgets, trade)",
        "q2-f": "English, Social Sciences, History, and Creative Arts",
      },
    },
    3: {
      id: 3,
      title: "When you and your family think about your future career, which factor is most important to you?",
      subtitle: "Select your primary goals and priorities for life after college.",
      options: {
        "q3-a": "High growth, global job opportunities, and cutting-edge technology",
        "q3-b": "Creative freedom, building beautiful consumer products, and visual design",
        "q3-c": "High financial earnings, managing investments, and leadership roles",
        "q3-d": "Noble profession, saving lives, and long-term societal respect (Medicine / Healthcare)",
        "q3-e": "Working with tangible machines, building real-world infrastructure and robotics",
      },
    },
    4: {
      id: 4,
      title: "What daily work style and environment suits your personality best?",
      subtitle: "Choose the environment where you would be happiest working every day.",
      options: {
        "q4-a": "Focused intellectual work with computers, software tools, and logical problem solving",
        "q4-b": "Creative and collaborative studio discussing ideas, layouts, and user experiences",
        "q4-c": "Dynamic business environment managing teams, client meetings, and financial plans",
        "q4-d": "Hospital, clinic, or diagnostic laboratory caring for patients and health research",
        "q4-e": "Engineering workshop, industrial lab, or on-site project management",
      },
    },
    5: {
      id: 5,
      title: "How comfortable are you with competitive entrance exams and intense multi-year preparation?",
      subtitle: "This helps us guide you between intensive entrance paths (JEE/NEET) and skill/design paths.",
      options: {
        "q5-a": "Very comfortable with 2+ years of rigorous prep for Engineering (JEE Main / Advanced / BITSAT)",
        "q5-b": "Ready for dedicated multi-year medical preparation and clinical training (NEET UG / PG)",
        "q5-c": "Prefer Commerce / Management entrances (CUET, IPMAT, CA Foundation, CFA)",
        "q5-d": "Prefer portfolio and aptitude-based creative design entrances (UCEED, NID, NIFT)",
        "q5-e": "Prefer direct university admissions, practical internships, and portfolio-driven tech careers",
      },
    },
    6: {
      id: 6,
      title: "How do you prefer to explain your ideas and communicate with others?",
      subtitle: "Choose the communication method that comes most naturally to you.",
      options: {
        "q6-a": "Using clear logic, structured facts, and step-by-step reasoning",
        "q6-b": "Using visual diagrams, slides, sketches, and design examples",
        "q6-c": "Using numbers, financial returns, and persuasive business summaries",
        "q6-d": "Empathetic listening and patient, caring conversation",
        "q6-e": "Demonstrating physical models, hands-on prototypes, and functional devices",
      },
    },
    7: {
      id: 7,
      title: "Which stream option are you and your parents currently considering for higher secondary (11th-12th)?",
      subtitle: "This ensures our roadmap aligns with your current educational track.",
      options: {
        "q7-a": "Science PCM (Physics, Chemistry, Mathematics — Engineering / Tech / Architecture)",
        "q7-b": "Science PCB (Physics, Chemistry, Biology — Medicine / Biotech / Pharmacy)",
        "q7-c": "Science PCMB (PCM + Biology — Keeping all technical & medical options open)",
        "q7-d": "Commerce with Applied Mathematics (Finance, CA, Business Analytics, Investment)",
        "q7-e": "Commerce without Math / Humanities (Design, Law, Mass Media, Management)",
      },
    },
  },
  gu: {
    1: {
      id: 1,
      title: "જ્યારે સપ્તાહના અંતે તમારી પાસે ખાલી સમય હોય, ત્યારે તમને કઈ પ્રવૃત્તિ સૌથી વધુ ગમે છે?",
      subtitle: "તમને કુદરતી રીતે રસપ્રદ લાગતી એક અથવા વધુ પ્રવૃત્તિઓ પસંદ કરો.",
      options: {
        "q1-a": "કમ્પ્યુટર ચલાવવું, કોડિંગ શીખવું અથવા ડિજિટલ એપ્સ બનાવવી",
        "q1-b": "ચિત્રકામ, સ્કેચિંગ, ગ્રાફિક ડિઝાઇન અથવા ફોટોગ્રાફી",
        "q1-c": "ગણિતના કોયડા ઉકેલવા અથવા ચેસ જેવી રમત રમવી",
        "q1-d": "બિઝનેસ આઈડિયા વિચારવા અથવા બજાર અને નાણાંકીય વ્યવહાર સમજવા",
        "q1-e": "વાર્તા લખવી, વક્તૃત્વ, ડિબેટ અથવા વિડીયો બનાવવા",
        "q1-f": "વિજ્ઞાન, બાયોલોજી, તબીબી શોધો વાંચવી અથવા પ્રયોગો કરવા",
      },
    },
    2: {
      id: 2,
      title: "શાળામાં કયા વિષયો ભણવામાં તમને સૌથી વધુ આત્મવિશ્વાસ અને સરળતા લાગે છે?",
      subtitle: "જે વિષયોમાં તમે સારા ગુણ મેળવો છો અને ભણવાની મજા આવે છે તે પસંદ કરો.",
      options: {
        "q2-a": "ગણિત અને આંકડાશાસ્ત્ર (મેથેમેટિક્સ, આંકડાકીય ગણતરીઓ)",
        "q2-b": "કમ્પ્યુટર સાયન્સ / ઇન્ફોર્મેશન ટેકનોલોજી અને કોડિંગ",
        "q2-c": "ભૌતિક વિજ્ઞાન (ફિઝિક્સ અને મશીનરી કેવી રીતે કામ કરે છે)",
        "q2-d": "જીવવિજ્ઞાન અને રસાયણશાસ્ત્ર (બાયોલોજી, કેમિસ્ટ્રી, દવાઓ)",
        "q2-e": "કોમર્સ, અર્થશાસ્ત્ર અને નામાના મૂળતત્વો (એકાઉન્ટ, બિઝનેસ)",
        "q2-f": "અંગ્રેજી, સમાજવિદ્યા, ઇતિહાસ અને ભાષાઓ",
      },
    },
    3: {
      id: 3,
      title: "જ્યારે તમે અને તમારા વાલીઓ ભવિષ્યની કારકિર્દી વિશે વિચારો છો, ત્યારે સૌથી મહત્વનું શું છે?",
      subtitle: "કોલેજ પછી તમારા જીવનના મુખ્ય લક્ષ્યો પસંદ કરો.",
      options: {
        "q3-a": "ઉચ્ચ વિકાસ, વૈશ્વિક નોકરીની તકો અને નવી ટેકનોલોજી",
        "q3-b": "સર્જનાત્મક સ્વતંત્રતા અને સુંદર ડિઝાઇન બનાવવી",
        "q3-c": "ઉચ્ચ આવક, બિઝનેસ લીડરશિપ અને રોકાણ વ્યવસ્થાપન",
        "q3-d": "સેવાકીય વ્યવસાય, દર્દીઓની સેવા અને સમાજમાં મોટો આદર (મેડિકલ / ડોક્ટર)",
        "q3-e": "વાસ્તવિક મશીનો, રોબોટિક્સ અને ઇજનેરી પ્રોજેક્ટ્સ પર કામ કરવું",
      },
    },
    4: {
      id: 4,
      title: "તમારા સ્વભાવ માટે કેવા પ્રકારનું દૈનિક કાર્ય વાતાવરણ સૌથી વધુ અનુકૂળ રહેશે?",
      subtitle: "જ્યાં તમે દરરોજ આનંદથી કામ કરી શકો તેવું વાતાવરણ પસંદ કરો.",
      options: {
        "q4-a": "કમ્પ્યુટર અને સોફ્ટવેર સાથે શાંતિથી લોજિકલ સમસ્યાઓ ઉકેલવી",
        "q4-b": "નવા વિચારો અને ડિઝાઇન પર ચર્ચા કરતો ક્રિએટિવ સ્ટુડિયો",
        "q4-c": "ટીમ મેનેજમેન્ટ, બિઝનેસ મીટિંગ્સ અને નાણાકીય આયોજન",
        "q4-d": "હોસ્પિટલ, ક્લિનિક અથવા રિસર્ચ લેબમાં આરોગ્ય સેવા",
        "q4-e": "ઇજનેરી વર્કશોપ, મશીનરી પ્લાન્ટ અથવા સાઇટ પ્રોજેક્ટ્સ",
      },
    },
    5: {
      id: 5,
      title: "તમે સ્પર્ધાત્મક પ્રવેશ પરીક્ષાઓ (Competitive Exams) ની તૈયારી માટે કેટલા તૈયાર છો?",
      subtitle: "આનાથી અમે તમને યોગ્ય એન્ટ્રન્સ પરીક્ષાનો સાચો માર્ગ બતાવી શકીશું.",
      options: {
        "q5-a": "ઇજનેરી માટે 2 વર્ષ સખત મહેનત કરવા તૈયાર (JEE Main / Advanced / BITSAT)",
        "q5-b": "મેડિકલ માટે લાંબી અને સમર્પિત તૈયારી કરવા તૈયાર (NEET UG / PG)",
        "q5-c": "કોમર્સ અને મેનેજમેન્ટ પ્રવેશ પરીક્ષાઓ (CUET, IPMAT, CA Foundation)",
        "q5-d": "ડિઝાઇન અને એપ્ટિટ્યુડ પરીક્ષાઓ (UCEED, NID, NIFT)",
        "q5-e": "ડાયરેક્ટ કોલેજ એડમિશન, પ્રેક્ટિકલ સ્કિલ્સ અને પોર્ટફોલિયો આધારિત કરિયર",
      },
    },
    6: {
      id: 6,
      title: "તમે તમારા વિચારો અન્ય લોકો સમક્ષ કેવી રીતે સમજાવવાનું પસંદ કરો છો?",
      subtitle: "તમારી વાતચીત કરવાની સૌથી સરળ અને કુદરતી રીત પસંદ કરો.",
      options: {
        "q6-a": "સ્પષ્ટ લોજિક, નિયમો અને સ્ટેપ-બાય-સ્ટેપ તથ્યો દ્વારા",
        "q6-b": "ચિત્રો, સ્લાઇડ્સ, ડિઝાઇન અને ઉદાહરણો દ્વારા",
        "q6-c": "આંકડા, નફો-નુકસાન અને બિઝનેસ સારાંશ દ્વારા",
        "q6-d": "સહાનુભૂતિપૂર્વક સાંભળીને અને પ્રેમથી સમજાવીને",
        "q6-e": "વાસ્તવિક મોડેલ્સ અને મશીનરી ડેમો દ્વારા",
      },
    },
    7: {
      id: 7,
      title: "ધોરણ 11-12 માટે તમે અને તમારા વાલીઓ હાલમાં કયો પ્રવાહ (Stream) વિચારી રહ્યા છો?",
      subtitle: "જેથી અમારો રોડમેપ તમારા અભ્યાસ સાથે સીધો મેળ ખાય.",
      options: {
        "q7-a": "સાયન્સ PCM (ફિઝિક્સ, કેમિસ્ટ્રી, મેથ્સ — એન્જિનિયરિંગ / ટેકનોલોજી)",
        "q7-b": "સાયન્સ PCB (ફિઝિક્સ, કેમિસ્ટ્રી, બાયોલોજી — મેડિકલ / ફાર્મસી)",
        "q7-c": "સાયન્સ PCMB (ગણિત અને જીવવિજ્ઞાન બંને સાથે)",
        "q7-d": "કોમર્સ વિથ મેથ્સ (નાણાં, સીએ, બિઝનેસ એનાલિટિક્સ)",
        "q7-e": "કોમર્સ / આર્ટસ (ડિઝાઇન, લો, મીડિયા, મેનેજમેન્ટ)",
      },
    },
  },
  hi: {
    1: {
      id: 1,
      title: "जब सप्ताहांत में आपके पास खाली समय होता है, तो आप कौन सा काम करना सबसे अधिक पसंद करते हैं?",
      subtitle: "वे गतिविधियाँ चुनें जो आपको स्वाभाविक रूप से सबसे दिलचस्प लगती हैं।",
      options: {
        "q1-a": "कंप्यूटर चलाना, कोडिंग सीखना या डिजिटल ऐप्स बनाना",
        "q1-b": "चित्रकला, स्केचिंग, ग्राफिक डिजाइन या फोटोग्राफी",
        "q1-c": "गणित की पहेलियां सुलझाना या शतरंज जैसी रणनीतिक खेल खेलना",
        "q1-d": "बिजनेस आइडिया सोचना या बाजार और पैसों के लेन-देन को समझना",
        "q1-e": "रचनात्मक कहानियां लिखना, भाषण, वाद-विवाद या वीडियो बनाना",
        "q1-f": "विज्ञान, जीव विज्ञान, मेडिकल खोजों को पढ़ना या प्रयोग करना",
      },
    },
    2: {
      id: 2,
      title: "स्कूल में कौन से विषय पढ़ने में आपको सबसे अधिक आत्मविश्वास और सहजता महसूस होती है?",
      subtitle: "वे विषय चुनें जिनमें आपके अच्छे अंक आते हैं और पढ़ने में रुचि है।",
      options: {
        "q2-a": "गणित और सांख्यिकी (Mathematics, Data Analysis)",
        "q2-b": "कंप्यूटर साइंस / आईटी और कोडिंग",
        "q2-c": "भौतिक विज्ञान (Physics और मशीनें कैसे काम करती हैं)",
        "q2-d": "जीव विज्ञान और रसायन विज्ञान (Biology, Chemistry, दवाइयां)",
        "q2-e": "कॉमर्स, अर्थशास्त्र और अकाउंट्स (Business, Finance)",
        "q2-f": "अंग्रेजी, सामाजिक विज्ञान, इतिहास और कला",
      },
    },
    3: {
      id: 3,
      title: "जब आप और आपके अभिभावक भविष्य के करियर के बारे में सोचते हैं, तो सबसे महत्वपूर्ण क्या है?",
      subtitle: "कॉलेज के बाद अपने जीवन के प्रमुख लक्ष्यों को चुनें।",
      options: {
        "q3-a": "उच्च विकास, वैश्विक नौकरियां और नई तकनीक",
        "q3-b": "रचनात्मक स्वतंत्रता और सुंदर डिजाइन तैयार करना",
        "q3-c": "उच्च आय, बिजनेस लीडरशिप और वित्तीय प्रबंधन",
        "q3-d": "महान पेशा, लोगों की सेवा और समाज में बड़ा सम्मान (मेडिकल / डॉक्टर)",
        "q3-e": "वास्तविक मशीनों, रोबोटिक्स और इंजीनियरिंग प्रोजेक्ट्स पर काम करना",
      },
    },
    4: {
      id: 4,
      title: "आपके स्वभाव के अनुसार प्रतिदिन का कैसा कार्य वातावरण सबसे उपयुक्त रहेगा?",
      subtitle: "वह वातावरण चुनें जहां आप हर दिन खुशी से काम कर सकें।",
      options: {
        "q4-a": "कंप्यूटर और सॉफ्टवेयर के साथ तार्किक समस्याओं को हल करना",
        "q4-b": "नए विचारों और डिजाइन पर चर्चा करने वाला क्रिएटिव स्टूडियो",
        "q4-c": "टीम प्रबंधन, बिजनेस मीटिंग्स और वित्तीय योजनाएं",
        "q4-d": "अस्पताल, क्लिनिक या रिसर्च लैब में स्वास्थ्य सेवा",
        "q4-e": "इंजीनियरिंग वर्कशॉप, इंडस्ट्रियल प्लांट या साइट प्रोजेक्ट्स",
      },
    },
    5: {
      id: 5,
      title: "आप प्रतियोगी प्रवेश परीक्षाओं (Entrance Exams) की तैयारी के लिए कितने तैयार हैं?",
      subtitle: "इससे हम आपको सही प्रवेश परीक्षा और मार्गदर्शन प्रदान कर सकेंगे।",
      options: {
        "q5-a": "इंजीनियरिंग के लिए 2 वर्ष कड़ी मेहनत को तैयार (JEE Main / Advanced / BITSAT)",
        "q5-b": "मेडिकल के लिए समर्पित लंबी तैयारी को तैयार (NEET UG / PG)",
        "q5-c": "कॉमर्स और मैनेजमेंट प्रवेश परीक्षाएं (CUET, IPMAT, CA Foundation)",
        "q5-d": "डिजाइन और एप्टीट्यूड परीक्षाएं (UCEED, NID, NIFT)",
        "q5-e": "सीधे कॉलेज प्रवेश, व्यावहारिक कौशल और पोर्टफोलियो आधारित करियर",
      },
    },
    6: {
      id: 6,
      title: "आप अपने विचारों को दूसरों के सामने कैसे समझाना पसंद करते हैं?",
      subtitle: "अपनी बातचीत करने की सबसे स्वाभाविक शैली चुनें।",
      options: {
        "q6-a": "स्पष्ट तर्क, नियमों और क्रमबद्ध तथ्यों के माध्यम से",
        "q6-b": "चित्रों, स्लाइड्स, डिजाइन और उदाहरणों के माध्यम से",
        "q6-c": "आंकड़ों, लाभ-हानि और बिजनेस सारांश के माध्यम से",
        "q6-d": "सहानुभूतिपूर्वक सुनकर और प्रेम से समझाकर",
        "q6-e": "भौतिक मॉडल और मशीनरी डेमो के माध्यम से",
      },
    },
    7: {
      id: 7,
      title: "11वीं-12वीं के लिए आप और आपके अभिभावक वर्तमान में कौन सा संकाय (Stream) सोच रहे हैं?",
      subtitle: "ताकि हमारा रोडमैप आपकी पढ़ाई के साथ पूरी तरह मेल खा सके।",
      options: {
        "q7-a": "साइंस PCM (Physics, Chemistry, Math — इंजीनियरिंग / टेक्नोलॉजी)",
        "q7-b": "साइंस PCB (Physics, Chemistry, Biology — मेडिकल / फार्मेसी)",
        "q7-c": "साइंस PCMB (गणित और जीव विज्ञान दोनों के साथ)",
        "q7-d": "कॉमर्स विथ मैथ्स (फाइनेंस, सीए, बिजनेस एनालिटिक्स)",
        "q7-e": "कॉमर्स / आर्ट्स (डिजाइन, लॉ, मीडिया, मैनेजमेंट)",
      },
    },
  },
};

export function getTranslatedQuestion(id: number, lang: TestLang = "en"): TranslatedQuestion {
  return TEST_TRANSLATIONS[lang]?.[id] || TEST_TRANSLATIONS.en[id];
}
