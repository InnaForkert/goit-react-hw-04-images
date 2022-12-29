import React, { useEffect, useState } from "react";
import "./App.css";

import { fetchImages } from "./utils/fetch";
import { ImageObject } from "./utils/interfaces";
import { Report } from "notiflix/build/notiflix-report-aio";

import { Searchbar } from "./Searchbar/Searchbar";
import { ImageGallery } from "./ImageGallery/ImageGallery";
import { Button } from "./Button/Button";
import { Loader } from "./Loader/Loader";
import { Modal } from "./Modal/Modal";

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [images, setImages] = useState<ImageObject[]>([]);
  const [fetching, setFetching] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentModalImage, setCurrentModalImage] = useState("");
  const [showLoadMoreBtn, setShowLoadMoreBtn] = useState(false);

  useEffect(() => {
    if (!searchQuery) {
      return;
    }
    const fetchData = async () => {
      try {
        const data = await fetchImages(searchQuery, page);
        if (data && data.data.hits.length) {
          const totalHits = data.data.totalHits;
          const fetchedImages: ImageObject[] = data.data.hits;
          setImages((prevState) => [...prevState, ...fetchedImages]);
          setShowLoadMoreBtn(page < Math.ceil(totalHits / 12));
        } else {
          Report.failure(
            "No images found!",
            "Try typing something else",
            "Okay"
          );
        }
      } catch (err) {
        Report.failure("Opps!", "Something went wrong", "Okay");
        console.log(err);
      } finally {
        setFetching(false);
      }
    };
    setFetching(true);
    fetchData();
  }, [searchQuery, page]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const target = e.target as HTMLFormElement;
    const query = target.elements[1] as HTMLInputElement;
    const searchQuery = query.value;

    setSearchQuery(searchQuery);
    setPage(1);
    setImages([]);
  };

  const loadMore = () => {
    setPage((prevState) => prevState + 1);
  };

  const openModal = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;

    if (target.dataset.largeimg) {
      setShowModal(true);
      setCurrentModalImage(target.dataset.largeimg);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentModalImage("");
  };

  return (
    <div className="App">
      <Searchbar handleSubmit={handleSubmit} />
      {images.length > 0 ? (
        <ImageGallery images={images} openModal={openModal} />
      ) : (
        <h1>Nothing here yet!</h1>
      )}
      {showLoadMoreBtn && <Button loadMore={loadMore} />}
      <Loader visible={fetching} />
      {showModal && <Modal src={currentModalImage} closeModal={closeModal} />}
    </div>
  );
};

export default App;
