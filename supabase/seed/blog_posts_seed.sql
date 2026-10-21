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

-- Article 3: Why take surf lessons (replaces beginner guide)
(
  'why-take-surf-lessons-nosara',
  '5 Razones para Tomar Clases de Surf en Nosara',
  '5 Reasons to Take Surf Lessons in Nosara',
  'Descubre por qué tomar clases de surf con un instructor certificado en Nosara hace toda la diferencia. Seguridad, progreso rápido y la mejor experiencia.',
  'Discover why taking surf lessons with a certified instructor in Nosara makes all the difference. Safety, fast progress, and the best experience.',
  '<h2>¿Por qué tomar clases de surf en Nosara?</h2>
<p>Nosara es uno de los destinos de surf más populares del mundo, y miles de viajeros llegan cada año con la ilusión de pararse en una tabla por primera vez. Pero hay una gran diferencia entre intentarlo solo y hacerlo con un instructor profesional. Estas son las 5 razones por las que tomar clases de surf transforma tu experiencia.</p>

<h2>1. Seguridad en el océano</h2>
<p>El océano es impredecible. Las corrientes, las mareas y el oleaje cambian constantemente. Un instructor certificado conoce las condiciones de Playa Guiones como la palma de su mano:</p>
<ul>
<li><strong>Identifica corrientes de resaca</strong> y te enseña cómo reaccionar si quedas atrapado</li>
<li><strong>Elige el punto exacto</strong> donde las olas son seguras para tu nivel</li>
<li><strong>Está contigo en el agua</strong> en todo momento, listo para ayudarte</li>
<li><strong>Conoce los protocolos de emergencia</strong> — la seguridad siempre es prioridad</li>
</ul>
<p>Surfear sin experiencia y sin guía es un riesgo innecesario. Con un instructor, puedes concentrarte en disfrutar sabiendo que estás en buenas manos.</p>

<h2>2. Progresas mucho más rápido</h2>
<p>¿Sabías que la mayoría de personas que intentan surfear solas tardan semanas en lograr lo que un estudiante con instructor logra en una sola clase? La razón es simple:</p>
<ul>
<li>Tu instructor te da <strong>feedback en tiempo real</strong> — corrige tu postura, tu timing y tu técnica mientras surfeas</li>
<li>Te enseña la <strong>técnica correcta desde el inicio</strong>, evitando malos hábitos que luego son difíciles de corregir</li>
<li>Elige las <strong>olas perfectas para tu nivel</strong> — ni muy grandes ni muy pequeñas</li>
</ul>
<p>El resultado: la mayoría de nuestros estudiantes se paran en la tabla en su primera clase. Ese momento de euforia es algo que recordarás para siempre.</p>

<h2>3. El equipo correcto marca la diferencia</h2>
<p>No todas las tablas son iguales. Un principiante necesita una tabla específica para su peso, altura y nivel de experiencia. Cuando tomas clases:</p>
<ul>
<li>Recibes una <strong>tabla de espuma del tamaño ideal</strong> para aprender — estable, segura y fácil de manejar</li>
<li>Te proporcionamos <strong>rash guard</strong> para protegerte del sol y la tabla</li>
<li>No necesitas invertir en equipo costoso — nosotros lo tenemos todo</li>
</ul>

<h2>4. Entiendes y respetas el océano</h2>
<p>Surfear no es solo pararse en una tabla. Es conectar con el océano. Un buen instructor te enseña:</p>
<ul>
<li>Las <strong>reglas de etiqueta del surf</strong> — quién tiene prioridad, cómo compartir las olas</li>
<li>Cómo <strong>leer las olas y las corrientes</strong> — un conocimiento que te sirve para toda la vida</li>
<li>La importancia de <strong>proteger el medio ambiente</strong> — usar protector solar biodegradable y respetar la vida marina</li>
</ul>
<p>Este conocimiento no lo encuentras en un video de YouTube. Se aprende en el agua, con alguien que tiene años de experiencia.</p>

<h2>5. Es la experiencia completa de Nosara</h2>
<p>Tomar una clase de surf en Nosara no es solo aprender un deporte — es vivir una experiencia. Es sentir la arena bajo tus pies en Playa Guiones, ver el atardecer desde el lineup, y compartir el stoke con tu instructor y otros estudiantes.</p>
<p>Nuestros instructores son locales que aman lo que hacen. Conocen cada rincón de esta playa y te van a hacer sentir como en casa desde el primer momento.</p>

<h2>Reserva tu clase hoy</h2>
<p>No dejes la mejor experiencia de tu viaje al azar. Reserva tu clase de surf en Surfers Lab CR y descubre por qué Nosara es el mejor lugar del mundo para aprender a surfear. ¡Te esperamos en el agua!</p>',

  '<h2>Why take surf lessons in Nosara?</h2>
<p>Nosara is one of the world''s most popular surf destinations, and thousands of travelers arrive each year dreaming of standing on a surfboard for the first time. But there''s a huge difference between trying it alone and doing it with a professional instructor. Here are 5 reasons why taking surf lessons transforms your experience.</p>

<h2>1. Ocean safety</h2>
<p>The ocean is unpredictable. Currents, tides, and swell change constantly. A certified instructor knows Playa Guiones conditions like the back of their hand:</p>
<ul>
<li><strong>Identifies rip currents</strong> and teaches you how to react if caught in one</li>
<li><strong>Chooses the exact spot</strong> where waves are safe for your level</li>
<li><strong>Is with you in the water</strong> at all times, ready to help</li>
<li><strong>Knows emergency protocols</strong> — safety is always the priority</li>
</ul>
<p>Surfing without experience and without guidance is an unnecessary risk. With an instructor, you can focus on having fun knowing you''re in good hands.</p>

<h2>2. You progress much faster</h2>
<p>Did you know that most people who try surfing alone take weeks to achieve what a student with an instructor achieves in a single lesson? The reason is simple:</p>
<ul>
<li>Your instructor gives you <strong>real-time feedback</strong> — correcting your posture, timing, and technique as you surf</li>
<li>Teaches you the <strong>correct technique from the start</strong>, avoiding bad habits that are hard to fix later</li>
<li>Chooses the <strong>perfect waves for your level</strong> — not too big, not too small</li>
</ul>
<p>The result: most of our students stand up on the board in their first lesson. That moment of pure joy is something you''ll remember forever.</p>

<h2>3. The right equipment makes all the difference</h2>
<p>Not all surfboards are the same. A beginner needs a specific board for their weight, height, and experience level. When you take lessons:</p>
<ul>
<li>You get an <strong>ideal-sized foam board</strong> for learning — stable, safe, and easy to handle</li>
<li>We provide a <strong>rash guard</strong> to protect you from the sun and board</li>
<li>No need to invest in expensive gear — we have everything</li>
</ul>

<h2>4. You understand and respect the ocean</h2>
<p>Surfing isn''t just about standing on a board. It''s about connecting with the ocean. A good instructor teaches you:</p>
<ul>
<li><strong>Surf etiquette rules</strong> — who has priority, how to share waves</li>
<li>How to <strong>read waves and currents</strong> — knowledge that serves you for life</li>
<li>The importance of <strong>protecting the environment</strong> — using biodegradable sunscreen and respecting marine life</li>
</ul>
<p>This knowledge isn''t found in a YouTube video. It''s learned in the water, with someone who has years of experience.</p>

<h2>5. It''s the complete Nosara experience</h2>
<p>Taking a surf lesson in Nosara isn''t just learning a sport — it''s living an experience. It''s feeling the sand under your feet at Playa Guiones, watching the sunset from the lineup, and sharing the stoke with your instructor and other students.</p>
<p>Our instructors are locals who love what they do. They know every corner of this beach and will make you feel at home from the very first moment.</p>

<h2>Book your lesson today</h2>
<p>Don''t leave the best experience of your trip to chance. Book your surf lesson at Surfers Lab CR and discover why Nosara is the best place in the world to learn to surf. We''ll see you in the water!</p>',

  '5 razones para tomar clases de surf en Nosara con un instructor certificado. Seguridad, progreso rápido, equipo profesional y la experiencia completa en Playa Guiones.',
  '5 reasons to take surf lessons in Nosara with a certified instructor. Safety, fast progress, professional equipment, and the complete experience at Playa Guiones.',
  'surf lessons Nosara, why take surf lessons, clases de surf Nosara, surf instructor Nosara, learn to surf Costa Rica, surf school Playa Guiones, Nosara surf experience',
  'Instructor de surf enseñando en Playa Guiones, Nosara — Surfers Lab CR',
  'Surf instructor teaching at Playa Guiones, Nosara — Surfers Lab CR',
  true,
  now() - interval '6 days'
),

