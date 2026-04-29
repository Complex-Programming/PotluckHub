import pool from '../config/database.js'

// const users = [
//   { name: 'Alice Nguyen',  bio: 'Home cook obsessed with Southeast Asian flavors.', email: 'alice@example.com' },
//   { name: 'Marcus Bell',   bio: 'Grill master and weekend baker.',                  email: 'marcus@example.com' },
//   { name: 'Sofia Reyes',   bio: 'Plant-based food enthusiast.',                     email: 'sofia@example.com' },
// ]

const recipes = [
  { name: 'Vietnamese Spring Rolls', description: 'Fresh rice paper rolls with shrimp, herbs, and peanut dipping sauce.', category: 'Appetizer', image_url: "https://images.unsplash.com/photo-1594020293082-20140e0af18d?q=80&w=1772&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: 'Smoked BBQ Brisket', description: 'Low-and-slow smoked brisket with a dry rub and tangy mop sauce.', category: 'Main', image_url: "https://images.unsplash.com/photo-1626114762019-e981765eb0bf?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: 'Mango Avocado Salad', description: 'Light salad with mango, avocado, red onion, and lime vinaigrette.', category: 'Side', image_url: "https://images.unsplash.com/photo-1562629609-49c10e58c2a6?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: 'Banana Pudding', description: 'Classic Southern banana pudding with vanilla wafers and whipped cream.', category: 'Dessert', image_url: "https://images.unsplash.com/photo-1552637086-ce3bf3275c4c?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: 'Lentil Coconut Curry', description: 'Creamy red lentil curry with coconut milk, ginger, and tomatoes.', category: 'Main', image_url: "https://images.unsplash.com/photo-1611068120738-e3801fcaa00a?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },

  { name: "Caprese Skewers", description: "Fresh mozzarella, tomatoes, and basil on skewers", category: "appetizer", image_url: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=400&h=300&fit=crop" },
  { name: "BBQ Pulled Pork", description: "Slow-cooked pork shoulder with tangy BBQ sauce", category: "main", image_url: "https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=300&fit=crop" },
  { name: "Vegetarian Lasagna", description: "Layers of pasta, vegetables, ricotta, and marinara", category: "main", image_url: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400&h=300&fit=crop" },
  { name: "Caesar Salad", description: "Crisp romaine with parmesan, croutons, and Caesar dressing", category: "side", image_url: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop" },
  { name: "Garlic Bread", description: "Toasted baguette with butter, garlic, and herbs", category: "side", image_url: "https://images.unsplash.com/photo-1573140401552-3fab0b24306f?w=400&h=300&fit=crop" },
  { name: "Tiramisu", description: "Italian coffee-flavored dessert with mascarpone", category: "dessert", image_url: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop" },
  { name: "Iced Tea Pitcher", description: "Refreshing iced tea with lemon slices", category: "drink", image_url: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop" },

]

const events = [
  { host_index: 0, title: 'Spring Potluck', description: 'Celebrate spring with fresh seasonal dishes!', event_date: '2026-05-10', event_time: '17:00', location: '123 Maple St, Seattle, WA' },
  { host_index: 1, title: 'Backyard BBQ Bash', description: 'Grilled everything — bring a side or dessert.', event_date: '2026-06-14', event_time: '14:00', location: '456 Oak Ave, Portland, OR' },
  { host_index: 2, title: 'Plant-Based Potluck', description: 'All vegan, all delicious. Show off your best dish!', event_date: '2026-07-04', event_time: '12:00', location: '789 Pine Rd, Austin, TX' },
]

// user_to_event: [user_index, event_index]
const rsvps = [
  [0, 0], [1, 0], [2, 0],
  [0, 1], [1, 1],
  [1, 2], [2, 2],
]

// event_to_recipe: [event_index, recipe_index, user_index]
const claimedDishes = [
  [0, 0, 0],
  [0, 2, 2],
  [1, 1, 1],
  [1, 3, 0],
  [2, 4, 2],
]

// reviews: [user_index, recipe_index, rating, comment]
const reviews = [
  [1, 0, 5, 'The peanut sauce was unreal!'],
  [2, 1, 4, 'So smoky and tender.'],
  [0, 4, 5, 'Best curry I have had in a long time.'],
]

async function seed() {
  const client = await pool.connect()
  try {

    // drop all tables
    const { rows } = await client.query(`
      SELECT string_agg(quote_ident(tablename), ', ') AS tables
      FROM pg_tables
      WHERE schemaname = 'public'
    `);

    if (rows[0].tables) {
      await client.query(`DROP TABLE ${rows[0].tables} CASCADE`);
    }

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id    SERIAL PRIMARY KEY,
        githubid integer NOT NULL,
        username varchar(100) NOT NULL,
        avatarurl varchar(500) NOT NULL,
        accesstoken varchar(500) NOT NULL,
        bio TEXT
      );
    `)

    /**
     *  id    SERIAL PRIMARY KEY,
     *  name  VARCHAR(255) NOT NULL,
        bio   TEXT,
        email VARCHAR(255) UNIQUE NOT NULL
     */

    await client.query(`
      CREATE TABLE IF NOT EXISTS recipes (
        id          SERIAL PRIMARY KEY,
        name        VARCHAR(255) NOT NULL,
        description TEXT,
        category    VARCHAR(50),
        image_url   TEXT
      )
    `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS events (
        id          SERIAL PRIMARY KEY,
        host_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title       VARCHAR(255) NOT NULL,
        description TEXT,
        event_date  DATE,
        event_time  TIME,
        location    VARCHAR(255)
      )
    `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS user_to_event (
        id       SERIAL PRIMARY KEY,
        user_id  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
        UNIQUE (user_id, event_id)
      )
    `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS event_to_recipe (
        id        SERIAL PRIMARY KEY,
        event_id  INTEGER NOT NULL REFERENCES events(id)    ON DELETE CASCADE,
        recipe_id INTEGER NOT NULL REFERENCES recipes(id)   ON DELETE CASCADE,
        user_id   INTEGER NOT NULL REFERENCES users(id)   ON DELETE CASCADE,
        UNIQUE (event_id, recipe_id)
      )
    `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS review (
        id        SERIAL PRIMARY KEY,
        user_id   INTEGER NOT NULL REFERENCES users(id)   ON DELETE CASCADE,
        recipe_id INTEGER NOT NULL REFERENCES recipes(id)   ON DELETE CASCADE,
        rating    INTEGER CHECK (rating >= 1 AND rating <= 5),
        comment   TEXT
      )
    `)

    console.log('Tables created (or already exist)')

    // Clear in reverse dependency order
    await client.query('DELETE FROM review')
    await client.query('DELETE FROM event_to_recipe')
    await client.query('DELETE FROM user_to_event')
    await client.query('DELETE FROM events')
    await client.query('DELETE FROM recipes')
    await client.query('DELETE FROM users')
    console.log('Cleared existing rows')

    // const userIds = []
    // for (const u of users) {
    //   const { rows } = await client.query(
    //     `INSERT INTO users (name, bio, email) VALUES ($1, $2, $3) RETURNING id`,
    //     [u.name, u.bio, u.email]
    //   )
    //   userIds.push(rows[0].id)
    // }
    // console.log(`Seeded ${users.length} users`)

    const recipeIds = []
    for (const r of recipes) {
      const { rows } = await client.query(
        `INSERT INTO recipes (name, description, category, image_url) VALUES ($1, $2, $3, $4) RETURNING id`,
        [r.name, r.description, r.category, r.image_url]
      )
      recipeIds.push(rows[0].id)
    }
    console.log(`Seeded ${recipes.length} recipes`)

    // const eventIds = []
    // for (const e of events) {
    //   const { rows } = await client.query(
    //     `INSERT INTO events (host_id, title, description, event_date, event_time, location)
    //      VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
    //     [userIds[e.host_index], e.title, e.description, e.event_date, e.event_time, e.location]
    //   )
    //   eventIds.push(rows[0].id)
    // }
    // console.log(`Seeded ${events.length} events`)

    // for (const [ui, ei] of rsvps) {
    //   await client.query(
    //     `INSERT INTO user_to_event (user_id, event_id) VALUES ($1, $2)`,
    //     [userIds[ui], eventIds[ei]]
    //   )
    // }
    // console.log(`Seeded ${rsvps.length} RSVPs`)

    // for (const [ei, ri, ui] of claimedDishes) {
    //   await client.query(
    //     `INSERT INTO event_to_recipe (event_id, recipe_id, user_id) VALUES ($1, $2, $3)`,
    //     [eventIds[ei], recipeIds[ri], userIds[ui]]
    //   )
    // }
    // console.log(`Seeded ${claimedDishes.length} claimed dishes`)

    // for (const [ui, ri, rating, comment] of reviews) {
    //   await client.query(
    //     `INSERT INTO review (user_id, recipe_id, rating, comment) VALUES ($1, $2, $3, $4)`,
    //     [userIds[ui], recipeIds[ri], rating, comment]
    //   )
    // }
    // console.log(`Seeded ${reviews.length} reviews`)

  } finally {
    client.release()
    await pool.end()
  }
}

seed().catch(err => { console.error(err); process.exit(1) })
