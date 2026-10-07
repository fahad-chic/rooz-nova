// functions/api/owner-pin.js — حارس غرفة صاحب الموقع (Security Gatekeeper)
// طبقة حماية ثانية قبل فتح الغرفة: رمز PIN سري يُطلب حتى لو كان الحساب
// مسجلاً دخوله. الرمز يُخزَّن في D1 مشفّراً (PBKDF2-SHA256 + ملح عشوائي)
// ولا يُحفظ نصياً أبداً. التحقق من الهوية يتم عبر Firebase ID Token
// (accounts:lookup) + التأكد أن البريد ضمن إيميلات المالك المعتمدة.
// حماية التخمين: 5 محاولات فاشلة = قفل 15 دقيقة لكل بريد.

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
      "Cache-Control": "no-store",
    },
  });
}

async function readJsonSafe(request) {
  try {
    const data = await request.json();
    return data && typeof data === "object" && !Array.isArray(data) ? data : {};
  } catch {
    return {};
  }
}

// يتحقق من Firebase ID Token عبر REST API الرسمي ويعيد بريد المستخدم
async function verifyOwnerToken(request, env) {
  const authHeader = request.headers.get("Authorization") || "";
  const idToken = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : "";

  if (!idToken) {
    return { ok: false, status: 401, error: "رمز الهوية مفقود" };
  }

  if (idToken.length < 20 || idToken.length > 8192) {
    return { ok: false, status: 401, error: "رمز الهوية غير صالح" };
  }

  const apiKey = String(
    env.FIREBASE_WEB_API_KEY || env.VITE_FIREBASE_API_KEY || ""
  ).trim();

  if (!apiKey) {
    return {
      ok: false,
      status: 500,
      error: "إعداد الخادم ناقص (API key)",
    };
  }

  let res;

  try {
    res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ idToken }),
      }
    );
  } catch {
    return {
      ok: false,
      status: 502,
      error: "تعذر التحقق من جلسة Firebase",
    };
  }

  const data = await res.json().catch(() => ({}));
  const email = String(data?.users?.[0]?.email || "")
    .trim()
    .toLowerCase();

  if (!res.ok || !email) {
    return {
      ok: false,
      status: 401,
      error: "جلسة غير صالحة — سجّل الدخول من جديد",
    };
  }

  const ownerEmails = String(
    env.OWNER_EMAILS || env.VITE_OWNER_EMAILS || ""
  )
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (!ownerEmails.includes(email)) {
    return {
      ok: false,
      status: 403,
      error: "هذا الحساب ليس حساب صاحب الموقع",
    };
  }

  return { ok: true, email };
}

// PBKDF2-SHA256 عبر WebCrypto — لا يُحفظ الرمز نصياً إطلاقاً
async function hashPin(pin, saltBytes, iterations) {
  if (!isValidPin(pin)) {
    throw new Error("INVALID_PIN");
  }

  if (!(saltBytes instanceof Uint8Array) || saltBytes.length < 16) {
    throw new Error("INVALID_SALT");
  }

  if (!Number.isInteger(iterations) || iterations < 10000 || iterations > 1000000) {
    throw new Error("INVALID_ITERATIONS");
  }

  const enc = new TextEncoder();

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(pin),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: saltBytes,
      iterations,
    },
    keyMaterial,
    256
  );

  return toHex(new Uint8Array(bits));
}

