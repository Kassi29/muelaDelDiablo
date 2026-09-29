import type { StoryId } from './stories';

export type ArtCrop = 'portrait-left' | 'portrait-right' | 'landscape-bottom' | 'landscape-top' | 'quadrant-top-right' | 'full';

export interface ReaderPage {
  image: number;
  crop: ArtCrop;
  /** Porcentaje superior que se oculta cuando el texto está encima de la ilustración. */
  cutoff?: number;
  chapter: string;
  title: string;
  imageAlt: string;
  paragraphs: string[];
  prompt: string;
  discovery: string;
}

export interface ReaderBook {
  shortTitle: string;
  pages: ReaderPage[];
}

/** Relatos breves para lectura infantil; las imágenes originales se muestran solo mediante recortes CSS. */
export const readerBooks: Record<StoryId, ReaderBook> = {
  'la-muela': {
    shortTitle: 'La Muela del Diablo',
    pages: [
      {
        image: 1, crop: 'portrait-left', chapter: 'Una noche en el valle', title: 'Un plan bajo la Luna',
        imageAlt: 'Dos diablos observan a un dinosaurito dormido bajo la Luna.',
        paragraphs: [
          'Hace muchísimo tiempo, los dinosaurios vivían tranquilos en el valle que hoy conocemos como Valle de la Luna.',
          'Una noche, unos diablos enormes se reunieron entre las rocas. Querían apoderarse del lugar y asustar a sus habitantes.',
          'Mientras los diablos preparaban su plan, un pequeño dinosaurio dormía sin sospechar nada.',
        ],
        prompt: 'Descubre quién vigila el valle', discovery: 'Los dos diablos se escondían detrás de las rocas.',
      },
      {
        image: 2, crop: 'full', chapter: 'El gran susto', title: 'El valle se despertó',
        imageAlt: 'Un dinosaurio verde se enfrenta a un diablo de traje rojo.',
        paragraphs: [
          'Al día siguiente, los diablos aparecieron de repente. Saltaban entre las piedras y el suelo retumbaba a cada paso.',
          'Los dinosaurios se sorprendieron, pero pronto comenzaron a defender su hogar. El valle se llenó de carreras y rugidos.',
          'Entre todos ellos había un dinosaurito que, aunque tenía miedo, no quería dejar solos a sus amigos.',
        ],
        prompt: 'Dale valor al dinosaurito', discovery: 'Ser valiente también significa actuar cuando tenemos miedo.',
      },
      {
        image: 3, crop: 'landscape-bottom', cutoff: 52, chapter: 'Un momento decisivo', title: 'La muela del diablo',
        imageAlt: 'El dinosaurito verde se aferra al diablo, que abre mucho la boca.',
        paragraphs: [
          'Uno de los diablos se acercó demasiado al dinosaurito. Él se aferró con todas sus fuerzas a una de sus grandes muelas.',
          'Tiró y tiró hasta que, de pronto, la muela se soltó. ¡El propio dinosaurito quedó sorprendido!',
          'El diablo salió corriendo y los demás, al verlo huir, decidieron seguirlo.',
        ],
        prompt: 'Mira qué encontró el dinosaurito', discovery: '¡Una muela enorme entre sus pequeñas garras!',
      },
      {
        image: 4, crop: 'portrait-left', chapter: 'La huella que quedó', title: 'Una montaña con historia',
        imageAlt: 'Un dinosaurito descansa frente a una enorme roca con forma de muela.',
        paragraphs: [
          'Los diablos no volvieron al valle. El pequeño dinosaurio había logrado espantarlos y sus compañeros lo recordaron por su valentía.',
          'Muchos dinosaurios habían sufrido durante aquel ataque. Los que quedaron colocaron la gran muela en la tierra para recordar lo ocurrido.',
          'Cuenta la leyenda que aquella muela sigue allí, firme como una montaña, y que por eso el lugar se llama La Muela del Diablo.',
        ],
        prompt: 'Haz brillar la montaña', discovery: 'Una roca puede guardar una historia durante muchísimo tiempo.',
      },
    ],
  },
  'la-nina': {
    shortTitle: 'La Niña y el Espejo',
    pages: [
      {
        image: 1, crop: 'portrait-left', chapter: 'Un reino en las colinas', title: 'Más allá del palacio',
        imageAlt: 'Una reina y un rey se encuentran en las colinas bajo su castillo.',
        paragraphs: [
          'En lo alto de unas colinas vivían una reina, un rey y sus dos hijos. Desde su castillo se veían caminos que llegaban hasta el valle.',
          'Los reyes solían viajar para conocer a la gente. Un día descubrieron que, abajo, muchas familias trabajaban mucho y aun así tenían poco para comer.',
          'La sequía hacía la vida todavía más difícil. Los reyes quisieron ayudar.',
        ],
        prompt: 'Observa el castillo', discovery: 'Desde la colina se veía un mundo muy distinto al del palacio.',
      },
      {
        image: 2, crop: 'landscape-bottom', cutoff: 55, chapter: 'Una niña necesita ayuda', title: 'El campo de lechugas',
        imageAlt: 'Una niña agotada descansa en el césped de un campo.',
        paragraphs: [
          'Una niña del valle había trabajado tanto que cayó agotada en un campo de lechugas.',
          'La reina y el rey la encontraron allí. La levantaron con cuidado, la abrigaron y la llevaron al palacio para que pudiera descansar y recuperarse.',
          'Decidieron recibirla como parte de su familia.',
        ],
        prompt: 'Envía un poco de cuidado', discovery: 'La niña necesitaba descanso, comida y personas que la cuidaran.',
      },
      {
        image: 3, crop: 'full', chapter: 'Un secreto equivocado', title: 'Los espejos desaparecen',
        imageAlt: 'Dos jóvenes de la familia real caminan preocupados frente al castillo.',
        paragraphs: [
          'En el palacio, los reyes temían que alguien se burlara del aspecto de la niña. Pensaron que podían protegerla escondiendo todos los espejos.',
          'Sus hijos les pidieron que no lo hicieran, pero los reyes ordenaron retirarlos de todo el reino.',
          'Pronto todos empezaron a fingir y a decir cosas que no sentían. Aquel secreto hizo que la familia se sintiera cada vez más sola.',
        ],
        prompt: 'Descubre el secreto', discovery: 'Esconder la verdad no ayudó a nadie a sentirse mejor.',
      },
      {
        image: 4, crop: 'landscape-bottom', cutoff: 57, chapter: 'Años de silencio', title: 'Las palabras que faltaban',
        imageAlt: 'Un espejo roto yace sobre el suelo del palacio.',
        paragraphs: [
          'Pasaron los años sin espejos. En el palacio, las personas tenían miedo de decir lo que pensaban con sinceridad.',
          'Los hermanos de la nueva princesa se fueron entristeciendo. Ella, por su parte, se acostumbró a recibir halagos y empezó a tratar mal a los demás.',
          'Nadie se atrevía a decirle que sus palabras podían hacer daño.',
        ],
        prompt: 'Piensa en una palabra amable', discovery: 'La sinceridad puede decirse con respeto y cariño.',
      },
      {
        image: 5, crop: 'landscape-bottom', cutoff: 52, chapter: 'Una visita al palacio', title: 'La oportunidad negada',
        imageAlt: 'La joven princesa hace un gesto de enojo dentro del palacio.',
        paragraphs: [
          'Un día llegó una muchacha del valle. Buscaba trabajo para ayudar a su familia y pidió una oportunidad en la cocina.',
          'La princesa se burló de ella y la mandó marcharse sin escucharla. Un consejero del rey vio lo ocurrido y sintió que era hora de intervenir.',
          'Quería que la princesa aprendiera a mirar a los demás con más atención.',
        ],
        prompt: 'Dale una oportunidad a la muchacha', discovery: 'Todas las personas merecen ser escuchadas con respeto.',
      },
      {
        image: 6, crop: 'portrait-left', chapter: 'Un objeto desconocido', title: 'El vendedor de espejos',
        imageAlt: 'Una muchacha del valle está de pie en una sala del palacio.',
        paragraphs: [
          'El consejero invitó al palacio a un niño que vendía espejos. La princesa nunca había visto uno y se acercó con mucha curiosidad.',
          'Al principio se asustó al descubrir su propio reflejo. Miró de nuevo, con calma, y empezó a pensar en cómo había tratado a la muchacha.',
          'Comprendió que lo importante no era su apariencia, sino la manera en que trataba a los demás.',
        ],
        prompt: 'Mira más allá del reflejo', discovery: 'Un espejo muestra un rostro; nuestras acciones muestran cómo cuidamos a otros.',
      },
      {
        image: 7, crop: 'portrait-right', chapter: 'Un nuevo comienzo', title: 'Bajar al valle',
        imageAlt: 'La princesa mira su reflejo en un espejo de marco dorado.',
        paragraphs: [
          'La princesa quiso disculparse con la muchacha. Bajó por primera vez de la colina y vio de cerca las dificultades que vivían muchas familias.',
          'Entonces decidió quedarse un tiempo para ayudar y aprender de la gente del valle.',
          'El espejo la había hecho detenerse. Escuchar a los demás le ayudó a cambiar.',
        ],
        prompt: 'Haz brillar el espejo', discovery: 'Cambiar empieza cuando reconocemos a quienes tenemos delante.',
      },
    ],
  },
  'conejito-lloron': {
    shortTitle: 'El Conejito Llorón',
    pages: [
      {
        image: 1, crop: 'quadrant-top-right', chapter: 'Una familia en el bosque', title: 'Lágrimas escondidas',
        imageAlt: 'La familia de conejitos se reúne junto a un árbol del bosque.',
        paragraphs: [
          'En un bosque fresco vivía un conejito con sus padres y sus hermanitas. Pasaban los días jugando y saltando entre los árboles.',
          'Cuando sus hermanas se lastimaban, podían llorar y recibían consuelo. Pero si él lloraba, su papá le decía que los conejitos machos no debían hacerlo.',
          'El conejito guardaba sus lágrimas, aunque por dentro se sentía triste.',
        ],
        prompt: 'Dile algo amable al conejito', discovery: 'Llorar es una forma de expresar lo que sentimos.',
      },
      {
        image: 2, crop: 'landscape-bottom', cutoff: 54, chapter: 'Un día de campo', title: 'La liebre gigante',
        imageAlt: 'Una liebre grande asusta a la familia de conejitos en el bosque.',
        paragraphs: [
          'Un día la familia salió de paseo. El sol calentaba el bosque y las mariposas revoloteaban entre las flores.',
          'De pronto apareció una liebre gigante y se llevó a una de las hermanitas. Dijo que la devolvería si le traían cinco sacos de zanahorias.',
          'La familia se asustó. ¿Cómo conseguir tantas zanahorias?',
        ],
        prompt: 'Acompaña a la familia', discovery: 'Estar juntos ayuda cuando aparece un problema difícil.',
      },
      {
        image: 3, crop: 'landscape-bottom', cutoff: 55, chapter: 'Un poder inesperado', title: 'Las zanahorias mágicas',
        imageAlt: 'El conejito llora y crecen zanahorias enormes a su alrededor.',
        paragraphs: [
          'El conejito quería mucho a su hermana. Esta vez dejó salir sus lágrimas sin preocuparse por lo que pensaran los demás.',
          'Cuando las gotas tocaron la tierra, comenzaron a brotar zanahorias por todas partes. ¡Cada vez aparecían más!',
          'La liebre se sorprendió, soltó a la conejita y huyó del bosque.',
        ],
        prompt: 'Haz crecer las zanahorias', discovery: 'Aquellas lágrimas hicieron brotar algo maravilloso.',
      },
      {
        image: 4, crop: 'landscape-top', chapter: 'Una fiesta para todos', title: 'Llorar también está bien',
        imageAlt: 'La familia de conejitos celebra reunida alrededor de zanahorias gigantes.',
        paragraphs: [
          'La hermanita volvió corriendo a los brazos de su familia. Todos abrazaron al conejito y le dieron las gracias.',
          'Su papá reconoció su error y le pidió disculpas. Desde entonces, el conejito pudo llorar cuando estaba triste, feliz o emocionado.',
          'Después celebraron con un gran banquete de zanahorias preparadas de muchas maneras.',
        ],
        prompt: 'Únete a la celebración', discovery: 'Sentir y expresar emociones es para todos.',
      },
    ],
  },
  quirquinchos: {
    shortTitle: 'Los Quirquinchos de San Pedro',
    pages: [
      {
        image: 1, crop: 'portrait-right', chapter: 'Bajo la arena', title: 'Una familia escucha pasos',
        imageAlt: 'Una familia de quirquinchos escucha a un hombre y un niño desde su guarida.',
        paragraphs: [
          'Cerca de Oruro, una familia de cinco quirquinchos vivía en una guarida bajo la arena. Allí se protegían del calor del día y del frío de la noche.',
          'Una mañana escucharon pasos sobre sus cabezas. Un padre le decía a su hijo que quería atrapar un quirquincho para hacerle un charango.',
          'La familia se quedó muy quieta. Debían pensar cómo ponerse a salvo.',
        ],
        prompt: 'Ayuda a guardar silencio', discovery: 'Debajo de la arena, los cinco escuchaban cada palabra.',
      },
      {
        image: 2, crop: 'full', chapter: 'Pensar en familia', title: 'Una idea para protegerse',
        imageAlt: 'Los cinco quirquinchos conversan alrededor de una mesa bajo tierra.',
        paragraphs: [
          'Los quirquinchitos estaban asustados. Sabían que algunas personas querían usar sus caparazones para fabricar instrumentos.',
          'Su mamá les recordó que lamentarse no bastaba: necesitaban una idea. El papá pidió que todos hablaran y escucharan.',
          'Sentados juntos en su guarida, comenzaron a pensar en un plan.',
        ],
        prompt: 'Piensa con los quirquinchos', discovery: 'Las mejores ideas a veces nacen cuando todos colaboran.',
      },
      {
        image: 3, crop: 'landscape-bottom', cutoff: 47, chapter: 'El motivo del peligro', title: 'El charango',
        imageAlt: 'Un charango dibujado sobre la arena.',
        paragraphs: [
          'El hombre quería un caparazón porque creía que así su charango sonaría mejor. A los quirquinchos les parecía muy injusto arriesgar la vida por eso.',
          'Tenían que salir a buscar comida, pero tampoco podían dejarse atrapar.',
          'La mamá tuvo una idea. Se acercó a los demás y se la contó en voz baja.',
        ],
        prompt: 'Escucha el plan secreto', discovery: 'Se esconderían y aparecerían en lugares distintos del arenal.',
      },
      {
        image: 4, crop: 'landscape-bottom', cutoff: 57, chapter: 'Todos tienen un papel', title: 'Un plan en equipo',
        imageAlt: 'La familia de quirquinchos se reúne para poner en marcha su plan.',
        paragraphs: [
          'Cada quirquincho tomó una posición bajo la arena. La mamá se quedó cerca del más pequeño y los otros se alejaron por el arenal.',
          'A una señal, asomarían la cabeza por un instante y volverían a esconderse.',
          'Aunque tenían miedo, sabían que podían confiar unos en otros.',
        ],
        prompt: 'Dales valor a todos', discovery: 'Ninguno estaba solo: eran un equipo.',
      },
      {
        image: 5, crop: 'landscape-bottom', cutoff: 55, chapter: 'Cabezas en la arena', title: '¡Por aquí! ¡Por allá!',
        imageAlt: 'El hombre corre entre los agujeros mientras el niño señala a los quirquinchos.',
        paragraphs: [
          '«¡Allí hay uno!», gritó el niño. Su padre corrió hasta el lugar, pero el quirquincho ya se había escondido.',
          'Entonces apareció otra cabecita al otro lado. El hombre fue y vino por la arena, sin alcanzar a ninguno.',
          'Corrió tanto que terminó completamente agotado.',
        ],
        prompt: 'Busca la próxima cabecita', discovery: 'Los quirquinchos eran rapidísimos para esconderse.',
      },
      {
        image: 6, crop: 'portrait-left', chapter: 'Una promesa nueva', title: 'Cuidar a los animales',
        imageAlt: 'El hombre descansa en la arena mientras el niño y los quirquinchos lo observan.',
        paragraphs: [
          'El hombre se desmayó de cansancio y su hijo se asustó. Al verlo, los quirquinchos salieron de sus escondites.',
          'Cavaron un lugar fresco para que pudiera recuperarse. El niño comprendió que aquella familia solo quería vivir en paz.',
          'Cuando su padre despertó, el niño prometió que no volvería a perseguir a los animales.',
        ],
        prompt: 'Celebra la promesa', discovery: 'Cuidar la naturaleza también es escuchar a quienes viven en ella.',
      },
    ],
  },
  tortugas: {
    shortTitle: 'Las tortuguitas y la Luna',
    pages: [
      {
        image: 1, crop: 'portrait-left', chapter: 'Un encuentro inesperado', title: 'Cuatro amigas y un viajero',
        imageAlt: 'Ilustración original de un viajero de barba blanca junto a las tortuguitas.',
        paragraphs: [
          'Había una vez cuatro tortuguitas alegres que vivían en una ciudad cálida, cerca del mar. Pasaban los días al sol, siempre juntas y contentas.',
          'Una tarde llegó un viajero sabio. Descansó en la ciudad algunas semanas y enseguida se hizo amigo de ellas.',
          'Les contó historias de otros lugares, de comidas y costumbres distintas. Pero lo que más las asombró fue escuchar que algunas personas soñaban con viajar a la Luna.',
        ],
        prompt: '¿Qué imaginaron las tortuguitas?', discovery: '¡Un viaje entre estrellas, más allá de todo lo que conocían!',
      },
      {
        image: 2, crop: 'landscape-bottom', cutoff: 44, chapter: 'Un sueño brillante', title: '¿Y si llegamos a la Luna?',
        imageAlt: 'Ilustración original de dos tortuguitas que imaginan un viaje entre estrellas.',
        paragraphs: [
          'Las tortuguitas miraron el cielo y pensaron en la Luna. Parecía tan lejana que no podían imaginar cómo llegar hasta ella.',
          'El viajero señaló la fuente de la plaza. Dijo que, si alcanzaban su cima antes de la Luna llena, los rayos dorados podrían envolverlas y llevarlas al cielo.',
          'La fuente era altísima y ellas caminaban despacio. Aun así, sus ojos brillaron de ilusión.',
        ],
        prompt: 'Haz brillar las estrellas', discovery: 'Todo gran viaje comienza con una pregunta: «¿Y si lo intentamos?»',
      },
      {
        image: 3, crop: 'landscape-bottom', cutoff: 44, chapter: 'Una decisión difícil', title: 'El valor de intentarlo',
        imageAlt: 'Ilustración original de las tortuguitas y el viajero imaginando la Luna.',
        paragraphs: [
          'El viajero les advirtió que el camino sería difícil y que no tenían mucho tiempo. La más pequeña se preocupó: «Soy demasiado lenta», dijo bajito.',
          'Una de sus hermanas respondió que ninguna tendría que hacer el viaje sola. Las demás asintieron.',
          'Con un poco de miedo y mucho cariño, decidieron probar. Al fin y al cabo, cada paso podían darlo juntas.',
        ],
        prompt: 'Anima a la más pequeña', discovery: '«Nosotras te ayudaremos», prometieron sus hermanas.',
      },
      {
        image: 4, crop: 'landscape-bottom', cutoff: 36, chapter: 'Comienza la aventura', title: 'Un pasito, luego otro',
        imageAlt: 'Ilustración original de las cuatro tortuguitas caminando por la ciudad.',
        paragraphs: [
          'Cuando comenzó el nuevo ciclo de la Luna, las cuatro tortuguitas se dirigieron a la fuente. Cada una eligió un lado para subir sin estorbar a las otras.',
          'La piedra tenía adornos, curvas y rincones resbaladizos. Desde abajo, la cima parecía casi tocar el cielo.',
          'Respiraron hondo. Después dieron el primer paso, y luego otro.',
        ],
        prompt: 'Acompaña sus primeros pasos', discovery: 'Despacio también se puede avanzar.',
      },
      {
        image: 5, crop: 'full', chapter: 'La gran subida', title: 'La fuente parecía gigante',
        imageAlt: 'Ilustración original de la fuente dorada a la que suben las tortuguitas.',
        paragraphs: [
          'El agua corría por la columna lisa. Las tortuguitas subían cinco pasitos y resbalaban diez. ¡Qué difícil era sostenerse!',
          'Pero no se rindieron. Volvieron a empezar una y otra vez, animándose entre ellas mientras la Luna crecía en el cielo.',
          'Cada pequeño avance las acercaba a la cima y al sueño que compartían.',
        ],
        prompt: 'Dales un poco de ánimo', discovery: 'Caerse no significa dejar de intentarlo.',
      },
      {
        image: 6, crop: 'portrait-left', chapter: 'La leyenda de la fuente', title: 'Siempre mirando la Luna',
        imageAlt: 'Ilustración original de las tortuguitas de piedra junto a la fuente, bajo la Luna.',
        paragraphs: [
          'Las tortuguitas llegaron muy cerca de la cima. Justo entonces, la luz de la Luna se alejó y siguió su camino por el cielo.',
          'Cuenta la leyenda que quedaron convertidas en piedra junto a la fuente, con los cuellos estirados hacia arriba.',
          'Allí permanecen las cuatro amigas, recordándonos su valentía y que acompañarse puede hacer más hermoso cualquier camino.',
        ],
        prompt: 'Haz brillar su recuerdo', discovery: 'Su sueño sigue iluminando la plaza cada noche.',
      },
    ],
  },
};
