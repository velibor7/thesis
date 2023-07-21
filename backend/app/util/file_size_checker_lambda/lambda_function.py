import boto3
import os
import io
from PIL import Image


def lambda_handler(event, context):
    s3_client = boto3.client('s3')

    bucket = event['Records'][0]['s3']['bucket']['name']
    key = event['Records'][0]['s3']['object']['key']

    out_bucket = 'xws-thesis-out'

    response = s3_client.head_object(Bucket=bucket, Key=key)
    file_size = response['ContentLength']

    threshold_size = 10 * 1024 * 1024  # 10 MB
    if file_size > threshold_size:
        response = s3_client.get_object(Bucket=bucket, Key=key)
        image_data = response['Body'].read()
        image = Image.open(io.BytesIO(image_data))

        compressed_image = image.copy()
        compressed_image.save("compressed_image.jpg", optimize=True, quality=80)

        with open("compressed_image.jpg", "rb") as f:
            s3_client.upload_fileobj(f, out_bucket, key)

        os.remove("compressed_image.jpg")
    else:
        s3_client.copy_object(
            Bucket=out_bucket,
            CopySource={'Bucket': bucket, 'Key': key},
            Key=key
        )

    return {
        'statusCode': 200,
        'body': 'Lambda function executed successfully.'
    }