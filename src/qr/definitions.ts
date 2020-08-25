const table = {
  1: {
    remainderBits: 0,
    alignmentPatterns: [],
    L: {
      ecPerBlock: 7,
      groups: [
        {
          blocks: 1,
          dataCodeWordsPerBlock: 19,
        },
      ],
    },
    M: {
      ecPerBlock: 10,
      groups: [
        {
          blocks: 1,
          dataCodeWordsPerBlock: 16,
        },
      ],
    },
    Q: {
      ecPerBlock: 13,
      groups: [
        {
          blocks: 1,
          dataCodeWordsPerBlock: 13,
        },
      ],
    },
    H: {
      ecPerBlock: 17,
      groups: {
        1: {
          blocks: 1,
          dataCodeWordsPerBlock: 9,
        },
      },
    },
  },
  2: {
    remainderBits: 7,
    alignmentPatterns: [6, 18],
    L: {
      ecPerBlock: 10,
      groups: [
        {
          blocks: 1,
          dataCodeWordsPerBlock: 34,
        },
      ],
    },
    M: {
      ecPerBlock: 16,
      groups: [
        {
          blocks: 1,
          dataCodeWordsPerBlock: 28,
        },
      ],
    },
    Q: {
      ecPerBlock: 22,
      groups: [
        {
          blocks: 1,
          dataCodeWordsPerBlock: 22,
        },
      ],
    },
    H: {
      ecPerBlock: 28,
      groups: [
        {
          blocks: 1,
          dataCodeWordsPerBlock: 16,
        },
      ],
    },
  },
  3: {
    remainderBits: 7,
    alignmentPatterns: [6, 22],
    L: {
      ecPerBlock: 15,
      groups: [
        {
          blocks: 1,
          dataCodeWordsPerBlock: 55,
        },
      ],
    },
    M: {
      ecPerBlock: 26,
      groups: [
        {
          blocks: 1,
          dataCodeWordsPerBlock: 44,
        },
      ],
    },
    Q: {
      ecPerBlock: 18,
      groups: [
        {
          blocks: 2,
          dataCodeWordsPerBlock: 17,
        },
      ],
    },
    H: {
      ecPerBlock: 22,
      groups: [
        {
          blocks: 2,
          dataCodeWordsPerBlock: 13,
        },
      ],
    },
  },
  4: {
    remainderBits: 7,
    alignmentPatterns: [6, 26],
    L: {
      ecPerBlock: 20,
      groups: [
        {
          blocks: 1,
          dataCodeWordsPerBlock: 80,
        },
      ],
    },
    M: {
      ecPerBlock: 18,
      groups: [
        {
          blocks: 2,
          dataCodeWordsPerBlock: 32,
        },
      ],
    },
    Q: {
      ecPerBlock: 26,
      groups: [
        {
          blocks: 2,
          dataCodeWordsPerBlock: 24,
        },
      ],
    },
    H: {
      ecPerBlock: 16,
      groups: [
        {
          blocks: 4,
          dataCodeWordsPerBlock: 9,
        },
      ],
    },
  },
  5: {
    remainderBits: 7,
    alignmentPatterns: [6, 30],
    L: {
      ecPerBlock: 26,
      groups: [
        {
          blocks: 1,
          dataCodeWordsPerBlock: 108,
        },
      ],
    },
    M: {
      ecPerBlock: 24,
      groups: [
        {
          blocks: 2,
          dataCodeWordsPerBlock: 43,
        },
      ],
    },
    Q: {
      ecPerBlock: 18,
      groups: [
        {
          blocks: 2,
          dataCodeWordsPerBlock: 15,
        },
        {
          blocks: 2,
          dataCodeWordsPerBlock: 16,
        },
      ],
    },
    H: {
      ecPerBlock: 22,
      groups: [
        {
          blocks: 2,
          dataCodeWordsPerBlock: 11,
        },
        {
          blocks: 2,
          dataCodeWordsPerBlock: 12,
        },
      ],
    },
  },
}
export default table
