from typing import Optional, List
from fastapi import APIRouter, Cookie, Header
import asyncio
import json
from datetime import datetime, timedelta
import uuid
import base64

from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
from pydantic import BaseModel, EmailStr, Field
from starlette.responses import JSONResponse
from unhcr_tss.config import settings
from requests import put, get, post, Response
from requests.utils import quote  # type: ignore
from random import uniform
from time import sleep


class EmailSchema(BaseModel):
    name: EmailStr


class SimpleUserSchema(EmailSchema):
    password: Optional[str] = None


class UserSchema(SimpleUserSchema):
    roles: Optional[List[str]] = ["shelter", "user"]
    type: Optional[str] = "user"
    unconfirmed: Optional[bool] = None


class UserWithRevSchema(UserSchema):
    id: Optional[str] = Field(None, alias='_id')
    rev: Optional[str] = Field(None, alias='_rev')


class PasswordSchema(BaseModel):
    password: str


class PasswordSchemaWithToken(PasswordSchema):
    token: str


conf = ConnectionConfig(MAIL_USERNAME=settings.MAIL_USERNAME,
                        MAIL_PASSWORD=settings.MAIL_PASSWORD,
                        MAIL_FROM=settings.MAIL_FROM,
                        MAIL_PORT=settings.MAIL_PORT,
                        MAIL_SERVER=settings.MAIL_SERVER,
                        MAIL_STARTTLS=settings.MAIL_STARTTLS,
                        MAIL_SSL_TLS=settings.MAIL_SSL_TLS,
                        USE_CREDENTIALS=settings.USE_CREDENTIALS,
                        VALIDATE_CERTS=True)

confirm_path = "confirm"
default_path = "apps"
login_path = "login"
reset_password_path = "reset-password"
confirm_registration_message = "confirm registration"
reset_password_message = "reset your password"
html_template = """
<p>{title}</p>
<p>Please click on the link below to {action}.</p>
<p>{HOST_NAME}/{link_path}?token={token}</p>
<p>This link will remain active for {time} only.</p>
<br/>
<br/>
<p>The UNHCR-TSS team</p>
<p>
<a href="{HOST_NAME}/{default_path}">{HOST_NAME}/{default_path}</a></p>
"""
html_reset = html_template.format(
    title="You have requested a reset of your password.",
    action=reset_password_message,
    link_path=reset_password_path,
    default_path=default_path,
    HOST_NAME=settings.HOST_NAME,
    time="15 minutes",
    token="{token}")
html_may_have_forgot = html_template.format(
    title="You already have an account.",
    action=reset_password_message,
    link_path=reset_password_path,
    default_path=default_path,
    HOST_NAME=settings.HOST_NAME,
    time="15 minutes",
    token="{token}")
html_confirm = html_template.format(
    title="You have requested access to the unhcr-tss apps.",
    action=confirm_registration_message,
    link_path=confirm_path,
    default_path=default_path,
    HOST_NAME=settings.HOST_NAME,
    time="24 hours",
    token="{token}")
html_reset_success = """
<p>You have successfully reset your password.</p>
<br/>
<br/>
<p>The UNHCR-TSS team</p>
<p><a href="{HOST_NAME}/{default_path}">{HOST_NAME}/{default_path}</a></p>""".format(
    default_path=login_path,
    HOST_NAME=settings.HOST_NAME,
)

html_confirm_success = """
<p>You have successfully confirm your password.</p>
<br/>
<br/>
<p>The UNHCR-TSS team</p>
<p><a href="{HOST_NAME}/{default_path}">{HOST_NAME}/{default_path}</a></p>""".format(
    default_path=login_path,
    HOST_NAME=settings.HOST_NAME,
)

router = APIRouter()


# https://github.com/sabuhish/fastapi-mail/tree/master
# https://medium.com/nerd-for-tech/how-to-send-email-using-python-fastapi-947921059f0c
async def send_email(user: EmailSchema, title: str, body: str, token: str):
    message = MessageSchema(subject="UNHCR-TSS {title}".format(title=title),
                            recipients=[user.name],
                            body=body.format(token=token),
                            subtype=MessageType.html)
    fm = FastMail(conf)
    await fm.send_message(message)


