const { buildSchema } = require('graphql');
const cards = require('./data');

/* eslint-disable */
const categories = Array.from(
  new Set(cards
    .map(card => card.categories)
    .reduce((curr, prev) => [...prev, ...curr])
  )
);
const drugs = Array.from(
  new Set(cards
    .filter(card => card.drugs)
    .map(card => card.drugs)
    .reduce((curr, prev) => [...prev, ...curr])
  )
)
/* eslint-enable */

exports.schema = buildSchema(`
  type Card {
    id: ID!
    title: String
    authors: [String]
    created: Float
    updates: [Int]
    categories: [String]
    drugs: [String]
    content: String
    hash: String
  }

  type Query {
    cards(category: String, drug: String): [Card]
    card(id: ID!): Card
    categories: [String]
    recentlyAdded(n: Int): [Card]
    recentlyUpdated(n: Int): [Card]
    search(input: String): [Card]
  }
`);

// Root Resolver
exports.rootValue = {
  cards: ({ category, drug }) => {
    if (!category && !drug) return cards;
    if (!category && drug) return cards.filter(c => c.drugs.indexOf(drug) !== -1);
    if (category && !drug) return cards.filter(c => c.categories.indexOf(category) !== -1);
    return cards.filter(c => c.categories.indexOf(category) !== -1 && c.drugs.indexOf(drug) !== -1);
  },
  card: ({ id }) => cards.find(card => card.id === id),
  categories: () => categories,
  recentlyAdded: ({ n }) => (
    [...cards].sort((a, b) => {
      if (a.created < b.created) return 1;
      if (a.created > b.created) return -1;
      return 0;
    })
    .slice(0, n || 5)
  ),
  recentlyUpdated: ({ n }) => (
    cards.filter(card => card.updates)
    .sort((a, b) => {
      if (a.updates[0] < b.updates[0]) return 1;
      if (a.updates[0] > b.updates[0]) return -1;
      return 0;
    })
    .slice(0, n || 5)
  ),
  search: ({ input }) => {
    if (!input) return [];
    const re = new RegExp(` ${input}`, 'gi');
    return cards.filter(card => re.test(card.content)).slice(0, 5);
  },
};
