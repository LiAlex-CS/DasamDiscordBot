const services = require("../services");
const { MOCK_VAL_API_RESP } = require("../constants/testing_consts");

describe("JSONHasKey", () => {
  test("JSON should have key", () => {
    const res = MOCK_VAL_API_RESP.ranked_data_success;
    const key = "status";
    result = services.JSONHasKey(key, res);
    expect(result).toBe(true);
  });
  test("JSON should not have key", () => {
    const res = MOCK_VAL_API_RESP.ranked_data_success;
    const key = "res";
    result = services.JSONHasKey(key, res);
    expect(result).toBe(false);
  });
});

describe("JSONHasValue", () => {
  test("JSON should have value", () => {
    const res = MOCK_VAL_API_RESP.ranked_data_success;
    const value = 200;
    result = services.JSONHasValue(value, res);
    expect(result).toBe(true);
  });
  test("JSON should not have value", () => {
    const res = MOCK_VAL_API_RESP.ranked_data_success;
    const value = 400;
    result = services.JSONHasValue(value, res);
    expect(result).toBe(false);
  });
});
