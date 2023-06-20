from typing import Optional, List
from fastapi import APIRouter, Cookie, Header
import asyncio
import json
from datetime import datetime, timedelta
import uuid
import base64

# from fastapi import BackgroundTasks, FastAPI
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
from pydantic import BaseModel, EmailStr, Field
from starlette.responses import JSONResponse
from unhcr_tss.config import settings
from requests import put, get, post
from requests.utils import quote


class SimpleUserSchema(BaseModel):
    name: EmailStr
    password: Optional[str] = None
    roles: Optional[List[str]] = ["shelter"]
    type: Optional[str] = "user"


class UserSchema(BaseModel):
    id: Optional[str] = Field(None, alias='_id')
    rev: Optional[str] = Field(None, alias='_rev')
    name: EmailStr
    password: Optional[str] = None
    roles: Optional[List[str]] = ["shelter"]
    type: Optional[str] = "user"
    unconfirmed: Optional[bool] = None


class PasswordSchema(BaseModel):
    password: str


class PasswordSchemaWithToken(PasswordSchema):
    token: str


conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
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
<p>{HOST_NAME}/{default_path}</p>
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
<p>The UNHCR-TSS team</p>"""

router = APIRouter()


# https://github.com/sabuhish/fastapi-mail/tree/master
# https://medium.com/nerd-for-tech/how-to-send-email-using-python-fastapi-947921059f0c
async def send_confirmation(user: UserSchema, title: str, body: str,
                            token: str):
    message = MessageSchema(subject="UNHCR-TSS {title}".format(title=title),
                            recipients=[user.name],
                            body=body.format(token=token),
                            subtype=MessageType.html)
    fm = FastMail(conf)
    await fm.send_message(message)


async def authenticate_admin() -> tuple[Cookie, dict[str, str]]:
    return await authenticate(settings.COUCHDB_USER, settings.COUCHDB_PASSWORD)


async def authenticate(name: str,
                       password: str) -> tuple[Cookie, dict[str, str]]:
    headers = {'Content-Type': 'application/x-www-form-urlencoded'}
    r = post(settings.AUTH_SERVER + "/_session",
             headers=headers,
             data='name={name}&password={password}'.format(name=name,
                                                           password=password))
    if (r.status_code != 200):
        raise ValueError('Could not authenticate')
    # // fail if r.status !== 200
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


async def create_user(user: UserSchema):
    # curl -X PUT http://localhost:5984/_users/org.couchdb.user:jan \
    #  -H "Accept: application/json" \
    #  -H "Content-Type: application/json" \
    #  -d '{"name": "jan", "password": "apple", "roles": [], "type": "user"}'
    user_encoded = quote(":{user}".format(user=user.name))
    cookies, headers, r = await authenticate_admin()
    # [ ] use asyncio for better perf
    headers['Content-Type'] = 'application/json'

    user.roles = ["shelter"]
    user.type = "user"
    user.unconfirmed = True
    return put(settings.AUTH_SERVER +
               "/_users/org.couchdb.user{user_encoded}".format(
                   user_encoded=user_encoded),
               cookies=cookies,
               headers=headers,
               data=user.json())


async def confirm_user(user: UserSchema, password: str):
    # [ ] Endpoint should be protected or user identitifed
    # [ ] use asyncio for better perf

    user_encoded = quote(":{user}".format(user=user.name))
    cookies, headers, r = await authenticate_admin()
    headers['Content-Type'] = 'application/json'
    r = await get_user(
        user.name)  # maybe unecessary ? since we hhave the user at the top

    _, _, authenticate_response = await authenticate(user.name, password)
    print(authenticate_response.json())
    if (authenticate_response.status_code != 200):
        raise ValueError("Password does not match")
    latest_user = r.json()
    latest_user.pop("unconfirmed", None)
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

    return put(settings.AUTH_SERVER +
               "/_users/org.couchdb.user{user_encoded}".format(
                   user_encoded=user_encoded),
               cookies=cookies,
               headers=headers,
               data=json.dumps(latest_user))


@router.post("/register")
async def register_user(user: UserSchema) -> JSONResponse:

    # print(user.name)
    # no .encode('UTF-8')
    # user_email = email.dict().get("email")
    r = await get_user(user.name)
    if (r.status_code == 404):
        # can create a user
        # [ ] validate user.password complexity here
        r = await create_user(user)
        print(r.status_code)
        print(r.json())
        # generate token and store in couchdb a jwt of contain uuid4 + email
        # send confirmation
        temp_id = await create_token(email=user.name,
                                     expiration_in_minutes=60 * 24)
        await send_confirmation(user,
                                'Registration',
                                html_confirm,
                                token=temp_id)
    else:
        temp_id = await create_token(email=user.name,
                                     expiration_in_minutes=60 * 24)
        # user already exist do nothing
        await send_confirmation(user,
                                "Forgot your password",
                                html_may_have_forgot,
                                token=temp_id)

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
    temp_id = await create_token(email=user.name,
                                 expiration_in_minutes=60 * 24)
    await send_confirmation(user, "Reset Password", html_reset, token=temp_id)
    return JSONResponse(status_code=200,
                        content={"message": "email has been sent"})


async def create_token(email: str, expiration_in_minutes: int = 15):
    expire: str = (datetime.today() +
                   timedelta(minutes=expiration_in_minutes)).isoformat()
    # [ ] create document in couchdb
    print(expire)
    cookies, headers, r = await authenticate_admin()
    headers['Content-Type'] = 'application/json'
    # id unique is uuid4 + email in base 64
    # base64.b64encode(b'Hello World!')
    _id = "{uuid}{email}".format(uuid=str(uuid.uuid4()),
                                 email=base64.b64encode(
                                     email.encode('ascii')).decode('ascii'))
    r = post(
        settings.AUTH_SERVER + "/tokens",
        cookies=cookies,
        headers=headers,
        data=json.dumps({
            "expire_at": expire,
            "_id": _id,
            "email": email  # TODO should probably encrypt email there
        }))
    return quote(r.json().get("id"))


async def verify_token_validity(token: str):
    cookies, headers, r = await authenticate_admin()
    r = get(settings.AUTH_SERVER + "/tokens/{token}".format(token=token),
            cookies=cookies,
            headers=headers)
    return r


@router.post("/confirm-registration")
async def confirm_registration(
        payload: PasswordSchemaWithToken) -> JSONResponse:
    token_valid = await verify_token_validity(payload.token)
    # [ ] purge outdated token
    if (token_valid):
        print(token_valid.json().get("email", ""))
        user = await get_user(token_valid.json().get("email", ""))
        resp = await confirm_user(UserSchema(**user.json()),
                                  password=payload.password)
        print(resp.json())
        return JSONResponse(resp.json())
        # if (resp.status_code === "200"):
        #     return JSONResponse(
        #         status_code=200,
        #         content={"message": "token is valid you may proceed"})
        # else:

    else:
        # [ ] delete  from couchdb the token
        return JSONResponse(status_code=410, content={"error": ""})


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
        return JSONResponse(status_code=410, content={"error": ""})


async def update_user_password(user: UserSchema, new_password: str):

    new_user = SimpleUserSchema(name=user.name,
                                password=new_password,
                                roles=user.roles,
                                type=user.type)
    user_encoded = quote(":{user}".format(user=user.name))
    cookies, headers, r = await authenticate_admin()
    # [ ] use asyncio for better perf
    headers['Content-Type'] = 'application/json'
    headers['If-Match'] = user.rev
    return put(settings.AUTH_SERVER +
               "/_users/org.couchdb.user{user_encoded}".format(
                   user_encoded=user_encoded),
               cookies=cookies,
               headers=headers,
               data=new_user.json())


@router.post("/reset-password")
async def reset_password(payload: PasswordSchemaWithToken) -> JSONResponse:
    # check that the token is valid and that the user associated with the token match
    # the current user
    token_valid = await verify_token_validity(payload.token)
    if (token_valid.status_code == 404):
        print("token not found")
        return JSONResponse(token_valid.json())

    email = token_valid.json().get("email", "")
    # The user should confirm the password they set by writing it twice. (in the frontend)
    # [ ] Ensure that a secure password policy is in place, and is consistent with the rest of the application.
    userResponse = await get_user(email)
    # Update and store the password following secure practices.
    current_user = UserSchema(**userResponse.json())
    updateResponse = await update_user_password(current_user, payload.password)
    print("update password response", updateResponse.status_code)
    print("update password response", updateResponse.json())

    # Send the user an email informing them that their password has been reset (do not send the password in the email!).
    await send_confirmation(user=UserSchema(name=email),
                            title="Reset Successful",
                            body=html_reset_success,
                            token="")

    # Once they have set their new password, the user should then login through the usual mechanism. Don't automatically log the user in, as this introduces additional complexity to the authentication and session handling code, and increases the likelihood of introducing vulnerabilities.
    # TODO: find out how to do that in couchdb: Ask the user if they want to invalidate all of their existing sessions, or invalidate the sessions automatically.

    return JSONResponse(
        status_code=200,
        content={"message": "email has been sent; you may log in now"})
