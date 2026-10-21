-- Blog posts seed data — first 4 SEO-optimized articles
-- Run AFTER 00007_blog_posts.sql migration

INSERT INTO blog_posts (slug, title, title_en, excerpt, excerpt_en, content, content_en, meta_description, meta_description_en, keywords, cover_image_alt, cover_image_alt_en, is_published, published_at)
VALUES

-- Article 1: Surf lessons in Nosara
(
  'surf-lessons-nosara-what-to-expect',
  'Clases de Surf en Nosara — Qué Esperar en Tu Primera Clase',
  'Surf Lessons in Nosara — What to Expect in Your First Lesson',
  'Todo lo que necesitas saber antes de tomar tu primera clase de surf en Playa Guiones, Nosara. Desde qué llevar hasta cómo es la experiencia completa.',
  'Everything you need to know before your first surf lesson at Playa Guiones, Nosara. From what to bring to the complete experience.',
  '<h2>Tu primera clase de surf en Nosara</h2>
<p>Nosara, ubicada en la costa del Pacífico de Guanacaste, Costa Rica, se ha convertido en uno de los destinos de surf más populares del mundo. Playa Guiones, con sus olas consistentes y su fondo de arena, es el lugar ideal para aprender a surfear — sin importar tu edad o nivel de experiencia.</p>

<h2>¿Por qué Playa Guiones es perfecta para principiantes?</h2>
<p>A diferencia de otras playas de surf en Costa Rica, Playa Guiones ofrece condiciones ideales para principiantes:</p>
<ul>
<li><strong>Fondo de arena</strong> — sin rocas ni arrecifes peligrosos</li>
<li><strong>Olas consistentes todo el año</strong> — siempre hay olas para aprender</li>
<li><strong>Olas largas y suaves</strong> — perfectas para practicar el pop-up</li>
<li><strong>Agua cálida</strong> — no necesitas traje de neopreno</li>
</ul>

<h2>¿Qué incluye una clase de surf?</h2>
<p>Una clase típica en Surfers Lab CR dura aproximadamente 2 horas e incluye:</p>
<ol>
<li><strong>Calentamiento en tierra (20 min)</strong> — Tu instructor te enseña la técnica del pop-up, cómo remar y las reglas de seguridad en el agua.</li>
<li><strong>Práctica en el agua (1.5 horas)</strong> — Entras al agua con tu instructor, quien te ayuda a elegir las olas correctas y te da feedback en tiempo real.</li>
<li><strong>Video análisis (opcional)</strong> — Algunos paquetes incluyen grabación de video para analizar tu técnica después de la sesión.</li>
</ol>

<h2>¿Qué llevar a tu clase de surf?</h2>
<p>Solo necesitas lo básico:</p>
<ul>
<li>Traje de baño</li>
<li>Protector solar biodegradable (importante para proteger el océano)</li>
<li>Toalla</li>
<li>Agua para hidratarte</li>
</ul>
<p>Nosotros proporcionamos la tabla de surf, el rash guard y todo el equipo necesario.</p>

<h2>¿Cuánto cuesta una clase de surf en Nosara?</h2>
<p>Los precios varían según el tipo de clase. Las clases grupales son más económicas, mientras que las clases privadas ofrecen atención personalizada. En Surfers Lab CR ofrecemos diferentes paquetes para adaptarnos a tu presupuesto y objetivos.</p>

<h2>Reserva tu clase hoy</h2>
<p>¿Listo para surfear? Playa Guiones te espera. Reserva tu clase directamente en nuestro sitio web y vive la experiencia de surfear en una de las mejores playas de Costa Rica.</p>',

  '<h2>Your first surf lesson in Nosara</h2>
<p>Nosara, located on the Pacific coast of Guanacaste, Costa Rica, has become one of the world''s most popular surf destinations. Playa Guiones, with its consistent waves and sandy bottom, is the ideal place to learn to surf — regardless of your age or experience level.</p>

<h2>Why is Playa Guiones perfect for beginners?</h2>
<p>Unlike other surf beaches in Costa Rica, Playa Guiones offers ideal conditions for beginners:</p>
<ul>
<li><strong>Sandy bottom</strong> — no dangerous rocks or reefs</li>
<li><strong>Consistent waves year-round</strong> — there are always waves to learn on</li>
<li><strong>Long, gentle waves</strong> — perfect for practicing your pop-up</li>
<li><strong>Warm water</strong> — no wetsuit needed</li>
</ul>

<h2>What does a surf lesson include?</h2>
<p>A typical lesson at Surfers Lab CR lasts approximately 2 hours and includes:</p>
<ol>
<li><strong>Beach warm-up (20 min)</strong> — Your instructor teaches you the pop-up technique, how to paddle, and water safety rules.</li>
<li><strong>Water practice (1.5 hours)</strong> — You enter the water with your instructor, who helps you choose the right waves and gives you real-time feedback.</li>
<li><strong>Video analysis (optional)</strong> — Some packages include video recording to analyze your technique after the session.</li>
</ol>

<h2>What to bring to your surf lesson</h2>
<p>You only need the basics:</p>
<ul>
<li>Swimsuit</li>
<li>Biodegradable sunscreen (important to protect the ocean)</li>
<li>Towel</li>
<li>Water to stay hydrated</li>
</ul>
<p>We provide the surfboard, rash guard, and all necessary equipment.</p>

<h2>How much does a surf lesson in Nosara cost?</h2>
<p>Prices vary depending on the type of lesson. Group lessons are more affordable, while private lessons offer personalized attention. At Surfers Lab CR we offer different packages to fit your budget and goals.</p>

<h2>Book your lesson today</h2>
<p>Ready to surf? Playa Guiones is waiting for you. Book your lesson directly on our website and experience surfing at one of the best beaches in Costa Rica.</p>',

  'Clases de surf en Nosara, Costa Rica. Todo lo que necesitas saber sobre tu primera clase de surf en Playa Guiones: qué llevar, cómo es la experiencia y precios.',
  'Surf lessons in Nosara, Costa Rica. Everything you need to know about your first surf lesson at Playa Guiones: what to bring, the experience, and prices.',
  'surf lessons Nosara, clases de surf Nosara, Playa Guiones surf, learn to surf Costa Rica, surf school Nosara, escuela de surf Guiones',
  'Clase de surf en Playa Guiones, Nosara — Surfers Lab CR',
  'Surf lesson at Playa Guiones, Nosara — Surfers Lab CR',
  true,
  now() - interval '2 days'
),

