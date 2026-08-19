const fs = require('fs');
const cheerio = require('cheerio');

const htmlContent = fs.readFileSync('index.html', 'utf-8');
const $ = cheerio.load(htmlContent);

const services = [
    {
        id: 'electricity',
        filename: 'electricity.html',
        title: 'خدمات الكهرباء بالرياض | بلو كي للصيانة المنزلية',
        nameAr: 'خدمات الكهرباء',
        desc: 'خدمات كهرباء متكاملة في الرياض. إصلاح الأعطال، تمديد الشبكات، معالجة الالتماسات، وتركيب الإضاءة والمفاتيح.',
        icon: 'fa-bolt',
        faqs: [
            { q: 'هل تقدمون ضماناً على خدمات الكهرباء؟', a: 'نعم، نقدم ضماناً لمدة 30 يوماً على جميع خدمات الكهرباء لضمان جودة العمل.' },
            { q: 'ما هي سرعة الاستجابة للأعطال الكهربائية الطارئة؟', a: 'نحن ندرك أهمية الكهرباء، لذا نوفر استجابة سريعة للأعطال الطارئة في الرياض لتأمين سلامتك.' },
            { q: 'هل الفنيون لديكم معتمدون؟', a: 'بالتأكيد، جميع فنيي الكهرباء لدينا مؤهلون ومعتمدون ويمتلكون خبرة واسعة في هذا المجال.' }
        ]
    },
    {
        id: 'plumbing',
        filename: 'plumbing.html',
        title: 'خدمات السباكة بالرياض | بلو كي للصيانة المنزلية',
        nameAr: 'خدمات السباكة',
        desc: 'خدمات سباكة محترفة في الرياض. معالجة التسريبات، تمديد وتأسيس شبكات المياه، تركيب الأدوات الصحية.',
        icon: 'fa-droplet',
        faqs: [
            { q: 'كيف يتم الكشف عن تسربات المياه؟', a: 'نستخدم أحدث الأجهزة للكشف عن تسربات المياه بدقة دون الحاجة إلى تكسير عشوائي.' },
            { q: 'هل تقومون بتأسيس شبكات السباكة للمباني الجديدة؟', a: 'نعم، نقدم خدمات تأسيس وتمديد شبكات المياه للمباني السكنية والتجارية الجديدة.' },
            { q: 'هل تقدمون ضمان على أعمال السباكة؟', a: 'نعم، جميع أعمالنا مضمونة لمدة 30 يوماً لنضمن لك جودة التنفيذ.' }
        ]
    },
    {
        id: 'ac',
        filename: 'ac.html',
        title: 'خدمات التبريد والتكييف بالرياض | بلو كي للصيانة المنزلية',
        nameAr: 'خدمات التبريد والتكييف',
        desc: 'صيانة المكيفات في الرياض. غسيل، تعبئة فريون، إصلاح أعطال المكيفات الاسبليت والمركزية بكفاءة عالية.',
        icon: 'fa-snowflake',
        faqs: [
            { q: 'كم مرة يجب غسيل المكيف في السنة؟', a: 'ينصح بغسيل المكيف وتنظيف الفلاتر بشكل دوري كل 3 إلى 6 أشهر للحفاظ على كفاءة التبريد.' },
            { q: 'هل توفرون تعبئة فريون أصلي؟', a: 'نعم، نستخدم غاز فريون أصلي ومطابق لمواصفات المكيفات لضمان تبريد ممتاز وعمر أطول للجهاز.' },
            { q: 'هل تصلحون جميع أنواع المكيفات؟', a: 'نعم، فريقنا مدرب على إصلاح وصيانة جميع أنواع المكيفات (اسبليت، مركزي، شباك، مخفي).' }
        ]
    },
    {
        id: 'general-maintenance',
        filename: 'general-maintenance.html',
        title: 'الصيانة العامة بالرياض | بلو كي للصيانة المنزلية',
        nameAr: 'الصيانة العامة',
        desc: 'خدمات الصيانة العامة الشاملة في الرياض. أعمال الجبس، الدهانات البسيطة، والتركيبات المختلفة.',
        icon: 'fa-screwdriver-wrench',
        faqs: [
            { q: 'ما هي الخدمات المشمولة في الصيانة العامة؟', a: 'تشمل خدماتنا طوارئ المنزل اليومية، أعمال الجبس، الدهانات البسيطة، وإصلاح الأبواب والنوافذ والتركيبات المتنوعة.' },
            { q: 'هل يمكن حجز موعد للتقييم والمعاينة؟', a: 'بالتأكيد، يمكنك حجز موعد لنقوم بزيارتك وتقييم المشكلة وتقديم عرض سعر واضح.' },
            { q: 'هل يتوفر لديكم خدمة صيانة دورية؟', a: 'نعم، يمكننا ترتيب خطط صيانة دورية للحفاظ على منزلك في أفضل حالة طوال العام.' }
        ]
    }
];

