import asyncio
import websockets
import cv2
import copy
import base64
import os
import json
from LicensePlate import LicensePlate  # Keeping your original imports
from Text import Text
import selectors
import base64
from PIL import Image
from io import BytesIO
from datetime import datetime
from http.cookies import SimpleCookie

sel = selectors.DefaultSelector()
reports, id = [], 1
officer_websockets = []

async def main():
    # Welcome new connections w/ new server
    server = await websockets.serve(
        handle_client,
        "127.0.0.1",
        65432,
        ping_interval=20,
        ping_timeout=20,
        max_size=10 * 1024 * 1024  # 10 MB
    )
    print(f"WebSocket server started on ws://127.0.0.1:65432")

    await server.wait_closed() # Close server

async def handle_client(websocket):
    print(f"Accepted connection from {websocket.remote_address}")
    role = get_role_from_websocket(websocket) # Get role from HTTP cookie
    # If client is an officer send all reports in session memory
    if role == 'officer':
        await websocket.send(json.dumps(reports))
        officer_websockets.append(websocket) # Track officer for live updating
    try:
        async for message in websocket:
            try:
                # Get photo
                data = json.loads(message)
                data_url = data["data"]

                # Convert to cv2 photo from base 64
                base64_str = data_url.split(",")[1]
                image_filename = "received_image.jpg"
                image_saved = base64_to_image(base64_str, image_filename)

                # Get plate number and cropped/edited photos
                plate_number, cropped_base64_str, photo_base64_str = process_image(image_filename)

                # Build response to acknowledge successful (or not) submission to client
                response = {
                    'plate_number': plate_number,
                    'cropped_photo': cropped_base64_str if cropped_base64_str else 'no_plate_detected',
                    'status': 'success' if plate_number else 'no_plate_detected',
                    'datetime': str(datetime.now())
                }

                # If successful, send to all online officers
                if response["status"] == 'success':
                    global id
                    rpt = {
                        'id': id,
                        'plate_number': plate_number,
                        'cropped_photo': cropped_base64_str,
                        'photo': photo_base64_str,
                        'datetime': str(datetime.now()),
                        'description': data["description"],
                        'name': data["name"],
                        'email': data["email"]
                    }
                    # Add new report to session memory
                    reports.insert(0, rpt)
                    # Send officers new report for live updating
                    await message_all_officers(rpt)
                    id += 1

                # Alert reporter of success (or not)
                if role == 'reporter':
                    await websocket.send(json.dumps(response))
                
            except Exception as e:
                await websocket.send(json.dumps({'error': str(e)}))
                print(f"Error processing message: {e}")

    except websockets.exceptions.ConnectionClosed:
        print(f"Connection closed")
        if websocket in officer_websockets:
            officer_websockets.remove(websocket)

# Message all logged in officers
async def message_all_officers(msg):
    for officer_websocket in officer_websockets:
        try:
            await officer_websocket.send(json.dumps(msg))
        except Exception as e:
            print(f"Officer could not be contacted: {e}")

# Get role from HTTP cookie
def get_role_from_websocket(websocket):
    return get_cookie_value_from_websocket(websocket, 'Role')

# Get cookie value based on cookie
def get_cookie_value_from_websocket(websocket, key):
    headers_dict = dict(websocket.request.headers.items())
    cookie_header = headers_dict.get('cookie', '')
    cookies = dict(item.strip().split('=', 1) for item in cookie_header.split(';') if '=' in item)
    return cookies[key]

# Convert base 64 to image (used when reporter sends HTML form to server)
def base64_to_image(base64_string, output_path):
    try:
        image_data = base64.b64decode(base64_string)
        image = Image.open(BytesIO(image_data))
        if image.mode == "RGBA":
            image = image.convert("RGB")
        image.save(output_path)
        return True
    except Exception as e:
        print(f"Error converting base64 to image: {e}")
        return False

def process_image(image_filename):
    output_image_filename = "processed_image.jpg"
    license_plate_text, cropped_base64_str, photo_base64_str = get_license_plate_number(image_filename, output_image_filename)
    return [license_plate_text, cropped_base64_str, photo_base64_str]

# Object detection inference and OCR
def get_license_plate_number(image_filename, output_image_filename):
    # Read image
    image = cv2.imread(image_filename)

    # Get bounding box with fine-tuned model inference
    license_plate = LicensePlate()
    result = license_plate.get_bounding_box_coords(image)
    if result == None:
        return None, None, None
    
    # Unbox bounding box
    x1, y1, x2, y2 = result

    # Create another copy of image so cropped doesn't spoil original
    roi = copy.deepcopy(image[int(y1):int(y2), int(x1):int(x2)])

    # Get text using OCR tech
    text = Text()
    license_plate_text = text.recognize(roi)
    if license_plate_text == None:
        return None, None, None

    # Recreate image with bounding box and text
    cv2.rectangle(image, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 4)
    cv2.putText(image, str(license_plate_text), (int(x1), int(y1 - 10)),
        cv2.FONT_HERSHEY_SIMPLEX, 1.3, (0, 255, 0), 3, cv2.LINE_AA)
    
    # Convert images to base 64
    s1, b1 = cv2.imencode('.jpg', image)
    if not s1:
        raise Exception("Failed to encode image")
    photo_base64_str = base64.b64encode(b1).decode('utf-8')

    s2, b2 = cv2.imencode('.jpg', roi)
    if not s2:
        raise Exception("Failed to encode cropped image")
    cropped_base64_str = base64.b64encode(b2).decode('utf-8')

    # Destroy cv2
    cv2.destroyAllWindows()

    return [license_plate_text, cropped_base64_str, photo_base64_str]

if __name__ == "__main__":
    asyncio.get_event_loop().run_until_complete(main())
    asyncio.get_event_loop().run_forever()