-- Article 2: Best time to surf in Nosara
(
  'best-time-to-surf-nosara',
  'Mejor Época para Surfear en Nosara, Costa Rica',
  'Best Time to Surf in Nosara, Costa Rica',
  'Descubre cuándo es la mejor temporada para surfear en Playa Guiones, Nosara. Guía mes a mes del oleaje, clima y condiciones ideales.',
  'Discover when is the best season to surf at Playa Guiones, Nosara. Month-by-month guide to swell, weather, and ideal conditions.',
  '<h2>¿Cuándo es la mejor época para surfear en Nosara?</h2>
<p>La respuesta corta: <strong>todo el año</strong>. Nosara es uno de los pocos destinos de surf en el mundo donde puedes encontrar olas consistentes los 365 días del año. Pero hay temporadas donde las condiciones son especialmente buenas.</p>

<h2>Temporada seca (diciembre - abril)</h2>
<p>La temporada seca en Nosara coincide con la temporada alta de turismo. Las condiciones son:</p>
<ul>
<li><strong>Oleaje:</strong> Olas de 3-5 pies, ideales para principiantes e intermedios</li>
<li><strong>Clima:</strong> Soleado, temperaturas de 28-33°C</li>
<li><strong>Viento:</strong> Vientos offshore por las mañanas (condiciones glassy)</li>
<li><strong>Agua:</strong> 27-28°C, cristalina</li>
</ul>
<p>Esta es la mejor época si eres principiante o si vienes de vacaciones y quieres disfrutar tanto del surf como del sol.</p>

<h2>Temporada de lluvias (mayo - noviembre)</h2>
<p>La temporada verde trae las mejores olas del año:</p>
<ul>
<li><strong>Oleaje:</strong> Olas de 4-8 pies, swells del sur más consistentes</li>
<li><strong>Clima:</strong> Lluvias por las tardes, mañanas generalmente soleadas</li>
<li><strong>Viento:</strong> Menos viento = olas más limpias</li>
<li><strong>Agua:</strong> 28-29°C</li>
</ul>
<p>Si buscas olas más grandes y menos gente en el agua, esta es tu temporada. Las mañanas suelen estar despejadas — la lluvia llega por la tarde.</p>

<h2>Guía mes a mes</h2>
<ul>
<li><strong>Enero - Marzo:</strong> Olas medianas, perfecto para aprender. Temporada alta.</li>
<li><strong>Abril - Mayo:</strong> Transición. Las olas empiezan a crecer con los primeros swells del sur.</li>
<li><strong>Junio - Agosto:</strong> Las mejores olas del año. Swells del sur traen olas consistentes de 5-8 pies.</li>
<li><strong>Septiembre - Octubre:</strong> Más lluvia, pero excelentes condiciones de surf. Menos turistas.</li>
<li><strong>Noviembre - Diciembre:</strong> Transición a temporada seca. Buen surf con clima mejorando.</li>
</ul>

<h2>Mejor hora del día para surfear</h2>
<p>Las mejores condiciones en Playa Guiones son por la mañana temprano (6:00 - 9:00 AM) y al atardecer (4:00 - 6:00 PM), cuando el viento es más suave y las olas están más limpias.</p>

<h2>Conclusión</h2>
<p>No existe una mala época para surfear en Nosara. Cada temporada ofrece algo diferente. Si eres principiante, la temporada seca es ideal. Si buscas aventura y olas más grandes, ven entre junio y agosto. Lo más importante es estar en el agua.</p>',

  '<h2>When is the best time to surf in Nosara?</h2>
<p>The short answer: <strong>all year round</strong>. Nosara is one of the few surf destinations in the world where you can find consistent waves 365 days a year. But there are seasons where conditions are especially good.</p>

<h2>Dry season (December - April)</h2>
<p>The dry season in Nosara coincides with peak tourism season. Conditions are:</p>
<ul>
<li><strong>Swell:</strong> 3-5 foot waves, ideal for beginners and intermediates</li>
<li><strong>Weather:</strong> Sunny, temperatures of 82-91°F (28-33°C)</li>
<li><strong>Wind:</strong> Offshore winds in the mornings (glassy conditions)</li>
<li><strong>Water:</strong> 80-82°F (27-28°C), crystal clear</li>
</ul>
<p>This is the best time if you''re a beginner or if you''re on vacation and want to enjoy both surfing and sunshine.</p>

<h2>Rainy season (May - November)</h2>
<p>The green season brings the best waves of the year:</p>
<ul>
<li><strong>Swell:</strong> 4-8 foot waves, more consistent south swells</li>
<li><strong>Weather:</strong> Rain in the afternoons, mornings generally sunny</li>
<li><strong>Wind:</strong> Less wind = cleaner waves</li>
<li><strong>Water:</strong> 82-84°F (28-29°C)</li>
</ul>
<p>If you''re looking for bigger waves and fewer people in the water, this is your season. Mornings are usually clear — rain comes in the afternoon.</p>

<h2>Month-by-month guide</h2>
<ul>
<li><strong>January - March:</strong> Medium waves, perfect for learning. High season.</li>
<li><strong>April - May:</strong> Transition. Waves start to grow with the first south swells.</li>
<li><strong>June - August:</strong> Best waves of the year. South swells bring consistent 5-8 foot waves.</li>
<li><strong>September - October:</strong> More rain, but excellent surf conditions. Fewer tourists.</li>
<li><strong>November - December:</strong> Transition to dry season. Good surf with improving weather.</li>
</ul>

<h2>Best time of day to surf</h2>
<p>The best conditions at Playa Guiones are early morning (6:00 - 9:00 AM) and at sunset (4:00 - 6:00 PM), when the wind is lighter and the waves are cleaner.</p>

<h2>Conclusion</h2>
<p>There is no bad time to surf in Nosara. Every season offers something different. If you''re a beginner, the dry season is ideal. If you''re looking for adventure and bigger waves, come between June and August. The most important thing is to be in the water.</p>',

  'Mejor época para surfear en Nosara, Costa Rica. Guía mes a mes del oleaje, clima y condiciones en Playa Guiones para principiantes y surfistas intermedios.',
  'Best time to surf in Nosara, Costa Rica. Month-by-month guide to swell, weather, and conditions at Playa Guiones for beginners and intermediate surfers.',
  'best time to surf Nosara, surf season Nosara, Playa Guiones waves, when to surf Costa Rica, mejor epoca surf Nosara, temporada surf Guanacaste',
  'Surfista en Playa Guiones al atardecer — Nosara, Costa Rica',
  'Surfer at Playa Guiones at sunset — Nosara, Costa Rica',
  true,
  now() - interval '4 days'
),

