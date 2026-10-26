// Install the approved service illustrations without touching real case photographs.
const fs=require('node:fs');const {enhance}=require('./generated-photos.cjs');
const root=__dirname,read=n=>fs.readFileSync(root+'/'+n,'utf8'),write=(n,s)=>fs.writeFileSync(root+'/'+n,s);
const sources=JSON.parse(read('generated-image-sources.json'));
const clothing=JSON.parse(read('clothing-services.json'));
const ids=['clothing-coat','clothing-shirt','clothing-knit'];
const alts=['Чистое шерстяное пальто бежевого оттенка','Свежая белая сорочка на вешалке','Аккуратно сложенный чистый кашемировый трикотаж'];
clothing.forEach((item,i)=>{
 const row=sources.find(r=>r.id===ids[i]);
 item.image='assets/generated/'+ids[i]+'-1600.webp';item.alt=alts[i];
 item.srcset=row.variants.map(v=>v.path+' '+v.width+'w').join(', ');
 item.source='Сгенерировано встроенным image_gen';delete item.photographer;
});
write('clothing-services.json',JSON.stringify(clothing,null,2));
let home=read('index.html');
ids.forEach((id,i)=>{home=home.replace('src="assets/service-'+['coat','shirt','knit'][i]+'.svg"','src="assets/generated/'+id+'-1600.webp"');});
// The two product tiles use a clean shoe, while workshop and before/after photos stay authentic.
home=home.replace('src="assets/loro-piana.jpg"','src="assets/generated/clean-loafer-1600.webp"').replace('src="assets/obuv.png"','src="assets/generated/clean-loafer-1600.webp"');
write('index.html',enhance(home));
let menu=JSON.parse(read('service-menu-data.json'));
menu[0].items[1][2]='generated/clean-loafer-1600.webp';menu[0].items[2][2]='generated/clean-loafer-1600.webp';
menu[2].items.forEach((item,i)=>item[2]='generated/'+ids[i]+'-1600.webp');
write('service-menu-data.json',JSON.stringify(menu,null,2));
let full=read('chistka_obuvi_full.html').replace('src="assets/obuv.png"','src="assets/generated/clean-loafer-1600.webp"').replace('Чёрная замшевая обувь с контрастной подошвой','Чистый бежевый замшевый лофер со светлой подошвой');
write('chistka_obuvi_full.html',enhance(full));
let catalog=read('catalog-layout-template.html').replace('src="assets/generated/hero-1600.webp"','src="assets/generated/catalog-collection-1600.webp"').replace('Замшевая обувь и кашемир: студийная композиция','Чистые замшевые лоферы, кожаная сумка, пальто и сорочка');
write('catalog-layout-template.html',enhance(catalog));
let uniq=read('build-uniq.cjs').replace("const offerPhoto=delivery?null:await asset(images(offer).at(-1));","const offerPhoto=delivery?null:'assets/generated/clean-loafer-1600.webp';").replace('Обувь Loro Piana: бережно сохраняем верх и заменяем подошву','Чистый замшевый лофер со светлой подошвой: иллюстрация ухода');
write('build-uniq.cjs',uniq);
console.log('Updated clothing tiles, clean footwear illustrations and catalog cover.');
