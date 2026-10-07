const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json; charset=UTF-8",
    },
  });
}

async function readJsonSafe(request) {
  try {
    const data = await request.json();
    return data && typeof data === "object" ? data : {};
  } catch {
    return {};
  }
}

function generateCode() {
  // مولد تشفيري آمن — Math.random() قابل للتنبؤ ولا يصلح لرموز تحقق
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return String(buf[0] % 1000000).padStart(6, "0");
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function sendEmail(env, email, code, purpose) {
  const apiKey = env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error(
      "خدمة البريد غير مُعدة (RESEND_API_KEY مفقودة)"
    );
  }

  const fromEmail =
    env.OTP_FROM_EMAIL || "onboarding@resend.dev";

  const purposeLabel =
    purpose === "register"
      ? "تسجيل حساب جديد"
      : purpose === "login"
        ? "تسجيل الدخول"
        : "التحقق";

  const html = `
    <div dir="rtl" style="font-family:Arial,Tahoma,sans-serif;max-width:480px;margin:auto;padding:24px;background:#0b1017;color:#c7dbfe;border:1px solid rgb(59, 130, 246,.3);border-radius:12px">
      <h2 style="color:#3b82f6;text-align:center;margin-top:0">
        أناقة ROOZ 
      </h2>

      <p style="text-align:center">
        مرحباً، كود التحقق الخاص بك لـ (${purposeLabel}) هو:
      </p>

      <div style="text-align:center;margin:24px 0">
        <span style="display:inline-block;font-size:36px;font-weight:bold;letter-spacing:8px;color:#fff;background:#101a2b;padding:16px 24px;border-radius:10px;border:1px solid #3b82f6">
          ${code}
        </span>
      </div>

      <p style="text-align:center;color:#aaa">
        الكود صالح لمدة 5 دقائق فقط. لا تشاركه مع أحد.
      </p>

      <p style="text-align:center;font-size:12px;color:#777">
        إن لم تطلب هذا الكود، تجاهل هذه الرسالة.
      </p>
    </div>
  `;

  const response = await fetch(
    "https://api.resend.com/emails",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `أناقة ROOZ <${fromEmail}>`,
        to: [email],
        subject: "كود التحقق لموقع أناقة ROOZ",
        html,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");

    throw new Error(
      `فشل إرسال البريد (${response.status}): ${errorText}`
    );
  }

  return response.json().catch(() => ({}));
}

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  if (request.method !== "POST") {
    return json(
      {
        success: false,
        error: "Method not allowed",
      },
      405
    );
  }

  if (!env || !env.DB) {
    return json(
      {
        success: false,
        error: "قاعدة البيانات غير متاحة",
      },
      500
    );
  }

  const body = await readJsonSafe(request);

  const cleanEmail = String(body.email || "")
    .trim()
    .toLowerCase();

  const cleanPurpose =
    String(body.purpose || "login").trim() || "login";

  if (!cleanEmail || !isValidEmail(cleanEmail)) {
    return json(
      {
        success: false,
        error: "بريد إلكتروني غير صالح",
      },
      400
    );
  }

  try {
    const now = Math.floor(Date.now() / 1000);

    // حد إرسال: رمز واحد كل 60 ثانية لنفس البريد والغرض — يمنع إغراق البريد
    // وإساءة استخدام خدمة Resend (الرمز الحديث يبقى صالحاً 5 دقائق أصلاً)
    const recent = await env.DB.prepare(
      `SELECT created_at FROM otps
       WHERE email = ?1 AND purpose = ?2 AND used = 0
       ORDER BY id DESC LIMIT 1`
    ).bind(cleanEmail, cleanPurpose).first().catch(() => null);

    const nowMs = Date.now();
    if (recent && recent.created_at) {
      const createdMs = Date.parse(
        String(recent.created_at).replace(" ", "T") + "Z"
      );
      if (Number.isFinite(createdMs) && nowMs - createdMs < 60_000) {
        return json(
          {
            success: false,
            error: "تم إرسال كود مؤخراً، انتظر دقيقة ثم حاول مجدداً",
          },
          429
        );
      }
    }

    const code = generateCode();

    const expiresAt = now + 300;

    await env.DB.prepare(
      `UPDATE otps
       SET used = 1
       WHERE email = ?1
         AND purpose = ?2
         AND used = 0`
    )
      .bind(cleanEmail, cleanPurpose)
      .run();

    await env.DB.prepare(
      `INSERT INTO otps
        (email, code, purpose, expires_at, used)
       VALUES
        (?1, ?2, ?3, ?4, 0)`
    )
      .bind(
        cleanEmail,
        code,
        cleanPurpose,
        expiresAt
      )
      .run();

    try {
      await sendEmail(
        env,
        cleanEmail,
        code,
        cleanPurpose
      );
    } catch (emailError) {
      await env.DB.prepare(
        `DELETE FROM otps
         WHERE email = ?1
           AND code = ?2`
      )
        .bind(cleanEmail, code)
        .run()
        .catch(() => {});

      throw emailError;
    }

    return json({
      success: true,
      message:
        "تم إرسال كود التحقق إلى بريدك الإلكتروني",
      expiresIn: 300,
    });
  } catch (error) {
    console.error("otp/send error:", error);

    return json(
      {
        success: false,
        error:
          error?.message ||
          "تعذر إرسال كود التحقق",
      },
      500
    );
  }
}