-- Article 3: Beginner surf guide
(
  'beginner-surf-guide-nosara',
  'Guía de Surf para Principiantes en Nosara, Costa Rica',
  'Beginner Surf Guide — Nosara, Costa Rica',
  'Guía completa para aprender a surfear en Nosara. Tips, técnicas básicas, seguridad en el agua y todo lo que necesitas saber antes de tu primera ola.',
  'Complete guide to learning to surf in Nosara. Tips, basic techniques, water safety, and everything you need to know before your first wave.',
  '<h2>Aprender a surfear en Nosara</h2>
<p>Si estás pensando en aprender a surfear, Nosara es uno de los mejores lugares del mundo para hacerlo. Esta guía te va a preparar para tu primera experiencia en el agua.</p>

<h2>Antes de entrar al agua</h2>
<h3>Elige la tabla correcta</h3>
<p>Como principiante, vas a usar una tabla larga (longboard) de espuma. Estas tablas son más estables, más fáciles de remar y más seguras que las tablas cortas. En Surfers Lab CR proporcionamos tablas de espuma de 8-9 pies, ideales para aprender.</p>

<h3>Aprende el pop-up en tierra</h3>
<p>El pop-up es el movimiento de pararte en la tabla. Antes de entrar al agua, practica este movimiento en la arena:</p>
<ol>
<li>Acuéstate boca abajo en la tabla</li>
<li>Coloca las manos a la altura del pecho</li>
<li>Empuja hacia arriba y lleva el pie trasero al centro de la tabla</li>
<li>El pie delantero va adelante, con las rodillas flexionadas</li>
<li>Mantén los ojos al frente, nunca mires tus pies</li>
</ol>

<h2>En el agua</h2>
<h3>Cómo remar</h3>
<p>Remar correctamente es fundamental. Acuéstate en el centro de la tabla (ni muy adelante ni muy atrás) y rema con brazadas largas y profundas, alternando los brazos como si nadaras crol.</p>

<h3>Cómo atrapar una ola</h3>
<p>Tu instructor te va a ayudar a elegir las olas correctas. Cuando veas que viene una ola:</p>
<ol>
<li>Apunta tu tabla hacia la playa</li>
<li>Empieza a remar fuerte antes de que la ola te alcance</li>
<li>Cuando sientas que la ola te empuja, haz el pop-up</li>
<li>Mantén las rodillas flexionadas y los brazos extendidos para balance</li>
</ol>

<h2>Seguridad en el agua</h2>
<ul>
<li><strong>Nunca surfees solo</strong> — especialmente como principiante</li>
<li><strong>Respeta las reglas de prioridad</strong> — el surfista más cerca del pico tiene prioridad</li>
<li><strong>No sueltes tu tabla</strong> — tu tabla puede golpear a otros surfistas</li>
<li><strong>Conoce las corrientes</strong> — tu instructor te va a enseñar a identificarlas</li>
<li><strong>Usa protector solar biodegradable</strong> — protege tu piel y el océano</li>
</ul>

<h2>Errores comunes de principiantes</h2>
<ul>
<li>Mirar los pies en vez de al frente</li>
<li>Pararse demasiado recto (mantén las rodillas flexionadas)</li>
<li>Remar demasiado suave (rema con fuerza)</li>
<li>Elegir olas demasiado grandes</li>
<li>Rendirse después de la primera caída (todos se caen, eso es parte de surfear)</li>
</ul>

<h2>¿Listo para surfear?</h2>
<p>La mejor forma de aprender es con un instructor certificado que te guíe paso a paso. En Surfers Lab CR nuestros instructores adaptan cada clase a tu nivel y te dan feedback personalizado para que progreses rápido. ¡Nos vemos en el agua!</p>',

  '<h2>Learning to surf in Nosara</h2>
<p>If you''re thinking about learning to surf, Nosara is one of the best places in the world to do it. This guide will prepare you for your first experience in the water.</p>

<h2>Before entering the water</h2>
<h3>Choose the right board</h3>
<p>As a beginner, you''ll use a foam longboard. These boards are more stable, easier to paddle, and safer than shortboards. At Surfers Lab CR we provide 8-9 foot foam boards, ideal for learning.</p>

<h3>Learn the pop-up on land</h3>
<p>The pop-up is the movement of standing up on the board. Before entering the water, practice this movement on the sand:</p>
<ol>
<li>Lie face down on the board</li>
<li>Place your hands at chest level</li>
<li>Push up and bring your back foot to the center of the board</li>
<li>Front foot goes forward, knees bent</li>
<li>Keep your eyes forward, never look at your feet</li>
</ol>

<h2>In the water</h2>
<h3>How to paddle</h3>
<p>Paddling correctly is fundamental. Lie in the center of the board (not too far forward or back) and paddle with long, deep strokes, alternating arms as if swimming freestyle.</p>

<h3>How to catch a wave</h3>
<p>Your instructor will help you choose the right waves. When you see a wave coming:</p>
<ol>
<li>Point your board toward the beach</li>
<li>Start paddling hard before the wave reaches you</li>
<li>When you feel the wave pushing you, do the pop-up</li>
<li>Keep your knees bent and arms extended for balance</li>
</ol>

<h2>Water safety</h2>
<ul>
<li><strong>Never surf alone</strong> — especially as a beginner</li>
<li><strong>Respect priority rules</strong> — the surfer closest to the peak has priority</li>
<li><strong>Don''t let go of your board</strong> — your board can hit other surfers</li>
<li><strong>Know the currents</strong> — your instructor will teach you to identify them</li>
<li><strong>Use biodegradable sunscreen</strong> — protect your skin and the ocean</li>
</ul>

<h2>Common beginner mistakes</h2>
<ul>
<li>Looking at your feet instead of forward</li>
<li>Standing too straight (keep your knees bent)</li>
<li>Paddling too softly (paddle hard)</li>
<li>Choosing waves that are too big</li>
<li>Giving up after the first wipeout (everyone falls, that''s part of surfing)</li>
</ul>

<h2>Ready to surf?</h2>
<p>The best way to learn is with a certified instructor who guides you step by step. At Surfers Lab CR our instructors adapt each lesson to your level and give you personalized feedback so you progress quickly. See you in the water!</p>',

  'Guía de surf para principiantes en Nosara, Costa Rica. Tips, técnica del pop-up, seguridad en el agua y errores comunes al aprender a surfear en Playa Guiones.',
  'Beginner surf guide for Nosara, Costa Rica. Tips, pop-up technique, water safety, and common mistakes when learning to surf at Playa Guiones.',
  'beginner surf guide, learn to surf Nosara, aprender a surfear Nosara, surf tips Costa Rica, Playa Guiones beginners, surf techniques, guia surf principiantes',
  'Principiante aprendiendo a surfear en Playa Guiones, Nosara',
  'Beginner learning to surf at Playa Guiones, Nosara',
  true,
  now() - interval '6 days'
),

