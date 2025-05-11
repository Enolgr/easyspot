import { PrismaClient } from '@prisma/client';
import crypto from 'node:crypto';

const prisma = new PrismaClient();

async function main() {
  // Crear roles básicos
  const roles = [
    { name: 'User' },
    { name: 'Admin' },
    { name: 'Promoter' }
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role
    });
  }

  // Crear categorías
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Festivales' },
      update: {},
      create: {
        name: 'Festivales'
      }
    }),
    prisma.category.upsert({
      where: { name: 'Conciertos' },
      update: {},
      create: {
        name: 'Conciertos'
      }
    }),
    prisma.category.upsert({
      where: { name: 'Teatro' },
      update: {},
      create: {
        name: 'Teatro'
      }
    }),
    prisma.category.upsert({
      where: { name: 'Comedia' },
      update: {},
      create: {
        name: 'Comedia'
      }
    })
  ]);

  // Obtener las categorías para usarlas en los eventos
  const festivalCategory = await prisma.category.findUnique({ where: { name: 'Festivales' } });
  const concertCategory = await prisma.category.findUnique({ where: { name: 'Conciertos' } });
  const theaterCategory = await prisma.category.findUnique({ where: { name: 'Teatro' } });
  const comedyCategory = await prisma.category.findUnique({ where: { name: 'Comedia' } });

  // Crear usuario
  const user = await prisma.user.upsert({
    where: { email: 'enolgr@gmail.com' },
    update: {},
    create: {
      firebaseUid: 'PFIoPNPuEVaR4fejiXEssuhLS1P2',
      email: 'enolgr@gmail.com',
      displayName: 'Enol',
      promoter: true,
      roleId: (await prisma.role.findUnique({ where: { name: 'Promoter' } })).id
    }
  });

  // Venues
  const venuesData = [
    { name: 'Ciudad de las Artes y las Ciencias', city: 'Valencia', address: 'Av. del Professor López Piñero, 7', capacity: 15000, contactDetails: 'info@cac.es' },
    { name: 'Recinto Ferial de Aranda de Duero', city: 'Aranda de Duero', address: 'Calle Ferial, s/n', capacity: 20000, contactDetails: 'info@sonorama.com' },
    { name: 'Iberdrola Music Venue', city: 'Madrid', address: 'Calle Antonio Díaz Miguel, s/n', capacity: 70000, contactDetails: 'info@madcoolfestival.com' },
    { name: 'Andén 56', city: 'Burgos', address: 'Calle San Pedro de Cardeña, 56', capacity: 800, contactDetails: 'info@anden56.com' },
    { name: 'La Riviera', city: 'Madrid', address: 'Paseo Bajo de la Virgen del Puerto, s/n', capacity: 1500, contactDetails: 'info@lariviera.com' },
    { name: 'Palacio de Deportes José María Martín Carpena', city: 'Málaga', address: 'Calle Miguel de Mérida Nicolich, 2', capacity: 11000, contactDetails: 'info@martincarpena.es' },
    { name: 'Sala Malandar', city: 'Sevilla', address: 'Calle Torneo, 43', capacity: 300, contactDetails: 'info@salamalandar.com' },
    { name: 'Movistar Arena Madrid', city: 'Madrid', address: 'Avenida de Felipe II, s/n', capacity: 5000, contactDetails: 'info@movistararenamadrid.com' },
    { name: 'Prestoso Fest Grounds', city: 'Cangas del Narcea', address: 'Zona Prestoso', capacity: 3000, contactDetails: 'info@prestosofest.com' },
    { name: 'Teatro Principal de Alicante', city: 'Alicante', address: 'Plaza Ruperto Chapí, s/n', capacity: 1200, contactDetails: 'info@teatroprincipaldealicante.com' },
    { name: 'Bilbao Arena', city: 'Bilbao', address: 'Calle Askatasuna Hiribidea, 13', capacity: 8000, contactDetails: 'info@bilbaoarena.com' },
    { name: 'Teatro Borrás', city: 'Barcelona', address: 'Calle de Urquinaona, 9', capacity: 700, contactDetails: 'info@teatroborras.com' },
    { name: 'Teatro Jovellanos', city: 'Gijón', address: 'Paseo de Begoña, 11', capacity: 900, contactDetails: 'info@teatrojovellanos.com' },
    { name: 'Teatro Olympia', city: 'Valencia', address: 'Calle de San Vicente Mártir, 44', capacity: 1200, contactDetails: 'info@teatro-olympia.com' },
    { name: 'Teatro Circo Price', city: 'Madrid', address: 'Ronda de Atocha, 35', capacity: 1500, contactDetails: 'info@teatrocircoprice.es' },
    { name: 'Teatro Colón A Coruña', city: 'A Coruña', address: 'Avenida da Mariña, 7A', capacity: 1000, contactDetails: 'info@teatrocolonacoruna.es' }
  ];

  const venueRecords = {};
  for (const venueData of venuesData) {
    const venue = await prisma.venue.create({ data: venueData });
    venueRecords[venue.name] = venue;
  }

  // Crear eventos como promoter
  const events = await Promise.all([
    prisma.event.create({
      data: {
        title: 'Festival de Les Arts',
        dateTime: new Date('2025-06-06T20:00:00Z'),
        city: 'Valencia',
        poster: 'https://firebasestorage.googleapis.com/v0/b/easyspot-21f28.firebasestorage.app/o/posters%2F18491693_1500254813332325_5119710715243302296_o.jpg.jpg?alt=media&token=0ada3e37-12af-4372-9aee-79568a867b6c',
        price: 90.00,
        availableTickets: 12000,
        description: 'El Festival de Les Arts reúne cada año en la Ciudad de las Artes y las Ciencias de Valencia lo mejor del pop, rock e indie nacional e internacional. Música, arte y gastronomía en un entorno único.',
        categoryId: festivalCategory.id,
        venueId: (await prisma.venue.findUnique({ where: { name: 'Ciudad de las Artes y las Ciencias' } })).id,
        promoters: {
          create: {
            userId: user.id,
            roleId: (await prisma.role.findUnique({ where: { name: 'Promoter' } })).id
          }
        }
      }
    }),
    prisma.event.create({
      data: {
        title: 'Sonorama Ribera',
        dateTime: new Date('2025-08-15T19:00:00Z'),
        city: 'Aranda de Duero',
        poster: 'https://firebasestorage.googleapis.com/v0/b/easyspot-21f28.firebasestorage.app/o/posters%2Fimages.png?alt=media&token=354b04d0-c75e-4647-b360-56f72c43ced6',
        price: 85.00,
        availableTickets: 20000,
        description: 'Sonorama Ribera celebra su 28ª edición en Aranda de Duero, combinando lo mejor del indie español con bandas internacionales en la Plaza del Trigo y Recinto Ferial.',
        categoryId: festivalCategory.id,
        venueId: (await prisma.venue.findUnique({ where: { name: 'Recinto Ferial de Aranda de Duero' } })).id,
        promoters: {
          create: {
            userId: user.id,
            roleId: (await prisma.role.findUnique({ where: { name: 'Promoter' } })).id
          }
        }
      }
    }),
    prisma.event.create({
      data: {
        title: 'Madcool Festival',
        dateTime: new Date('2025-07-10T17:00:00Z'),
        city: 'Madrid',
        poster: 'https://firebasestorage.googleapis.com/v0/b/easyspot-21f28.firebasestorage.app/o/posters%2Fmadcool.png?alt=media&token=19e5dff2-4bca-4f76-997a-bd902c2957ec',
        price: 150.00,
        availableTickets: 50000,
        description: 'Mad Cool Festival aterriza en Iberdrola Music Venue Madrid con una mezcla explosiva de rock, pop y electrónica. Un cartel de nivel mundial para un público exigente.',
        categoryId: festivalCategory.id,
        venueId: (await prisma.venue.findUnique({ where: { name: 'Iberdrola Music Venue' } })).id,
        promoters: {
          create: {
            userId: user.id,
            roleId: (await prisma.role.findUnique({ where: { name: 'Promoter' } })).id
          }
        }
      }
    }),
    prisma.event.create({
      data: {
        title: 'Rival Sons en Burgos',
        dateTime: new Date('2025-09-20T21:00:00Z'),
        city: 'Burgos',
        poster: 'https://firebasestorage.googleapis.com/v0/b/easyspot-21f28.firebasestorage.app/o/posters%2Frival.jpg?alt=media&token=5c3443dc-44f8-4d32-9d5e-ad166175dcc1',
        price: 40.00,
        availableTickets: 800,
        description: 'Rival Sons, la banda californiana de hard rock y blues, desembarca en Andén 56 para una noche íntima y llena de energía pura.',
        categoryId: concertCategory.id,
        venueId: (await prisma.venue.findUnique({ where: { name: 'Andén 56' } })).id,
        promoters: {
          create: {
            userId: user.id,
            roleId: (await prisma.role.findUnique({ where: { name: 'Promoter' } })).id
          }
        }
      }
    }),
    prisma.event.create({
      data: {
        title: 'ELYELLA en La Riviera',
        dateTime: new Date('2025-10-04T22:00:00Z'),
        city: 'Madrid',
        poster: 'https://firebasestorage.googleapis.com/v0/b/easyspot-21f28.firebasestorage.app/o/posters%2Felyella.jpg?alt=media&token=ec232ce8-5bf3-477f-9d5c-2e314aca950d',
        price: 25.00,
        availableTickets: 1500,
        description: 'ELYELLA, uno de los dúos más potentes de la electrónica indie, llega a La Riviera para transformar la noche en una fiesta imparable de luz y baile.',
        categoryId: concertCategory.id,
        venueId: (await prisma.venue.findUnique({ where: { name: 'La Riviera' } })).id,
        promoters: {
          create: {
            userId: user.id,
            roleId: (await prisma.role.findUnique({ where: { name: 'Promoter' } })).id
          }
        }
      }
    }),
    prisma.event.create({
      data: {
        title: 'Joaquín Sabina en Málaga',
        dateTime: new Date('2025-11-15T21:30:00Z'),
        city: 'Málaga',
        poster: 'https://firebasestorage.googleapis.com/v0/b/easyspot-21f28.firebasestorage.app/o/posters%2Fsabina.jpg?alt=media&token=8c7dba74-c7ac-442a-a62b-dc817d6d1bc7',
        price: 95.00,
        availableTickets: 10000,
        description: 'Joaquín Sabina presenta su gira "Contra todo pronóstico" en el Palacio de Deportes José María Martín Carpena de Málaga. Una noche de poesía, ironía y canciones eternas.',
        categoryId: concertCategory.id,
        venueId: (await prisma.venue.findUnique({ where: { name: 'Palacio de Deportes José María Martín Carpena' } })).id,
        promoters: {
          create: {
            userId: user.id,
            roleId: (await prisma.role.findUnique({ where: { name: 'Promoter' } })).id
          }
        }
      }
    }),
    prisma.event.create({
      data: {
        title: 'Grande Amore en Malandar',
        dateTime: new Date('2025-09-27T22:30:00Z'),
        city: 'Sevilla',
        poster: 'https://firebasestorage.googleapis.com/v0/b/easyspot-21f28.firebasestorage.app/o/posters%2Fgrande.jpg?alt=media&token=2d53d9c7-0be6-44c8-bd07-fbb6c9e44a29',
        price: 18.00,
        availableTickets: 300,
        description: 'Grande Amore, la sensación gallega del pop experimental, llega a Sala Malandar para una noche intensa de distorsión y emociones.',
        categoryId: concertCategory.id,
        venueId: (await prisma.venue.findUnique({ where: { name: 'Sala Malandar' } })).id,
        promoters: {
          create: {
            userId: user.id,
            roleId: (await prisma.role.findUnique({ where: { name: 'Promoter' } })).id
          }
        }
      }
    }),
    prisma.event.create({
      data: {
        title: 'Shinova - Fin de Gira en Movistar Arena',
        dateTime: new Date('2025-12-06T20:00:00Z'),
        city: 'Madrid',
        poster: 'https://firebasestorage.googleapis.com/v0/b/easyspot-21f28.firebasestorage.app/o/posters%2Fshinova.jpg?alt=media&token=da9d2a44-7813-4915-9486-498980a35471',
        price: 30.00,
        availableTickets: 5000,
        description: 'Shinova cierra su gira "La Buena Suerte" en Movistar Arena Madrid con un show vibrante lleno de himnos generacionales.',
        categoryId: concertCategory.id,
        venueId: (await prisma.venue.findUnique({ where: { name: 'Movistar Arena Madrid' } })).id,
        promoters: {
          create: {
            userId: user.id,
            roleId: (await prisma.role.findUnique({ where: { name: 'Promoter' } })).id
          }
        }
      }
    }),
    prisma.event.create({
      data: {
        title: 'Prestoso Fest',
        dateTime: new Date('2025-07-19T18:00:00Z'),
        city: 'Cangas del Narcea',
        poster: 'https://firebasestorage.googleapis.com/v0/b/easyspot-21f28.firebasestorage.app/o/posters%2Fprestoso.jpg?alt=media&token=72f4c8b2-fbd8-4378-8d2d-bbf8a8a0da9a',
        price: 45.00,
        availableTickets: 3000,
        description: 'Prestoso Fest celebra la música indie en un enclave natural único del suroccidente asturiano. Música, gastronomía y naturaleza en perfecta armonía.',
        categoryId: festivalCategory.id,
        venueId: (await prisma.venue.findUnique({ where: { name: 'Prestoso Fest Grounds' } })).id,
        promoters: {
          create: {
            userId: user.id,
            roleId: (await prisma.role.findUnique({ where: { name: 'Promoter' } })).id
          }
        }
      }
    }),
    prisma.event.create({
      data: {
        title: 'Jorge Drexler - Gira Tinta y Tiempo',
        dateTime: new Date('2025-10-18T20:00:00Z'),
        city: 'Alicante',
        poster: 'https://firebasestorage.googleapis.com/v0/b/easyspot-21f28.firebasestorage.app/o/posters%2Fdrexler.jpg?alt=media&token=c241aec2-a1fd-48b7-9d62-0d73a60c06fb',
        price: 60.00,
        availableTickets: 1200,
        description: 'Jorge Drexler presenta "Tinta y Tiempo" en el Teatro Principal de Alicante: poesía, melodías suaves y una noche para recordar.',
        categoryId: concertCategory.id,
        venueId: (await prisma.venue.findUnique({ where: { name: 'Teatro Principal de Alicante' } })).id,
        promoters: {
          create: {
            userId: user.id,
            roleId: (await prisma.role.findUnique({ where: { name: 'Promoter' } })).id
          }
        }
      }
    }),
    prisma.event.create({
      data: {
        title: 'The Lumineers en Bilbao Arena',
        dateTime: new Date('2025-04-30T20:30:00Z'),
        city: 'Bilbao',
        poster: 'https://firebasestorage.googleapis.com/v0/b/easyspot-21f28.firebasestorage.app/o/posters%2Flumineers.jpg?alt=media&token=265cf677-9de3-4ab3-bb3b-5e1762294191',
        price: 70.00,
        availableTickets: 8000,
        description: 'The Lumineers aterrizan en el Bilbao Arena con su folk épico y emocionante, en una de las citas imprescindibles del año.',
        categoryId: concertCategory.id,
        venueId: (await prisma.venue.findUnique({ where: { name: 'Bilbao Arena' } })).id,
        promoters: {
          create: {
            userId: user.id,
            roleId: (await prisma.role.findUnique({ where: { name: 'Promoter' } })).id
          }
        }
      }
    }),
    prisma.event.create({
      data: {
        title: 'Corta el Cable Rojo',
        dateTime: new Date('2025-09-13T20:30:00Z'),
        city: 'Barcelona',
        poster: 'https://firebasestorage.googleapis.com/v0/b/easyspot-21f28.firebasestorage.app/o/posters%2Fcorta.jpg?alt=media&token=28cc8767-c20a-4626-9e42-18a2e99755cf',
        price: 32.00,
        availableTickets: 700,
        description: 'La comedia improvisada más divertida de España aterriza en el Teatro Borrás de Barcelona. Cada función es distinta, llena de humor rápido, absurdo y participación del público.',
        categoryId: comedyCategory.id,
        venueId: (await prisma.venue.findUnique({ where: { name: 'Teatro Borrás' } })).id,
        promoters: {
          create: {
            userId: user.id,
            roleId: (await prisma.role.findUnique({ where: { name: 'Promoter' } })).id
          }
        }
      }
    }),
   
    prisma.event.create({
      data: {
        title: 'David Suárez - Humor Blanco',
        dateTime: new Date('2025-10-11T21:00:00Z'),
        city: 'Gijón',
        poster: 'https://firebasestorage.googleapis.com/v0/b/easyspot-21f28.firebasestorage.app/o/posters%2Fblanco.jpg?alt=media&token=69efc058-a468-4439-807a-441f3157888b',
        price: 25.00,
        availableTickets: 900,
        description: 'David Suárez presenta su humor negro y provocador en el Teatro Jovellanos de Gijón. Un monólogo para los que no temen reírse de todo.',
        categoryId: comedyCategory.id,
        venueId: (await prisma.venue.findUnique({ where: { name: 'Teatro Jovellanos' } })).id,
        promoters: {
          create: {
            userId: user.id,
            roleId: (await prisma.role.findUnique({ where: { name: 'Promoter' } })).id
          }
        }
      }
    }),
    prisma.event.create({
      data: {
        title: 'A ningú que li passe - Eugeni Alemany',
        dateTime: new Date('2025-11-29T20:00:00Z'),
        city: 'Valencia',
        poster: 'https://firebasestorage.googleapis.com/v0/b/easyspot-21f28.firebasestorage.app/o/posters%2Feugeni.jpg?alt=media&token=a5a0ae12-b606-4c06-ab1c-842b1538eb11',
        price: 28.00,
        availableTickets: 1200,
        description: 'Eugeni Alemany presenta "A ningú que li passe", una divertida sátira sobre las costumbres valencianas en el emblemático Teatro Olympia.',
        categoryId: comedyCategory.id,
        venueId: (await prisma.venue.findUnique({ where: { name: 'Teatro Olympia' } })).id,
        promoters: {
          create: {
            userId: user.id,
            roleId: (await prisma.role.findUnique({ where: { name: 'Promoter' } })).id
          }
        }
      }
    }),
    prisma.event.create({
      data: {
        title: 'Ballet Flamenco de Andalucía',
        dateTime: new Date('2025-12-20T19:30:00Z'),
        city: 'Madrid',
        poster: 'https://firebasestorage.googleapis.com/v0/b/easyspot-21f28.firebasestorage.app/o/posters%2Fballet.jpg?alt=media&token=e838bd83-75b4-4b8e-8a40-1512694ae874',
        price: 55.00,
        availableTickets: 1500,
        description: 'El Ballet Flamenco de Andalucía regresa al Teatro Circo Price con una impresionante puesta en escena donde el cante, la guitarra y la danza flamenca se funden en una experiencia inolvidable.',
        categoryId: theaterCategory.id,
        venueId: (await prisma.venue.findUnique({ where: { name: 'Teatro Circo Price' } })).id,
        promoters: {
          create: {
            userId: user.id,
            roleId: (await prisma.role.findUnique({ where: { name: 'Promoter' } })).id
          }
        }
      }
    }),
    prisma.event.create({
      data: {
        title: 'Infinita - Teatro Colón',
        dateTime: new Date('2025-10-25T20:00:00Z'),
        city: 'A Coruña',
        poster: 'https://firebasestorage.googleapis.com/v0/b/easyspot-21f28.firebasestorage.app/o/posters%2Finfinita.jpg?alt=media&token=f712ced6-231d-4c23-8c8c-06480207d1fe',
        price: 22.00,
        availableTickets: 1000,
        description: '"Infinita" es una obra emotiva y visualmente impactante sobre el paso del tiempo y la memoria, que recala en el Teatro Colón de A Coruña para emocionar al público gallego.',
        categoryId: theaterCategory.id,
        venueId: (await prisma.venue.findUnique({ where: { name: 'Teatro Colón A Coruña' } })).id,
        promoters: {
          create: {
            userId: user.id,
            roleId: (await prisma.role.findUnique({ where: { name: 'Promoter' } })).id
          }
        }
      }
    })
  ]);

  // Crear orden
  const order = await prisma.order.create({
    data: {
      userId: user.id,
      totalAmount: 180.00,
      status: 'completed'
    }
  });

  // Crear tickets
  const tickets = await Promise.all([
    prisma.ticket.create({
      data: {
        userId: user.id,
        eventId: events[0].id,
        orderId: order.id,
        qr: crypto.randomUUID(),
        validate: true,
        validatedAt: new Date('2025-05-01T17:50:19Z')
      }
    }),
    prisma.ticket.create({
      data: {
        userId: user.id,
        eventId: events[0].id,
        orderId: order.id,
        qr: crypto.randomUUID(),
        validate: false
      }
    })
  ]);

  // Crear pago
  const payment = await prisma.payment.create({
    data: {
      orderId: order.id,
      stripePaymentId: 'pi_123456',
      paymentStatus: 'succeeded',
      checkoutSessionId: 'cs_123456'
    }
  });

  console.log('Seed completado');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
