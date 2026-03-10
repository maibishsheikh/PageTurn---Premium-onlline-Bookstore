const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Book = require('../models/Book');
const Genre = require('../models/Genre');
const Event = require('../models/Event');

exports.seedDatabase = async (req, res) => {
  try {
    // Secret key check to prevent unauthorized seeding
    if (req.query.key !== 'pageturn_seed_2026') {
      return res.status(403).json({ success: false, message: 'Invalid seed key' });
    }

    // Clear collections
    await User.deleteMany({});
    await Book.deleteMany({});
    await Genre.deleteMany({});
    await Event.deleteMany({});

    // Create admin user
    await User.create({
      name: 'Admin',
      email: 'admin@pageturn.com',
      password: 'admin123',
      role: 'admin'
    });

    // Create test user
    await User.create({
      name: 'John Reader',
      email: 'john@example.com',
      password: 'password123',
      role: 'user'
    });

    // Genres
    const genres = [
      { name: 'Fiction', description: 'Imaginative narratives that explore the human experience through invented stories and characters.', image: 'https://images.unsplash.com/photo-1474932430478-367dbb6832c1?w=400' },
      { name: 'Science Fiction', description: 'Stories set in futuristic or alternative worlds driven by science and technology.', image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400' },
      { name: 'Fantasy', description: 'Tales of magic, mythical creatures, and extraordinary worlds.', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400' },
      { name: 'Mystery', description: 'Suspenseful stories centered around solving crimes or puzzles.', image: 'https://images.unsplash.com/photo-1587876931567-564ce588bfbd?w=400' },
      { name: 'Romance', description: 'Stories centered on love, relationships, and emotional connections.', image: 'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=400' },
      { name: 'Thriller', description: 'Fast-paced stories filled with tension, danger, and unexpected twists.', image: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=400' },
      { name: 'Non-Fiction', description: 'Real-world accounts, essays, and explorations of factual topics.', image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400' },
      { name: 'Biography', description: 'In-depth accounts of remarkable lives and personal journeys.', image: 'https://images.unsplash.com/photo-1529473814998-077b4fec6770?w=400' },
      { name: 'Self-Help', description: 'Guides for personal growth, productivity, and well-being.', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400' },
      { name: 'History', description: 'Explorations of past events that shaped civilizations and cultures.', image: 'https://images.unsplash.com/photo-1461360370896-922624d12a74?w=400' },
      { name: 'Poetry', description: 'Beautiful collections of verse exploring emotion, nature, and the human condition.', image: 'https://images.unsplash.com/photo-1473186505569-9c61870c11f9?w=400' },
      { name: 'Horror', description: 'Dark tales designed to frighten, unsettle, and thrill readers.', image: 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=400' }
    ];
    for (const g of genres) {
      await Genre.create(g);
    }

    // Books
    const books = [
      {
        title: 'The Midnight Library', author: 'Matt Haig', publisher: 'Viking Press', genre: 'Fiction',
        price: 14.99, originalPrice: 19.99, stock: 45,
        description: 'Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.',
        shortDescription: 'A dazzling novel about all the choices that go into a life well lived.',
        rating: 4.5, reviewCount: 234,
        coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1602190253i/52578297.jpg',
        releaseDate: new Date('2024-09-29'), isbn: '978-0525559474', pages: 304,
        tags: ['philosophical', 'life choices', 'parallel universes', 'book club'],
        isFeatured: true, isBestSeller: true, isTrending: true, soldCount: 1250
      },
      {
        title: 'Project Hail Mary', author: 'Andy Weir', publisher: 'Ballantine Books', genre: 'Science Fiction',
        price: 16.99, originalPrice: 22.99, stock: 38,
        description: 'Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the Earth itself are finished.',
        shortDescription: 'A lone astronaut must save the earth from disaster in this cinematic thriller.',
        rating: 4.8, reviewCount: 189,
        coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1597695864i/54493401.jpg',
        releaseDate: new Date('2024-05-04'), isbn: '978-0593135204', pages: 496,
        tags: ['space', 'survival', 'science', 'adventure'],
        isFeatured: true, isBestSeller: true, soldCount: 980
      },
      {
        title: 'The House in the Cerulean Sea', author: 'TJ Klune', publisher: 'Tor Books', genre: 'Fantasy',
        price: 13.99, originalPrice: 18.99, stock: 52,
        description: 'Linus Baker leads a quiet, solitary life. When he is unexpectedly summoned to a remote island, he discovers an orphanage that will change his life forever.',
        shortDescription: 'A magical story about finding family in the most unexpected places.',
        rating: 4.6, reviewCount: 312,
        coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1569514209i/45047384.jpg',
        releaseDate: new Date('2024-03-17'), isbn: '978-1250217318', pages: 400,
        tags: ['magical realism', 'found family', 'heartwarming', 'lgbtq'],
        isFeatured: true, isTrending: true, soldCount: 870
      },
      {
        title: 'Atomic Habits', author: 'James Clear', publisher: 'Avery', genre: 'Self-Help',
        price: 15.99, originalPrice: 24.99, stock: 120,
        description: 'Atomic Habits offers a proven framework for improving—every day. Practical strategies to form good habits, break bad ones, and master tiny behaviors that lead to remarkable results.',
        shortDescription: 'Transform your life with tiny changes that deliver remarkable results.',
        rating: 4.7, reviewCount: 567,
        coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1655988385i/40121378.jpg',
        releaseDate: new Date('2023-10-16'), isbn: '978-0735211292', pages: 320,
        tags: ['habits', 'productivity', 'personal development', 'psychology'],
        isFeatured: true, isBestSeller: true, isTrending: true, soldCount: 2340
      },
      {
        title: 'The Silent Patient', author: 'Alex Michaelides', publisher: 'Celadon Books', genre: 'Thriller',
        price: 12.99, originalPrice: 17.99, stock: 67,
        description: 'Alicia Berenson shoots her husband five times in the face, and then never speaks another word. A shocking psychological thriller.',
        shortDescription: 'A shocking psychological thriller of a woman who stops speaking after a crime.',
        rating: 4.3, reviewCount: 445,
        coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1668782119i/40097951.jpg',
        releaseDate: new Date('2024-02-05'), isbn: '978-1250301697', pages: 336,
        tags: ['psychological', 'crime', 'suspense', 'twist'],
        isBestSeller: true, isTrending: true, soldCount: 1560
      },
      {
        title: 'Dune', author: 'Frank Herbert', publisher: 'Ace Books', genre: 'Science Fiction',
        price: 11.99, originalPrice: 16.99, stock: 89,
        description: 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world.',
        shortDescription: 'The epic science fiction masterpiece about power, survival, and destiny.',
        rating: 4.6, reviewCount: 890,
        coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1555447414i/44767458.jpg',
        releaseDate: new Date('2023-06-01'), isbn: '978-0441172719', pages: 688,
        tags: ['epic', 'desert', 'politics', 'classic'],
        isFeatured: true, isBestSeller: true, soldCount: 3200
      },
      {
        title: 'Where the Crawdads Sing', author: 'Delia Owens', publisher: "G.P. Putnam's Sons", genre: 'Fiction',
        price: 13.99, originalPrice: 18.00, stock: 33,
        description: 'A haunting tale of a young woman who raised herself in the marshes of North Carolina, and becomes a suspect in a murder investigation.',
        shortDescription: 'A haunting tale of isolation, nature, and the mysteries of the marsh.',
        rating: 4.4, reviewCount: 678,
        coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1582135294i/36809135.jpg',
        releaseDate: new Date('2024-08-14'), isbn: '978-0735219106', pages: 384,
        tags: ['nature', 'murder mystery', 'coming of age', 'southern'],
        isTrending: true, isNewRelease: true, soldCount: 1890
      },
      {
        title: 'The Alchemist', author: 'Paulo Coelho', publisher: 'HarperOne', genre: 'Fiction',
        price: 10.99, originalPrice: 14.99, stock: 95,
        description: 'The mystical story of Santiago, an Andalusian shepherd boy who yearns to travel in search of a worldly treasure.',
        shortDescription: 'A global phenomenon about following your dreams and listening to your heart.',
        rating: 4.2, reviewCount: 1200,
        coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1654371463i/18144590.jpg',
        releaseDate: new Date('2023-04-25'), isbn: '978-0062315007', pages: 208,
        tags: ['philosophical', 'journey', 'dreams', 'spiritual'],
        isFeatured: true, soldCount: 5600
      },
      {
        title: 'The Seven Husbands of Evelyn Hugo', author: 'Taylor Jenkins Reid', publisher: 'Washington Square Press', genre: 'Romance',
        price: 14.49, originalPrice: 19.99, stock: 41,
        description: 'Aging Hollywood movie icon Evelyn Hugo is finally ready to tell the truth about her glamorous and scandalous life.',
        shortDescription: 'A captivating tale of glamour, love, and the price of fame.',
        rating: 4.5, reviewCount: 534,
        coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1664458703i/32620332.jpg',
        releaseDate: new Date('2024-06-13'), isbn: '978-1501161933', pages: 400,
        tags: ['hollywood', 'lgbtq', 'historical fiction', 'glamour'],
        isNewRelease: true, isTrending: true, soldCount: 920
      },
      {
        title: 'Sapiens: A Brief History of Humankind', author: 'Yuval Noah Harari', publisher: 'Harper Perennial', genre: 'Non-Fiction',
        price: 17.99, originalPrice: 24.99, stock: 56,
        description: 'A groundbreaking narrative of humanity\'s creation and evolution.',
        shortDescription: 'A groundbreaking exploration of how Homo sapiens came to rule the world.',
        rating: 4.4, reviewCount: 789,
        coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1703329310i/23692271.jpg',
        releaseDate: new Date('2023-02-10'), isbn: '978-0062316110', pages: 464,
        tags: ['anthropology', 'evolution', 'civilization', 'thought-provoking'],
        isFeatured: true, isBestSeller: true, soldCount: 4100
      },
      {
        title: 'The Name of the Wind', author: 'Patrick Rothfuss', publisher: 'DAW Books', genre: 'Fantasy',
        price: 15.49, originalPrice: 20.99, stock: 28,
        description: 'The tale of the magically gifted young man who grows to be the most notorious wizard his world has ever seen.',
        shortDescription: 'An epic fantasy about a legendary wizard telling his own story.',
        rating: 4.7, reviewCount: 456,
        coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1270352123i/186074.jpg',
        releaseDate: new Date('2024-04-01'), isbn: '978-0756404741', pages: 722,
        tags: ['epic fantasy', 'magic', 'adventure', 'hero journey'],
        isFeatured: true, soldCount: 1340
      },
      {
        title: 'The Girl with the Dragon Tattoo', author: 'Stieg Larsson', publisher: 'Vintage Crime', genre: 'Mystery',
        price: 12.49, originalPrice: 16.99, stock: 39,
        description: 'A journalist and a brilliant hacker investigate a decades-old disappearance from one of Sweden\'s wealthiest families.',
        shortDescription: 'A gripping mystery about a journalist and a brilliant hacker.',
        rating: 4.3, reviewCount: 923,
        coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1684638853i/2429135.jpg',
        releaseDate: new Date('2023-09-14'), isbn: '978-0307454546', pages: 480,
        tags: ['crime', 'investigation', 'hacker', 'swedish'],
        isBestSeller: true, soldCount: 2100
      },
      {
        title: 'The Power of Now', author: 'Eckhart Tolle', publisher: 'New World Library', genre: 'Self-Help',
        price: 13.49, originalPrice: 18.00, stock: 72,
        description: 'A guide to spiritual enlightenment and living in the present moment.',
        shortDescription: 'A guide to spiritual enlightenment and living in the present moment.',
        rating: 4.1, reviewCount: 345,
        coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1386925838i/6708.jpg',
        releaseDate: new Date('2023-01-15'), isbn: '978-1577314806', pages: 236,
        tags: ['mindfulness', 'spirituality', 'consciousness', 'meditation'],
        soldCount: 1580
      },
      {
        title: 'Becoming', author: 'Michelle Obama', publisher: 'Crown Publishing', genre: 'Biography',
        price: 16.49, originalPrice: 22.99, stock: 44,
        description: 'Michelle Obama invites readers into her world, chronicling the experiences that have shaped her.',
        shortDescription: 'An intimate and inspiring memoir from the former First Lady.',
        rating: 4.6, reviewCount: 678,
        coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1528206996i/38746485.jpg',
        releaseDate: new Date('2024-11-13'), isbn: '978-1524763138', pages: 448,
        tags: ['memoir', 'politics', 'inspirational', 'leadership'],
        isNewRelease: true, isBestSeller: true, soldCount: 3400
      },
      {
        title: 'A Court of Thorns and Roses', author: 'Sarah J. Maas', publisher: 'Bloomsbury', genre: 'Fantasy',
        price: 14.99, originalPrice: 19.99, stock: 58,
        description: 'When a huntress kills a wolf in the woods, she is dragged to a treacherous magical land ruled by immortal faeries.',
        shortDescription: 'A spellbinding fantasy romance of beauty, beasts, and fae courts.',
        rating: 4.2, reviewCount: 890,
        coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1620324329i/50659467.jpg',
        releaseDate: new Date('2024-05-05'), isbn: '978-1619634442', pages: 432,
        tags: ['fae', 'romance', 'dark fantasy', 'adventure'],
        isTrending: true, isNewRelease: true, soldCount: 1780
      },
      {
        title: 'Educated', author: 'Tara Westover', publisher: 'Random House', genre: 'Biography',
        price: 14.99, originalPrice: 19.99, stock: 35,
        description: 'Born to survivalists in Idaho, Tara Westover was seventeen the first time she set foot in a classroom. A testament to the transformative power of education.',
        shortDescription: 'A memoir about growing up in isolation and the transformative power of education.',
        rating: 4.5, reviewCount: 512,
        coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1506026635i/35133922.jpg',
        releaseDate: new Date('2024-02-20'), isbn: '978-0399590504', pages: 352,
        tags: ['memoir', 'education', 'resilience', 'family'],
        isNewRelease: true, soldCount: 1920
      },
      {
        title: 'Winds of Eternity', author: 'Elena Vasquez', publisher: 'Tor Books', genre: 'Fantasy',
        price: 24.99, stock: 0,
        description: 'In the ancient realm of Aethermoor, a young cartographer discovers a map that rewrites reality itself.',
        shortDescription: 'An epic fantasy where a cartographer discovers a map that rewrites reality.',
        rating: 0, coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400',
        releaseDate: new Date('2026-07-15'), pages: 580,
        tags: ['epic fantasy', 'maps', 'gods', 'adventure'],
        isUpcoming: true, preOrderAvailable: true, soldCount: 0
      },
      {
        title: 'Quantum Minds', author: 'Dr. Sarah Chen', publisher: 'Penguin Science', genre: 'Science Fiction',
        price: 22.99, stock: 0,
        description: 'In 2089, consciousness can be uploaded, downloaded, and shared. A quantum researcher discovers she\'s living in a simulation.',
        shortDescription: 'A mind-bending sci-fi about consciousness in the age of quantum computing.',
        rating: 0, coverImage: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400',
        releaseDate: new Date('2026-09-01'), pages: 412,
        tags: ['quantum', 'consciousness', 'simulation', 'identity'],
        isUpcoming: true, preOrderAvailable: true, soldCount: 0
      },
      {
        title: 'The Last Lighthouse Keeper', author: 'Marcus Albright', publisher: 'Knopf', genre: 'Fiction',
        price: 19.99, stock: 0,
        description: 'On a remote Scottish island, the last lighthouse keeper tends his light and memories. A mysterious boat changes everything.',
        shortDescription: 'A poetic novel about memory, isolation, and the light that guides us home.',
        rating: 0, coverImage: 'https://images.unsplash.com/photo-1474932430478-367dbb6832c1?w=400',
        releaseDate: new Date('2026-06-20'), pages: 296,
        tags: ['literary fiction', 'lighthouse', 'memory', 'atmospheric'],
        isUpcoming: true, preOrderAvailable: true, soldCount: 0
      },
      {
        title: 'Echoes of Byzantium', author: 'Amir Khalil', publisher: 'Simon & Schuster', genre: 'History',
        price: 28.99, stock: 0,
        description: 'The fall of Constantinople told through the eyes of twelve different witnesses.',
        shortDescription: 'The fall of Constantinople told through twelve unforgettable perspectives.',
        rating: 0, coverImage: 'https://images.unsplash.com/photo-1461360370896-922624d12a74?w=400',
        releaseDate: new Date('2026-11-10'), pages: 520,
        tags: ['history', 'byzantine', 'multiple perspectives', 'epic'],
        isUpcoming: true, preOrderAvailable: true, soldCount: 0
      }
    ];
    await Book.insertMany(books);

    // Events
    const events = [
      {
        title: 'Midnight Pages: A Fantasy Book Launch', type: 'book_launch',
        description: 'Join us for an enchanting evening as Elena Vasquez unveils "Winds of Eternity."',
        author: 'Elena Vasquez',
        date: new Date('2026-07-15T19:00:00'), endDate: new Date('2026-07-15T22:00:00'),
        location: { venue: 'The Grand Library Hall', city: 'New York', country: 'USA', isOnline: false },
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600',
        maxAttendees: 200, isFeatured: true, status: 'upcoming'
      },
      {
        title: 'Coffee & Conversations with Andy Weir', type: 'author_meetup',
        description: 'An intimate morning with the bestselling author of Project Hail Mary.',
        author: 'Andy Weir',
        date: new Date('2026-05-20T10:00:00'), endDate: new Date('2026-05-20T12:30:00'),
        location: { venue: 'Orbit Café & Books', city: 'San Francisco', country: 'USA', isOnline: false },
        image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600',
        maxAttendees: 50, isFeatured: true, status: 'upcoming'
      },
      {
        title: 'Virtual Author Signing: Sarah J. Maas', type: 'book_signing',
        description: 'Get your copies of A Court of Thorns and Roses signed virtually!',
        author: 'Sarah J. Maas',
        date: new Date('2026-04-12T14:00:00'), endDate: new Date('2026-04-12T16:00:00'),
        location: { venue: 'Online', city: 'Virtual', country: 'Worldwide', isOnline: true },
        image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600',
        maxAttendees: 500, isFeatured: true, status: 'upcoming'
      },
      {
        title: 'Poetry Under Stars: A Reading Evening', type: 'reading_session',
        description: 'An open-air poetry reading session under the night sky.',
        author: 'Various Poets',
        date: new Date('2026-06-05T20:00:00'), endDate: new Date('2026-06-05T23:00:00'),
        location: { venue: 'Riverside Gardens', city: 'London', country: 'UK', isOnline: false },
        image: 'https://images.unsplash.com/photo-1473186505569-9c61870c11f9?w=600',
        maxAttendees: 150, status: 'upcoming'
      },
      {
        title: 'WorldScript Literary Festival 2026', type: 'literary_festival',
        description: 'Three days of panels, workshops, readings, and book fairs featuring over 100 authors.',
        author: 'Multiple Authors',
        date: new Date('2026-08-10T09:00:00'), endDate: new Date('2026-08-12T18:00:00'),
        location: { venue: 'Edinburgh Convention Centre', city: 'Edinburgh', country: 'UK', isOnline: false },
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600',
        maxAttendees: 5000, isFeatured: true, status: 'upcoming'
      },
      {
        title: 'Mystery Writing Workshop with Alex Michaelides', type: 'workshop',
        description: 'Learn the art of crafting unputdownable thrillers from the master himself.',
        author: 'Alex Michaelides',
        date: new Date('2026-04-25T13:00:00'), endDate: new Date('2026-04-25T17:00:00'),
        location: { venue: 'Online', city: 'Virtual', country: 'Worldwide', isOnline: true },
        image: 'https://images.unsplash.com/photo-1587876931567-564ce588bfbd?w=600',
        maxAttendees: 100, status: 'upcoming'
      }
    ];
    await Event.insertMany(events);

    res.json({
      success: true,
      message: 'Database seeded successfully!',
      data: {
        users: 2,
        genres: genres.length,
        books: books.length,
        events: events.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
