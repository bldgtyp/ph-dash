# -*- Python Version: 3.11 -*-

from __future__ import annotations  # Enables forward references

from pydantic import BaseModel


class MaterialPhotoSchema(BaseModel):
    id: int
    segment_id: int
    full_size_url: str
    thumbnail_url: str

    class Config:
        orm_mode = True
