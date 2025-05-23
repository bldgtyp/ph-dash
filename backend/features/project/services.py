# -*- Python Version: 3.11 (Render.com) -*-

from sqlalchemy.orm import Session

from db_entities.app.project import Project


class ProjectNotFoundException(Exception):
    """Custom exception for missing project."""

    def __init__(self, bt_number: str):
        self.bt_number = bt_number
        super().__init__(f"Project {bt_number} not found.")


async def get_projects(db: Session, project_ids: list[int]) -> list[Project]:
    return db.query(Project).filter(Project.id.in_(project_ids)).all()


async def get_project_by_bt_number(db: Session, project_bt_number: str) -> Project:
    """Return a project by its BuildingType Number."""

    project = db.query(Project).filter(Project.bt_number == project_bt_number).first()
    if not project:
        raise ProjectNotFoundException(project_bt_number)
    return project