async def authenticate_admin() -> tuple[Cookie, dict[str, str]]:
    return await authenticate(settings.COUCHDB_USER, settings.COUCHDB_PASSWORD)


async def authenticate(
        name: str, password: str) -> tuple[Cookie, dict[str, str], Response]:
    headers = {'Content-Type': 'application/x-www-form-urlencoded'}
    r = post(settings.AUTH_SERVER + "/_session",
             headers=headers,
             data='name={name}&password={password}'.format(name=name,
                                                           password=password))
    # // fail silently
    cookies = r.cookies.get_dict()
    headers["X-CouchDB-WWW-Authenticate"] = "Cookie"
    return cookies, headers, r


async def get_user(email: str):
    user_encoded = quote(":{user}".format(user=email))
    cookies, headers, r = await authenticate_admin()
    # [ ] use asyncio for better perf
    return get(settings.AUTH_SERVER +
               "/_users/org.couchdb.user{user_encoded}".format(
                   user_encoded=user_encoded),
               cookies=cookies,
               headers=headers)


async def create_user(user: SimpleUserSchema):
    # curl -X PUT http://localhost:5984/_users/org.couchdb.user:jan \
    #  -H "Accept: application/json" \
    #  -H "Content-Type: application/json" \
    #  -d '{"name": "jan", "password": "apple", "roles": [], "type": "user"}'
    user_encoded = quote(":{user}".format(user=user.name))
    cookies, headers, r = await authenticate_admin()
    # [ ] use asyncio for better perf
    headers['Content-Type'] = 'application/json'
    new_user = UserSchema(**user.dict())
    new_user.roles.append("unconfirmed")
    new_user.unconfirmed = True
    return put(settings.AUTH_SERVER +
               "/_users/org.couchdb.user{user_encoded}".format(
                   user_encoded=user_encoded),
               cookies=cookies,
               headers=headers,
               data=new_user.json())


async def confirm_user(user: UserSchema, password: str) -> JSONResponse:
    # [ ] Endpoint should be protected or user identitifed
    # [ ] use asyncio for better perf

    r = await get_user(
        user.name)  # maybe unecessary ? since we hhave the user at the top

    _, _, authenticate_response = await authenticate(user.name, password)
    if (authenticate_response.status_code != 200):
        print(authenticate_response.json())
        return JSONResponse(status_code=authenticate_response.status_code,
                            content={
                                "message":
                                authenticate_response.json().get(
                                    "reason", "Password does not match")
                            })
    latest_user = r.json()
    latest_user.pop("unconfirmed", None)
    latest_user["roles"] = ["shelter", "user"]
    print(latest_user)

    # new_user = SimpleUserSchema(name=user.name,
    #                             password=new_password,
    #                             roles=user.roles,
    #                             type=user.type)
    # user_encoded = quote(":{user}".format(user=user.name))
    # cookies, headers = await authenticate_admin()
    # # [ ] use asyncio for better perf
    # headers['Content-Type'] = 'application/json'
    # headers['If-Match'] = user.rev
    # return put(settings.AUTH_SERVER +
    #            "/_users/org.couchdb.user{user_encoded}".format(
    #                user_encoded=user_encoded),
    #            cookies=cookies,
    #            headers=headers,
    #            data=new_user.json())

    user_encoded = quote(":{user}".format(user=user.name))
    cookies, headers, r = await authenticate_admin()
    headers['Content-Type'] = 'application/json'
    update_response = put(settings.AUTH_SERVER +
                          "/_users/org.couchdb.user{user_encoded}".format(
                              user_encoded=user_encoded),
                          cookies=cookies,
                          headers=headers,
                          data=json.dumps(latest_user))
    await send_email(user,
                     "Registration complete",
                     html_confirm_success,
                     token="")
    return JSONResponse(update_response.json())


