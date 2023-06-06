const { helpCommand } = require("../../command_functions/help_command");
const { MOCK_COMMANDS } = require("../../constants/testing_consts");
const {
  COMMAND_DESCRIPTIONS,
  ALL_COMMANDS,
  COMMANDS,
  COMMAND_ERRORS,
} = require("../../constants/commands");

const { stringArrToString } = require("../../services");

describe("Test help command", () => {
  const HELP_COMMAND = MOCK_COMMANDS.help_command;
  const mockMessage = {};
  mockMessage.reply = jest.fn();

  afterEach(() => {
    mockMessage.reply.mockClear();
  });

  test("Should message with all bot commands", () => {
    helpCommand(mockMessage, HELP_COMMAND.command, HELP_COMMAND.no_args);

    expect(mockMessage.reply.mock.calls).toHaveLength(1);
    expect(mockMessage.reply.mock.calls[0][0]).toBe(ALL_COMMANDS);
  });

  test("Should message with help description", () => {
    helpCommand(mockMessage, HELP_COMMAND.command, HELP_COMMAND.valid_args);

    const key = Object.keys(COMMANDS).find(
      (key) => COMMANDS[key] === HELP_COMMAND.valid_args[0]
    );

    expect(mockMessage.reply.mock.calls).toHaveLength(1);
    expect(mockMessage.reply.mock.calls[0][0]).toBe(COMMAND_DESCRIPTIONS[key]);
  });

  test("Should message with arugment lenght error", () => {
    helpCommand(mockMessage, HELP_COMMAND.command, HELP_COMMAND.invalid_args);

    expect(mockMessage.reply.mock.calls).toHaveLength(1);
    expect(mockMessage.reply.mock.calls[0][0]).toBe(
      `*${HELP_COMMAND.command} ${stringArrToString(
        HELP_COMMAND.invalid_args
      )}* ${COMMAND_ERRORS.getCommands}`
    );
  });
});
