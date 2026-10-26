# Обновление контента и фотографий — 25.10.2026

Изображения созданы встроенным image_gen (режим generate). Исходные PNG сохранены в `../image-sources/`, рабочие адаптивные WebP — в `assets/generated/`.

Изменения: бегущая строка уменьшена до 18–28 px; в слайдере сохранены исходные сцены 2 и 4; количество сцен и длина прокрутки вычисляются автоматически. Обновлены описание мастерской, услуги, цены и состав ухода из сообщения и приложенного текста. Добавлены кнопки существующей формы консультации во все три направления на главной. Никаких WP/ACF зависимостей не добавлено.

Фотографии услуг и реальных работ, логотипы, скриншоты отзывов сохранены. Сгенерированные сцены — иллюстративная редакционная съёмка, они не подписываются как реальные результаты или подлинный интерьер мастерской.

## Файлы и промпты

### hero

Файлы: assets/generated/hero-{640,960,1600}.webp. Исходник: ../image-sources/hero.png.

Wide 16:9 luxury editorial photograph for a premium shoe and garment care website. Immaculate unbranded black suede loafers and a small folded warm beige cashmere textile on a charcoal work surface, sculptural side lighting, subtle suede grain, deep near-black background with generous dark negative space in the center for website text. Restrained black, warm ivory and muted antique gold palette, sophisticated real photographic art direction, no logos, no text, no dirty shoes, no collage.

### assessment

Файлы: assets/generated/assessment-{640,960,1600}.webp. Исходник: ../image-sources/assessment.png.

Wide 16:9 cinematic editorial photograph: close detail of an artisan wearing clean black nitrile gloves gently examining a pristine warm taupe leather handbag at a charcoal atelier workbench. Hands and bag occupy the left half; right half has dark quiet negative space. Restrained black, warm beige, muted gold palette, tactile material detail, beautiful natural side light, realistic anatomy, no brand logos, no text, no before-after collage.

### atelier

Файлы: assets/generated/atelier-{640,960,1600}.webp. Исходник: ../image-sources/atelier.png.

Wide 16:9 luxury editorial photograph of a refined clothing care atelier: a neat rail of ivory shirts, a beige wool coat and charcoal garment bags, a small folded cashmere stack on a dark oak counter. Warm soft light, charcoal walls, spare elegant interior, quiet right-side negative space, realistic photography, no people, no signs, no logos, no text.

### football

Файлы: assets/generated/football-{640,960,1600}.webp. Исходник: ../image-sources/football.png.

Landscape 3:2 premium editorial still-life photograph of clean unbranded black football boots with understated ivory detailing beside a folded beige towel and a soft bristle cleaning brush on charcoal stone. No visible logos. Soft natural side lighting, tactile leather, elegant restrained neutral palette, realistic sports footwear studs, no text, no collage.

### hygiene

Файлы: assets/generated/hygiene-{640,960,1600}.webp. Исходник: ../image-sources/hygiene.png.

Landscape 3:2 premium editorial still-life photograph of an immaculate unbranded beige leather sneaker with a cedar shoe tree and a soft brush on a charcoal stone surface. Clean shoe care and freshness concept, warm natural side light, warm ivory, black, taupe palette, realistic photography, no mold, no dirt, no logos, no text.

### workboots

Файлы: assets/generated/workboots-{640,960,1600}.webp. Исходник: ../image-sources/workboots.png.

Landscape 3:2 premium editorial photograph of a pair of clean unbranded dark brown leather protective work boots, sturdy toe caps and practical sole, neatly placed on a charcoal workbench beside a small brush. Sophisticated warm neutral light, tactile leather, minimal elegant framing, realistic photography, no construction clutter, no logos, no text.

### riding

Файлы: assets/generated/riding-{640,960,1600}.webp. Исходник: ../image-sources/riding.png.

Landscape 3:2 premium editorial photograph of a pair of immaculate tall black leather equestrian riding boots with elegant shafts beside a folded beige cloth, charcoal studio wall and warm grey floor, refined side light showing polished leather texture, realistic proportions, restrained black and ivory palette, no person, no logos, no text.

### skates

Файлы: assets/generated/skates-{640,960,1600}.webp. Исходник: ../image-sources/skates.png.

Landscape 3:2 premium editorial photograph of immaculate ivory leather figure skating boots with realistic silver figure skate blades, neatly tied laces, placed on charcoal stone beside a folded taupe towel. Sophisticated soft side light, restrained warm neutral palette, high detail, realistic photography, no ice rink, no brand logos, no text.

### climbing

Файлы: assets/generated/climbing-{640,960,1600}.webp. Исходник: ../image-sources/climbing.png.

Landscape 3:2 premium editorial still life photograph of a pair of clean unbranded charcoal and warm taupe climbing shoes with realistic curved rubber soles on dark grey stone, a soft brush beside them. Restrained warm neutral palette with minimal muted ochre accent, soft natural side lighting, realistic equipment, no text, no logos.

### repair

Файлы: assets/generated/repair-{640,960,1600}.webp. Исходник: ../image-sources/repair.png.

Landscape 3:2 premium editorial photograph of a shoe repair craftsperson's hands in black gloves carefully working at the sole edge of a clean dark brown leather loafer on a charcoal atelier bench. A few neatly aligned hand tools, warm precise side lighting, realistic hands and materials, quiet luxurious composition, no brands, no text.

## Сборка

`node apply-client-copy.cjs` обновляет общие текстовые блоки, `node restore-catalog.cjs` собирает каталог, `node build-uniq.cjs` — специализированные страницы, `node build-blog.cjs` — блог. `service-copy.cjs` хранит общий состав трёх услуг, `client-service-copy.txt` — исходный текст заказчика. `generated-photos.cjs` добавляет корректные srcset, размеры и относительные пути. `optimize-generated.py` повторно создаёт WebP из исходников. Размеры файлов и оригинальные параметры генерации доступны в generated-image-sources.json.