-- Article 4: Things to do in Nosara (replaces Guanacaste spots comparison)
(
  'things-to-do-nosara-costa-rica',
  'Qué Hacer en Nosara, Costa Rica — Surf, Naturaleza y Aventura',
  'Things to Do in Nosara, Costa Rica — Surf, Nature & Adventure',
  'Guía completa de actividades en Nosara: surf, yoga, vida silvestre, playas y aventura. Todo lo que necesitas para planear tu viaje a este paraíso de Guanacaste.',
  'Complete guide to activities in Nosara: surfing, yoga, wildlife, beaches, and adventure. Everything you need to plan your trip to this Guanacaste paradise.',
  '<h2>Nosara: mucho más que surf</h2>
<p>Nosara, ubicada en la costa del Pacífico de Guanacaste, Costa Rica, es conocida mundialmente por sus olas. Pero este pueblo tiene mucho más que ofrecer. Ya sea que vengas a surfear, a relajarte o a explorar la naturaleza, aquí vas a encontrar algo que te enamore.</p>

<h2>Surf en Playa Guiones</h2>
<p>Obviamente, el surf es la actividad estrella de Nosara. Playa Guiones ofrece olas consistentes todo el año, fondo de arena seguro y condiciones ideales para todos los niveles. Es una de las playas más respetadas de Centroamérica para aprender y mejorar tu surf.</p>
<p>Si es tu primera vez, tomar una clase con un instructor local es la mejor forma de empezar. No solo aprendes la técnica correcta desde el día uno, sino que también conoces el océano de la mano de alguien que lleva años surfeando estas olas.</p>

<h2>Yoga y bienestar</h2>
<p>Nosara es uno de los centros de yoga más reconocidos de Latinoamérica. Encontrarás:</p>
<ul>
<li><strong>Estudios de yoga</strong> con clases diarias para todos los niveles</li>
<li><strong>Retiros de bienestar</strong> que combinan yoga, meditación y surf</li>
<li><strong>Terapias holísticas</strong> — masajes, acupuntura y medicina natural</li>
</ul>
<p>La combinación de surf por la mañana y yoga por la tarde es la rutina clásica de Nosara. Tu cuerpo y tu mente te lo van a agradecer.</p>

<h2>Naturaleza y vida silvestre</h2>
<p>Nosara está rodeada de reservas biológicas y bosques tropicales. Las experiencias que no te puedes perder:</p>
<ul>
<li><strong>Refugio Nacional de Vida Silvestre Ostional</strong> — Uno de los pocos lugares del mundo donde puedes ver la arribada masiva de tortugas lora (julio a noviembre)</li>
<li><strong>Reserva Biológica Nosara</strong> — Senderos entre manglares con monos aulladores, iguanas y más de 250 especies de aves</li>
<li><strong>Playa Pelada</strong> — Una playa más tranquila y rocosa, perfecta para atardeceres y pozas de marea</li>
</ul>

<h2>Aventura y actividades al aire libre</h2>
<p>Si buscas adrenalina más allá del surf, Nosara tiene opciones:</p>
<ul>
<li><strong>Kayak y paddleboard</strong> en el río Nosara y la costa</li>
<li><strong>Canopy y tirolesas</strong> sobre el bosque tropical</li>
<li><strong>Horseback riding</strong> por la playa al atardecer</li>
<li><strong>Snorkeling</strong> en las pozas de Playa Pelada</li>
<li><strong>Mountain biking</strong> por los senderos de montaña</li>
</ul>

<h2>Gastronomía local</h2>
<p>Nosara tiene una escena gastronómica sorprendente para un pueblo pequeño:</p>
<ul>
<li>Restaurantes con cocina internacional y fusión</li>
<li>Sodas locales con el mejor casado y gallo pinto de Guanacaste</li>
<li>Cafeterías con café costarricense de altura</li>
<li>Ferias de productores locales con frutas tropicales frescas</li>
</ul>

<h2>Planea tu viaje a Nosara</h2>
<p>Nosara está a unas 5 horas en carro desde San José, o puedes tomar un vuelo local de 35 minutos al aeródromo de Nosara. La mejor época para visitar depende de lo que busques — la temporada seca (diciembre a abril) tiene sol garantizado, mientras que la temporada verde (mayo a noviembre) trae las mejores olas y menos turistas.</p>
<p>Lo que hace especial a Nosara es su equilibrio: naturaleza virgen, comunidad acogedora y un ritmo de vida que te invita a desconectarte. Ven a descubrirlo por ti mismo.</p>

<h2>Empieza por el surf</h2>
<p>Si el surf está en tu lista, empieza tu viaje con una clase en Playa Guiones. En Surfers Lab CR te recibimos con los brazos abiertos y te ayudamos a vivir la experiencia completa de Nosara. ¡Reserva tu clase y nos vemos en el agua!</p>',

  '<h2>Nosara: much more than surfing</h2>
<p>Nosara, located on the Pacific coast of Guanacaste, Costa Rica, is known worldwide for its waves. But this town has much more to offer. Whether you come to surf, relax, or explore nature, you''ll find something to fall in love with here.</p>

<h2>Surfing at Playa Guiones</h2>
<p>Obviously, surfing is Nosara''s star activity. Playa Guiones offers consistent waves year-round, a safe sandy bottom, and ideal conditions for all levels. It''s one of the most respected beaches in Central America for learning and improving your surfing.</p>
<p>If it''s your first time, taking a lesson with a local instructor is the best way to start. You''ll not only learn proper technique from day one, but you''ll also get to know the ocean guided by someone who has been surfing these waves for years.</p>

<h2>Yoga and wellness</h2>
<p>Nosara is one of the most recognized yoga centers in Latin America. You''ll find:</p>
<ul>
<li><strong>Yoga studios</strong> with daily classes for all levels</li>
<li><strong>Wellness retreats</strong> combining yoga, meditation, and surfing</li>
<li><strong>Holistic therapies</strong> — massages, acupuncture, and natural medicine</li>
</ul>
<p>The combination of surfing in the morning and yoga in the afternoon is the classic Nosara routine. Your body and mind will thank you.</p>

<h2>Nature and wildlife</h2>
<p>Nosara is surrounded by biological reserves and tropical forests. Must-do experiences:</p>
<ul>
<li><strong>Ostional National Wildlife Refuge</strong> — One of the few places in the world where you can witness the massive olive ridley sea turtle arrival (July to November)</li>
<li><strong>Nosara Biological Reserve</strong> — Trails through mangroves with howler monkeys, iguanas, and over 250 bird species</li>
<li><strong>Playa Pelada</strong> — A quieter, rocky beach perfect for sunsets and tide pools</li>
</ul>

<h2>Adventure and outdoor activities</h2>
<p>If you''re looking for adrenaline beyond surfing, Nosara has options:</p>
<ul>
<li><strong>Kayaking and paddleboarding</strong> on the Nosara River and coast</li>
<li><strong>Canopy and ziplines</strong> over the tropical forest</li>
<li><strong>Horseback riding</strong> on the beach at sunset</li>
<li><strong>Snorkeling</strong> in the tide pools at Playa Pelada</li>
<li><strong>Mountain biking</strong> on mountain trails</li>
</ul>

<h2>Local cuisine</h2>
<p>Nosara has a surprisingly good food scene for a small town:</p>
<ul>
<li>Restaurants with international and fusion cuisine</li>
<li>Local sodas with the best casado and gallo pinto in Guanacaste</li>
<li>Coffee shops with Costa Rican highland coffee</li>
<li>Local farmers'' markets with fresh tropical fruits</li>
</ul>

<h2>Plan your trip to Nosara</h2>
<p>Nosara is about a 5-hour drive from San José, or you can take a 35-minute local flight to the Nosara airstrip. The best time to visit depends on what you''re looking for — the dry season (December to April) has guaranteed sunshine, while the green season (May to November) brings the best waves and fewer tourists.</p>
<p>What makes Nosara special is its balance: pristine nature, welcoming community, and a pace of life that invites you to disconnect. Come discover it for yourself.</p>

<h2>Start with surfing</h2>
<p>If surfing is on your list, start your trip with a lesson at Playa Guiones. At Surfers Lab CR we welcome you with open arms and help you live the complete Nosara experience. Book your lesson and we''ll see you in the water!</p>',

  'Qué hacer en Nosara, Costa Rica. Guía de actividades: surf, yoga, naturaleza, vida silvestre, aventura y gastronomía en este paraíso de Guanacaste.',
  'Things to do in Nosara, Costa Rica. Activity guide: surfing, yoga, nature, wildlife, adventure, and cuisine in this Guanacaste paradise.',
  'things to do Nosara, Nosara Costa Rica activities, Nosara travel guide, que hacer en Nosara, surf Nosara, yoga Nosara, Playa Guiones, Nosara wildlife, Nosara adventure',
  'Atardecer en Playa Guiones, Nosara — Costa Rica',
  'Sunset at Playa Guiones, Nosara — Costa Rica',
  true,
  now() - interval '8 days'
);
