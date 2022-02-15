from dynaconf import Dynaconf, Validator

settings = Dynaconf(
    envvar_prefix=False,
    validators=[
        Validator("cors_enabled", default=False),
        Validator("root_path", default=""),
        Validator("couchdb_user", must_exist=True),
        Validator("couchdb_password", must_exist=True),
    ],
)

cors_enabled: bool = settings.cors_enabled  # type: ignore
root_path: str = settings.root_path  # type: ignore
couchdb_user: str = settings.couchdb_user  # type: ignore
couchdb_password: str = settings.couchdb_password  # type: ignore
