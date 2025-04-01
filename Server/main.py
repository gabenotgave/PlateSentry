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

    host, port = sys.argv[1], int(sys.argv[2])
    lsock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    lsock.bind((host, port))
    lsock.listen()
    print(f"Listening on {(host, port)}")
    lsock.setblocking(False)
    sel.register(lsock, selectors.EVENT_READ, data=None)

    

    image_filename = "image.png"
    output_image_filename = "processed_image.jpg"
    license_plate_text = get_license_plate_number(image_filename, output_image_filename)
    

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