-- Article 4: Top surf spots in Guanacaste
(
  'top-surf-spots-guanacaste',
  'Mejores Playas para Surfear en Guanacaste, Costa Rica',
  'Top Surf Spots in Guanacaste, Costa Rica',
  'Las mejores playas para surfear en Guanacaste: Playa Guiones, Tamarindo, Santa Teresa y más. Nivel recomendado, tipo de ola y cómo llegar.',
  'The best beaches for surfing in Guanacaste: Playa Guiones, Tamarindo, Santa Teresa, and more. Recommended level, wave type, and how to get there.',
  '<h2>Surfear en Guanacaste</h2>
<p>Guanacaste, la provincia más al noroeste de Costa Rica, es un paraíso para surfistas. Con más de 100 kilómetros de costa en el Pacífico, ofrece playas para todos los niveles — desde principiantes hasta expertos.</p>

<h2>1. Playa Guiones, Nosara</h2>
<p><strong>Nivel:</strong> Principiante a intermedio<br>
<strong>Tipo de ola:</strong> Beach break, olas largas y consistentes<br>
<strong>Mejor época:</strong> Todo el año</p>
<p>Playa Guiones es considerada una de las mejores playas para aprender surf en toda Centroamérica. Su fondo de arena, olas consistentes y ambiente relajado la hacen perfecta para principiantes. También ofrece olas de calidad para surfistas intermedios que quieren mejorar su técnica.</p>

<h2>2. Playa Tamarindo</h2>
<p><strong>Nivel:</strong> Principiante a intermedio<br>
<strong>Tipo de ola:</strong> Beach break<br>
<strong>Mejor época:</strong> Diciembre a abril</p>
<p>Tamarindo es la playa de surf más conocida de Guanacaste. Tiene buena infraestructura turística, muchas escuelas de surf y olas suaves para principiantes. Sin embargo, puede estar muy concurrida en temporada alta.</p>

<h2>3. Playa Grande</h2>
<p><strong>Nivel:</strong> Intermedio a avanzado<br>
<strong>Tipo de ola:</strong> Beach break potente<br>
<strong>Mejor época:</strong> Septiembre a marzo</p>
<p>Justo al norte de Tamarindo, Playa Grande ofrece olas más grandes y potentes. Es parte del Parque Nacional Las Baulas, así que el ambiente es más salvaje y natural. No recomendada para principiantes.</p>

<h2>4. Witch''s Rock (Playa Naranjo)</h2>
<p><strong>Nivel:</strong> Intermedio a avanzado<br>
<strong>Tipo de ola:</strong> Beach break con picos definidos<br>
<strong>Mejor época:</strong> Mayo a noviembre</p>
<p>Dentro del Parque Nacional Santa Rosa, Witch''s Rock es una de las olas más famosas de Costa Rica. Solo se accede en bote desde Playas del Coco. Las olas pueden alcanzar los 10 pies y la experiencia es de surf en estado puro.</p>

<h2>5. Playa Avellanas</h2>
<p><strong>Nivel:</strong> Intermedio<br>
<strong>Tipo de ola:</strong> Beach break y point break<br>
<strong>Mejor época:</strong> Todo el año</p>
<p>Conocida por "Little Hawaii", Playa Avellanas tiene olas de calidad con menos gente que Tamarindo. El point break ofrece olas largas que son un placer para surfistas intermedios.</p>

<h2>¿Cuál playa elegir?</h2>
<p>Si eres <strong>principiante</strong>, Playa Guiones en Nosara es tu mejor opción: olas consistentes, fondo de arena seguro, y un pueblo con la vibra perfecta para un viaje de surf. Si eres <strong>intermedio o avanzado</strong>, Playa Grande y Witch''s Rock te van a dar las olas que buscas.</p>

<h2>Surfea con nosotros en Nosara</h2>
<p>En Surfers Lab CR te ofrecemos clases de surf, video análisis y surf trips en Playa Guiones, Nosara. Ya sea tu primera ola o tu ola número mil, estamos aquí para ayudarte a mejorar. ¡Reserva tu clase hoy!</p>',

  '<h2>Surfing in Guanacaste</h2>
<p>Guanacaste, Costa Rica''s northwesternmost province, is a surfer''s paradise. With over 100 kilometers of Pacific coastline, it offers beaches for all levels — from beginners to experts.</p>

<h2>1. Playa Guiones, Nosara</h2>
<p><strong>Level:</strong> Beginner to intermediate<br>
<strong>Wave type:</strong> Beach break, long and consistent waves<br>
<strong>Best time:</strong> Year-round</p>
<p>Playa Guiones is considered one of the best beaches to learn surfing in all of Central America. Its sandy bottom, consistent waves, and relaxed vibe make it perfect for beginners. It also offers quality waves for intermediate surfers looking to improve their technique.</p>

<h2>2. Playa Tamarindo</h2>
<p><strong>Level:</strong> Beginner to intermediate<br>
<strong>Wave type:</strong> Beach break<br>
<strong>Best time:</strong> December to April</p>
<p>Tamarindo is Guanacaste''s most famous surf beach. It has good tourist infrastructure, many surf schools, and gentle waves for beginners. However, it can get very crowded during high season.</p>

<h2>3. Playa Grande</h2>
<p><strong>Level:</strong> Intermediate to advanced<br>
<strong>Wave type:</strong> Powerful beach break<br>
<strong>Best time:</strong> September to March</p>
<p>Just north of Tamarindo, Playa Grande offers bigger and more powerful waves. It''s part of Las Baulas National Park, so the environment is wilder and more natural. Not recommended for beginners.</p>

<h2>4. Witch''s Rock (Playa Naranjo)</h2>
<p><strong>Level:</strong> Intermediate to advanced<br>
<strong>Wave type:</strong> Beach break with defined peaks<br>
<strong>Best time:</strong> May to November</p>
<p>Inside Santa Rosa National Park, Witch''s Rock is one of the most famous waves in Costa Rica. It''s only accessible by boat from Playas del Coco. Waves can reach 10 feet and the experience is surfing at its purest.</p>

<h2>5. Playa Avellanas</h2>
<p><strong>Level:</strong> Intermediate<br>
<strong>Wave type:</strong> Beach break and point break<br>
<strong>Best time:</strong> Year-round</p>
<p>Known for "Little Hawaii," Playa Avellanas has quality waves with fewer crowds than Tamarindo. The point break offers long waves that are a pleasure for intermediate surfers.</p>

<h2>Which beach to choose?</h2>
<p>If you''re a <strong>beginner</strong>, Playa Guiones in Nosara is your best bet: consistent waves, safe sandy bottom, and a town with the perfect vibe for a surf trip. If you''re <strong>intermediate or advanced</strong>, Playa Grande and Witch''s Rock will give you the waves you''re looking for.</p>

<h2>Surf with us in Nosara</h2>
<p>At Surfers Lab CR we offer surf lessons, video analysis, and surf trips at Playa Guiones, Nosara. Whether it''s your first wave or your thousandth, we''re here to help you improve. Book your lesson today!</p>',

  'Mejores playas para surfear en Guanacaste, Costa Rica. Guía de Playa Guiones, Tamarindo, Playa Grande, Witch''s Rock y Avellanas con nivel y tipo de ola.',
  'Best surf beaches in Guanacaste, Costa Rica. Guide to Playa Guiones, Tamarindo, Playa Grande, Witch''s Rock, and Avellanas with level and wave type.',
  'surf spots Guanacaste, best surf beaches Costa Rica, Playa Guiones surf, Tamarindo surf, mejores playas surf Costa Rica, surf Guanacaste, where to surf Costa Rica',
  'Vista aérea de Playa Guiones, Nosara — Guanacaste, Costa Rica',
  'Aerial view of Playa Guiones, Nosara — Guanacaste, Costa Rica',
  true,
  now() - interval '8 days'
);
