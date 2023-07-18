import hashlib
import boto3
import os
from dotenv import dotenv_values
from botocore.exceptions import ClientError


env_vars = dotenv_values('.env')

ACCESS_KEY = env_vars['ACCESS_KEY']
SECRET_KEY = env_vars['SECRET_KEY']
REGION = env_vars['REGION']

def push_image_to_s3_with_path(user_id, image_file_path, filename):
    session = boto3.Session(
        aws_access_key_id=ACCESS_KEY,
        aws_secret_access_key=SECRET_KEY,
        region_name=REGION
    )
    try:
        s3_client = session.client('s3')
        print("successfully logged into s3 client")
    except Exception as e:
        print("failed connecting to s3")
        print(e)

    new_filename = f'{user_id}/{filename}'
    bucket_name = 'xws-thesis'
    try:
        with open(image_file_path, 'rb') as f:
            s3_client.upload_fileobj(f, bucket_name, new_filename)
    except ClientError as e:
        print(e)

def push_image_to_s3(user_id, image_file, filename):
    session = boto3.Session(
        aws_access_key_id=ACCESS_KEY,
        aws_secret_access_key=SECRET_KEY,
        region_name=REGION
    )
    try:
        s3_client = session.client('s3')
        print("successfully logged into s3 client")
    except Exception as e:
        print("failed connecting to s3")
        print(e)

    new_filename = f'{user_id}/{filename}'
    bucket_name = 'xws-thesis'
    try:
        s3_client.upload_fileobj(image_file, bucket_name, new_filename)
    except ClientError as e:
        print(e)


def test():
    session = boto3.Session(
        aws_access_key_id=ACCESS_KEY,
        aws_secret_access_key=SECRET_KEY,
        region_name=REGION
    )
    print(ACCESS_KEY)
    print(SECRET_KEY)
    print(REGION)
    try:
        s3_client = session.client('s3')
        print("successfully logged into s3 client")
    except Exception as e:
        print("failed connecting to s3")
        print(e)

    # new_filename = f'{user_id}/{filename}'
    bucket_name = 'xws-thesis'
    f = open('test.txt', 'rb')

    try:
        s3_client.upload_fileobj(f, bucket_name, "test/test.txt")
        print("succesfully uploaded file to s3")
    except ClientError as e:
        print(e)

    f.close()


# if __name__ == '__main__':
#     test()
