const summaries=require('./catalog-summaries.json');
const {esc}=require('./service-copy.cjs');
function summary(title){
 const data=summaries[title];if(!data)throw Error('Missing catalog summary: '+title);
 const price=data.label?`<p class="service-copy-kicker"><strong>${esc(data.label)}</strong></p>`:`<p class="service-copy-price">${esc(data.price||'Стоимость — после оценки')}</p>`;
 return `<div class="service-copy service-copy-compact">${price}<p>${esc(data.description)}</p>${data.steps?.length?`<p><strong>В услугу входит:</strong></p><ul>${data.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ul>`:''}${data.result?`<p><strong>Результат:</strong> ${esc(data.result)}</p>`:''}</div>`;
}
module.exports={summary};
