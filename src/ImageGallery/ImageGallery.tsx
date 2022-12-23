import { ImageGalleryItem } from "../ImageGalleryItem/ImageGalleryItem";
import { ImageObject } from "../utils/interfaces";
import css from "./ImageGallery.module.css";

export function ImageGallery({
  images,
  fetching,
}: {
  images: ImageObject[];
  fetching: boolean;
}) {
  return (
    <ul className={css.ImageGallery}>
      {images.length
        ? images.map(({ id, webformatURL, largeImageURL, tags }) => (
            <ImageGalleryItem
              key={id}
              src={webformatURL}
              largeImg={largeImageURL}
              alt={tags}
            />
          ))
        : fetching
        ? null
        : "Start searching!"}
    </ul>
  );
}