// يوحّد شكل رمز PIN القادم من أي مصدر (متصفح/تطبيق/اختبار) بتطبيع الأرقام
// العربية والفارسية/الأردية والأرقام كاملة العرض مع إزالة المسافات فقط.
// الأصفار البادئة محفوظة لأنها جزء من رمز PIN.
const normalizePinInput = (raw) => {
  const map = {
    "\u0660": "0",
    "\u0661": "1",
    "\u0662": "2",
    "\u0663": "3",
    "\u0664": "4",
    "\u0665": "5",
    "\u0666": "6",
    "\u0667": "7",
    "\u0668": "8",
    "\u0669": "9",
    "\u06F0": "0",
    "\u06F1": "1",
    "\u06F2": "2",
    "\u06F3": "3",
    "\u06F4": "4",
    "\u06F5": "5",
    "\u06F6": "6",
    "\u06F7": "7",
    "\u06F8": "8",
    "\u06F9": "9",
    "\uFF10": "0",
    "\uFF11": "1",
    "\uFF12": "2",
    "\uFF13": "3",
    "\uFF14": "4",
    "\uFF15": "5",
    "\uFF16": "6",
    "\uFF17": "7",
    "\uFF18": "8",
    "\uFF19": "9",
  };

  return String(raw ?? "")
    .split("")
    .map((ch) => (map[ch] !== undefined ? map[ch] : ch))
    .join("")
    .replace(/\s+/g, "")
    .slice(0, 8);
};

const toHex = (bytes) =>
  Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

const fromHex = (hex) => {
  const value = String(hex || "").trim();

  if (!/^[0-9a-fA-F]+$/.test(value) || value.length % 2 !== 0) {
    throw new Error("INVALID_HEX");
  }

  const bytes = new Uint8Array(value.length / 2);

  for (let i = 0; i < value.length; i += 2) {
    bytes[i / 2] = Number.parseInt(value.slice(i, i + 2), 16);
  }

  return bytes;
};

const safeEqualHex = (left, right) => {
  const a = String(left || "").toLowerCase();
  const b = String(right || "").toLowerCase();

  if (a.length !== b.length) return false;

  let diff = 0;

  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return diff === 0;
};

// 60.000 تكراراً — ضمن الحد المستخدم لضمان توافق WebCrypto
// في بيئات Cloudflare Pages Workers والمتصفحات.
const ITERATIONS = 60000;
const MAX_ATTEMPTS = 5;
const LOCK_SECONDS = 900; // 15 دقيقة

async function ensureTables(env) {
  await env.DB.prepare(
    `CREATE TABLE IF NOT EXISTS owner_pins (
      email TEXT PRIMARY KEY,
      salt TEXT NOT NULL,
      hash TEXT NOT NULL,
      iterations INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    )`
  ).run();

  await env.DB.prepare(
    `CREATE TABLE IF NOT EXISTS pin_attempts (
      key TEXT PRIMARY KEY,
      attempts INTEGER NOT NULL DEFAULT 0,
      locked_until INTEGER NOT NULL DEFAULT 0
    )`
  ).run();
}

async function checkLock(env, email) {
  const now = Math.floor(Date.now() / 1000);

  const row = await env.DB.prepare(
    `SELECT attempts, locked_until FROM pin_attempts WHERE key = ?1`
  )
    .bind(email)
    .first();

  const lockedUntil = Number(row?.locked_until || 0);
  const attempts = Number(row?.attempts || 0);

  if (lockedUntil > now) {
    const mins = Math.max(1, Math.ceil((lockedUntil - now) / 60));
    return { locked: true, mins, attempts };
  }

  if (lockedUntil > 0 || attempts >= MAX_ATTEMPTS) {
    await env.DB.prepare(
      `DELETE FROM pin_attempts WHERE key = ?1`
    )
      .bind(email)
      .run()
      .catch(() => {});
  }

  return { locked: false, attempts: 0 };
}

