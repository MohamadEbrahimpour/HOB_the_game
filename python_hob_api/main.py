from fastapi import FastAPI, Form, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Game state
next_number = 1
waiting_for_fix = False
expected = None

def check_response(n: int):
    return "HOB" if n % 5 == 0 else n

@app.get("/poll")
def poll():
    # Return server message if waiting for user, or empty if server move done
    global waiting_for_fix, expected, next_number
    if waiting_for_fix:
        return JSONResponse(content={"message": f"Waiting for correct input: '{expected}'", "waiting": True})
    else:
        # no new server move to report
        return JSONResponse(content={"message": "", "waiting": False})

@app.post("/play")
def play(message: int = Form(...)):
    global next_number, waiting_for_fix, expected

    if waiting_for_fix:
        if message != expected:
            raise HTTPException(status_code=400, detail=f"Wrong. Expected: '{expected}'")
        waiting_for_fix = False
        expected = None
        next_number += 1
        server_msg = check_response(next_number)
        next_number += 1
        return {"message": f"Correct! Server says: {server_msg}"}

    correct = check_response(next_number)
    if message != correct:
        waiting_for_fix = True
        expected = correct
        raise HTTPException(status_code=400, detail=f"Wrong. Expected: '{correct}'")

    next_number += 1
    server_msg = check_response(next_number)
    next_number += 1
    return {"message": f"Server says: {server_msg}"}

@app.post("/reset")
def reset():
    global next_number, waiting_for_fix, expected
    next_number = 1
    waiting_for_fix = False
    expected = None
    return {"message": "Game reset."}
