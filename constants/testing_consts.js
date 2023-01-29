const MOCK_VAL_API_RESP = {
  ranked_data_success: {
    status: 200,
    data: {
      currenttier: 15,
      currenttierpatched: "Platinum 1",
      images: {
        small:
          "https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/11/smallicon.png",
        large:
          "https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/11/largeicon.png",
        triangle_down:
          "https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/11/ranktriangledownicon.png",
        triangle_up:
          "https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/11/ranktriangleupicon.png",
      },
      ranking_in_tier: 11,
      mmr_change_to_last_game: -12,
      elo: 1211,
      name: "nugnug",
      tag: "6135",
      old: false,
    },
  },
};

module.exports = { MOCK_VAL_API_RESP };