async function registerFail(env, email) {
  const now = Math.floor(Date.now() / 1000);

  const row = await env.DB.prepare(
    `SELECT attempts, locked_until FROM pin_attempts WHERE key = ?1`
  )
    .bind(email)
    .first();

  const existingAttempts = Number(row?.attempts || 0);
  const existingLockedUntil = Number(row?.locked_until || 0);

  if (existingLockedUntil > now) {
    return {
      attempts: existingAttempts,
      lockedUntil: existingLockedUntil,
    };
  }

  const attempts = existingAttempts + 1;
  const lockedUntil =
    attempts >= MAX_ATTEMPTS ? now + LOCK_SECONDS : 0;

  await env.DB.prepare(
    `INSERT INTO pin_attempts (key, attempts, locked_until)
     VALUES (?1, ?2, ?3)
     ON CONFLICT(key) DO UPDATE SET
       attempts = ?2,
       locked_until = ?3`
  )
    .bind(email, attempts, lockedUntil)
    .run();

  return { attempts, lockedUntil };
}

const clearFails = (env, email) =>
  env.DB.prepare(
    `DELETE FROM pin_attempts WHERE key = ?1`
  )
    .bind(email)
    .run()
    .catch(() => {});

const isValidPin = (pin) => /^\d{4,8}$/.test(pin);

