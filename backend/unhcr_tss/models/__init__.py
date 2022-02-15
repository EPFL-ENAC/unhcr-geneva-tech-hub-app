"""
Model definitions
"""
from pydantic import BaseModel


class Info(BaseModel):
    """
    App Info
    """

    name: str
    version: str