async def create_token(email: str, expiration_in_minutes: int = 15) -> str:
    expire: str = (datetime.today() +
                   timedelta(minutes=expiration_in_minutes)).isoformat()
    # [ ] create document in couchdb
    cookies, headers, r = await authenticate_admin()
    headers['Content-Type'] = 'application/json'
    # id unique is uuid4 + email in base 64
    # base64.b64encode(b'Hello World!')
    _id = "{uuid}{email}".format(uuid=str(uuid.uuid4()),
                                 email=base64.b64encode(
                                     email.encode('ascii')).decode('ascii'))
    # TODO: delete all previous token associated with that email
    r = post(
        settings.AUTH_SERVER + "/tokens",
        cookies=cookies,
        headers=headers,
        data=json.dumps({
            "expire_at": expire,
            "_id": _id,
            "email": email  # TODO should probably encrypt email there
        }))
    return quote(r.json().get("id", ""))


async def verify_token_validity(token: str):
    cookies, headers, r = await authenticate_admin()
    # todo: use a views to retrieve not expired token
    r = get(settings.AUTH_SERVER + "/tokens/{token}".format(token=token),
            cookies=cookies,
            headers=headers)
    return r


def find_tokens_by_email(email: str) -> List[str]:
    return []


def remove_tokens(tokens: List[str]) -> List[str]:
    # bulk delete post
    return []


def remove_email_tokens(email: str):
    tokens = find_tokens_by_email(email)
    remove_tokens(tokens)


async def update_user_password(email: str, new_password: str):
    # The user should confirm the password they set by writing it twice. (in the frontend)
    # [ ] Ensure that a secure password policy is in place, and is consistent with the rest of the application.
    userResponse = await get_user(email)
    # Update and store the password following secure practices.
    user = UserWithRevSchema(**userResponse.json())
    new_user = UserSchema(name=user.name,
                          password=new_password,
                          roles=user.roles,
                          type=user.type)
    if (user.unconfirmed):
        new_user.unconfirmed = True
    user_encoded: str = quote(":{user}".format(user=user.name))
    cookies, headers, r = await authenticate_admin()
    # [ ] use asyncio for better perf
    headers['Content-Type'] = 'application/json'
    headers['If-Match'] = user.rev or ""
    return put(settings.AUTH_SERVER +
               "/_users/org.couchdb.user{user_encoded}".format(
                   user_encoded=user_encoded),
               cookies=cookies,
               headers=headers,
               data=new_user.json())


async def send_confirmation_email(user: EmailSchema):
    # [ ] validate user.password complexity here
    temp_id = await create_token(email=user.name,
                                 expiration_in_minutes=24 * 60)
    await send_email(user, 'Registration', html_confirm, token=temp_id)


@router.post("/register")
async def register_user(user: SimpleUserSchema) -> JSONResponse:
    r = await get_user(user.name)

    if (r.status_code == 404):
        # can create a user
        r = await create_user(user)
        if (r.status_code != 201):
            raise ValueError(
                "could not create user: {message}".format(message=r.json()))
        await send_confirmation_email(user)
    else:
        # user already exist do nothing
        if (r.json().get("unconfirmed", False)):
            # user is unconfirmed
            # change password and update user
            if (user.password == ""):
                raise ValueError("password should not be empty")
            await update_user_password(user.name, user.password or "")
            await send_confirmation_email(user)
        else:
            temp_id = await create_token(email=user.name,
                                         expiration_in_minutes=15)
            await send_email(user,
                             "Forgot your password ?",
                             html_may_have_forgot,
                             token=temp_id)

    # [ ] retrieve token document if none => then email verification has expired
    # [ ] else => please enter your password --> login -> change unconfirmed field

    return JSONResponse(status_code=200,
                        content={"message": "email has been sent"})


