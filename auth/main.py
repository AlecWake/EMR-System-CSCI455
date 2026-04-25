from enum import Enum
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel

#Never used this stuff, if you find an easy fix in something, please leave a comment with a little explanation so i can figure out this stuff better
api = FastAPI()

@api.get("/test/")
async def test():
  return{"test1a" : "test2b"}
