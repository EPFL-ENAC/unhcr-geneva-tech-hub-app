from typing import Optional
from fastapi import APIRouter, Cookie, Header
import asyncio

# from fastapi import BackgroundTasks, FastAPI
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
from pydantic import BaseModel, EmailStr
from starlette.responses import JSONResponse
from unhcr_tss.config import settings
from requests import put, get, post
from requests.utils import quote


class UserSchema(BaseModel):
    email: EmailStr
    password: Optional[str]


conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_FROM,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,
    # MAIL_STARTTLS=False,
    # MAIL_SSL_TLS=False,
    # USE_CREDENTIALS=False,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True)

confirm_path = "confirm"
default_path = "apps"
reset_password_path = "reset-password"
confirm_registration_message = "confirm registration"
reset_password_message = "reset your password"
html_template = """
<p>{title}</p>
<p>Please click on the link below to {action}.</p>
<p>{HOST_NAME}/{link_path}</p>
<p>This link will remain active for {time} only.</p>
<br/>
<br/>
<p>The UNHCR-TSS team</p>
<p>{HOST_NAME}/{default_path}</p>
"""
html_reset = html_template.format(
    title="You have requested a reset of your password.",
    action=reset_password_message,
    link_path=reset_password_path,
    default_path=default_path,
    HOST_NAME=settings.HOST_NAME,
    time="15 minutes")
html_may_have_forgot = html_template.format(
    title="You seem to already have an account. If you forgot your password.",
    action=reset_password_message,
    link_path=reset_password_path,
    default_path=default_path,
    HOST_NAME=settings.HOST_NAME,
    time="15 minutes")
html_confirm = html_template.format(
    title="You have requested access to the unhcr-tss apps.",
    action=confirm_registration_message,
    link_path=confirm_path,
    default_path=default_path,
    HOST_NAME=settings.HOST_NAME,
    time="24 hours")

router = APIRouter()


# https://github.com/sabuhish/fastapi-mail/tree/master
# https://medium.com/nerd-for-tech/how-to-send-email-using-python-fastapi-947921059f0c
async def send_confirmation(user: UserSchema, title: str, body: str):
    message = MessageSchema(subject="UNHCR-TSS {title}".format(title=title),
                            recipients=[user.email],
                            body=body,
                            subtype=MessageType.html)
    fm = FastMail(conf)
    await fm.send_message(message)


async def authenticate_admin() -> tuple[Cookie, dict[str, str]]:
    headers = {'Content-Type': 'application/x-www-form-urlencoded'}
    r = post(settings.AUTH_SERVER + "/_session",
             headers=headers,
             data='name={login}&password={password}'.format(
                 login=settings.COUCHDB_USER,
                 password=settings.COUCHDB_PASSWORD))
    cookies = r.cookies.get_dict()
    headers["X-CouchDB-WWW-Authenticate"] = "Cookie"
    return cookies, headers


async def get_user(email: str):
    user_encoded = quote(":{user}".format(user=email))
    cookies, headers = await authenticate_admin()
    # [ ] use asyncio for better perf
    return get(settings.AUTH_SERVER +
               "/_users/org.couchdb.user{user_encoded}".format(
                   user_encoded=user_encoded),
               cookies=cookies,
               headers=headers)


@router.post("/register")
async def register_user(user: UserSchema) -> JSONResponse:

    # print(user.email)
    # no .encode('UTF-8')
    # user_email = email.dict().get("email")
    r = await get_user(user.email)
    if (r.status_code == 404):
        # can create a user
        # send confirmation
        await send_confirmation(user, 'Registration', html_confirm)
    else:
        # user already exist do nothing
        await send_confirmation(user, "Forgot your password",
                                html_may_have_forgot)

    # create a user with a waitingConfirmation: true + created_at: new Date() field
    # curl -X PUT http://localhost:5984/_users/org.couchdb.user:jan \
    #  -H "Accept: application/json" \
    #  -H "Content-Type: application/json" \
    #  -d '{"name": "jan", "password": "apple", "roles": [], "type": "user"}'
    # [ ] token is a jwt of contain uuid4 + email
    # [ ] create a waiting confirmation view from users that shows if token is valid
    # [ ] retrieve token document if none => then email verification has expired
    # [ ] else => please enter your password --> login -> change waitingConfirmation field

    # TODO: test creating user

    return JSONResponse(status_code=200,
                        content={"message": "email has been sent"})


# Implement protections against excessive automated submissions such as rate-limiting on a per-account basis, requiring a CAPTCHA, or other controls. Otherwise an attacker could make thousands of password reset requests per hour for a given account, flooding the user's intake system (e.g., email inbox or SMS) with useless requests.
# [ ] The user should confirm the password they set by writing it twice.
# [ ] Ensure that a secure password policy is in place, and is consistent with the rest of the application.
# [ ] Update and store the password following secure practices.
# [ ] Send the user an email informing them that their password has been reset (do not send the password in the email!).
# [ ] Once they have set their new password, the user should then login through the usual mechanism. Don't automatically log the user in, as this introduces additional complexity to the authentication and session handling code, and increases the likelihood of introducing vulnerabilities.
# [ ] Ask the user if they want to invalidate all of their existing sessions, or invalidate the sessions automatically.


@router.post("/forgot-password")
async def forgot_password(user: UserSchema) -> JSONResponse:
    await send_confirmation(user, "Reset Password", html_reset)
    return JSONResponse(status_code=200,
                        content={"message": "email has been sent"})


async def create_token(expiration_in_minutes: int = 15):
    expire: str = (datetime.today() +
                   timedelta(minutes=expiration_in_minutes)).isoformat()
    # [ ] create document in couchdb
    print(expire)
    pass


async def verify_token_validity(token: str):
    # if (token)
    #     return true
    # pass
    pass


@router.post("/verify-token")
async def verify_token(token: str) -> JSONResponse:
    token_valid = await verify_token_validity(token)
    if (token_valid):
        return JSONResponse(
            status_code=200,
            content={"message": "token is valid you may proceed"})
    else:
        # [ ] delete  from couchdb the token
        return JSONResponse(status_code=410, content={"error": ""})


@router.post("/reset-password")
async def reset_password(user: UserSchema) -> JSONResponse:
    #  change user password ?
    await send_confirmation(user, "Password reset", html_reset)
    return JSONResponse(status_code=200,
                        content={"message": "email has been sent"})
