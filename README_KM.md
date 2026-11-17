# CHROMALUX — Order System Starter (Telegram + Email)

## សមត្ថភាព
- អតិថិជនផ្ញើ Order ពី Website
- Upload រូបថតផលិតផល និងបង្កាន់ដៃ (JPG/PNG/WEBP, មួយៗអតិបរមា 4MB)
- រក្សាទុក Order និងឯកសារក្នុង Supabase private storage
- បង្កើត PDF Order Invoice និងរក្សាទុកក្នុង Cloud
- ផ្ញើការជូនដំណឹងទៅ Telegram Admin និង Email Admin
- Payment status ដំបូងជា PENDING_VERIFICATION (មិនបញ្ជាក់ការបង់ប្រាក់ស្វ័យប្រវត្តិ)

## មុនបើកប្រើពិត
Starter code នេះមិនទាន់បាន deploy ឬសាកល្បងជាមួយគណនី/credentials ពិតទេ។ ត្រូវកំណត់ credentials និងធ្វើ test order មុនផ្សព្វផ្សាយ។ វាមិនមែនជាប្រព័ន្ធសុវត្ថិភាព production ពេញលេញដោយស្វ័យប្រវត្តិទេ; សូមបន្ថែម CAPTCHA/rate limiting និង policy/consent តាមតម្រូវការមុនទទួលចរាចរណ៍ធំ។

## 1. GitHub
Upload មាតិកា project ទាំងអស់ (api/, public/, fonts/, package.json, vercel.json, supabase.sql) ទៅ Repository។ Vercel project root directory ទុកជា root។ Homepage ស្ថិតក្នុង public/index.html។

## 2. Supabase
1. បង្កើត Project: https://supabase.com/dashboard
2. SQL Editor → paste `supabase.sql` → Run។
3. Project Settings → API: ចម្លង Project URL និង `service_role` key។ កុំដាក់ service role key នៅក្នុង Frontend ឬផ្ញើក្នុង Chat។
4. Storage buckets `order-files` និង `invoices` ត្រូវជា Private។

## 3. Resend Email
1. បង្កើតគណនី https://resend.com/
2. Verify domain របស់អ្នកក្នុង Resend មុនប្រើ production sender។ សម្រាប់ testing អាចមានកម្រិត recipient។
3. បង្កើត API Key។
4. `EMAIL_FROM` ត្រូវជាអាសយដ្ឋាន sender ដែល Resend អនុញ្ញាត/verify ឧ. `CHROMALUX <orders@yourdomain.com>`។

## 4. Telegram Bot
1. បង្កើត/ប្រើ Bot តាម @BotFather។
2. កំណត់ `BOT_TOKEN` នៅ Vercel Environment Variables។
3. ដើម្បីរក Admin chat ID: ផ្ញើ `/start` ទៅ Bot របស់អ្នក ហើយប្រើ Telegram getUpdates API ឬ bot helper ដែលទុកចិត្តបាន ដើម្បីរក `message.chat.id`។ កុំផ្ញើ token ក្នុង Chat។
4. កំណត់ `TELEGRAM_ADMIN_CHAT_ID` ជាលេខ chat ID របស់អ្នក។ Bot ត្រូវបានអ្នកចាប់ផ្ដើម chat មុន ទើបអាចផ្ញើសារទៅអ្នកបាន។

## 5. Vercel Environment Variables
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (secret)
- `BOT_TOKEN` (secret)
- `TELEGRAM_ADMIN_CHAT_ID`
- `RESEND_API_KEY` (secret)
- `ADMIN_EMAIL` (អ៊ីមែលដែលចង់ទទួល Order)
- `EMAIL_FROM` (sender ដែល verify នៅ Resend)
- `SHOP_NAME=CHROMALUX`
- `SHOP_PHONE=068 990 688`

បន្ទាប់ពីបញ្ចូល Environment Variables ត្រូវ Redeploy។

## 6. Test
1. បើក Website ដែល Vercel ផ្ដល់។
2. ដាក់ Test Order ដោយប្រើរូបថតសាកល្បង និងបង្កាន់ដៃសាកល្បង។
3. ពិនិត្យ Telegram និង Email ទទួលបាន Order summary និង PDF។
4. ពិនិត្យ Supabase Table `orders` និង Storage buckets។
5. កុំបើកទទួលប្រាក់ពិត រហូតដល់បានសាកល្បងទាំងអស់។

## សុវត្ថិភាព និងចំណាំ
- មិនត្រូវបញ្ចូល Token, API Key ឬ service role key ក្នុង Chat ឬ GitHub។
- រូបថត/បង្កាន់ដៃ និង PDF ត្រូវបានរក្សាទុកក្នុង private buckets។
- PDF ជា Order Invoice ប៉ុណ្ណោះ មិនមែន Payment Receipt។
- Admin ត្រូវផ្ទៀងផ្ទាត់ KHQR receipt ដោយដៃ។
- បច្ចុប្បន្ន email ទៅ Admin មាន PDF Invoice ភ្ជាប់; Telegram Admin ទទួល Order summary។ 
- មិនទាន់មាន customer-facing status page, refund, shipment tracking, admin dashboard ឬ automatic payment verification។
