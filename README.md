# Trend Supabase Storage Logic Fixed

التعديل المهم:

عند حفظ منتج أو Hero من لوحة التحكم:

1. إذا رفعت ملف جديد، يرفع مباشرة إلى Supabase Storage ويحفظ الرابط.
2. إذا ما رفعت ملف وكانت القيمة الحالية رابط Supabase/URL، يحفظ نفس الرابط.
3. إذا كانت القيمة الحالية صورة من `public` مثل `/heroes/car-adhkar.jpg`، السيرفر يقرأ الملف من `public` ويرفعه إلى bucket `trend-media` ثم يحفظ رابط Supabase بدل المسار المحلي.

يعني الآن أول مرة تحفظ داتا demo راح تتحول صور `public` إلى روابط Supabase تلقائيًا.

## المطلوب

في `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_ADMIN_PASSWORD=trend2024
```

وفي Supabase Storage اعمل bucket عام باسم:

```txt
trend-media
```

ثم شغل:

```bash
npm install
npm run dev
```

ادخل لوحة التحكم واحفظ المنتج أو الهيرو. الصور المحلية الموجودة في `public` سترفع تلقائيًا إلى Supabase.
