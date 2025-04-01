import cv2
from LicensePlate import LicensePlate
from Text import Text
import copy
import sys
import socket
import selectors
import types

sel = selectors.DefaultSelector()

def main():
    host, port = "127.0.0.1", 65432
    welcome_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    welcome_socket.bind((host, port))
    welcome_socket.listen()
    print(f"Listening on {(host, port)}")
    welcome_socket.setblocking(False)
    sel.register(welcome_socket, selectors.EVENT_READ, data=None)

    try:
        while True:
            events = sel.select(timeout=None)
            for key, mask in events:
                if key.data is None:
                    accept_wrapper(key.fileobj)
                else:
                    service_connection(key, mask)
    except KeyboardInterrupt:
        print("Caught keyboard interrupt, exiting")
    finally:
        sel.close()

def accept_wrapper(connection_socket):
    conn, addr = connection_socket.accept()
    print(f"Accepted connection from {addr}")
    conn.setblocking(False)
    data = types.SimpleNamespace(addr=addr, inb=b"", outb=b"")
    events = selectors.EVENT_READ | selectors.EVENT_WRITE
    sel.register(conn, events, data=data)

def service_connection(key, mask):
    connection_socket = key.fileobj
    data = key.data
    if mask & selectors.EVENT_READ:
        recv_data = connection_socket.recv(1024)
        if recv_data:
            data.outb += process_image("sijsdfsdf").encode('utf-8') # Returns license plate number
            print(recv_data, data.outb)
        else:
            print(f"Closing connection to {data.addr}")
            sel.unregister(connection_socket)
            connection_socket.close()
    if mask & selectors.EVENT_WRITE:
        if data.outb:
            print(f"Echoing {data.outb!r} to {data.addr}")
            sent = connection_socket.send(data.outb)
            data.outb = data.outb[sent:]

def process_image(base64encoding):
    # TODO: convert base 64 to image
    image_filename = "image.png"
    output_image_filename = "processed_image.jpg"
    license_plate_text = get_license_plate_number(image_filename, output_image_filename)
    return license_plate_text

def get_license_plate_number(image_filename, output_image_filename):
    # Read image
    image = cv2.imread(image_filename)

    license_plate = LicensePlate()
    result = license_plate.get_bounding_box_coords(image)
    if result == None:
        return None
    
    x1, y1, x2, y2 = result

    roi = copy.deepcopy(image[int(y1):int(y2), int(x1):int(x2)])

    text = Text()
    license_plate_text = text.recognize(roi)

    # Recreate image with bounding box and text
    cv2.rectangle(image, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 4)
    cv2.putText(image, str(license_plate_text), (int(x1), int(y1 - 10)),
        cv2.FONT_HERSHEY_SIMPLEX, 1.3, (0, 255, 0), 3, cv2.LINE_AA)

    # Save image to bounding_box_images
    cv2.imwrite(output_image_filename, image)

    cv2.destroyAllWindows()

    return license_plate_text

if __name__ == "__main__":
    main()