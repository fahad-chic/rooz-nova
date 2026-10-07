const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};
export async function onRequest({ request, env }) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      {
        status: 405,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
  try {
    const { message = '' } = await request.json();
    // حد أقصى لطول الرسالة
    if (typeof message !== 'string' || message.length > 2000) {
      return new Response(
        JSON.stringify({
          reply: '',
          error: 'الرسالة طويلة جداً',
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }
    const lower = message.toLowerCase();
    // تحديد الجنس عند الحاجة لتحسين أسلوب الرد
    let gender = 'unknown';
    if (
      lower.includes('زوجي') ||
      lower.includes('خطيبي') ||
      lower.includes('أنا بنت')
    ) {
      gender = 'female';
    }
    if (
      lower.includes('زوجتي') ||
      lower.includes('خطيبتي') ||
      lower.includes('أنا رجل')
    ) {
      gender = 'male';
    }
    // تحديد النبرة
    let tone = 'neutral';
    if (
      lower.includes('تكفين') ||
      lower.includes('بليز') ||
      lower.includes('لو سمحتي')
    ) {
      tone = 'soft';
    }
    if (
      lower.includes('ضروري') ||
      lower.includes('الحين') ||
      lower.includes('مهم')
    ) {
      tone = 'urgent';
    }
    if (
      lower.includes('أبي') ||
      lower.includes('ابغى')
    ) {
      tone = 'normal';
    }
    // تحديد نوع السؤال
    let intent = 'general';
    if (
      lower.includes('تسجيل دخول') ||
      lower.includes('ادخل') ||
      lower.includes('login')
    ) {
      intent = 'login';
    }
    if (
      lower.includes('تسجيل جديد') ||
      lower.includes('sign up') ||
      lower.includes('حساب جديد')
    ) {
      intent = 'register';
    }
    if (
      lower.includes('نسيت كلمة المرور') ||
      lower.includes('استرجاع') ||
      lower.includes('reset')
    ) {
      intent = 'reset_password';
    }
    if (
      lower.includes('فستان') ||
      lower.includes('فساتين') ||
      lower.includes('لبس')
    ) {
      intent = 'dress';
    }
    if (
      lower.includes('هديه') ||
      lower.includes('هدايا') ||
      lower.includes('أهدي')
    ) {
      intent = 'gift';
    }
    if (
      lower.includes('موقعكم') ||
      lower.includes('وينكم') ||
      lower.includes('المتجر')
    ) {
      intent = 'store_info';
    }
    if (
      lower.includes('رقم الحساب') ||
      lower.includes('حساب بنكي') ||
      lower.includes('التحويل')
    ) {
      intent = 'bank';
    }
    if (
      lower.includes('واتساب') ||
      lower.includes('تواصل') ||
      lower.includes('رقمكم')
    ) {
      intent = 'contact';
    }
    /*
     * مهم:
     * رسالة الترحيب يتم عرضها من AIChatWidget.jsx فقط عند بدء المحادثة.
     * الـ API لا يقوم بإنشاء رسالة ترحيب.
     */
    const systemPrompt = `
أنت "علياء" — المساعدة الذكية لموقع أناقة ROOZ.
شخصيتك:
- أنيقة
- ودودة
- راقية
- سعودية اللهجة المهذبة
- مفيدة ومباشرة
مهم جداً جداً بخصوص الترحيب:
رسالة الترحيب التالية يتم عرضها تلقائياً من واجهة الموقع عند فتح المحادثة:
"أهلاً وسهلاً فيك نورت موقع أناقة ROOZ 💐
معك علياء تفضل كيف أقدر أساعدك؟"
هذه الرسالة ليست من مسؤوليتك.
ممنوع عليك إعادة هذه الرسالة أو أي تحية في بداية ردودك.
لا تبدأ ردك بأي من:
- أهلاً
- أهلاً وسهلاً
- مرحباً
- مرحبا
- هلا
- حياك
- وسهلاً
- نورت
- أي تحية مشابهة
حتى لو كان هذا أول سؤال يرسله المستخدم، لا تكتب أي تحية.
ابدأ مباشرة بالإجابة عن سؤال المستخدم.
مثال:
المستخدم:
"كيف أسجل؟"
الرد الصحيح:
"لإنشاء حساب جديد، اختر إنشاء حساب جديد ثم أكمل بيانات التسجيل المطلوبة."
الرد الخاطئ:
"أهلاً وسهلاً فيك... كيف أقدر أساعدك؟ لإنشاء حساب جديد..."
يجب أن تكون كل إجابة مباشرة على السؤال.
## معلومات الموقع الرسمية:
- أرقام التواصل (واتساب واتصال):
00966536667222
00966507882771
- البريد:
kal6667222@gmail.com
- سناب شات:
pmp.u
رابط مباشر:
https://snapchat.com/t/HPkkIfUp
- الحسابات البنكية للتحويل:
مصرف الراجحي:
آيبان: SA0980000509608010069017
تحويل محلي: 09608010069017
البنك العربي:
آيبان: SA9830400108088851870011
تحويل محلي: 0108088851870011
- الموقع:
متجر أزياء نسائية سعودي
(فساتين، عبايات، إكسسوارات)
- يوجد أيضاً قسم "حراج" للإعلانات المستعملة.
- العروض:
شحن مجاني للطلبات فوق 200 ريال.
ويوجد قسم للعروض في الصفحة الرئيسية.
## قدراتك:
1. كل ما يخص الموقع:
المنتجات، الطلبات، الشحن، الدفع، الإرجاع، المقاسات، حراج، التسجيل والدخول.
2. الأسئلة العامة خارج الموقع:
- أفكار الهدايا
- تنسيق الإطلالات
- نصائح الموضة والأناقة
- العناية بالملابس
- اقتراحات المناسبات
- وأي سؤال عام آخر
أجب دائماً بذوق راقٍ وفائدة حقيقية.
3. عند سؤال المستخدم عن:
"هدية لزوجي"
أو
"هدية لزوجتي"
إذا لم يذكر المناسبة والميزانية، اسأله عنهما.
ثم اقترح أفكاراً مناسبة ومرتبة.
## ممنوع منعاً باتاً:
لا تكشف أسرار المنصة أو معلومات الإدارة الداخلية.
ممنوع تقديم:
- الصلاحيات والأدوار (مالك/موظف/مشرف)
- كيفية ضبط الصلاحيات
- الأكواد والرموز السرية
- طرق الدخول الخفية
- غرف المالك
- بيانات Firebase
- قاعدة البيانات
- API Keys
- أسماء الملفات الداخلية
- البنية التقنية الداخلية
- الإيميلات الإدارية
- آلية OTP الداخلية
عند السؤال عن هذه الأمور قل فقط:
"هذي معلومات خاصة بإدارة الموقع، أقدر أساعدك بأي شيء ثاني 🌸"
## أسلوب الرد:
- ادخل في الإجابة مباشرة.
- لا تستخدم تحية في بداية الرد.
- إجابات موجزة ومرتبة، عادةً من 2 إلى 6 أسطر.
- استخدم رموزاً تعبيرية خفيفة عند الحاجة.
- لا تخترع منتجات أو أسعاراً غير موجودة.
- إذا لم تكن المعلومة مؤكدة، لا تخمن.
- عند عدم معرفة معلومة مؤكدة، وجّه المستخدم للتواصل معنا مباشرة.
`.trim();
    const userPrompt = `المستخدم قال: "${message}"
الجنس: ${gender}، النبرة: ${tone}، النوع: ${intent}
مهم:
أجب مباشرة عن سؤال المستخدم.
لا تبدأ بتحية.
لا تكرر رسالة الترحيب.
لا تقل "أهلاً" أو "مرحباً" أو "هلا" أو أي تحية مشابهة.
رد بأسلوب راقي كـ "علياء" من أناقة ROOZ.`;
    const body = {
      model: 'openai/gpt-oss-120b',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    };
    if (!env.GROQ_API_KEY) {
      console.error('ai: GROQ_API_KEY is not configured');
      return new Response(
        JSON.stringify({
          reply: '',
          error: 'GROQ_API_KEY missing',
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }
    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${env.GROQ_API_KEY}`,
        },
        body: JSON.stringify(body),
      }
    );
    let reply = '';
    if (response.ok) {
      try {
        const data = await response.json();
        reply = (
          data?.choices?.[0]?.message?.content || ''
        ).trim();
        /*
         * حماية إضافية:
         * إذا أعاد النموذج التحية بالخطأ، نحذفها قبل إرسال
         * الرد إلى الواجهة.
         *
         * هذا يضمن أن رسالة الترحيب لا تتكرر حتى لو
         * تجاهل النموذج التعليمات الموجودة في systemPrompt.
         */
        reply = reply
          .replace(
            /^أهلاً وسهلاً فيك نورت موقع أناقة ROOZ 💐\s*/i,
            ''
          )
          .replace(
            /^أهلاً وسهلاً فيك نورت موقع أناقة ROOZ\s*/i,
            ''
          )
          .replace(/^أهلاً وسهلاً\s*/i, '')
          .replace(/^أهلاً\s*/i, '')
          .replace(/^مرحباً\s*/i, '')
          .replace(/^مرحبا\s*/i, '')
          .replace(/^هلا\s*/i, '')
          .replace(/^حياك\s*/i, '')
          .replace(/^وسهلاً\s*/i, '')
          .replace(/^نورت\s*/i, '')
          .trim();
      } catch (parseError) {
        console.error('ai: failed to parse Groq response:', parseError);
        reply = '';
      }
    } else {
      // سجّل سبب فشل Groq في سجلات Cloudflare Pages
      // بدلاً من ابتلاع الخطأ بصمت.
      const errText = await response
        .text()
        .catch(() => '');
      console.error(
        `ai: groq request failed (${response.status}): ${errText.slice(
          0,
          300
        )}`
      );
    }
    return new Response(
      JSON.stringify({ reply }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (err) {
    console.error('ai: unexpected error:', err);
    return new Response(
      JSON.stringify({
        reply: '',
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
}