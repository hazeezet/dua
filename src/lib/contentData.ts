import { LucideIcon, BookOpen, Moon, Clock, ShieldCheck, AlertCircle } from 'lucide-react';

export interface DuaGuide {
    slug: string;
    title: string;
    description: string;
    icon: LucideIcon;
    color: string;
    sections: {
        heading: string;
        content: string;
        arabic?: string;
        transliteration?: string;
        reference?: string;
    }[];
}

export const duaGuides: DuaGuide[] = [
    {
        slug: 'how-to-make-dua',
        title: 'How to Make Dua',
        description: 'A step-by-step guide to making sincere and effective supplications to Allah.',
        icon: BookOpen,
        color: '#2e5cb8',
        sections: [
            {
                heading: '1. Begin with Praising Allah',
                content: 'Start your dua by praising Allah (SWT). The Prophet ﷺ said: "When one of you prays, let him begin by praising Allah, then let him send blessings upon the Prophet ﷺ, then let him ask for whatever he wants."',
                reference: 'Jami` at-Tirmidhi 3477',
            },
            {
                heading: '2. Send Blessings on the Prophet ﷺ',
                content: 'After praising Allah, send salawat upon the Prophet Muhammad ﷺ.',
                arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ',
                transliteration: "Allahumma salli 'ala Muhammad wa 'ala aali Muhammad",
                reference: 'Sahih al-Bukhari 3370',
            },
            {
                heading: '3. Face the Qiblah',
                content: 'If possible, face the direction of the Kaaba (Qiblah) when making dua. The Prophet ﷺ would face the Qiblah when making supplication.',
                reference: 'Sahih Muslim 895',
            },
            {
                heading: '4. Raise Your Hands',
                content: 'Raise your hands with palms facing upward. The Prophet ﷺ said: "Your Lord is Generous and Shy. If His servant raises his hands to Him, He is shy to return them empty."',
                reference: 'Sunan Abu Dawud 1488',
            },
            {
                heading: '5. Be Sincere and Humble',
                content: 'Make dua with complete sincerity (ikhlas), humility, and conviction that Allah will answer. Have certainty in your heart and avoid being distracted.',
            },
            {
                heading: '6. Ask with Persistence',
                content: 'Don\'t give up! Repeat your dua multiple times. The Prophet ﷺ would repeat his supplications three times. Allah loves those who are persistent in their asking.',
                reference: 'Sahih Muslim 2735',
            },
            {
                heading: '7. End with Salawat and Ameen',
                content: 'Conclude your dua by again sending blessings on the Prophet ﷺ and saying "Ameen" (O Allah, answer our prayer).',
            },
        ],
    },
    {
        slug: 'dua-etiquette',
        title: 'Dua Etiquette & Manners',
        description: 'The proper adab (manners) to observe when making supplication for it to be accepted.',
        icon: ShieldCheck,
        color: '#b45309',
        sections: [
            {
                heading: 'Be in a State of Wudu',
                content: 'While not mandatory, being in a state of wudu (ablution) is recommended as it shows respect and readiness for worship.',
            },
            {
                heading: 'Use the Beautiful Names of Allah',
                content: 'Call upon Allah using His beautiful names (Asma ul-Husna) that relate to your need. For example, call upon Ar-Razzaq (The Provider) when asking for provision, or Ash-Shafi (The Healer) when asking for health.',
                reference: 'Quran 7:180',
            },
            {
                heading: 'Admit Your Sins & Seek Forgiveness',
                content: 'Begin by acknowledging your shortcomings and asking for forgiveness. This shows humility and opens the door to Allah\'s mercy.',
            },
            {
                heading: 'Make Dua for Others First',
                content: 'The Prophet ﷺ encouraged making dua for others. An angel says "And for you the same" whenever you make dua for your brother or sister in their absence.',
                reference: 'Sahih Muslim 2733',
            },
            {
                heading: 'Don\'t Rush for the Answer',
                content: 'The Prophet ﷺ said: "The supplication of a slave continues to be granted as long as he does not supplicate for a sinful thing or for breaking ties of kinship, and he does not grow impatient."',
                reference: 'Sahih Muslim 2735',
            },
            {
                heading: 'Eat Halal',
                content: 'Ensure your food, drink, clothing, and income are from halal (lawful) sources. The Prophet ﷺ mentioned a man who makes dua but his food, drink, and clothing are from haram - how can his dua be answered?',
                reference: 'Sahih Muslim 1015',
            },
        ],
    },
    {
        slug: 'opening-supplications',
        title: 'Opening Supplications',
        description: 'Learn the recommended phrases to begin your dua with, as taught by the Prophet ﷺ.',
        icon: Moon,
        color: '#8b5cf6',
        sections: [
            {
                heading: 'Praising Allah - Al-Hamd',
                content: 'Begin by praising and glorifying Allah before asking for anything.',
                arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
                transliteration: 'Al-hamdu lillahi Rabbil-\'alamin',
            },
            {
                heading: 'Glorifying Allah - SubhanAllah',
                content: 'Glorify Allah and acknowledge His perfection.',
                arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ',
                transliteration: 'SubhanAllahi wa bihamdihi, SubhanAllahil-\'Adheem',
                reference: 'Sahih al-Bukhari 6682',
            },
            {
                heading: 'Salawat upon the Prophet ﷺ',
                content: 'Send blessings upon the Prophet ﷺ - this is one of the most emphasized steps.',
                arabic: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ',
                transliteration: "Allahumma salli wa sallim 'ala nabiyyina Muhammad",
            },
            {
                heading: 'Seeking Refuge - Isti\'adhah',
                content: 'Seek refuge in Allah from Shaytan before beginning your supplication.',
                arabic: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ',
                transliteration: "A'udhu billahi minash-shaytanir-rajeem",
            },
            {
                heading: 'The Comprehensive Opening',
                content: 'A beautiful comprehensive way to start your dua, combining praise, glorification, and acknowledgment.',
                arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ، اللَّهُمَّ لَكَ الْحَمْدُ، أَنْتَ نُورُ السَّمَاوَاتِ وَالْأَرْضِ',
                transliteration: "Bismillahir-Rahmanir-Raheem. Allahumma lakal-hamd, anta nurus-samawati wal-ard",
                reference: 'Sahih al-Bukhari 1120',
            },
        ],
    },
    {
        slug: 'best-times-for-dua',
        title: 'Best Times for Dua',
        description: 'Discover the most blessed times when duas are most likely to be accepted by Allah.',
        icon: Clock,
        color: '#06b6d4',
        sections: [
            {
                heading: 'The Last Third of the Night',
                content: 'Allah descends to the lowest heaven in the last third of every night and says: "Is there anyone who invokes Me that I may respond to his invocation? Is there anyone who asks Me so that I may grant him his request?"',
                reference: 'Sahih al-Bukhari 1145',
            },
            {
                heading: 'Between Adhan and Iqamah',
                content: 'The dua made between the call to prayer (adhan) and the start of prayer (iqamah) is not rejected.',
                reference: 'Jami` at-Tirmidhi 212',
            },
            {
                heading: 'During Sujud (Prostration)',
                content: 'The Prophet ﷺ said: "The closest a servant is to his Lord is when he is in prostration. So increase your supplications therein."',
                reference: 'Sahih Muslim 482',
            },
            {
                heading: 'On Friday - The Special Hour',
                content: 'There is an hour on Friday during which any Muslim who asks Allah for something, He will give it to them. Scholars say it is the last hour before Maghrib.',
                reference: 'Sahih al-Bukhari 935',
            },
            {
                heading: 'While Fasting',
                content: 'The dua of a fasting person is not refused. Make abundant dua especially before breaking your fast (iftar time).',
                reference: 'Sunan Ibn Majah 1752',
            },
            {
                heading: 'Laylatul Qadr - Night of Power',
                content: 'The most powerful night for dua. It is better than a thousand months. Seek it in the odd nights of the last ten nights of Ramadan.',
                reference: 'Quran 97:1-5',
            },
            {
                heading: 'After Obligatory Prayers',
                content: 'After completing the obligatory prayer, before saying salam or immediately after, is a blessed time for making dua.',
                reference: 'Jami` at-Tirmidhi 3499',
            },
            {
                heading: 'When it Rains',
                content: 'The Prophet ﷺ said: "Two (supplications) are not rejected: the supplication when the adhan is given, and the supplication at the time of rain."',
                reference: 'Abu Dawud 2540',
            },
        ],
    },
    {
        slug: 'things-to-avoid',
        title: 'Things to Avoid in Dua',
        description: 'Common mistakes and prohibited actions that may prevent your dua from being accepted.',
        icon: AlertCircle,
        color: '#ef4444',
        sections: [
            {
                heading: 'Don\'t Make Dua Against Yourself or Family',
                content: 'The Prophet ﷺ warned against making dua against yourself, your children, your wealth, or your servants, as it may coincide with a time when prayers are accepted.',
                reference: 'Sahih Muslim 3009',
            },
            {
                heading: 'Avoid Being Distracted',
                content: 'When making dua, focus entirely on your supplication. A heedless heart is not answered. Be present and sincere in your asking.',
                reference: 'Jami` at-Tirmidhi 3479',
            },
            {
                heading: 'Don\'t Ask for Sinful Things',
                content: 'Never supplicate for something sinful or for the cutting of ties of kinship. Allah will not accept a dua that asks for harm to others unjustly.',
                reference: 'Sahih Muslim 2735',
            },
            {
                heading: 'Don\'t Lose Hope',
                content: 'Never think your dua won\'t be answered. Allah answers every dua in one of three ways: He gives you what you asked for, He delays it for something better, or He averts a harm equivalent to it.',
                reference: 'Musnad Ahmad 11133',
            },
            {
                heading: 'Avoid Rhyming Artificially',
                content: 'Don\'t try to make your dua rhyme or overly poetic at the expense of sincerity. Simple, heartfelt words are better than elaborate but insincere phrases.',
            },
            {
                heading: 'Don\'t Say "If You Will"',
                content: 'The Prophet ﷺ said: "None of you should say: O Allah, forgive me if You wish. Rather be firm in asking, for nobody can compel Allah."',
                reference: 'Sahih al-Bukhari 6339',
            },
        ],
    },
];

