import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

function FAQ() {
  const faqs = [
    { q: "ما هو موقع أناقة ROOZ؟", a: "أناقة ROOZ منصة مختصة بالأناقة والموضة والمحتوى الفخم." },
    { q: "هل المنتجات أصلية؟", a: "نعم، يتم التحقق من جودة كل منتج قبل عرضه لضمان الموثوقية." },
    { q: "كيف أتواصل مع الإدارة؟", a: "عبر صفحة تواصل معنا أو نموذج المراسلة داخل القائمة." },
    { q: "هل يقدم الموقع خدمات خاصة؟", a: "نعم، يمكنك طلب خدمات خاصة عبر مراسلة الإدارة." },
    { q: "هل يوجد شحن لجميع مناطق المملكة؟", a: "نعم، يتم توفير الشحن لجميع المناطق داخل السعودية." },
    { q: "كيف أنشئ حساب؟", a: "عبر صفحة حسابي داخل القائمة الرئيسية." },
    { q: "هل يمكنني تتبع طلباتي؟", a: "نعم، يمكنك متابعة حالة الطلبات من خلال صفحة حسابك." },
    { q: "هل يقدم الموقع عروض؟", a: "نعم، يتم طرح عروض موسمية وخصومات خاصة بشكل مستمر." },
    { q: "هل يمكنني إرجاع المنتج؟", a: "نعم، يوجد سياسة إرجاع واضحة يمكنك الاطلاع عليها داخل صفحة الشروط." },
    { q: "هل يوجد قسم للفساتين الفخمة؟", a: "نعم، يوجد قسم كامل للفساتين الفاخرة داخل المتجر." },
    { q: "هل يمكنني المشاركة في المسابقة الكبرى؟", a: "نعم، يمكنك المشاركة عبر صفحة المسابقة الكبرى." },
    { q: "هل الموقع آمن؟", a: "نعم، يتم استخدام أنظمة حماية متقدمة لضمان خصوصية المستخدمين." },
    { q: "كيف أعرف جديد ROOZ؟", a: "عبر صفحة الإشعارات أو زيارة قسم رحلة التسوق في ROOZ." },
    { q: "هل يوجد تطبيق؟", a: "لا يوجد تطبيق حاليًا، لكن يتم العمل على تطويره قريبًا." },
    { q: "هل يوجد مساعد ذكي؟", a: "نعم، يوجد مساعد ذكي يجيب على جميع الأسئلة ويساعدك في التصفح." },
    { q: "هل يمكنني التواصل مع صاحب الموقع؟", a: "نعم، يوجد خيار مراسلة صاحب الموقع داخل القائمة." },
    { q: "هل يمكنني إلغاء طلبي؟", a: "نعم، يمكنك إلغاء الطلب قبل مرحلة التجهيز." },
    { q: "هل الأسعار ثابتة؟", a: "نعم، الأسعار ثابتة ويتم تحديثها بشكل دوري." },
    { q: "هل يوجد دعم فني؟", a: "نعم، يوجد دعم فني متاح عبر صفحة تواصل معنا." },
    { q: "هل يمكنني اقتراح ميزة جديدة؟", a: "نعم، يمكنك إرسال اقتراحاتك عبر نموذج التواصل." },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <div className="faq-page">
      <style>{`
        .faq-page {
          width: min(100%, 1000px);
          margin: 0 auto;
          padding: 24px 18px 50px;
          direction: rtl;
          box-sizing: border-box;
        }

        .faq-header {
          position: relative;
          overflow: hidden;
          margin-bottom: 22px;
          padding: 24px 22px;
          border: 1px solid rgb(115, 75, 214, 0.35);
          border-radius: 20px;
          background:
            radial-gradient(circle at 15% 20%, rgb(115, 75, 214, 0.18), transparent 34%),
            linear-gradient(135deg, #0e0a2b, #0b0822);
          box-shadow: 0 12px 30px rgb(14, 10, 43, 0.16);
        }

        .faq-header-content {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .faq-header-icon {
          width: 48px;
          height: 48px;
          flex: 0 0 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          color: #2563eb;
          background: rgb(127, 83, 226, 0.12);
          border: 1px solid rgb(127, 83, 226, 0.3);
        }

        .faq-title {
          margin: 0;
          color: #cbbaf9;
          font-size: clamp(1.35rem, 3vw, 1.9rem);
          font-weight: 800;
        }

        .faq-subtitle {
          margin: 5px 0 0;
          color: rgb(247, 248, 250, 0.72);
          font-size: 0.92rem;
        }

        .faq-list {
          display: grid;
          gap: 11px;
        }

        .faq-item {
          overflow: hidden;
          border: 1px solid rgb(115, 75, 214, 0.22);
          border-radius: 16px;
          background: rgb(255, 255, 255, 0.94);
          box-shadow: 0 5px 18px rgb(14, 10, 43, 0.07);
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
        }

        .faq-item.open {
          border-color: rgb(115, 75, 214, 0.55);
          box-shadow: 0 8px 24px rgb(14, 10, 43, 0.1);
        }

        .faq-question {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding: 17px 18px;
          border: none;
          background: transparent;
          color: #0e0a2b;
          cursor: pointer;
          text-align: right;
          font-family: inherit;
          font-size: 1rem;
          font-weight: 750;
        }

        .faq-question:hover {
          background: rgb(115, 75, 214, 0.045);
        }

        .faq-question-text {
          flex: 1;
        }

        .faq-chevron {
          width: 32px;
          height: 32px;
          flex: 0 0 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          color: #1e40af;
          background: rgb(115, 75, 214, 0.11);
          transition: transform 0.25s ease, background 0.25s ease;
        }

        .faq-item.open .faq-chevron {
          transform: rotate(180deg);
          background: rgb(115, 75, 214, 0.18);
        }

        .faq-answer {
          padding: 0 18px 18px;
          border-top: 1px solid rgb(115, 75, 214, 0.14);
        }

        .faq-answer p {
          margin: 14px 0 0;
          color: #34427a;
          line-height: 1.9;
          font-size: 0.94rem;
        }

        @media (max-width: 600px) {
          .faq-page {
            padding: 14px 12px 35px;
          }

          .faq-header {
            padding: 19px 16px;
            border-radius: 17px;
          }

          .faq-header-icon {
            width: 42px;
            height: 42px;
            flex-basis: 42px;
          }

          .faq-question {
            padding: 15px;
            font-size: 0.94rem;
          }

          .faq-answer {
            padding: 0 15px 15px;
          }

          .faq-answer p {
            font-size: 0.9rem;
          }
        }
      `}</style>

      <div className="faq-header">
        <div className="faq-header-content">
          <div className="faq-header-icon">
            <HelpCircle size={25} />
          </div>

          <div>
            <h1 className="faq-title">الأسئلة الشائعة</h1>
            <p className="faq-subtitle">كل ما تحتاج معرفته عن أناقة ROOZ</p>
          </div>
        </div>
      </div>

      <div className="faq-list">
        {faqs.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <div key={index} className={`faq-item ${isOpen ? 'open' : ''}`}>
              <button
                type="button"
                className="faq-question"
                onClick={() => toggleFAQ(index)}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="faq-question-text">{item.q}</span>

                <span className="faq-chevron">
                  <ChevronDown size={18} />
                </span>
              </button>

              {isOpen && (
                <div id={`faq-answer-${index}`} className="faq-answer">
                  <p>{item.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FAQ;