@router.post("/send-confirmation")
async def send_confirmation(user: EmailSchema) -> JSONResponse:
    r = await get_user(user.name)

    if (r.status_code == 404):
        # We do nothing; but we don't inform the user that it does not exist
        # to avoid user leaks
        # to have same processing time as the else condition
        sleep(uniform(0.8, 1.2))
    else:
        # user already exist do nothing
        if (r.json().get("unconfirmed", False)):
            #  user is unconfirmed
            await send_confirmation_email(user)
        else:
            temp_id = await create_token(email=user.name,
                                         expiration_in_minutes=15)
            await send_email(user,
                             "Forgot your password ?",
                             html_may_have_forgot,
                             token=temp_id)

    # [ ] retrieve token document if none => then email verification has expired
    # [ ] else => please enter your password --> login -> change unconfirmed field

    return JSONResponse(status_code=200,
                        content={"message": "email has been sent"})


@router.post("/confirm-registration")
async def confirm_registration(
        payload: PasswordSchemaWithToken) -> JSONResponse:
    token_valid = await verify_token_validity(payload.token)
    # [ ] purge outdated token
    # [ ] content={"message": "token is valid you may proceed"})
    if (token_valid):
        print(token_valid.json().get("email", ""))
        user = await get_user(token_valid.json().get("email", ""))
        resp = await confirm_user(UserSchema(**user.json()),
                                  password=payload.password)
        print(resp)
        return resp
    else:
        # [ ] delete from couchdb the token
        return JSONResponse(status_code=410,
                            content={"error": "Confirmation link has expired"})


@router.post("/forgot-password")
async def forgot_password(user: EmailSchema) -> JSONResponse:
    temp_id = await create_token(email=user.name, expiration_in_minutes=15)
    await send_email(user, "Reset Password", html_reset, token=temp_id)
    return JSONResponse(status_code=200,
                        content={"message": "email has been sent"})


#  The following may be not necessary
@router.post("/verify-token")
async def verify_token(token: str) -> JSONResponse:
    # retrieve user from token
    token_valid = await verify_token_validity(token)
    if (token_valid):
        # await confirm_user() maybe
        return JSONResponse(
            status_code=200,
            content={"message": "token is valid you may proceed"})
    else:
        # [ ] delete  from couchdb the token
        return JSONResponse(status_code=410,
                            content={"error": "Confirmation link has expired"})


@router.post("/reset-password")
async def reset_password(payload: PasswordSchemaWithToken) -> JSONResponse:
    # https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html
    # check that the token is valid and that the user associated with the token match
    # the current user

    # Implement protections against excessive automated submissions such as rate-limiting on a per-account basis, requiring a CAPTCHA, or other controls. Otherwise an attacker could make thousands of password reset requests per hour for a given account, flooding the user's intake system (e.g., email inbox or SMS) with useless requests.
    # [ ] The user should confirm the password they set by writing it twice.
    # [ ] Ensure that a secure password policy is in place, and is consistent with the rest of the application.
    # [ ] Update and store the password following secure practices.
    # [ ] Send the user an email informing them that their password has been reset (do not send the password in the email!).
    # [ ] Once they have set their new password, the user should then login through the usual mechanism. Don't automatically log the user in, as this introduces additional complexity to the authentication and session handling code, and increases the likelihood of introducing vulnerabilities.
    # [ ] Ask the user if they want to invalidate all of their existing sessions, or invalidate the sessions automatically.

    token_valid = await verify_token_validity(payload.token)
    if (token_valid.status_code == 404):
        return JSONResponse(status_code=410,
                            content="Confirmation link has expired")

    email = token_valid.json().get("email", "")
    updateResponse = await update_user_password(email, payload.password)
    print("update password response", updateResponse.status_code)
    print("update password response", updateResponse.json())

    # Send the user an email informing them that their password has been reset (do not send the password in the email!).
    await send_email(user=UserSchema(name=email),
                     title="Reset Successful",
                     body=html_reset_success,
                     token="")

    # Once they have set their new password, the user should then login through the usual mechanism. Don't automatically log the user in, as this introduces additional complexity to the authentication and session handling code, and increases the likelihood of introducing vulnerabilities.
    # TODO: find out how to do that in couchdb: Ask the user if they want to invalidate all of their existing sessions, or invalidate the sessions automatically.

    return JSONResponse(
        status_code=200,
        content={"message": "email has been sent; you may log in now"})
