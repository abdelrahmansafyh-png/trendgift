# Custom Order File Uploads

تم تعديل فورم الطلب المخصص بحيث يرفع الملفات إلى Supabase Storage ثم يضع روابط الملفات داخل رسالة WhatsApp تلقائيًا.

## المطلوب في `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ORDER_FILES_BUCKET=order-files
```

`SUPABASE_ORDER_FILES_BUCKET` اختياري. إذا لم تضعه سيستخدم المشروع bucket باسم `order-files`.

## طريقة العمل

1. العميل يختار الصور/الفيديو/الصوت/PDF من الطلب المخصص.
2. الموقع يرفعها إلى Supabase Storage عبر `/api/order-files`.
3. رسالة WhatsApp تفتح وفيها روابط الملفات.

## ملاحظة

إذا لم يكن `SUPABASE_SERVICE_ROLE_KEY` موجودًا، لن يتم رفع الملفات وستصل أسماء الملفات فقط داخل رسالة WhatsApp.

يمكن تشغيل ملف SQL الاختياري:

```txt
supabase/order_files_storage.sql
```

لكن الـ API يحاول إنشاء bucket تلقائيًا إذا كان service role مضبوطًا.
