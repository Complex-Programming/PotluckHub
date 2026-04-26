import pg from 'pg'

const pool = new pg.Pool({
  user:     'postgres',
  password: 'postgres',
  host:     '34.82.218.175',
  port:     5432,
  database: 'postgres',
})

const users = [
  { name: 'Alice Nguyen',  bio: 'Home cook obsessed with Southeast Asian flavors.', email: 'alice@example.com' },
  { name: 'Marcus Bell',   bio: 'Grill master and weekend baker.',                  email: 'marcus@example.com' },
  { name: 'Sofia Reyes',   bio: 'Plant-based food enthusiast.',                     email: 'sofia@example.com' },
]

const recipes = [
  { name: 'Vietnamese Spring Rolls',   description: 'Fresh rice paper rolls with shrimp, herbs, and peanut dipping sauce.', category: 'Appetizer',  image_url: null },
  { name: 'Smoked BBQ Brisket',        description: 'Low-and-slow smoked brisket with a dry rub and tangy mop sauce.',       category: 'Main',       image_url: null },
  { name: 'Mango Avocado Salad',       description: 'Light salad with mango, avocado, red onion, and lime vinaigrette.',     category: 'Side',       image_url: null },
  { name: 'Banana Pudding',            description: 'Classic Southern banana pudding with vanilla wafers and whipped cream.', category: 'Dessert',    image_url: null },
  { name: 'Lentil Coconut Curry',      description: 'Creamy red lentil curry with coconut milk, ginger, and tomatoes.',      category: 'Main',       image_url: null },
]

const events = [
  { host_index: 0, title: 'Spring Potluck',      description: 'Celebrate spring with fresh seasonal dishes!',       event_date: '2026-05-10', event_time: '17:00', location: '123 Maple St, Seattle, WA' },
  { host_index: 1, title: 'Backyard BBQ Bash',   description: 'Grilled everything — bring a side or dessert.',      event_date: '2026-06-14', event_time: '14:00', location: '456 Oak Ave, Portland, OR' },
  { host_index: 2, title: 'Plant-Based Potluck', description: 'All vegan, all delicious. Show off your best dish!', event_date: '2026-07-04', event_time: '12:00', location: '789 Pine Rd, Austin, TX' },
]

const rsvps = [
  [0, 0], [1, 0], [2, 0],
  [0, 1], [1, 1],
  [1, 2], [2, 2],
]

const claimedDishes = [
  [0, 0, 0],
  [0, 2, 2],
  [1, 1, 1],
  [1, 3, 0],
  [2, 4, 2],
]

const reviews = [
  [1, 0, 5, 'The peanut sauce was unreal!'],
  [2, 1, 4, 'So smoky and tender.'],
  [0, 4, 5, 'Best curry I have had in a long time.'],
]

async function seed() {
  const client = await pool.connect()
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS "user" (
        id    SERIAL PRIMARY KEY,
        name  VARCHAR(255) NOT NULL,
        bio   TEXT,
        email VARCHAR(255) UNIQUE NOT NULL
      )`)
    await client.query(`
      CREATE TABLE IF NOT EXISTS recipe (
        id          SERIAL PRIMARY KEY,
        name        VARCHAR(255) NOT NULL,
        description TEXT,
        category    VARCHAR(50),
        image_url   TEXT
      )`)
    await client.query(`
      CREATE TABLE IF NOT EXISTS event (
        id          SERIAL PRIMARY KEY,
        host_id     INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
        title       VARCHAR(255) NOT NULL,
        description TEXT,
        event_date  DATE,
        event_time  TIME,
        location    VARCHAR(255)
      )`)
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_to_event (
        id       SERIAL PRIMARY KEY,
        user_id  INTEGER NOT NULL REFERENCES "user"(id)  ON DELETE CASCADE,
        event_id INTEGER NOT NULL REFERENCES event(id)   ON DELETE CASCADE,
        UNIQUE (user_id, event_id)
      )`)
    await client.query(`
      CREATE TABLE IF NOT EXISTS event_to_recipe (
        id        SERIAL PRIMARY KEY,
        event_id  INTEGER NOT NULL REFERENCES event(id)  ON DELETE CASCADE,
        recipe_id INTEGER NOT NULL REFERENCES recipe(id) ON DELETE CASCADE,
        user_id   INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
        UNIQUE (event_id, recipe_id)
      )`)
    await client.query(`
      CREATE TABLE IF NOT EXISTS review (
        id        SERIAL PRIMARY KEY,
        user_id   INTEGER NOT NULL REFERENCES "user"(id)   ON DELETE CASCADE,
        recipe_id INTEGER NOT NULL REFERENCES recipe(id)   ON DELETE CASCADE,
        rating    INTEGER CHECK (rating >= 1 AND rating <= 5),
        comment   TEXT
      )`)
    console.log('Tables created')

    await client.query('DELETE FROM review')
    await client.query('DELETE FROM event_to_recipe')
    await client.query('DELETE FROM user_to_event')
    await client.query('DELETE FROM event')
    await client.query('DELETE FROM recipe')
    await client.query('DELETE FROM "user"')
    console.log('Cleared existing rows')

    const userIds = []
    for (const u of users) {
      const { rows } = await client.query(
        `INSERT INTO "user" (name, bio, email) VALUES ($1, $2, $3) RETURNING id`,
        [u.name, u.bio, u.email])
      userIds.push(rows[0].id)
    }
    console.log(`Seeded ${users.length} users`)

    const recipeIds = []
    for (const r of recipes) {
      const { rows } = await client.query(
        `INSERT INTO recipe (name, description, category, image_url) VALUES ($1, $2, $3, $4) RETURNING id`,
        [r.name, r.description, r.category, r.image_url])
      recipeIds.push(rows[0].id)
    }
    console.log(`Seeded ${recipes.length} recipes`)

    const eventIds = []
    for (const e of events) {
      const { rows } = await client.query(
        `INSERT INTO event (host_id, title, description, event_date, event_time, location) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [userIds[e.host_index], e.title, e.description, e.event_date, e.event_time, e.location])
      eventIds.push(rows[0].id)
    }
    console.log(`Seeded ${events.length} events`)

    for (const [ui, ei] of rsvps) {
      await client.query(
        `INSERT INTO user_to_event (user_id, event_id) VALUES ($1, $2)`,
        [userIds[ui], eventIds[ei]])
    }
    console.log(`Seeded ${rsvps.length} RSVPs`)

    for (const [ei, ri, ui] of claimedDishes) {
      await client.query(
        `INSERT INTO event_to_recipe (event_id, recipe_id, user_id) VALUES ($1, $2, $3)`,
        [eventIds[ei], recipeIds[ri], userIds[ui]])
    }
    console.log(`Seeded ${claimedDishes.length} claimed dishes`)

    for (const [ui, ri, rating, comment] of reviews) {
      await client.query(
        `INSERT INTO review (user_id, recipe_id, rating, comment) VALUES ($1, $2, $3, $4)`,
        [userIds[ui], recipeIds[ri], rating, comment])
    }
    console.log(`Seeded ${reviews.length} reviews`)

  } finally {
    client.release()
    await pool.end()
  }
}

seed().catch(err => { console.error(err); process.exit(1) })
