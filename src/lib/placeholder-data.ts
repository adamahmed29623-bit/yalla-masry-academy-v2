// This file contains placeholder data that we'll use for the UI
// until we implement a real database. In a real app, this data would
// come from a Firestore collection.

export const placeholderTeachers = [
  {
    id: 'teacher-1-sara',
    name: 'سارة المصري',
    profilePictureUrl: 'https://picsum.photos/seed/sara/200/200',
    introVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder video
    headline: 'خبيرة في اللهجة العامية المصرية وجعل التعلم ممتعاً',
    bio: 'أنا سارة، معلمة لغة عربية من القاهرة. أحب مشاركة ثقافتي ولغتي مع الطلاب من جميع أنحاء العالم. أسلوبي في التدريس يعتمد على التفاعل والممارسة اليومية. في دروسي، سنتحدث كثيراً ونشاهد مقاطع من الأفلام المصرية ونستمع إلى الأغاني.',
    experience: '5 سنوات من الخبرة في تدريس اللغة العربية لغير الناطقين بها عبر الإنترنت وفي المراكز التعليمية.',
    hourlyRate: 20,
    availability: 'مرنة - صباحاً ومساءً',
    rating: 4.9,
    totalReviews: 125,
    specialties: ['colloquial', 'kids'],
    reviews: [
        { id: 'r1', studentName: 'John D.', rating: 5, comment: 'Amazing teacher! Sara is very patient and makes learning fun.' },
        { id: 'r2', studentName: 'Emily R.', rating: 5, comment: 'I have learned so much in just a few weeks. Highly recommended.' }
    ]
  },
  {
    id: 'teacher-2-ahmed',
    name: 'أحمد القارئ',
    profilePictureUrl: 'https://picsum.photos/seed/ahmed/200/200',
    introVideoUrl: 'https://www.youtube.com/embed/ZyDbq-lEKTo', // Placeholder video
    headline: 'معلم قرآن كريم معتمد ومجاز في القراءات العشر',
    bio: 'السلام عليكم. اسمي أحمد وأنا من الإسكندرية. كرست حياتي لتعلم وتعليم القرآن الكريم. حصلت على إجازات في عدة قراءات وأتبع منهجاً منظماً لمساعدة الطلاب على تحسين التلاوة والحفظ والفهم.',
    experience: 'خبرة أكثر من 10 سنوات في تحفيظ القرآن الكريم وتدريس علوم التجويد.',
    hourlyRate: 25,
    availability: 'المساء وعطلات نهاية الأسبوع',
    rating: 5.0,
    totalReviews: 210,
    specialties: ['quran'],
    reviews: [
        { id: 'r3', studentName: 'Fatima Z.', rating: 5, comment: 'الشيخ أحمد من أفضل من تعلمت على أيديهم. صبور جداً وعلمه واسع. بارك الله فيه.' },
        { id: 'r4', studentName: 'David L.', rating: 5, comment: 'An excellent teacher for Tajweed rules. My recitation has improved significantly.' }
    ]
  },
];