export interface FallbackDua {
    id: string;
    arabic: string;
    transliteration: string;
    translation: string;
    reference: string;
    category: string;
    tags: string[];
}

export const fallbackDuas: FallbackDua[] = [
    {
        id: 'dua-001',
        arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلًا مُتَقَبَّلًا',
        transliteration: "Allahumma inni as'aluka 'ilman naafi'an, wa rizqan tayyiban, wa 'amalan mutaqabbalan",
        translation: 'O Allah, I ask You for beneficial knowledge, good provision, and accepted deeds.',
        reference: 'Sunan Ibn Majah 925',
        category: 'provision',
        tags: ['provision', 'knowledge', 'work', 'job', 'employment', 'rizq', 'sustenance'],
    },
    {
        id: 'dua-002',
        arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
        transliteration: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina 'adhaban-nar'",
        translation: 'Our Lord, give us good in this world and good in the Hereafter, and protect us from the torment of the Fire.',
        reference: 'Quran 2:201',
        category: 'general',
        tags: ['general', 'protection', 'goodness', 'hereafter', 'fire', 'dunya'],
    },
    {
        id: 'dua-003',
        arabic: 'اللَّهُمَّ اكْفِنِي بِحَلالِكَ عَنْ حَرَامِكَ وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ',
        transliteration: "Allahummak-fini bi halalika 'an haramika wa aghnini bi fadlika 'amman siwak",
        translation: 'O Allah, suffice me with what You have made lawful so that I have no need of what You have made unlawful, and make me independent of all others besides You.',
        reference: 'Jami` at-Tirmidhi 3563',
        category: 'provision',
        tags: ['provision', 'employment', 'job', 'halal', 'income', 'money', 'debt', 'financial'],
    },
    {
        id: 'dua-004',
        arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ وَأَعُوذُ بِكَ مِنَ الْجُبْنِ وَالْبُخْلِ وَأَعُوذُ بِكَ مِنْ غَلَبَةِ الدَّيْنِ وَقَهْرِ الرِّجَالِ',
        transliteration: "Allahumma inni a'udhu bika minal-hammi wal-hazani, wa a'udhu bika minal-'ajzi wal-kasali, wa a'udhu bika minal-jubni wal-bukhli, wa a'udhu bika min ghalabatid-dayni wa qahrir-rijal",
        translation: 'O Allah, I seek refuge in You from anxiety and sorrow, from weakness and laziness, from miserliness and cowardice, and from the burden of debts and being overpowered by men.',
        reference: 'Sahih al-Bukhari 6369',
        category: 'protection',
        tags: ['protection', 'anxiety', 'depression', 'debt', 'stress', 'mental health', 'sadness', 'worry'],
    },
    {
        id: 'dua-005',
        arabic: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
        transliteration: "Allahumma innaka 'afuwwun tuhibbul-'afwa fa'fu 'anni",
        translation: 'O Allah, You are the Most Pardoning, and You love to pardon, so pardon me.',
        reference: 'Jami` at-Tirmidhi 3513',
        category: 'forgiveness',
        tags: ['forgiveness', 'pardon', 'laylatul qadr', 'mercy', 'ramadan', 'night of power'],
    },
];

export const suggestedQueries = [
    'Finding a job',
    'Good health',
    'Forgiveness',
    'Guidance',
    'Protection from evil',
    'Financial provision',
    'Happy family',
    'Success in exams',
    'Patience in hardship',
    'Gratitude',
    'Anxiety & stress relief',
    'Laylatul Qadr',
];

export const motivationalHadith = [
    {
        text: '"When the last ten nights of Ramadan begin, the Prophet ﷺ would tighten his waist belt, pray during the night, and wake his family."',
        source: 'Sahih al-Bukhari 2024',
    },
    {
        text: '"Whoever stands (in prayer) during Laylatul Qadr with faith and hoping for reward, his previous sins will be forgiven."',
        source: 'Sahih al-Bukhari 1901',
    },
    {
        text: '"Search for Laylatul Qadr in the odd nights of the last ten nights of Ramadan."',
        source: 'Sahih al-Bukhari 2017',
    },
    {
        text: '"The supplication of a fasting person is never refused."',
        source: 'Sunan Ibn Majah 1752',
    },
    {
        text: '"Ramadan is the month whose beginning is mercy, middle is forgiveness, and end is freedom from the Fire."',
        source: 'Ibn Khuzaymah',
    },
];
