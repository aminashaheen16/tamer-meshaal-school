/**
 * مساعد المدرسة - النظام الذكي لمدرسة الشهيد تامر عبدالنبي مشعل الإعدادية المشتركة
 * نظام ردود متدفق لحظياً (Streaming Response Engine) مع إمكانية الإيقاف والنسخ السريع
 */

(function () {
  'use strict';

  // قاعدة المعرفة الشاملة لبيانات المدرسة
  const SCHOOL_KB = {
    identity: {
      name: "مدرسة الشهيد تامر عبدالنبي مشعل الإعدادية المشتركة",
      type: "مدرسة إعدادية حكومية مشتركة (بنين وبنات)",
      address: "قرية الغريب، مركز زفتى، محافظة الغربية، بجوار محطة المياه",
      code: "الرقم التعريفي: 1611496 | الرقم الكودي: 41035182",
      phone: "12345678",
      whatsapp: "2012345678",
      email: "info@tamer-meshaal-school.edu.eg",
      hours: "من الساعة 7:00 صباحاً حتى الساعة 1:30 مساءً (الأحد إلى الخميس)",
      assembly: "يبدأ طابور الصباح المدرسي وتحية العلم في تمام الساعة 7:00 صباحاً وتليه الإذاعة المدرسية والحصة الأولى."
    },
    martyr: {
      name: "الشهيد البطل تامر عبدالنبي صادق مشعل",
      title: "شهيد الواجب والوطن",
      tribute: "ابن محافظة الغربية البار، الذي روى بدمائه الزكية تراب الوطن الغالي دفاعاً عن عزته وأمنه وسلامة مواطنيه. سُميت المدرسة باسمه تخليداً لبطولته العطرة ولتظل تضحيته نبراساً ينير درب الأجيال القادمة في حب مصر والانتماء الحقيقي لها."
    },
    leadership: {
      principal: "الأستاذة رباب البشلاوي (مديرة المدرسة)",
      vicePrincipal: "الأستاذة هبه بلبول (وكيل المدرسة)",
      officeHours: "يستقبل مكتب الإدارة أولياء الأمور الكرام يومي الإثنين والأربعاء من الساعة 11:30 صباحاً حتى 1:00 ظهراً لتيسير التواصل دون تعطيل الحصص."
    },
    specialists: {
      psychological: "الأستاذة خديجة النويهي - الأخصائية النفسية بالمدرسة (مسؤولة عن الدعم النفسي للطلاب، تعديل السلوك، علاج صعوبات التعلم وقلق الامتحانات، وتعزيز الثقة بالنفس).",
      social: "الأستاذة غادة مجدي - الأخصائية الاجتماعية بالمدرسة (مسؤولة عن الأبحاث الاجتماعية والإعفاءات، متابعة المواظبة والغياب، حل المشكلات السلوكية والطلابية، وتنظيم الرحلات والأنشطة الاجتماعية)."
    },
    teachers: [
      { subject: "اللغة العربية والخط العربي", teachers: ["الأستاذ عبدالمنعم الشايب", "الأستاذة عُليا حنفي", "الأستاذ مرسي الزيات"] },
      { subject: "اللغة الثانية (اللغة الفرنسية)", teachers: ["مدام سمر محجوب حجازي"] },
      { subject: "التربية الدينية الإسلامية", teachers: ["الأستاذة إسراء مصطفى"] },
      { subject: "العلوم وتجارب المعمل", teachers: ["الأستاذ محمد البكري", "الأستاذة سلوى البربري"] },
      { subject: "الرياضيات (الجبر والهندسة)", teachers: ["الأستاذ رضا الشامي", "الأستاذ محمود البدوي"] },
      { subject: "الدراسات الاجتماعية (الجغرافيا والتاريخ)", teachers: ["الأستاذة حنان حليم"] },
      { subject: "اللغة الإنجليزية", teachers: ["مستر محمد زينة", "مستر إيهاب سلام"] },
      { subject: "الحاسب الآلي وتكنولوجيا المعلومات", teachers: ["الأستاذة جيهان مشغل"] },
      { subject: "التربية الفنية (الرسم والمعارض)", teachers: ["الأستاذة فاطمة سعيد"] },
      { subject: "المسرح المدرسي والإلقاء والتمثيل", teachers: ["الأستاذ محمد بدر"] },
      { subject: "التربية الرياضية والأنشطة الحركية", teachers: ["الأستاذ سالم", "الأستاذة شيماء"] },
      { subject: "الاقتصاد المنزلي والأعمال اليدوية", teachers: ["الأستاذة همت"] }
    ],
    activities: [
      "المسرح المدرسي وفنون الإلقاء تحت إشراف أ. محمد بدر (حصد المركز الأول على مستوى الإدارة في المسابقة المسرحية).",
      "معارض التربية الفنية والرسم تحت إشراف أ. فاطمة سعيد (لوحات تشكيلية وأشغال يدوية إبداعية).",
      "دوري كرة القدم وألعاب القوى تحت إشراف أ. سالم و أ. شيماء.",
      "ورش الاقتصاد المنزلي وفنون الطهي والتطريز والتدبير تحت إشراف أ. همت.",
      "نادي التكنولوجيا والحاسب الآلي ومختبر المبرمج الصغير تحت إشراف أ. جيهان مشغل.",
      "الكشافة المدرسية وتحية العلم بطابور الصباح.",
      "الصحافة المدرسية والإذاعة الصباحية وجماعة البيئة والتشجير."
    ],
    stages: [
      "الصف الأول الإعدادي: تأهيل تأسيسي وتكيف مع مناهج المرحلة الإعدادية واللغة الثانية والعلوم المتخصصة.",
      "الصف الثاني الإعدادي: تعميق المعارف وتطوير التفكير المنطقي والمهارات العملية.",
      "الصف الثالث الإعدادي: مرحلة الشهادة الإعدادية والتجهيز للتفوق وتنسيق مدارس المتفوقين والثانوية العامة والفنية."
    ]
  };

  // تطبيع النص العربي لتسهيل البحث والمطابقة الذكية
  function normalizeText(text) {
    if (!text) return "";
    return text
      .toLowerCase()
      .replace(/[إأآا]/g, "ا")
      .replace(/ة/g, "ه")
      .replace(/ى/g, "ي")
      .replace(/[\u064B-\u065F]/g, "") // إزالة التشكيل
      .replace(/[^\w\s\u0621-\u064A]/g, " ")
      .trim();
  }

  // خوارزمية استخراج الرد الذكي
  function findAnswer(query) {
    const q = normalizeText(query);

    // 1. الترحيب والسلام
    if (/^(مرحبا|اهلا|سلام|السلام عليكم|صباح الخير|مساء الخير|هاي|ازيك|ازي حضرتك)/.test(q)) {
      return `وعليكم السلام ورحمة الله وبركاته. أهلاً بك في **مدرسة الشهيد تامر عبدالنبي مشعل الإعدادية المشتركة**. تفضل بطرح استفسارك وسأجيبك فوراً.`;
    }

    // 2. مديرة المدرسة والإدارة
    if (/(مدير|مديره|رباب|البشلاوي|الاداره|رئيس المدرسه)/.test(q)) {
      return `**إدارة المدرسة الموقرة:**
• **مديرة المدرسة:** الأستاذة / **رباب البشلاوي**، تقود المدرسة برؤية تربوية متميزة تسعى لتوفير بيئة تعليمية محفزة لجميع الطلاب.
• **وكيل المدرسة:** الأستاذة / **هبه بلبول**.
• **مواعيد مقابلة أولياء الأمور:** ترحب الإدارة بلقاء أولياء الأمور أسبوعياً يومي الإثنين والأربعاء (من 11:30 ص إلى 1:00 ظ) لبحث أي مقترحات أو استفسارات.`;
    }

    // 3. وكيل المدرسة
    if (/(وكيل|وكيله|هبه|بلبول)/.test(q)) {
      return `**وكيل المدرسة:** الأستاذة / **هبه بلبول**، مسؤولة عن الشؤون المدرسية وتنظيم اليوم الدراسي وجداول الحصص ومتابعة التزام وانضباط الطلاب.`;
    }

    // 4. الأخصائية النفسية والاجتماعية
    if (/(اخصائي|نفسي|خديجه|النويهي|سلوك|قلق|تعديل سلوك|استشاره نفسيه)/.test(q)) {
      return `**الأخصائية النفسية:**  
الأستاذة / **خديجة النويهي**.  
مكتب الإرشاد النفسي يقدم دعماً متواصلاً لطلاب المرحلة الإعدادية في:
1. التغلب على قلق الامتحانات والتوتر الدراسي.
2. تنمية الثقة بالنفس وتعديل السلوكيات السلبية.
3. رعاية الطلاب المتفوقين ودعم ذوي صعوبات التعلم.  
*جميع الاستشارات تتم بسرية تامة واحترافية عالية.*`;
    }

    if (/(اجتماعي|غاده|مجدي|بحث اجتماعي|اعفاء|غياب|مشاكل طلابيه)/.test(q)) {
      return `**الأخصائية الاجتماعية:**  
الأستاذة / **غادة مجدي**.  
يقدم مكتب الخدمة الاجتماعية بالمدرسة:
1. إعداد الأبحاث الاجتماعية للحالات المعفاة من المصروفات.
2. متابعة انتظام الطلاب وسجلات الغياب والتحفيز على الحضور.
3. حل الخلافات الطلابية ورعاية الأنشطة الاجتماعية والمبادرات الخيرية والرحلات.`;
    }

    // 5. المدرسون حسب المواد
    if (/(عربي|لغه عربيه|الشايب|عبدالمنعم|عليا|حنفي|مرسي|الزيات|نحو|نصوص)/.test(q)) {
      return `**مدرسو اللغة العربية بالمدرسة:**
• **الأستاذ / عبدالمنعم الشايب**
• **الأستاذة / عُليا حنفي**
• **الأستاذ / مرسي الزيات**
يقومون بتدريس فروع اللغة العربية (القراءة، النحو، النصوص، القصة، وفنون الخط العربي والإملاء).`;
    }

    if (/(انجليزي|انجلش|english|محمد زينه|ايهاب سلام)/.test(q)) {
      return `**مدرسو اللغة الإنجليزية:**
• **مستر / محمد زينة**
• **مستر / إيهاب سلام**
يقومان بتقديم مناهج اللغة الإنجليزية الحديثة وتنمية مهارات التحدث والاستماع والقواعد وكتابة المقال.`;
    }

    if (/(فرنساوي|فرنسي|فرنساوى|سمر|محجوب|حجازي|لغه ثانيه)/.test(q)) {
      return `**اللغة الثانية (اللغة الفرنسية):**
• **مدام / سمر محجوب حجازي**
تتولى تدريس اللغة الفرنسية لطلاب المرحلة الإعدادية بأسلوب مبسط وممتع يركز على المحادثة والمفردات وقواعد اللغة.`;
    }

    if (/(رياضيات|حساب|جبر|هندسه|رضا|الشامي|محمود|البدوي)/.test(q)) {
      return `**مدرسو مادة الرياضيات:**
• **الأستاذ / رضا الشامي**
• **الأستاذ / محمود البدوي**
يقومان بتدريس فرعي الجبر والإحصاء والهندسة وحساب المثلثات، وتدريب الطلاب على حل المسائل المعقدة والتفكير الرياضي المنطقي.`;
    }

    if (/(علوم|البكري|محمد البكري|سلوى|البربري|معمل|تجارب|احياء|كيمياء|فيزياء)/.test(q)) {
      return `**مدرسو مادة العلوم:**
• **الأستاذ / محمد البكري**
• **الأستاذة / سلوى البربري**
يشرفان على تدريس مادة العلوم والتطبيقات المعملية وتجارب الكيمياء والفيزياء والأحياء في معمل المدرسة المجهز.`;
    }

    if (/(دراسات|جغرافيا|تاريخ|حنان|حليم)/.test(q)) {
      return `**مُدرّسة الدراسات الاجتماعية:**
• **الأستاذة / حنان حليم**
تتولى تدريس فرعي الجغرافيا الطبيعية والبشرية والتاريخ المصري وحضارة مصر لغرس الوعي الوطني والتاريخي لدى الطلاب.`;
    }

    if (/(دين|تربيه دينيه|اسلاميه|اسراء|مصطفى)/.test(q)) {
      return `**مُدرّسة التربية الدينية:**
• **الأستاذة / إسراء مصطفى**
تقوم بتدريس التربية الدينية الإسلامية، تفسير القرآن الكريم، والحديث الشريف، مع غرس القيم الأخلاقية والتسامح.`;
    }

    if (/(حاسب|كمبيوتر|تكنولوجيا|جيهان|مشغل|ict)/.test(q)) {
      return `**مُدرّسة الحاسب الآلي وتكنولوجيا المعلومات:**
• **الأستاذة / جيهان مشغل**
مسؤولة عن تدريس مناهج الحاسب الآلي والبرمجة وحل المشكلات، بالإضافة إلى الإشراف على معمل التطوير ونادي التكنولوجيا بالمدرسة ومسابقات المبرمج الصغير.`;
    }

    if (/(رسم|تربيه فنيه|فاطمه|سعيد|لوحات|معرض)/.test(q)) {
      return `**مُدرّسة التربية الفنية (الرسم):**
• **الأستاذة / فاطمة سعيد**
تكتشف مواهب الطلاب الفنية وتشرف على رسم الجداريات، اللوحات الزيتية، والأشغال اليدوية والمعارض الفنية السنوية.`;
    }

    if (/(مسرح|تمثيل|القاء|بدر|محمد بدر)/.test(q)) {
      return `**مسؤول المسرح المدرسي والإلقاء:**
• **الأستاذ / محمد بدر**
يقود فريق المسرح المدرسي والإلقاء الشعري والخطابة بالمدرسة، ويدرب الطلاب على مهارات الوقوف على خشبة المسرح والإلقاء المتميز، وحصد مراكز أولى على مستوى الإدارة التعليمية!`;
    }

    if (/(العاب|رياضه|تربيه رياضيه|سالم|شيماء|كوره|دوري)/.test(q)) {
      return `**معلمو التربية الرياضية والألعاب:**
• **الأستاذ / سالم**
• **الأستاذة / شيماء**
يشرفان على طابور الصباح والتمارين الرياضية، وتنظيم دوري الفصول في كرة القدم وكرة السلة والجمباز ومسابقات اللياقة البدنية.`;
    }

    if (/(اقتصاد|منزلي|همت|طهي|خياطه|تطريز|تدبير)/.test(q)) {
      return `**مُدرّسة الاقتصاد المنزلي:**
• **الأستاذة / همت**
تتولى تدريب الطالبات على المهارات الحياتية: فنون الطهي الصحي، التفصيل والخياطة، الإسعافات الأولية، وتنسيق المنزل والميزانية الأسرية.`;
    }

    // 6. قائمة المدرسين كاملة
    if (/(مدرسين|المعلمين|المدرسين مين|فريق المدرسين|هيئة التدريس|اسماء المدرسين)/.test(q)) {
      let staffText = `**كوكبة المعلمين بمدرسة الشهيد تامر مشعل:**\n`;
      SCHOOL_KB.teachers.forEach(item => {
        staffText += `• **${item.subject}:** ${item.teachers.join(" و ")}\n`;
      });
      return staffText;
    }

    // 7. الشهيد تامر عبدالنبي مشعل
    if (/(شهيد|تامر|مشعل|مين تامر|سبب التسميه|تاريخ التسميه|صادق)/.test(q)) {
      return `**${SCHOOL_KB.martyr.name} - ${SCHOOL_KB.martyr.title}:**  
${SCHOOL_KB.martyr.tribute}  
تفخر مدرستنا بحمل اسم هذا البطل كرمز للشجاعة والشرف، ويحتفل الطلاب بإحياء ذكراه وترسيخ روح الفداء في نفوسهم.  
**الرقم التعريفي:** 1611496 | **الرقم الكودي:** 41035182`;
    }

    // 8. المواعيد والحضور والانصراف
    if (/(مواعيد|حضور|انصراف|الساعه كام|طابور|وقت المدرسه|تبدا امتى|تخلص امتى)/.test(q)) {
      return `**مواعيد اليوم الدراسي بالمدرسة:**  
• **طابور الصباح:** يبدأ في تمام **7:00 صباحاً** يومياً.  
• **نهاية اليوم الدراسي:** ينتهي في تمام **1:30 مساءً**.  
• **أيام الدراسة:** من الأحد إلى الخميس (الجمعة والسبت عطلة أسبوعية).  
*نرجو من جميع أبنائنا الطلاب الالتزام بالحضور قبل موعد الطابور بـ 10 دقائق لضمان الانضباط المدرسي.*`;
    }

    // 9. العنوان والمكان والخريطة
    if (/(عنوان|فين|مكان|موقع|محافظه|مركز|زفتى|الغريب|محطه المياه|ازاي اوصل)/.test(q)) {
      return `**عنوان المدرسة وموقعها:**  
• **الموقع:** قرية **الغريب** - مركز **زفتى** - محافظة **الغربية**.  
• **علامة مميزة:** تقع المدرسة **بجوار محطة المياه** مباشرة.  
• يمكنك الوصول بسهولة عبر المواصلات لقرية الغريب أو الاتصال برقم المدرسة: **12345678**.`;
    }

    // 10. رقم التليفون والواتساب والتواصل
    if (/(تليفون|تلفون|واتس|واتساب|رقم|اتصال|موبايل|تواصل|ايميل|12345678)/.test(q)) {
      return `**وسائل التواصل الرسمية مع المدرسة:**  
• **الهاتف المباشر:** \`12345678\`  
• **الواتساب:** يمكنك الضغط على زر الواتساب الأخضر العائم أسفل الشاشة للتواصل الفوري.  
• **البريد الإلكتروني:** \`info@tamer-meshaal-school.edu.eg\`  
• **ساعات الرد الهاتفي:** يومياً من 7:00 صباحاً حتى 1:30 مساءً خلال أيام العمل الرسمية.`;
    }

    // 11. الأنشطة المدرسية والكشافة
    if (/(انشطه|نشاط|مسابقات|رحلات|معارض|بطولات|كشافه|تشجير)/.test(q)) {
      return `**الأنشطة المدرسية في مدرسة الشهيد تامر مشعل:**  
1. **المسرح والإلقاء:** إشراف أ. محمد بدر (المركز الأول بالإدارة).  
2. **التربية الفنية والمعارض:** إشراف أ. فاطمة سعيد.  
3. **الدوري الرياضي واللياقة:** إشراف أ. سالم و أ. شيماء.  
4. **الاقتصاد المنزلي والأشغال:** إشراف أ. همت.  
5. **نادي البرمجة والـ AI:** إشراف أ. جيهان مشغل.  
6. **الكشافة المدرسية:** طابور الصباح وتحية العلم.  
7. **مبادرة التشجير والبيئة المدرسية.**`;
    }

    // 12. المراحل الدراسية
    if (/(مراحل|صفوف|اولي اعدادي|تانيه اعدادي|تالته اعدادي|شهاده اعداديه)/.test(q)) {
      return `**المراحل الدراسية المتاحة:**  
المدرسة مخصصة لطلاب المرحلة الإعدادية المشتركة:  
• **الصف الأول الإعدادي:** 4 فصول دراسية مجهزة.  
• **الصف الثاني الإعدادي:** 4 فصول دراسية.  
• **الصف الثالث الإعدادي (الشهادة الإعدادية):** 4 فصول مع فصول مراجعة مكثفة للتفوق والتأهيل للمرحلة الثانوية.`;
    }

    // 13. مختبر المبرمج الصغير والذكاء الاصطناعي
    if (/(برمجه|مبرمج|كود|ذكاء اصطناعي|مختبر|العاب|شات بوت|prompt)/.test(q)) {
      return `**مختبر المبرمج الصغير (Little Coder Lab):**  
هو قسمنا التفاعلي لطلاب المرحلة الإعدادية لتعلم بناء المواقع باستخدام أدوات الذكاء الاصطناعي!  
يحتوي على:  
1. **مسار تعليمي من 5 مستويات** بشهادة إتمام مطبوعة.  
2. **Prompt Playground** لتجربة أوامر المواقع وتوليد معاينة فورية.  
3. **ألعاب برمجية شيقة:** رتّب الكود، إيه الخطأ؟، واكتب برومبت أحسن.  
4. **نظام نقاط وشارات وتحديات أسبوعية** يُحفظ تقدمك فيها تلقائياً!  
اضغط على رابط "مختبر المبرمج الصغير" في القائمة لتجربته الآن! `;
    }

    // 14. الاستعلام عن النتيجة والامتحانات
    if (/(نتيجه|شهاده|درجات|رقم جلوس|استعلام|امتحانات|جدول)/.test(q)) {
      return `**جداول الامتحانات والاستعلام:**  
• يمكنك الاطلاع على جدول الامتحانات الرسمي وتحميله من قسم "الأخبار والفعاليات" في الصفحة.  
• للاستعلام التجريبي برقم الجلوس، انتقل لقسم "خدمات الطلاب" في الصفحة واستخدم رقم جلوسك للحصول على تفاصيل الدرجات والتقدير العام فور صدورها!`;
    }

    // الرد الافتراضي الذكي عند عدم مطابقة كلمة مفتاحية معينة
    return `أهلاً بك! شكراً لسؤالك. أنا **مساعد المدرسة** محمل بكامل بيانات **مدرسة الشهيد تامر عبدالنبي مشعل الإعدادية المشتركة**.  
لم أستطع فهم سؤالك بدقة، ولكن يمكنك الضغط على أحد الأسئلة السريعة أدناه أو السؤال عن:
• **الإدارة:** أ. رباب البشلاوي (المديرة) أو أ. هبه بلبول (الوكيل).
• **الأخصائيين:** أ. خديجة النويهي (نفسية) أو أ. غادة مجدي (اجتماعية).
• **المدرسين:** مدرسي العربي، الإنجليزي، الفرنسي، العلوم، الرياضيات، أو الحاسب الآلي.
• **المواعيد والعنوان:** من 7:00 ص إلى 1:30 م في الغريب مركز زفتى بجوار محطة المياه.`;
  }

  // واجهة مستخدم الشات بوت (مساعد المدرسة) مع ميزة Streaming
  class SchoolChatbot {
    constructor() {
      this.isOpen = false;
      this.messages = [];
      this.soundEnabled = true;
      this.audioCtx = null;
      this.isStreaming = false;
      this.streamTimer = null;
      this.currentStopBtn = null;
      this.initElements();
      this.bindEvents();
    }

    initElements() {
      this.launcherBtn = document.getElementById('chatLauncherBtn');
      this.chatModal = document.getElementById('chatModal');
      this.chatCloseBtn = document.getElementById('chatCloseBtn');
      this.chatClearBtn = document.getElementById('chatClearBtn');
      this.chatBody = document.getElementById('chatBody');
      this.chatForm = document.getElementById('chatForm');
      this.chatInput = document.getElementById('chatInput');
      this.sendBtn = this.chatForm ? this.chatForm.querySelector('.chat-send-btn') : null;
      this.typingIndicator = document.getElementById('typingIndicator');
      this.suggestedChips = document.querySelectorAll('.chat-chip');
      this.openChatCta = document.querySelectorAll('.open-chat-trigger');
    }

    bindEvents() {
      if (this.launcherBtn) {
        this.launcherBtn.addEventListener('click', () => this.toggleChat());
      }
      if (this.chatCloseBtn) {
        this.chatCloseBtn.addEventListener('click', () => this.closeChat());
      }
      if (this.chatClearBtn) {
        this.chatClearBtn.addEventListener('click', () => this.clearChat());
      }

      this.openChatCta.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.openChat();
        });
      });

      if (this.chatForm) {
        this.chatForm.addEventListener('submit', (e) => {
          e.preventDefault();
          this.handleSendMessage();
        });
      }

      if (this.suggestedChips) {
        this.suggestedChips.forEach(chip => {
          chip.addEventListener('click', () => {
            const query = chip.getAttribute('data-query') || chip.textContent.trim();
            this.sendUserMessage(query);
          });
        });
      }

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.closeChat();
        }
      });
    }

    playChime(type = 'msg') {
      try {
        if (!this.audioCtx) {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          if (AudioContext) this.audioCtx = new AudioContext();
        }
        if (!this.audioCtx) return;
        if (this.audioCtx.state === 'suspended') {
          this.audioCtx.resume();
        }
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        const now = this.audioCtx.currentTime;
        if (type === 'msg') {
          osc.frequency.setValueAtTime(587.33, now); // D5
          osc.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5
          gain.gain.setValueAtTime(0.06, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
          osc.start(now);
          osc.stop(now + 0.15);
        }
      } catch (e) {
        // تجاهل أي منع للمتصفح لتشغيل الصوت التلقائي
      }
    }

    openChat() {
      this.isOpen = true;
      if (this.chatModal) {
        this.chatModal.classList.add('active');
        this.chatModal.setAttribute('aria-hidden', 'false');
      }
      if (this.launcherBtn) {
        this.launcherBtn.classList.add('chat-active');
      }
      if (this.chatInput) {
        setTimeout(() => this.chatInput.focus(), 200);
      }
      this.scrollToBottom();
    }

    closeChat() {
      this.isOpen = false;
      if (this.chatModal) {
        this.chatModal.classList.remove('active');
        this.chatModal.setAttribute('aria-hidden', 'true');
      }
      if (this.launcherBtn) {
        this.launcherBtn.classList.remove('chat-active');
      }
    }

    toggleChat() {
      if (this.isOpen) {
        this.closeChat();
      } else {
        this.openChat();
      }
    }

    clearChat() {
      if (this.isStreaming) {
        this.stopCurrentStream();
      }
      const messages = this.chatBody.querySelectorAll('.chat-msg:not(.welcome-msg)');
      messages.forEach(m => m.remove());
      if (window.showToast) {
        window.showToast('تم إفراغ سجل المحادثة');
      }
    }

    handleSendMessage() {
      if (this.isStreaming) {
        this.stopCurrentStream();
        return;
      }
      const query = this.chatInput.value.trim();
      if (!query) return;
      this.chatInput.value = '';
      this.sendUserMessage(query);
    }

    sendUserMessage(query) {
      if (this.isStreaming) {
        this.stopCurrentStream();
      }
      this.openChat();
      this.addUserMessage(query);

      // إظهار مؤشر التفكير اللحظي
      this.showTyping(true);

      const delay = Math.min(600, Math.max(300, query.length * 15));
      setTimeout(() => {
        this.showTyping(false);
        const answer = findAnswer(query);
        this.startStreamingResponse(answer);
      }, delay);
    }

    addUserMessage(text) {
      const msgDiv = document.createElement('div');
      msgDiv.className = 'chat-msg chat-msg-user';

      const avatar = document.createElement('div');
      avatar.className = 'msg-avatar';
      avatar.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>';

      const bubble = document.createElement('div');
      bubble.className = 'msg-bubble';
      bubble.textContent = text;

      msgDiv.appendChild(bubble);
      msgDiv.appendChild(avatar);

      this.chatBody.appendChild(msgDiv);
      this.scrollToBottom();
    }

    // نظام الكتابة اللحظية المتدفقة (Streaming Response)
    startStreamingResponse(fullText) {
      this.isStreaming = true;
      this.playChime('msg');

      if (this.sendBtn) {
        this.sendBtn.innerHTML = 'إيقاف';
        this.sendBtn.title = 'إيقاف الكتابة';
        this.sendBtn.setAttribute('aria-label', 'إيقاف الكتابة');
      }

      const msgDiv = document.createElement('div');
      msgDiv.className = 'chat-msg chat-msg-bot streaming-active';

      const avatar = document.createElement('div');
      avatar.className = 'msg-avatar';
      avatar.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';

      const bubble = document.createElement('div');
      bubble.className = 'msg-bubble';

      const textSpan = document.createElement('div');
      textSpan.className = 'bubble-text-content';

      const cursor = document.createElement('span');
      cursor.className = 'typing-cursor';
      cursor.textContent = '▌';

      const actionsBar = document.createElement('div');
      actionsBar.className = 'chat-msg-actions';

      const stopBtn = document.createElement('button');
      stopBtn.className = 'chat-stop-btn';
      stopBtn.type = 'button';
      stopBtn.innerHTML = '<span>إيقاف الرد</span>';
      this.currentStopBtn = stopBtn;

      actionsBar.appendChild(stopBtn);
      bubble.appendChild(textSpan);
      bubble.appendChild(cursor);
      bubble.appendChild(actionsBar);

      msgDiv.appendChild(avatar);
      msgDiv.appendChild(bubble);

      this.chatBody.appendChild(msgDiv);
      this.scrollToBottom();

      // تقسيم النص إلى كلمات ومقاطع لضمان تدفق سلس وسريع مناسب للعربية
      const tokens = fullText.match(/\S+|\s+/g) || [fullText];
      let currentTokenIdx = 0;
      let accumulatedText = "";

      const streamSpeed = 16; // سرعة الكتابة بالمللي ثانية لكل كلمة

      const onStopOrFinish = () => {
        if (this.streamTimer) {
          clearInterval(this.streamTimer);
          this.streamTimer = null;
        }
        this.isStreaming = false;
        msgDiv.classList.remove('streaming-active');
        if (cursor.parentNode) cursor.remove();
        if (stopBtn.parentNode) stopBtn.remove();

        if (this.sendBtn) {
          this.sendBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
          this.sendBtn.title = 'إرسال السؤال';
          this.sendBtn.setAttribute('aria-label', 'إرسال السؤال');
        }

        // إضافة زر نسخ الرد بعد اكتمال أو إيقاف التوليد
        const copyBtn = document.createElement('button');
        copyBtn.className = 'chat-copy-btn';
        copyBtn.type = 'button';
        copyBtn.innerHTML = '<span>نسخ الرد</span>';
        copyBtn.title = 'نسخ نص الإجابة إلى الحافظة';

        copyBtn.addEventListener('click', () => {
          const cleanText = textSpan.innerText || textSpan.textContent;
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(cleanText).then(() => {
              copyBtn.innerHTML = '<span>تم النسخ</span>';
              copyBtn.classList.add('copied');
              if (window.showToast) window.showToast('تم نسخ إجابة مساعد المدرسة بنجاح', 'success');
              setTimeout(() => {
                copyBtn.innerHTML = '<span>نسخ الرد</span>';
                copyBtn.classList.remove('copied');
              }, 2200);
            }).catch(() => {
              this.fallbackCopy(cleanText, copyBtn);
            });
          } else {
            this.fallbackCopy(cleanText, copyBtn);
          }
        });

        actionsBar.appendChild(copyBtn);
        this.scrollToBottom();
      };

      stopBtn.addEventListener('click', () => {
        onStopOrFinish();
        if (window.showToast) window.showToast('تم إيقاف توليد الرد', 'info');
      });

      this.stopCurrentStream = () => {
        onStopOrFinish();
      };

      this.streamTimer = setInterval(() => {
        if (currentTokenIdx < tokens.length) {
          accumulatedText += tokens[currentTokenIdx];
          textSpan.innerHTML = this.formatMarkdown(accumulatedText);
          currentTokenIdx++;
          this.scrollToBottom();
        } else {
          onStopOrFinish();
        }
      }, streamSpeed);
    }

    fallbackCopy(text, btn) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        btn.innerHTML = '<span>تم النسخ</span>';
        if (window.showToast) window.showToast('تم نسخ إجابة مساعد المدرسة بنجاح', 'success');
        setTimeout(() => {
          btn.innerHTML = '<span>نسخ الرد</span>';
        }, 2200);
      } catch (err) {
        if (window.showToast) window.showToast('تعذر النسخ التلقائي', 'error');
      }
      document.body.removeChild(textarea);
    }

    formatMarkdown(text) {
      let formatted = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/`(.*?)`/g, '<code class="chat-code">$1</code>')
        .replace(/\n• /g, '<br>• ')
        .replace(/\n\d+\. /g, (match) => `<br>${match.trim()} `)
        .replace(/\n/g, '<br>');
      return formatted;
    }

    showTyping(show) {
      if (this.typingIndicator) {
        if (show) {
          this.typingIndicator.classList.add('visible');
          this.chatBody.appendChild(this.typingIndicator);
          this.scrollToBottom();
        } else {
          this.typingIndicator.classList.remove('visible');
        }
      }
    }

    scrollToBottom() {
      if (this.chatBody) {
        this.chatBody.scrollTop = this.chatBody.scrollHeight;
      }
    }
  }

  // تفعيل الشات بوت عند اكتمال تحميل الصفحة
  document.addEventListener('DOMContentLoaded', () => {
    window.schoolChatbot = new SchoolChatbot();

    // فحص رابط الصفحة لفتح الشات تلقائياً للاختبار والمعاينة
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('chat') === 'open') {
      setTimeout(() => {
        if (window.schoolChatbot) {
          window.schoolChatbot.sendUserMessage('من هي مديرة المدرسة والوكيل؟');
        }
      }, 300);
    } else if (urlParams.get('chat') === 'modal') {
      setTimeout(() => {
        if (window.schoolChatbot) {
          window.schoolChatbot.openChat();
        }
      }, 300);
    }
  });
})();