function generateFAQHTML(faqs) {
    let html = `<section class="section section-bg" id="faqs"><div class="container"><h2 class="section-title"><span class="ar-content">الأسئلة الشائعة</span></h2><div class="faq-list" style="max-width: 800px; margin: 0 auto; text-align: right;">`;
    faqs.forEach(faq => {
        html += `<div style="margin-bottom: 20px; background: #fff; padding: 15px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
            <h4 style="color: #0c3e80; margin-bottom: 10px;">${faq.q}</h4>
            <p>${faq.a}</p>
        </div>`;
    });
    html += `</div></div></section>`;
    return html;
}

services.forEach(service => {
    let $page = cheerio.load(htmlContent);
    
    // Update Title & Meta
    $page('title').text(service.title);
    $page('meta[name="description"]').attr('content', service.desc);
    $page('link[rel="canonical"]').attr('href', `https://www.bluekey.sa/${service.filename}`);
    
    // Update H1 in Hero section
    $page('.hero h1').html(`<span class="ar-content">${service.nameAr} في الرياض</span>`);
    $page('.hero p').first().html(`<span class="ar-content">${service.desc}</span>`);
    
    // Add FAQs before the booking section
    $page('#booking').before(generateFAQHTML(service.faqs));

    // Optional: Hide other service cards in the #services section on service pages,
    // or change the #services section to highlight this service.
    // We will keep them as related services but we could focus.
    
    fs.writeFileSync(service.filename, $page.html(), 'utf-8');
    console.log(`Generated ${service.filename}`);
});

// Update index.html to point to the new pages instead of #booking
const $index = cheerio.load(htmlContent);

// Fix 1: Add canonical if missing (already done by powershell, but let's ensure it's pointing to /)
$index('link[rel="canonical"]').attr('href', 'https://www.bluekey.sa/');

// Fix 2: Modify Service Links in index.html
const cardLinks = $index('.service-card .service-link');
if(cardLinks.length >= 4) {
    cardLinks.eq(0).attr('href', 'electricity.html');
    cardLinks.eq(1).attr('href', 'plumbing.html');
    cardLinks.eq(2).attr('href', 'ac.html');
    cardLinks.eq(3).attr('href', 'general-maintenance.html');
}

// Fix 3: Update Area Served in JSON-LD
const schemaScript = $index('script[type="application/ld+json"]');
if (schemaScript.length) {
    let schemaText = schemaScript.html();
    try {
        let schemaObj = JSON.parse(schemaText);
        schemaObj.name = "بلو كي للصيانة المنزلية";
        schemaObj.alternateName = "Blue Key Home Maintenance";
        schemaObj.telephone = "+966533359350";
        schemaObj.url = "https://www.bluekey.sa/";
        
        schemaScript.html(JSON.stringify(schemaObj, null, 2));
    } catch(e) {
        console.error("Failed to parse JSON-LD");
    }
}

// Generate sitemap.xml
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
   <url>
      <loc>https://www.bluekey.sa/</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>1.0</priority>
   </url>
${services.map(s => `   <url>
      <loc>https://www.bluekey.sa/${s.filename}</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.8</priority>
   </url>`).join('\n')}
</urlset>`;
fs.writeFileSync('sitemap.xml', sitemap, 'utf-8');
console.log("Generated sitemap.xml");

// Generate robots.txt
const robots = `User-agent: *
Allow: /

Sitemap: https://www.bluekey.sa/sitemap.xml
`;
fs.writeFileSync('robots.txt', robots, 'utf-8');
console.log("Updated robots.txt");

fs.writeFileSync('index.html', $index.html(), 'utf-8');
console.log("Updated index.html");
