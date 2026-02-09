import subprocess


def send_email(email: str, subject: str, body: str):
    subprocess.run(
        [
            "s-nail",
            "-s",
            subject,
            email,
        ],
        input=body,
        text=True,
        check=True,
    )
