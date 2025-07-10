class HobGameState:
    def __init__(self):
        self.next_number = 1
        self.needs_correction = False
        self.correct_num = None

    def reset(self):
        self.__init__()

    @staticmethod
    def hob_check_response(number):
        return "HOB" if number % 5 == 0 else number
    
    @staticmethod
    def is_integer(s):
        try:
            int(s)
            return True
        except ValueError:
            return False

    def handle_user_input(self, user_input):
        if HobGameState.is_integer(user_input):
            user_input = int(user_input)

        if self.needs_correction:
            if user_input != self.correct_num:
                return f"Incorrect. Expected: {self.correct_num}"
            self.needs_correction = False
            self.correct_num = None
            self.next_number += 1
            server_reply = HobGameState.hob_check_response(self.next_number)
            self.next_number += 1
            return server_reply

        expected = HobGameState.hob_check_response(self.next_number)
        if user_input != expected:
            self.needs_correction = True
            self.correct_num = expected
            return f"Incorrect input. Expected: {expected}"

        self.next_number += 1
        server_reply = HobGameState.hob_check_response(self.next_number)
        self.next_number += 1
        return f"Server says: {server_reply}"


hob_game = HobGameState()

user_input = False
while user_input != "end":
    user_input = input("You:\t")

    response = hob_game.handle_user_input(user_input)
    print(f"System:\t{response}")