const isValidStoredRecord = (record) => {
  if (!record) return false;

  const salt = String(record.salt || "").trim();
  const hash = String(record.hash || "").trim();
  const iterations = Number(record.iterations);

  return (
    /^[0-9a-fA-F]{32,}$/.test(salt) &&
    salt.length % 2 === 0 &&
    /^[0-9a-fA-F]{64}$/.test(hash) &&
    Number.isInteger(iterations) &&
    iterations >= 10000 &&
    iterations <= 1000000
  );
};

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
      { success: false, error: "Method not allowed" },
      405
    );
  }

  if (!env || !env.DB) {
    return json(
      { success: false, error: "قاعدة البيانات غير متاحة" },
      500
    );
  }

  const body = await readJsonSafe(request);
  const action = String(body.action || "").trim();

  if (!["status", "set", "change", "verify"].includes(action)) {
    return json(
      { success: false, error: "إجراء غير معروف" },
      400
    );
  }

  try {
    await ensureTables(env);

    const identity = await verifyOwnerToken(request, env);

    if (!identity.ok) {
      return json(
        { success: false, error: identity.error },
        identity.status
      );
    }

    const email = identity.email;

    const existing = await env.DB.prepare(
      `SELECT salt, hash, iterations FROM owner_pins WHERE email = ?1`
    )
      .bind(email)
      .first();

    // ——— حالة الإعداد: هل أُنشئ رمز لهذا المالك؟ ———
    if (action === "status") {
      return json({
        success: true,
        pinSet: !!existing,
      });
    }

    // ——— إنشاء الرمز لأول مرة ———
    if (action === "set") {
      if (existing) {
        return json(
          {
            success: false,
            error: "الرمز السري مُنشأ مسبقاً — استخدم تغيير الرمز",
          },
          409
        );
      }

      const pin = normalizePinInput(body.pin);

      if (!isValidPin(pin)) {
        return json(
          {
            success: false,
            error: "الرمز يجب أن يكون 4 إلى 8 أرقام",
          },
          400
        );
      }

      const salt = crypto.getRandomValues(
        new Uint8Array(16)
      );

      const hash = await hashPin(
        pin,
        salt,
        ITERATIONS
      );

      await env.DB.prepare(
        `INSERT INTO owner_pins
          (email, salt, hash, iterations, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5)`
      )
        .bind(
          email,
          toHex(salt),
          hash,
          ITERATIONS,
          Math.floor(Date.now() / 1000)
        )
        .run();

      await clearFails(env, email);

      return json({
        success: true,
        message: "تم إنشاء الرمز السري بنجاح",
      });
    }

    // ——— تغيير الرمز (يتطلب الرمز الحالي) ———
    if (action === "change") {
      if (!existing) {
        return json(
          {
            success: false,
            error: "لا يوجد رمز مُنشأ بعد",
          },
          404
        );
      }

      if (!isValidStoredRecord(existing)) {
        return json(
          {
            success: false,
            error: "بيانات الرمز السري غير صالحة — يجب إعادة إعداد الرمز",
          },
          500
        );
      }

      const lock = await checkLock(env, email);

      if (lock.locked) {
        return json(
          {
            success: false,
            error: `الحساب مقفل مؤقتاً — حاول بعد ${lock.mins} دقيقة`,
          },
          423
        );
      }

      const currentPin = normalizePinInput(body.currentPin);
      const newPin = normalizePinInput(body.newPin);

      if (!isValidPin(currentPin)) {
        return json(
          {
            success: false,
            error: "الرمز الحالي يجب أن يكون 4 إلى 8 أرقام",
          },
          400
        );
      }

      if (!isValidPin(newPin)) {
        return json(
          {
            success: false,
            error: "الرمز الجديد يجب أن يكون 4 إلى 8 أرقام",
          },
          400
        );
      }

      const currentHash = await hashPin(
        currentPin,
        fromHex(existing.salt),
        Number(existing.iterations)
      );

      if (!safeEqualHex(currentHash, existing.hash)) {
        const fail = await registerFail(env, email);

        return json(
          {
            success: false,
            error:
              fail.lockedUntil > 0
                ? "الرمز الحالي غير صحيح — تم قفل الحساب 15 دقيقة"
                : "الرمز الحالي غير صحيح",
          },
          401
        );
      }

      const salt = crypto.getRandomValues(
        new Uint8Array(16)
      );

      const hash = await hashPin(
        newPin,
        salt,
        ITERATIONS
      );

      await env.DB.prepare(
        `UPDATE owner_pins
         SET salt = ?2,
             hash = ?3,
             iterations = ?4,
             updated_at = ?5
         WHERE email = ?1`
      )
        .bind(
          email,
          toHex(salt),
          hash,
          ITERATIONS,
          Math.floor(Date.now() / 1000)
        )
        .run();

      await clearFails(env, email);

      return json({
        success: true,
        message: "تم تغيير الرمز السري بنجاح",
      });
    }

    // ——— التحقق من الرمز لفتح الغرفة ———
    if (action === "verify") {
      if (!existing) {
        return json(
          {
            success: false,
            error: "لا يوجد رمز مُنشأ بعد",
            pinSet: false,
          },
          404
        );
      }

      if (!isValidStoredRecord(existing)) {
        return json(
          {
            success: false,
            error: "بيانات الرمز السري غير صالحة — يجب إعادة إعداد الرمز",
          },
          500
        );
      }

      const lock = await checkLock(env, email);

      if (lock.locked) {
        return json(
          {
            success: false,
            error: `محاولات كثيرة — الحساب مقفل، حاول بعد ${lock.mins} دقيقة`,
          },
          423
        );
      }

      const pin = normalizePinInput(body.pin);

      if (!isValidPin(pin)) {
        return json(
          {
            success: false,
            error: "أدخل رقماً من 4 إلى 8 خانات",
          },
          400
        );
      }

      const hash = await hashPin(
        pin,
        fromHex(existing.salt),
        Number(existing.iterations)
      );

      if (!safeEqualHex(hash, existing.hash)) {
        const fail = await registerFail(env, email);
        const remaining = Math.max(
          0,
          MAX_ATTEMPTS - fail.attempts
        );

        return json(
          {
            success: false,
            error:
              fail.lockedUntil > 0
                ? "رمز غير صحيح — تم قفل الحساب 15 دقيقة وسُجّلت المحاولة"
                : `رمز غير صحيح — تبقى ${remaining} محاولات قبل القفل`,
          },
          401
        );
      }

      await clearFails(env, email);

      return json({
        success: true,
        message: "تم التحقق — الغرفة مفتوحة",
      });
    }

    return json(
      {
        success: false,
        error: "إجراء غير معروف",
      },
      400
    );
  } catch (error) {
    console.error("owner-pin error:", error);

    return json(
      {
        success: false,
        error: "تعذر تنفيذ الطلب — أعد المحاولة لاحقاً",
      },
      500
    );
  }
}