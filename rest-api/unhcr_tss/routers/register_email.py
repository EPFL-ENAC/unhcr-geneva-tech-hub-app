from typing import List
from fastapi import  APIRouter, Cookie, Header

# from fastapi import BackgroundTasks, FastAPI
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
from pydantic import BaseModel, EmailStr
from starlette.responses import JSONResponse
from unhcr_tss.config import settings
from requests import put, get, post
from requests.utils import quote

class EmailSchema(BaseModel):
    email: List[EmailStr]


conf = ConnectionConfig(
    MAIL_USERNAME = settings.MAIL_USERNAME,
    MAIL_PASSWORD = settings.MAIL_PASSWORD,
    MAIL_FROM = settings.MAIL_FROM,
    MAIL_PORT = settings.MAIL_PORT,
    MAIL_SERVER = settings.MAIL_SERVER,
    MAIL_STARTTLS = False,
    MAIL_SSL_TLS = False,
    USE_CREDENTIALS = False,
    VALIDATE_CERTS = True
)

confirm_path = "confirm"
default_path = "apps"

html = """
<p>You have requested access to the unhcr-tss apps.</p>
<p>Please click on the link below to confirm registration.</p>
<p>{HOST_NAME}/{confirm_path}</p> 
<p>Beware, this link will be deactivated in 1 day</p>
<br/>
<br/>
<p>The UNHCR-TSS team</p>
<p>{HOST_NAME}/{default_path}</p>
""".format(confirm_path=confirm_path, default_path=default_path,
        HOST_NAME=settings.HOST_NAME)
router = APIRouter()

# https://github.com/sabuhish/fastapi-mail/tree/master
# https://medium.com/nerd-for-tech/how-to-send-email-using-python-fastapi-947921059f0c


@router.post("/email")
async def simple_send(email: EmailSchema) -> JSONResponse:
    message = MessageSchema(
        subject="UNHCR-TSS Registration",
        recipients=email.dict().get("email"),
        body=html,
        subtype=MessageType.html)

    headers = {'Content-Type': 'application/x-www-form-urlencoded'}
    r = post(settings.AUTH_SERVER + "/_session", headers=headers, data='name={login}&password={password}'.format(login=settings.COUCHDB_USER, password=settings.COUCHDB_PASSWORD))
    cookies = r.cookies.get_dict()
    # AuthSession: Union[str, None] = Cookie(default=None)
    # cookies = {'AuthSession': AuthSession}
    # # check that this email is not already defined
    # # --cookie AuthSession=YW5uYTo0QUIzOTdFQjrC4ipN-D-53hw1sJepVzcVxnriEw \
    # #    -H "X-CouchDB-WWW-Authenticate: Cookie" \
    # #    -H "Content-Type:application/x-www-form-urlencoded"
    headers["X-CouchDB-WWW-Authenticate"] = "Cookie"
    print(email.dict())
    # no .encode('UTF-8')
    user_email = email.dict().get("email")[0] + "i"
    print(user_email)
    user_encoded = quote(":{user}".format(user=user_email))
    print(user_encoded)
    r = get(settings.AUTH_SERVER + "/_users/org.couchdb.user{user_encoded}".format(user_encoded = user_encoded),
            cookies=cookies,
            headers=headers)
    # if (r.status_code == 404):
        # can create a user
    # else:
        # user already exist do nothing
    # print(r.json())
    # print(r.status_code)

    # create a user with a waitingConfirmation: true + created_at: new Date() field
    # curl -X PUT http://localhost:5984/_users/org.couchdb.user:jan \
    #  -H "Accept: application/json" \
    #  -H "Content-Type: application/json" \
    #  -d '{"name": "jan", "password": "apple", "roles": [], "type": "user"}'
    # token is a jwt of contain uuid4 + email
    # create a waiting confirmation view from users that shows if token is valid
    # retrieve token document if none => then email verification has expired
    # else => please enter your password --> login -> change waitingConfirmation field

    # TODO: Next create an admin user for this API so it can create users
    # TODO: test creating user
    fm = FastMail(conf)
    await fm.send_message(message)
    return JSONResponse(status_code=200, content={"message": "email has been sent"})   
