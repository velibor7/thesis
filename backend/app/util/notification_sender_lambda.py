import json
import boto3
import requests

def lambda_handler(event, context):
    s3_client = boto3.client('s3')
    ses_client = boto3.client('ses')

    # Retrieve the bucket and key of the uploaded file
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = event['Records'][0]['s3']['object']['key']

    # Extract the user ID from the S3 key (assuming the key is in the format "user_id/filename")
    user_id = key.split('/')[0]

    # Get the list of followers for the user
    followers = get_followers(user_id)

    # Send email to each follower
    for follower in followers:
        recipient_email = follower.email
        subject = 'New Image Uploaded'
        message = f"Hi {follower.username}, a new image has been uploaded by user {user_id}. Check it out!"
        send_email(recipient_email, subject, message, ses_client)

    return {
        'statusCode': 200,
        'body': 'Lambda function executed successfully.'
    }

def get_followers(user_id):
    ngrok_forwarding_url = 'a8e7-94-230-187-74.ngrok-free.app'
    ngrok_url = f'http://{ngrok_forwarding_url}/users/{user_id}/followers'

    # Send a GET request to the Flask endpoint using the ngrok URL
    response = requests.get(ngrok_url)

    if response.status_code == 200:
        followers = json.loads(response.text)['followers']
        print(followers)
    else:
        # Handle the error response if needed
        print('error happend')
    
    return followers if followers is not None else []

def send_email(recipient_email, subject, message, ses_client):
    # Send email using Amazon SES
    # Make sure to replace 'SENDER_EMAIL' with the verified email address you set up in SES
    response = ses_client.send_email(
        Source='SENDER_EMAIL',
        Destination={'ToAddresses': [recipient_email]},
        Message={
            'Subject': {'Data': subject},
            'Body': {'Text': {'Data': message}}
        }
    )
    # Handle the response and any potential errors
