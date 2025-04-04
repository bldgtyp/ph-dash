# -*- Python Version: 3.11 (Render.com) -*-

from logging import getLogger

import requests
from sqlalchemy.orm import Session

from db_entities.airtable.at_table import AirTableTable
from features.project.services import get_project_by_bt_number

logger = getLogger(__name__)

class TableNotFoundException(Exception):
    """Custom exception for missing table in AirTable."""
    def __init__(self, table_name: str):
        self.table_name = table_name
        super().__init__(f"Table {table_name} not found in AirTable.")


class DownloadError(Exception):
    """Custom exception for download errors."""
    def __init__(self, url: str, message: str):
        super().__init__(f"DownloadError: Failed to download from URL: {url} | {message}")


async def get_airtable_base_ref(db: Session, project_bt_num: int) -> str:
    """Get the AirTable Base Ref by the project-BT-number."""
    project = await get_project_by_bt_number(db, project_bt_num)
    return project.airtable_base_ref


async def get_airtable_table_ref(
    db: Session, project_bt_num: int, table_name: str 
) -> str:
    """Get the AirTable Table Ref given a project-BT-number and table name."""
    
    # -- Find the Project
    project = await get_project_by_bt_number(db, project_bt_num)

    # -- Find the Table
    table = (
        db.query(AirTableTable)
        .filter(
            AirTableTable.parent_base_id == project.id,
            AirTableTable.name == table_name.upper(),
        )
        .first()
    )
    if not table:
        raise TableNotFoundException(table_name)

    return str(table.airtable_ref)


async def download_hbjson_file(url: str) -> dict:
    """Download the HBJSON File from the specified URL and return the content as JSON."""
    logger.info(f"download_hbjson_file(url={url[0:25]}...)")
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for HTTP errors
    except requests.exceptions.RequestException as e:
        logger.error(f"Failed to download {url}: {e}")
        raise DownloadError(url, str(e))
    return response.json()


async def download_epw_file(url: str) -> str:
    """Download the EPW data from the specified URL and return the content as a string."""
    logger.info(f"download_epw_file(url={url[0:25]}...)")
    try:
        # -- Download the EPW File
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for HTTP errors
    except requests.exceptions.RequestException as e:
        logger.error(f"Failed to download {url}: {e}")
        raise DownloadError(url, str(e))

    try:
        # -- Decode the file content (EPW files are plain text)
        return str(response.content.decode("utf-8"))
    except UnicodeDecodeError as e:
        logger.error(f"Failed to decode EPW file content: {e}")
        raise DownloadError(url, str(e))
