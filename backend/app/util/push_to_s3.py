import boto3

s3 = boto3.client('s3')

# todo: log into my aws accound
# todo: make s3 bucket

def push_image_to_s3(user_id, image_file, filename):
    new_filename = f'{user_id}/{filename}'
    s3.upload_fileobj(image_file, 's3_bucket_name', filename)
