"""
Dynaconf Settings
"""
from dynaconf import Dynaconf, Validator

settings = Dynaconf(
    environments=True,
    envvar_prefix=False,
    load_dotenv=True,
    settings_files=["unhcr_tss/settings.toml"],
    validators=[
        Validator("cors_enabled", default=False),
        Validator("root_path", default=""),
        Validator("S3_ACCESS_KEY_ID", must_exist=True),
        Validator("S3_SECRET_ACCESS_KEY", must_exist=True),
        Validator("S3_REGION", must_exist=True, default="EU"),
        Validator("S3_Bucket", must_exist=True),
        Validator("S3_Key", must_exist=True, default=""),
        Validator("AUTH_SERVER"),
    ],
)


cors_enabled: bool = settings.cors_enabled  # type: ignore
root_path: str = settings.root_path  # type: ignore
S3_Key: bool = settings.S3_Key  # type: ignore
S3_Key: str = settings.S3_Key  # type: ignore
