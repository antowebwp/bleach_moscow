// Shared contacts/footer are emitted into static HTML for no-JavaScript readability.
const fs = require('node:fs');
const path = require('node:path');
const shared = fs.readFileSync(path.join(__dirname, 'shared-footer.html'), 'utf8');
for (const name of ['index.html', 'uslugi.html', 'chistka_obuvi_full.html', 'brand.html', 'blog.html', 'himchistka_s_besplatnoy_dostavkoy.html', 'loropiana.html', ...['cases','blog'].flatMap(folder=>fs.existsSync(path.join(__dirname,folder))?fs.readdirSync(path.join(__dirname,folder)).filter(name => name.endsWith('.html')).map(name => folder+'/' + name):[])]) {
  const file = path.join(__dirname, name);
  if (!fs.existsSync(file)) continue;
  const fragment = name.includes('/') ? shared.replaceAll('src="assets/', 'src="../assets/') : shared;
  const html = fs.readFileSync(file, 'utf8');
  fs.writeFileSync(file, html.replace(/<!-- shared-footer:start -->[\s\S]*?<!-- shared-footer:end -->/, `<!-- shared-footer:start -->\n${fragment}\n<!-- shared-footer:end -->`));
}
